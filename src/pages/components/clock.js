import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, animate, useAnimationFrame } from 'framer-motion';

const HOUR_START_ROTATION = -120; // 30 degrees = 1 o'clock
const MINUTE_START_ROTATION = -90; // 12 o'clock

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 700;

// Tip radii corresponding to hand lengths
const HOUR_HAND_LENGTH = 31.5; // 70% of 45px
const MINUTE_HAND_LENGTH = 45; // 100% of 45px
const SECOND_HAND_LENGTH = 45; // 100% of 45px

const Clock = forwardRef(function Clock({ style, spins = 2, duration = 1.5 }, ref) {
  const hourRotate = useMotionValue(HOUR_START_ROTATION);
  const minuteRotate = useMotionValue(MINUTE_START_ROTATION);
  const secondRotate = useMotionValue(0);

  const hourRotationRef = useRef(HOUR_START_ROTATION);
  const minuteRotationRef = useRef(MINUTE_START_ROTATION);
  const [hourIndex, setHourIndex] = useState(0);

  const canvasRef = useRef(null);
  const pointsRef = useRef({ hour: [], minute: [], second: [] });

  // Continuously spin the second hand
  useEffect(() => {
    const controls = animate(secondRotate, 360, {
      duration: 10,
      repeat: Infinity,
      ease: 'linear',
    });
    return () => controls.stop();
  }, [secondRotate]);

  // Frame-by-frame canvas update for all three hands
  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = CANVAS_WIDTH / 2;

    // Convert current rotation values to radians
    const hRad = (hourRotate.get() * Math.PI) / 180;
    const mRad = (minuteRotate.get() * Math.PI) / 180;
    const sRad = (secondRotate.get() * Math.PI) / 180;

    // Calculate X tip displacements
    const hX = centerX + HOUR_HAND_LENGTH * Math.cos(hRad);
    const mX = centerX + MINUTE_HAND_LENGTH * Math.cos(mRad);
    const sX = centerX + SECOND_HAND_LENGTH * Math.cos(sRad);

    // Shift previous points down & prepend new tip position
    const stepPoints = (arr, newX) => [
      { x: newX, y: 0 },
      ...arr.map((pt) => ({ x: pt.x, y: pt.y + 3 })).filter((pt) => pt.y <= CANVAS_HEIGHT),
    ];

    pointsRef.current.hour = stepPoints(pointsRef.current.hour, hX);
    pointsRef.current.minute = stepPoints(pointsRef.current.minute, mX);
    pointsRef.current.second = stepPoints(pointsRef.current.second, sX);

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Helper function to render a single wave stroke
    const strokeWave = (points, strokeStyle, lineWidth) => {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach((pt) => ctx.lineTo(pt.x, pt.y));
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    // Render waves (Hour: soft white, Minute: bright white, Second: red)
    strokeWave(pointsRef.current.hour, 'rgba(255, 255, 255, 0.4)', 3);
    strokeWave(pointsRef.current.minute, 'rgba(255, 255, 255, 0.95)', 2);
    strokeWave(pointsRef.current.second, 'rgba(255, 50, 50, 0.85)', 1.5);
  });

  const advanceHour = () => {
    const hourTarget = hourRotationRef.current + spins * 360 + 30;
    const minuteTarget = minuteRotationRef.current + spins * 360 + 360;

    animate(hourRotate, hourTarget, { duration, ease: 'easeInOut' });
    animate(minuteRotate, minuteTarget, { duration, ease: 'easeInOut' });

    hourRotationRef.current = hourTarget;
    minuteRotationRef.current = minuteTarget;

    const next = (hourIndex % 12) + 1;
    setHourIndex(next);
    return next;
  };

  const previousHour = () => {
    if (hourIndex <= 1) {
      alert("Already at 1 o'clock!");
      return null;
    }

    const hourTarget = hourRotationRef.current - (spins * 360 + 30);
    const minuteTarget = minuteRotationRef.current - (spins * 360 + 360);

    animate(hourRotate, hourTarget, { duration, ease: 'easeInOut' });
    animate(minuteRotate, minuteTarget, { duration, ease: 'easeInOut' });

    hourRotationRef.current = hourTarget;
    minuteRotationRef.current = minuteTarget;

    const next = hourIndex - 1;
    setHourIndex(next);
    return next;
  };

  useImperativeHandle(ref, () => ({
    advanceHour,
    previousHour,
    get hourIndex() {
      return hourIndex;
    },
  }));

  return (
    <div style={{ position: 'absolute', width: 200, height: 200, ...style }}>
      {/* Downward Wave Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          position: 'absolute',
          left: '0px',
          top: '100px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <img
        alt=""
        className="clock"
        src={process.env.PUBLIC_URL + '/clock.svg'}
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '45px',
          height: '3px',
          marginTop: '-1.5px',
          filter: 'drop-shadow(-2px 2px 0px #d5c2bf)',
          zIndex: 2,
        }}
      >
        {/* Hour Hand */}
        <motion.div
          style={{
            position: 'absolute',
            width: '70%',
            height: '100%',
            backgroundColor: 'white',
            transformOrigin: 'left center',
            rotate: hourRotate,
          }}
        />

        {/* Minute Hand */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            transformOrigin: 'left center',
            rotate: minuteRotate,
          }}
        />

        {/* Second Hand */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'red',
            transformOrigin: 'left center',
            rotate: secondRotate,
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 6,
          height: 6,
          backgroundColor: 'black',
          zIndex: 3,
          borderRadius: '30%',
        }}
      />
    </div>
  );
});

export default Clock;