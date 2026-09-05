import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Manages thousands of raindrops using InstancedMesh
export default function RainEffect({ count = 300, isRunning, zThreshold = -12 }) {
  const meshRef = useRef();

  // Defines the bounds for the rain volume based on scene scale
  const bounds = useMemo(() => {
    return {
      x: 150,      // width of the rain volume
      y: 150,      // height of the rain volume
      zDepth: 80,  // how far back the rain extends from the zThreshold
    };
  }, []);

  // Initialize raindrop positions and speeds
  const rainData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * bounds.x,
          Math.random() * bounds.y - bounds.y / 2 + 30, // Start above the camera fov
          // Constrain Z to only spawn from the threshold and further backwards
          zThreshold - Math.random() * bounds.zDepth 
        ),
        speed: 0.3 + Math.random() * 1, // Varied falling speed
      });
    }
    return data;
  }, [count, bounds, zThreshold]);

  // Temporary objects for instance matrix manipulation
  const tempObject = new THREE.Object3D();
  const rainColor = new THREE.Color('#a4c5ca').multiplyScalar(0.8);
  
  // Define wind strength (affects both movement and geometry rotation)
  const windStrength = 0.15; 
  // Calculate the correct angle so the mesh tilts to match its trajectory
  const rainAngle = -Math.atan(-windStrength);

  useFrame((state, delta) => {
    if (!meshRef.current || !isRunning) return;

    tempObject.rotation.z = rainAngle;

    // Optional: cap delta to prevent massive jumps if the user switches browser tabs
    const safeDelta = Math.min(delta, 0.1); 

    rainData.forEach((rain, i) => {
      // Multiply by safeDelta to ensure consistent speed across all monitors!
      // (You may need to increase your base rain.speed multiplier to compensate)
      rain.position.y -= rain.speed * safeDelta * 60; 
      rain.position.x += rain.speed * windStrength * safeDelta * 60; 

      const floorLevel = -10;
      if (rain.position.y < floorLevel) {
        rain.position.y = bounds.y / 2 + 30;
        rain.position.x = (Math.random() - 0.5) * bounds.x;
        rain.position.z = zThreshold - Math.random() * bounds.zDepth;
      }

      tempObject.position.copy(rain.position);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <boxGeometry args={[0.02, 3, 0.02]} />
      <meshBasicMaterial
        color={rainColor}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}