import './App.css';
import WavyBox from './components/wave';
import { motion, useTime, useTransform } from "framer-motion";
import Rain from './components/rain';

function App() {
  const time = useTime();
  const speedModifier = 0.1;

  const loopDistance = window.innerWidth * 2; 

  const sceneX = useTransform(time, (t) => {
    const distanceTraveled = t * speedModifier;
    return -(distanceTraveled % loopDistance);
  });

  const tableWidth = window.innerWidth * 0.15;

  return (
    <div className='body' style={{ backgroundColor: "#a0c3ca", position: 'relative', overflow: 'hidden', height: '100vh' }}>
      <WavyBox />
      <Rain zIndex={2}/>
      <h1 className='hi'>
        Hi
      </h1>
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
          src="/frame.svg" 
          height={window.innerHeight} 
          width={window.innerWidth * 2} 
          style={{ position: 'absolute', top: 0, left: 0 }}
        />

        <img 
          className='table' 
          src="/table.svg"
          width={tableWidth}
          style={{ position: 'absolute', left: `${window.innerWidth * 1.2}px`, bottom: '7.5vh' }} 
        />

        <img 
          className='table' 
          src="/table.svg"
          width={tableWidth}
          style={{ position: 'absolute', left: `${window.innerWidth * 1.6}px`, bottom: '7.5vh' }} 
        />

        <img 
          className='frame' 
          src="/frame.svg" 
          height={window.innerHeight} 
          width={window.innerWidth * 2} 
          style={{ position: 'absolute', top: 0, left: `${loopDistance}px` }}
        />

        <img 
          className='table' 
          src="/table.svg"
          width={tableWidth}
          style={{ position: 'absolute', left: `${window.innerWidth * 1.2 + loopDistance}px`, bottom: '7.5vh' }} 
        />

        <img 
          className='table' 
          src="/table.svg"
          width={tableWidth}
          style={{ position: 'absolute', left: `${window.innerWidth * 1.6 + loopDistance}px`, bottom: '7.5vh' }} 
        />
      </motion.div>
      
      <div style={{width: "100vw", height: "20vh", position:"absolute", bottom: 0, zIndex : 3, backgroundColor: "#DDCCBD"}}></div>
      <img 
        src="/floor.svg" 
        height={window.innerHeight} 
        width={window.innerWidth * 2} 
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, pointerEvents: 'none' }} 
      />
      <div className="floor" style={{ backgroundColor: "#ddccbd", position: 'absolute', bottom: 0, width: '100%', height: '15%', zIndex: 4 }} />
    </div>
  );
}

export default App;
