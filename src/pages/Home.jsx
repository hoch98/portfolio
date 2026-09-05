
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
    "Projects": "/projects"
  };

  return (
    <div className='home-body' style={{ backgroundColor: "#a0c3ca", position: 'relative', overflow: 'hidden'}}>
      <div className='grain-overlay' style={{background: `url(${process.env.PUBLIC_URL}/grain.gif`}}/>
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
      <div className="floor" style={{ backgroundColor: "#ddccbd", position: 'absolute', bottom: 0, width: '100%', height: '175px', zIndex: 4 }} />

      <div className='gradient-blur-overlay' style={{ zIndex: 11 }}>
        <div className="home-content-container">
          <h1 className='hi'>
            Hi<span className="zero-width-comma">,</span><br className="hi-break" /> I'm Ho Yun
          </h1>
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

          <div className="social-links">
            <a
              href="https://github.com/hoch98"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="social-icon"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/ho~yun/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="social-icon"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}