import './styles/Projects.css';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import BackButton from './components/backbutton';
import Clock from './components/clock';
import { useEffect, useRef, useState } from 'react';
import { MdOpenInNew } from "react-icons/md";

// Shared Configurations
const DESKTOP_CLOCK_DURATION = 3;
const MOBILE_CLOCK_DURATION = 1.5;
const EXIT_DURATION = 0.75;
const ENTER_DURATION = 1;

const projects = [
  { "title": "SAT English\n Revision Site", "img": "/projects/project1/image.png", "url": "https://github.com/hoch98/sat-revision" },
  { "title": "Skyblock Attribute\n Lookup Site", "img": "/projects/project2/image.png", "url": "https://github.com/hoch98/attribute-lookup" },
  { "title": "Light Care\n Smart Mirror", "img": "/projects/project3/image.png", "url": "https://github.com/hoch98/light-care/" },
  { "title": "Sphere to Cube\n Interpolation Simulation", "img": "/projects/project4/image.png", "url": "https://github.com/hoch98/sphere2cube" },
  { "title": "YouTube Video Syncer", "img": "/projects/project5/image.png", "url": "https://github.com/hoch98/youtube-syncer" },
];

export default function Projects() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <MobileView isMobile={true} /> : <DesktopView isMobile={false} />;
}

// ------------------------------------------------------------
// Desktop Component (Original Complex UI)
// ------------------------------------------------------------
function DesktopView({ isMobile }) {
  const clockRef = useRef(null);
  const textControls = useAnimation();
  const shape1Controls = useAnimation();
  const shape2Controls = useAnimation();

  const [hourLabel, setHourLabel] = useState(null);
  const hasRunOnce = useRef(false);
  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(false);
  const [direction, setDirection] = useState('up');

  const containerVariants = {
    visible: { opacity: 1, y: 0, transition: { duration: ENTER_DURATION, ease: 'easeOut', staggerChildren: 0.1 } },
    hidden: { opacity: 0, y: 20, transition: { duration: EXIT_DURATION, ease: 'easeIn', staggerChildren: 0.05, staggerDirection: -1 } },
  };

  const frameVariants = {
    enter: (direction) => ({ y: direction === 'down' ? '-100%' : '100%', opacity: 0 }),
    center: { y: 0, opacity: 1, transition: { duration: EXIT_DURATION, ease: [0.33, 1, 0.68, 1] } },
    exit: (direction) => ({ y: direction === 'down' ? '100%' : '-100%', opacity: 0, transition: { duration: EXIT_DURATION, ease: [0.32, 0, 0.67, 0] } }),
  };

  const buttonVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 15 },
  };

  const triggerYellowFluctuation = () => {
    const target1 = window.innerWidth * 0.9;
    const target2 = window.innerWidth * 0.7;

    shape1Controls.start({
      left: [target1, target1 -50, target1],
      transition: { duration: DESKTOP_CLOCK_DURATION + 0.5, ease: 'easeInOut' }
    });

    shape2Controls.start({
      left: [target2, target2 - 75, target2],
      transition: { duration: DESKTOP_CLOCK_DURATION + 0.5, ease: 'easeInOut' }
    });
  };

  const runAdvance = async () => {
    if (isRunningRef.current) return;
    setDirection('up');
    isRunningRef.current = true;
    setIsRunning(true);

    if (hasRunOnce.current) {
      triggerYellowFluctuation();
      await textControls.start({
        y: '-50%',
        opacity: 0,
        transition: { duration: EXIT_DURATION, ease: 'easeIn' },
      });
    }
    hasRunOnce.current = true;

    const nextHour = clockRef.current?.advanceHour();
    setHourLabel(nextHour);

    await new Promise((resolve) => setTimeout(resolve, (DESKTOP_CLOCK_DURATION - 0.5) * 1000));

    setHourLabel(nextHour);
    isRunningRef.current = false;
    setIsRunning(false);

    await textControls.start({
      y: '10%',
      opacity: 1,
      transition: { duration: ENTER_DURATION, ease: 'easeOut' },
    });
  };

  const runPrevious = async () => {
    if (isRunning) return;
    if (clockRef.current?.hourIndex <= 1) {
      alert("Already at 1 o'clock!");
      return;
    }

    setDirection('down');
    setIsRunning(true);

    if (hasRunOnce.current) {
      await textControls.start({
        y: '150%',
        opacity: 0,
        transition: { duration: EXIT_DURATION, ease: 'easeIn' },
      });
    }

    const prevHour = clockRef.current?.previousHour();
    if (prevHour === null) {
      setIsRunning(false);
      return;
    }
    setHourLabel(prevHour);

    await new Promise((resolve) => setTimeout(resolve, (DESKTOP_CLOCK_DURATION - 0.5) * 1000));

    setIsRunning(false);

    await textControls.start({
      y: '10%',
      opacity: 1,
      transition: { duration: ENTER_DURATION, ease: 'easeOut' },
    });
  };

  useEffect(() => {
    shape1Controls.start({
      left: window.innerWidth * 0.9,
      transition: { duration: 7, ease: 'easeOut' }
    });
    shape2Controls.start({
      left: window.innerWidth * 0.7,
      transition: { duration: 7, ease: 'easeOut' }
    });
    runAdvance();
  }, []);

  return (
    <div className="projects-body">
      <div className='grain-overlay' style={{background: `url(${process.env.PUBLIC_URL}/grain.gif`}}/>
      <motion.div
        style={{ position: 'absolute', width: '100vw', height: '100vh', zIndex: 100, backgroundColor: 'orange', top: 0 }}
        initial={{ left: 0 }}
        animate={{ left: -window.innerWidth }}
        exit={{ left: 0 }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
      />
      <BackButton />

      <motion.div
        style={{ backgroundColor: '#ffbd0d', width: '30vw', height: '100vh', position: 'absolute', top: 0, skewX: -15 }}
        initial={{ left: 0 }}
        animate={shape1Controls}
      />

      <motion.div
        style={{ backgroundColor: '#ffbd0d', width: '20vw', height: '100vh', position: 'absolute', top: 0, skewX: -15 }}
        initial={{ left: '-21vw' }}
        animate={shape2Controls}
      />

      <Clock
        ref={clockRef}
        spins={2}
        duration={DESKTOP_CLOCK_DURATION}
        style={{ right: '150px', top: '200px' }}
        isMobile={isMobile}
      />

      <motion.div
        initial={{ x: '10%', y: "10%", opacity: 0 }}
        animate={textControls}
        style={{ position: 'absolute', left: '5%', fontSize: '2rem', fontWeight: 600, color: 'white', width: "40%", padding: '20px 30px' }}
      >
        <div className="clock-wrapper">
          <div className="clock-time">
            <span className="time-unit">{hourLabel !== null ? `${hourLabel}` : ''}</span>
            <span className="colon">:</span>
            <span className="time-unit">00</span>
          </div>
        </div>
        
        <h1 style={{ marginTop: "10px", fontSize: "1em", whiteSpace: "pre-line" }}>
          {hourLabel !== null ? projects[hourLabel - 1]?.title : ''}
        </h1>
        <AnimatePresence mode="wait" custom={direction}>
          {hourLabel !== null && (
            <motion.div
              key={hourLabel}
              custom={direction}
              variants={frameVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="project-frame"
            >
              <div className="project-frame-bar">
                <span className="project-frame-dot" data-color="red" />
                <span className="project-frame-dot" data-color="yellow" />
                <span className="project-frame-dot" data-color="green" />
              </div>
              <div className="project-frame-urlbar">
                <span className="project-frame-url">
                  {projects[hourLabel - 1]?.url}
                  <a href={projects[hourLabel - 1]?.url} target="_blank" rel="noopener noreferrer"><MdOpenInNew /></a>
                </span>
              </div>
              <div className="project-frame-viewport">
                <img src={process.env.PUBLIC_URL + projects[hourLabel - 1]?.img} alt="" className="project-frame-img" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="controls-container"
        variants={containerVariants}
        initial="hidden"
        animate={isRunning ? 'hidden' : 'visible'}
      >
        <motion.button variants={buttonVariants} className="para-button" onClick={runPrevious} disabled={isRunning || clockRef.current?.hourIndex <= 1}>
          <span className="para-text">▲</span>
        </motion.button>
        <motion.button variants={buttonVariants} className="para-button" onClick={runAdvance} disabled={isRunning || clockRef.current?.hourIndex >= projects.length}>
          <span className="para-text">▼</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

// ------------------------------------------------------------
// Mobile Component (Glitch-Free Fading Loop Shapes)
// ------------------------------------------------------------
function MobileView({ isMobile }) {
  const clockRef = useRef(null);
  const [hourLabel, setHourLabel] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [direction, setDirection] = useState('up');
  const hasRunOnce = useRef(false);

  const shape1Controls = useAnimation();
  const shape2Controls = useAnimation();

  const mobileFrameVariants = {
    enter: (direction) => ({ x: direction === 'down' ? '-50px' : '50px', opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: (direction) => ({ x: direction === 'down' ? '50px' : '-50px', opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } }),
  };

  const triggerYellowFluctuation = () => {
    // Fade out as it exits right, snap invisible to the left, and fade back in as it settles
    shape1Controls.start({
      left: ['50%', '150%', '-50%', '50%'],
      opacity: [1, 0, 0, 1],
      transition: { 
        duration: MOBILE_CLOCK_DURATION + 0.5, 
        times: [0, 0.44, 0.46, 1], 
        ease: ['easeInOut', 'linear', 'easeInOut'] 
      }
    });

    shape2Controls.start({
      left: ['50%', '150%', '-50%', '50%'],
      opacity: [1, 0, 0, 1],
      transition: { 
        duration: MOBILE_CLOCK_DURATION + 0.5, 
        times: [0, 0.44, 0.46, 1], 
        ease: ['easeInOut', 'linear', 'easeInOut'] 
      }
    });
  };

  const runAdvance = async () => {
    if (isRunning) return;
    setDirection('up');
    setIsRunning(true);

    if (hasRunOnce.current) {
      triggerYellowFluctuation();
    }
    hasRunOnce.current = true;

    const nextHour = clockRef.current?.advanceHour();
    
    await new Promise((resolve) => setTimeout(resolve, (MOBILE_CLOCK_DURATION * 1000) / 2));
    setHourLabel(nextHour);
    setTimeout(() => setIsRunning(false), (MOBILE_CLOCK_DURATION * 1000) / 2);
  };

  const runPrevious = async () => {
    if (isRunning) return;
    if (clockRef.current?.hourIndex <= 1) {
      alert("Already at 1 o'clock!");
      return;
    }

    setDirection('down');
    setIsRunning(true);
    triggerYellowFluctuation();

    const prevHour = clockRef.current?.previousHour();
    if (prevHour === null) {
      setIsRunning(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, (MOBILE_CLOCK_DURATION * 1000) / 2));
    setHourLabel(prevHour);
    setTimeout(() => setIsRunning(false), (MOBILE_CLOCK_DURATION * 1000) / 2);
  };

  useEffect(() => {
    shape1Controls.set({ left: '-100%', x: '-50%', opacity: 1 });
    shape2Controls.set({ left: '-100%', x: '-50%', opacity: 1 });

    shape1Controls.start({
      left: '50%',
      transition: { duration: 1.5, ease: 'easeOut' }
    });
    shape2Controls.start({
      left: '50%',
      transition: { duration: 1.8, ease: 'easeOut' }
    });

    runAdvance();
  }, []);

  return (
    <div 
      className="mobile-body" 
      style={{ 
        position: 'relative', 
        overflowX: 'hidden', 
        overflowY: 'auto',
        width: '100vw', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        paddingBottom: '40px'
      }}
    >
      <div className='grain-overlay' style={{background: `url(${process.env.PUBLIC_URL}/grain.gif`}}/>
      
      {/* Screen-wipe entry transition */}
      <motion.div
        style={{ position: 'fixed', width: '100vw', height: '100vh', zIndex: 100, backgroundColor: 'orange', top: 0, left: 0, pointerEvents: 'none' }}
        initial={{ left: 0 }}
        animate={{ left: -window.innerWidth }}
        exit={{ left: 0 }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
      />

      {/* Abstract Sliding Shapes with Opacity Tracking */}
      <motion.div
        style={{ backgroundColor: '#ffbd0d', width: '85vw', minHeight: '100vh', height: '100%', position: 'absolute', top: 0, skewX: -15, zIndex: 0, willChange: 'left, opacity' }}
        animate={shape1Controls}
      />
      <motion.div
        style={{ backgroundColor: '#ffbd0d', width: '65vw', minHeight: '100vh', height: '100%', position: 'absolute', top: 0, skewX: -15, zIndex: 0, willChange: 'left, opacity' }}
        animate={shape2Controls}
      />

      {/* Main Content Container */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <BackButton />
        <div className="mobile-content-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '10px 0' }}>
          <Clock
            ref={clockRef}
            spins={1}
            duration={MOBILE_CLOCK_DURATION}
            className="mobile-clock-container"
            isMobile={isMobile}
          />

          <div className="mobile-project-info" style={{ textAlign: 'center', margin: '10px 0' }}>
            <div className="clock-time">
              <span className="time-unit">{hourLabel !== null ? `${hourLabel}` : ''}</span>
              <span className="colon">:</span>
              <span className="time-unit">00</span>
            </div>
            
            <h1 className="mobile-project-title">
              {hourLabel !== null ? projects[hourLabel - 1]?.title : ''}
            </h1>
          </div>

          <div className="mobile-project-showcase" style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '10px 0' }}>
            <AnimatePresence mode="wait" custom={direction}>
              {hourLabel !== null && (
                <motion.div
                  key={hourLabel}
                  custom={direction}
                  variants={mobileFrameVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="project-frame"
                >
                  <div className="project-frame-bar">
                    <span className="project-frame-dot" data-color="red" />
                    <span className="project-frame-dot" data-color="yellow" />
                    <span className="project-frame-dot" data-color="green" />
                  </div>
                  <div className="project-frame-urlbar">
                    <span className="project-frame-url">
                      {projects[hourLabel - 1]?.url}
                      <a href={projects[hourLabel - 1]?.url} target="_blank" rel="noopener noreferrer"><MdOpenInNew /></a>
                    </span>
                  </div>
                  <div className="project-frame-viewport">
                    <img src={process.env.PUBLIC_URL + projects[hourLabel - 1]?.img} alt="" className="project-frame-img" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mobile-controls-container" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
            <button className="mobile-para-button" onClick={runPrevious} disabled={isRunning || clockRef.current?.hourIndex <= 1}>
              <span className="para-text">Prev</span>
            </button>
            <button className="mobile-para-button" onClick={runAdvance} disabled={isRunning || clockRef.current?.hourIndex >= projects.length}>
              <span className="para-text">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}