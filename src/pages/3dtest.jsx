import './styles/Contact.css';
import { motion } from 'framer-motion';
import BackButton from './components/backbutton';
import WavySlab from './components/wave3d';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import RainEffect from './components/RainEffect';

function Frame() {
  return (
    <group position={[0, 3, -10]}>
      <mesh receiveShadow>
        <boxGeometry args={[55, 1.25, 1]} />
        <meshStandardMaterial color="#2c5474" />
      </mesh>

      {Array.from({ length: 8 }).map((_, index) => {
        return (
          <mesh
            position={[-24.0625 + 6.875 * index, -5.5, 0]}
            key={`pillar_${index}`}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.9, 10, 0.5]}/>
            <meshStandardMaterial color="#2c5474" />
          </mesh>
        );
      })}
    </group>
  );
}

function Walls() {
  return (
    <group>
      <mesh position={[0, -1.9, 15]} receiveShadow>
        <boxGeometry args={[55, 11, 1]} />
        <meshStandardMaterial color="#2c5474" />
      </mesh>
    </group>
  );
}

function Floor() {
  return (
    <group>
      <mesh position={[0, -7.5, 9]}>
        <boxGeometry args={[55, 1, 40]} />
        <meshBasicMaterial color="#e4c2a5" />
      </mesh>

      <mesh position={[0, -7.49, 9]} receiveShadow>
        <boxGeometry args={[55, 1, 40]} />
        <shadowMaterial color="#16213e" opacity={0.7} transparent />
      </mesh>
    </group>
  );
}

function SceneSegment({ position }) {
  return (
    <group position={position}>
      <Frame />
      <Walls />
      <Floor />
    </group>
  );
}

function InfiniteEnvironment({ isRunning }) {
  const groupRef = useRef();

  const speed = isRunning ? 0.05 : 0;
  const segmentWidth = 55;

  useFrame(() => {
    if (groupRef.current && speed > 0) {
      groupRef.current.position.x -= speed;

      if (groupRef.current.position.x <= -segmentWidth) {
        groupRef.current.position.x += segmentWidth;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <SceneSegment position={[-segmentWidth, 0, 0]} />
      <SceneSegment position={[0, 0, 0]} />
      <SceneSegment position={[segmentWidth, 0, 0]} />
      <SceneSegment position={[segmentWidth * 2, 0, 0]} />
      <SceneSegment position={[segmentWidth * 3, 0, 0]} />
      <mesh position={[-27.5, -1.9, 3]} receiveShadow visible={true}>
          <boxGeometry args={[1, 11, 25]}/>
          <meshStandardMaterial color="#2c5474" />
        </mesh>
    </group>
  );
}
function CameraRig({ focusHallway, controlsRef }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!focusHallway || !controlsRef.current) return;

    targetPos.current.set(20, -4, 4);
    targetLookAt.current.set(20 - 15, -3, 4);

    camera.position.lerp(targetPos.current, 0.025);
    controlsRef.current.target.lerp(targetLookAt.current, 0.025);
    controlsRef.current.update();
  });

  return null;
}

export default function About() {
  // Controls the hallway environment scroll only
  const [treadmillRunning, setTreadmillRunning] = useState(true);
  const [focusHallway, setFocusHallway] = useState(false);
  const controlsRef = useRef();

  const handleHallwayView = () => {
    setTreadmillRunning(false); // stop the hallway scroll
    setFocusHallway(true);      // start the camera lerp
  };

  return (
    <div className='body'>
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
        animate={{ left: -window.innerWidth }}
        exit={{ left: 0 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
      />
      <BackButton />

      <button
        onClick={handleHallwayView}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 200,
          padding: "8px 16px",
          background: "#2c5474",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        View hallway
      </button>

      <Canvas shadows camera={{ position: [0, -3, 1], fov: 60 }}>
        <color attach="background" args={['#a4c5ca']} />

        <fog attach="fog" args={['#a4c5ca', 50, 150]} />

        <directionalLight
          position={[-20, 50, -10]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-55}
          shadow-camera-right={55}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
          shadow-camera-near={0.5}
          shadow-camera-far={150}
          shadow-bias={-0.0005}
        />

        <ambientLight intensity={2.5} />

        <WavySlab position={[0, -20, -100]} width={200} depth={200}/>

        <InfiniteEnvironment isRunning={treadmillRunning} />

        <RainEffect count={3000} isRunning={true} />

        <CameraRig focusHallway={focusHallway} controlsRef={controlsRef} />

        <OrbitControls
          ref={controlsRef}
          target={[0, -3, -10]}
          enableDamping
          dampingFactor={0.08}
          minDistance={2}
          maxDistance={40}
          onStart={() => {
            setTreadmillRunning(false); // manual orbiting also stops the hallway scroll
            setFocusHallway(false);     // and cancels the auto-lerp
          }}
        />
      </Canvas>
    </div>
  );
}