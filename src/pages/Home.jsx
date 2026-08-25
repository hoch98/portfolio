import { useEffect, useMemo, useState } from 'react';
import './styles/Home.css';
import WavyBox from './components/wave';
import { motion, useTime, useTransform } from "framer-motion";
import Rain from './components/rain';
import { useNavigate } from 'react-router-dom';

const FRAME_NATURAL = { width: 3912, height: 1080 };
const FLOOR_NATURAL = { width: 3912, height: 1080 };

function useViewportSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let frame;
    const handleResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return size;
}

export default function Home() {
  const time = useTime();
  const speedModifier = 0.1;
  const navigate = useNavigate();
  const { width: viewportWidth, height: viewportHeight } = useViewportSize();

  const frameHeight = viewportHeight;
  const frameWidth = useMemo(
    () => frameHeight * (FRAME_NATURAL.width / FRAME_NATURAL.height),
    [frameHeight]
  );

  const floorHeight = viewportHeight;
  const floorWidth = useMemo(
    () => floorHeight * (FLOOR_NATURAL.width / FLOOR_NATURAL.height),
    [floorHeight]
  );

  const loopDistance = frameWidth;
  const tableHeight = 0.3 * viewportHeight;

  const sceneX = useTransform(time, (t) => {
    const distanceTraveled = t * speedModifier;
    return -(distanceTraveled % loopDistance);
  });

  const linkMap = {
    "About": "/about",
    "Projects": "/projects",
    "Contact": "/contact"
  };

  return (
    <div className='body' style={{ backgroundColor: "#a0c3ca", position: 'relative', overflow: 'hidden', height: '100vh', width: '100vw' }}>
      <motion.div
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          zIndex: 100,
          backgroundColor: "orange",
          top: 0
        }}
        initial={{ left: 0 }}
        exit={{ left: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
        animate={{
          left: viewportWidth
        }}
      />

      <WavyBox width={viewportWidth} height={viewportHeight} />
      <Rain zIndex={2} count={500} />

      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: loopDistance * 2,
          height: '100%',
          x: sceneX,
          zIndex: 6
        }}
      >
        {[0, loopDistance].map((offset) => (
          <div key={offset}>
            <img
              className='frame'
              src={process.env.PUBLIC_URL + "/frame.svg"}
              height={frameHeight}
              width={frameWidth}
              alt=""
              style={{ position: 'absolute', top: 0, left: `${offset}px` }}
            />

            <img
              alt=""
              className='table'
              src={process.env.PUBLIC_URL + "/table.svg"}
              height={tableHeight}
              style={{ position: 'absolute', left: `${offset + frameWidth * 0.55}px`, bottom: '7.5vh', zIndex: 10 }}
            />

            <img
              alt=""
              className='table'
              src={process.env.PUBLIC_URL + "/table.svg"}
              height={tableHeight}
              style={{ position: 'absolute', left: `${offset + frameWidth * 0.82}px`, bottom: '7.5vh', zIndex: 10, transform: "scaleX(-1)" }}
            />
          </div>
        ))}
      </motion.div>

      <div style={{ width: "100vw", height: "15%", position: "absolute", bottom: 0, zIndex: 3, backgroundColor: "#DDCCBD" }} />
      <img
        alt=""
        src={process.env.PUBLIC_URL + "/floor.svg"}
        height={floorHeight}
        width={floorWidth}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, pointerEvents: 'none' }}
      />
      <div className="floor" style={{ backgroundColor: "#ddccbd", position: 'absolute', bottom: 0, width: '100%', height: '15%', zIndex: 4 }} />

      <div className='gradient-blur-overlay' style={{ zIndex: 11 }}>
        <h1 className='hi'>Hi,<br/> I'm Ho Yun</h1>
        <nav className="nav-index">
          {Object.keys(linkMap).map((item, i) => (
            <motion.button
              key={item}
              className="nav-index-item"
              onClick={() => navigate(linkMap[item])}
              initial="rest"
              whileHover="hover"
              animate="rest"
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                className="nav-index-row"
                variants={{ rest: { x: 0 }, hover: { x: 10 } }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="nav-index-number">{String(i + 1).padStart(2, '0')}</span>
                <span className="nav-index-label">
                  {item}
                  <motion.span
                    className="nav-index-underline"
                    variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </span>
              </motion.span>
            </motion.button>
          ))}
        </nav>
      </div>
    </div>
  );
}