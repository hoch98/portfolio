import './styles/Contact.css';
import { motion } from 'framer-motion';
import BackButton from './components/backbutton';

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
        exit={{
          left: 0
        }}
        transition={{
          duration: 0.5,
          ease: "easeIn"
        }}

      />
      <BackButton></BackButton>
    </div>
  );
}
