import './styles/Projects.css';
import { motion, useAnimation } from 'framer-motion';
import BackButton from './components/backbutton';
import Clock from './components/clock';
import { useEffect, useRef, useState } from 'react';

const CLOCK_DURATION = 4;
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

const buttonVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 15 },
};

const projects = [
  {
    "title": "Project 1"
  },
  {
    "title": "Project 2"
  },
  {
    "title": "Project 3"
  },
  {
    "title": "Project 4"
  },
  {
    "title": "Project 5"
  },
]

export default function Projects() {
  const clockRef = useRef(null);
  const textControls = useAnimation();
  const [hourLabel, setHourLabel] = useState(null);
  const hasRunOnce = useRef(false);
  const [isRunning, setIsRunning] = useState(false);

  const runAdvance = async () => {
    if (isRunning) return;
    setIsRunning(true);

    if (hasRunOnce.current) {
      await textControls.start({
        x: '-100%',
        opacity: 0,
        transition: { duration: EXIT_DURATION, ease: 'easeIn' },
      });
    }
    hasRunOnce.current = true;

    const nextHour = clockRef.current?.advanceHour();

    await new Promise((resolve) => setTimeout(resolve, CLOCK_DURATION * 1000));

    setHourLabel(nextHour);
    setIsRunning(false);

    await textControls.start({
      x: '10%',
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

    setIsRunning(true);

    if (hasRunOnce.current) {
      await textControls.start({
        x: '100%',
        opacity: 0,
        transition: { duration: EXIT_DURATION, ease: 'easeIn' },
      });
    }

    const prevHour = clockRef.current?.previousHour();
    if (prevHour === null) {
      setIsRunning(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, CLOCK_DURATION * 1000));

    setHourLabel(prevHour);
    setIsRunning(false);

    await textControls.start({
      x: '10%',
      opacity: 1,
      transition: { duration: ENTER_DURATION, ease: 'easeOut' },
    });
  };

  useEffect(() => {
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

      {/* Main Yellow Background Shape */}
      <motion.div
        style={{
          backgroundColor: '#ffbd0d',
          width: '30vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
          skewX: -15,
        }}
        initial={{ left: 0 }}
        animate={{ left: window.innerWidth * 0.9 }}
        transition={{ duration: 7, ease: 'easeOut' }}
      />
      <motion.div
        style={{
          backgroundColor: '#ffbd0d',
          width: '20vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: -295,
          skewX: -15,
        }}
        initial={{ left: '-21vw' }}
        animate={{ left: window.innerWidth * 0.7 }}
        transition={{ duration: 7, ease: 'easeOut' }}
      />

      <Clock
        ref={clockRef}
        spins={2}
        duration={CLOCK_DURATION}
        style={{ right: '150px', top: '200px' }}
      />

      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={textControls}
        style={{
          position: 'absolute',
          left: '10%',
          top: '50px',
          fontSize: '2rem',
          fontWeight: 600,
          color: 'white',
          width: "40%",
          // Glassmorphic border & background blur
          // border: '2px solid white',
          // borderRadius: '12px',
          padding: '20px 30px',
          // backgroundColor: 'rgba(255, 255, 255, 0.15)',
          // backdropFilter: 'blur(10px)',
          // WebkitBackdropFilter: 'blur(10px)',
          // boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        }}
      >
        {hourLabel !== null ? `${hourLabel}:00` : ''}
        <h1 style={{margin: "0"}}>{hourLabel !== null ? projects[hourLabel - 1]?.title : ''}</h1>
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