import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, animate, useAnimationFrame } from 'framer-motion';

const HOUR_START_ROTATION = -90;
const MINUTE_START_ROTATION = -90;

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 700;
const LEFT_CANVAS_HEIGHT = 200;

const HOUR_HAND_LENGTH = 31.5;
const MINUTE_HAND_LENGTH = 45;
const SECOND_HAND_LENGTH = 45;

const Clock = forwardRef(function Clock({ style, spins = 2, duration = 1.5 }, ref) {
  const hourRotate = useMotionValue(HOUR_START_ROTATION);
  const minuteRotate = useMotionValue(MINUTE_START_ROTATION);
  const secondRotate = useMotionValue(0);

  const [hourIndex, setHourIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const canvasRef = useRef(null);
  const leftCanvasRef = useRef(null);
  const pointsRef = useRef({ hour: [], minute: [], second: [] });
  const leftPointsRef = useRef({ hour: [], minute: [], second: [] });

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const controls = animate(secondRotate, 360, {
      duration: 10,
      repeat: Infinity,
      ease: 'linear',
    });
    return () => controls.stop();
  }, [secondRotate]);

  useAnimationFrame(() => {
    const centerX = CANVAS_WIDTH / 2;
    const leftCenterY = LEFT_CANVAS_HEIGHT / 2;

    const hRad = (hourRotate.get() * Math.PI) / 180;
    const mRad = (minuteRotate.get() * Math.PI) / 180;
    const sRad = (secondRotate.get() * Math.PI) / 180;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');

      const hX = centerX + HOUR_HAND_LENGTH * Math.cos(hRad);
      const mX = centerX + MINUTE_HAND_LENGTH * Math.cos(mRad);
      const sX = centerX + SECOND_HAND_LENGTH * Math.cos(sRad);

      const stepDown = (arr, newX) => [
        { x: newX, y: 0 },
        ...arr.map((pt) => ({ x: pt.x, y: pt.y + 3 })).filter((pt) => pt.y <= CANVAS_HEIGHT),
      ];

      pointsRef.current.hour = stepDown(pointsRef.current.hour, hX);
      pointsRef.current.minute = stepDown(pointsRef.current.minute, mX);
      pointsRef.current.second = stepDown(pointsRef.current.second, sX);

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const strokeWave = (points, strokeStyle, lineWidth) => {
        if (points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach((pt) => ctx.lineTo(pt.x, pt.y));
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      };

      strokeWave(pointsRef.current.hour, 'rgba(255, 255, 255, 0.4)', 3);
      strokeWave(pointsRef.current.minute, 'rgba(255, 255, 255, 0.95)', 2);
      strokeWave(pointsRef.current.second, 'rgba(255, 50, 50, 0.85)', 1.5);
    }

    const leftCanvas = leftCanvasRef.current;
    if (leftCanvas) {
      const ctx = leftCanvas.getContext('2d');
      const width = leftCanvas.width;

      const hY = leftCenterY + HOUR_HAND_LENGTH * Math.sin(hRad);
      const mY = leftCenterY + MINUTE_HAND_LENGTH * Math.sin(mRad);
      const sY = leftCenterY + SECOND_HAND_LENGTH * Math.sin(sRad);

      const stepLeft = (arr, newY) => [
        { x: width, y: newY },
        ...arr.map((pt) => ({ x: pt.x - 3, y: pt.y })).filter((pt) => pt.x >= 0),
      ];

      leftPointsRef.current.hour = stepLeft(leftPointsRef.current.hour, hY);
      leftPointsRef.current.minute = stepLeft(leftPointsRef.current.minute, mY);
      leftPointsRef.current.second = stepLeft(leftPointsRef.current.second, sY);

      ctx.clearRect(0, 0, width, LEFT_CANVAS_HEIGHT);

      const strokeWave = (points, strokeStyle, lineWidth) => {
        if (points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach((pt) => ctx.lineTo(pt.x, pt.y));
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      };

      strokeWave(leftPointsRef.current.hour, 'rgba(255, 255, 255, 0.4)', 3);
      strokeWave(leftPointsRef.current.minute, 'rgba(255, 255, 255, 0.95)', 2);
      strokeWave(leftPointsRef.current.second, 'rgba(255, 50, 50, 0.85)', 1.5);
    }
  });

  const getAbsoluteRotations = (targetIndex) => {
    const hourTarget = HOUR_START_ROTATION + targetIndex * (spins * 360 + 30);
    const minuteTarget = MINUTE_START_ROTATION + targetIndex * ((spins + 1) * 360);
    return { hourTarget, minuteTarget };
  };

  const advanceHour = () => {
    const nextIndex = hourIndex + 1;
    const { hourTarget, minuteTarget } = getAbsoluteRotations(nextIndex);

    animate(hourRotate, hourTarget, { duration, ease: 'easeInOut' });
    animate(minuteRotate, minuteTarget, { duration, ease: 'easeInOut' });

    setHourIndex(nextIndex);
    return (nextIndex % 12) || 12;
  };

  const previousHour = () => {
    if (hourIndex <= 1) {
      alert("Already at 1 o'clock!");
      return null;
    }

    const prevIndex = hourIndex - 1;
    const { hourTarget, minuteTarget } = getAbsoluteRotations(prevIndex);

    animate(hourRotate, hourTarget, { duration, ease: 'easeInOut' });
    animate(minuteRotate, minuteTarget, { duration, ease: 'easeInOut' });

    setHourIndex(prevIndex);
    return (prevIndex % 12) || 12;
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

      <canvas
        ref={leftCanvasRef}
        width={viewportWidth}
        height={LEFT_CANVAS_HEIGHT}
        style={{
          position: 'absolute',
          right: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
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