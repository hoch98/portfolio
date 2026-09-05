import './styles/About.css';
import { motion, useReducedMotion } from 'framer-motion';
import BackButton from './components/backbutton';

const DIAGONAL = 40;

const whiteBgClip = `polygon(${DIAGONAL}% 0, 100% 0, 100% 100%, 0% 100%)`;
const magentaLineClip = `polygon(calc(${DIAGONAL}% - 2px) 0, ${DIAGONAL}% 0, 0% 100%, calc(0% - 2px) 100%)`;
const blueLineClip = `polygon(calc(${DIAGONAL}% + 3px) 0, calc(${DIAGONAL}% + 5px) 0, calc(0% + 5px) 100%, calc(0% + 3px) 100%)`;
const whiteLineClip = `polygon(${DIAGONAL}% 0, calc(${DIAGONAL}% + 3px) 0, calc(0% + 3px) 100%, 0% 100%)`;

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: shouldReduceMotion
        ? {}
        : { staggerChildren: 0.12, delayChildren: 0.7 },
    },
  };

  const itemVariants = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
      };

  return (
    <div
      className="about-body"
      style={{ position: 'relative', overflow: 'hidden', width: '100vw', height: '100vh' }}
    >
      {/* Hidden SVG filter def — gives the black line its pencil/hand-drawn edge wobble.
          Lives once in the DOM; referenced via filter: url(#pencilTexture) below. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="pencilTexture" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.9" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div
        className="about-panel"
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}
      >
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="about-headline" variants={itemVariants}>
            Hi, I'm Ho Yun.
          </motion.h1>

          <motion.p className="about-subline" variants={itemVariants}>
            Student and aspiring software engineer, based in Singapore.
          </motion.p>

          <motion.p className="about-intro" variants={itemVariants}>
            I'm still early in figuring out what I want to build, but probably something to do with math, 3D design, and UI.
            <br />
            I like making cool things that solve problems.
          </motion.p>

          <motion.div className="about-divider" variants={itemVariants} />

          <motion.section variants={itemVariants}>
            <h2 className="about-section-title">Currently</h2>
            <p className="about-intro">
              Studying at UWCSEA in Singapore, and working on small projects on the side to build my skillset.
            </p>
          </motion.section>

          <motion.div className="about-divider" variants={itemVariants} />

          <motion.section variants={itemVariants}>
            <h2 className="about-section-title">cool thing</h2>
            <p className="about-contact-lead">The fastest way to reach me is email.</p>
            <a className="about-contact-link" href="mailto:you@example.com">
              you@example.com
            </a>
          </motion.section>
        </motion.div>
      </div>

      <motion.div
        style={{ position: 'absolute', width: '100vw', height: '100vh', zIndex: 100, backgroundColor: 'orange', top: 0 }}
        initial={{ left: 0 }}
        animate={{ left: '-100vw' }}
        exit={{ left: 0 }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
      />

      <motion.div
        className="about-envelope"
        style={{ position: 'absolute', top: 0, right: 0, width: '35vw', height: '100vh', zIndex: 50, overflow: 'hidden' }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
      >
        <motion.div
          style={{ position: 'absolute', inset: 0, clipPath: whiteBgClip }}
          initial={{ backgroundColor: '#100f0f' }}
          animate={{ backgroundColor: '#ffffff' }}
          transition={{ duration: 0.5, delay: 1, ease: 'easeInOut' }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ff00ff', clipPath: magentaLineClip, pointerEvents: 'none', zIndex: 3 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#00aaff', clipPath: blueLineClip, pointerEvents: 'none', zIndex: 3 }} />

        <div
          className="pencil-line"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'black',
            clipPath: whiteLineClip,
            pointerEvents: 'none',
            zIndex: 3,
            filter: 'url(#pencilTexture)',
          }}
        />
      </motion.div>

      <BackButton />
    </div>
  );
}