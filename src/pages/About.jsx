import './styles/About.css';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className='body'>
      <motion.div
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          zIndex: 100,
          backgroundColor: "orange",
          top: 0
        }}
        initial={{
          left: 0
        }}
        animate={{
          left: -window.innerWidth
        }}
        transition={{
          duration: 0.5,
          ease: "easeIn"
        }}

      />
      <h1>About</h1>
    </div>
  );
}
