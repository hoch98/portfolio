import './styles/Home.css';
import WavyBox from './components/wave';
import { motion, useTime, useTransform } from "framer-motion";
import Rain from './components/rain';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const time = useTime();
  const speedModifier = 0.1;
  const navigate = useNavigate();

  const loopDistance = window.innerWidth * 2; 

  const sceneX = useTransform(time, (t) => {
    const distanceTraveled = t * speedModifier;
    return -(distanceTraveled % loopDistance);
  });

  const tableHeight = 0.3 * window.innerHeight;

  const linkMap = {
    "About": "/about",
    "Projects": "/projects",
    "Contact": "/contact"
  }

  return (
    <div className='body' style={{ backgroundColor: "#a0c3ca", position: 'relative', overflow: 'hidden', height: '100vh' }}>
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
          left: window.innerWidth
        }}
        exit={{
          left: 0
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}

      />
      <WavyBox />
      <Rain zIndex={2} count={500} />
      
      <nav className="nav-menu">
      {Object.keys(linkMap).map((item) => (
        <motion.button 
          key={item}
          className="nav-btn"
          whileHover={{ 
            scale: 1.05, 
            x: 10,
            backgroundColor: "rgba(255, 213, 141, 0.15)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => {
            navigate(linkMap[item])
          }}
        >
          {item}
        </motion.button>
      ))}
    </nav>
      <motion.div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0,
          width: window.innerWidth * 4,
          height: '100%',
          x: sceneX,
          zIndex: 6
        }}
      >
        <img 
          className='frame' 
          src={process.env.PUBLIC_URL +"/frame.svg" }
          height={window.innerHeight} 
          width={window.innerWidth * 2} 
          style={{ position: 'absolute', top: 0, left: 0 }}
          alt=""
        />

        <img 
          alt=""
          className='table' 
          src={process.env.PUBLIC_URL +"/table.svg"}
          height={tableHeight}
          style={{ position: 'absolute', left: `${window.innerWidth * 1.1}px`, bottom: '7.5vh', zIndex: 10}} 
        />

        <img 
          alt=""
          className='table' 
          src={process.env.PUBLIC_URL +"/table.svg"}
          height={tableHeight}
          style={{ position: 'absolute', left: `${window.innerWidth * 1.65}px`, bottom: '7.5vh', zIndex: 10,transform: "scaleX(-1)" }} 
        />

        <img 
          alt=""
          className='frame' 
          src={process.env.PUBLIC_URL +"/frame.svg" }
          height={window.innerHeight} 
          width={window.innerWidth * 2} 
          style={{ position: 'absolute', top: 0, left: `${loopDistance}px` }}
        />

        <img 
          alt=""
          className='table' 
          src={process.env.PUBLIC_URL +"/table.svg"}
          height={tableHeight}
          style={{ position: 'absolute', left: `${window.innerWidth * 1.3 + loopDistance}px`, bottom: '7.5vh', zIndex: 10 }} 
        />

        <img 
          alt=""
          className='table' 
          src={process.env.PUBLIC_URL +"/table.svg"}
          height={tableHeight}
          style={{ position: 'absolute', left: `${window.innerWidth * 1.6 + loopDistance}px`, bottom: '7.5vh', zIndex: 10 }} 
        />
      </motion.div>
      
      <div style={{width: "100vw", height: "15%", position:"absolute", bottom: 0, zIndex : 3, backgroundColor: "#DDCCBD"}}></div>
      <img 
        alt=""
        src={process.env.PUBLIC_URL +"/floor.svg" }
        height={window.innerHeight} 
        width={window.innerWidth * 2} 
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, pointerEvents: 'none' }} 
      />
      <div className="floor" style={{ backgroundColor: "#ddccbd", position: 'absolute', bottom: 0, width: '100%', height: '15%', zIndex: 4 }} />
      <div className='gradient-blur-overlay' style={{zIndex: 11}}>

      </div>
    </div>
  );
}
