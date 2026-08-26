import './styles/Projects.css';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import BackButton from './components/backbutton';
import Clock from './components/clock';
import { useEffect, useRef, useState } from 'react';
import { MdOpenInNew } from "react-icons/md";

const CLOCK_DURATION = 3;
const EXIT_DURATION = 0.75;
const ENTER_DURATION = 1;

const containerVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ENTER_DURATION,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: EXIT_DURATION,
      ease: 'easeIn',
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const frameVariants = {
  enter: (direction) => ({
    y: direction === 'down' ? '-100%' : '100%',
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: {
      duration: EXIT_DURATION,
      ease: [0.33, 1, 0.68, 1],
    },
  },
  exit: (direction) => ({
    y: direction === 'down' ? '100%' : '-100%',
    opacity: 0,
    transition: {
      duration: EXIT_DURATION,
      ease: [0.32, 0, 0.67, 0],
    },
  }),
};

const buttonVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 15 },
};

const projects = [
  {
    "title": "SAT English\n Revision Site",
    "img": "/projects/project1/image.png",
    "url": "https://github.com/hoch98/sat-revision"
  },
  {
    "title": "Skyblock Attribute\n Lookup Site",
    "img": "/projects/project2/image.png",
    "url": "https://github.com/hoch98/attribute-lookup"
  },
  {
    "title": "Light Care\n Smart Mirror",
    "img": "/projects/project3/image.png",
    "url": "https://github.com/hoch98/light-care/"
  },
  {
    "title": "Sphere to Cube\n Interpolation Simulation",
    "img": "/projects/project4/image.png",
    "url": "https://github.com/hoch98/sphere2cube"
  },
  {
    "title": "YouTube Video Syncer",
    "img": "/projects/project5/image.png",
    "url": "https://github.com/hoch98/youtube-syncer"
  },
];

export default function Projects() {
  const clockRef = useRef(null);
  const textControls = useAnimation();
  
  const shape1Controls = useAnimation();
  const shape2Controls = useAnimation();

  const [hourLabel, setHourLabel] = useState(null);
  const hasRunOnce = useRef(false);
  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(false);
  const [direction, setDirection] = useState('up');

  // Trigger fluctuation relative to resting points
  const triggerYellowFluctuation = () => {
    const target1 = window.innerWidth * 0.9;
    const target2 = window.innerWidth * 0.7;

    shape1Controls.start({
      left: [target1, target1 -50, target1],
      transition: { duration: CLOCK_DURATION+0.5, ease: 'easeInOut' }
    });

    shape2Controls.start({
      left: [target2, target2 - 75, target2],
      transition: { duration: CLOCK_DURATION+0.5, ease: 'easeInOut' }
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

    await new Promise((resolve) => setTimeout(resolve, (CLOCK_DURATION - 0.5) * 1000));

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

    await new Promise((resolve) => setTimeout(resolve, (CLOCK_DURATION - 0.5) * 1000));

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
    <div className="body">
      <motion.div
        style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          zIndex: 100,
          backgroundColor: 'orange',
          top: 0,
        }}
        initial={{ left: 0 }}
        animate={{ left: -window.innerWidth }}
        exit={{ left: 0 }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
      />
      <BackButton />

      {/* Main Yellow Background Shape 1 */}
      <motion.div
        style={{
          backgroundColor: '#ffbd0d',
          width: '30vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          skewX: -15,
        }}
        initial={{ left: 0 }}
        animate={shape1Controls}
      />

      {/* Main Yellow Background Shape 2 */}
      <motion.div
        style={{
          backgroundColor: '#ffbd0d',
          width: '20vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          skewX: -15,
        }}
        initial={{ left: '-21vw' }}
        animate={shape2Controls}
      />

      <Clock
        ref={clockRef}
        spins={2}
        duration={CLOCK_DURATION}
        style={{ right: '150px', top: '200px' }}
      />

      <motion.div
        initial={{ x: '10%', y: "10%", opacity: 0 }}
        animate={textControls}
        style={{
          position: 'absolute',
          left: '5%',
          fontSize: '2rem',
          fontWeight: 600,
          color: 'white',
          width: "40%",
          padding: '20px 30px',
        }}
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
                  <a href={projects[hourLabel - 1]?.url} target="_blank" rel="noopener noreferrer">
                    <MdOpenInNew />
                  </a>
                </span>
              </div>
              <div className="project-frame-viewport">
                <img
                  src={process.env.PUBLIC_URL + projects[hourLabel - 1]?.img}
                  alt=""
                  className="project-frame-img"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom-Left Controls Container */}
      <motion.div
        className="controls-container"
        variants={containerVariants}
        initial="hidden"
        animate={isRunning ? 'hidden' : 'visible'}
      >
        <motion.button
          variants={buttonVariants}
          className="para-button"
          onClick={runPrevious}
          disabled={isRunning || clockRef.current?.hourIndex <= 1}
        >
          <span className="para-text">▲</span>
        </motion.button>

        <motion.button
          variants={buttonVariants}
          className="para-button"
          onClick={runAdvance}
          disabled={isRunning || clockRef.current?.hourIndex >= projects.length}
        >
          <span className="para-text">▼</span>
        </motion.button>
      </motion.div>
    </div>
  );
}