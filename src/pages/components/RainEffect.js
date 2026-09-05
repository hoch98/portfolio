import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Manages thousands of raindrops using InstancedMesh
export default function RainEffect({ count = 300, isRunning, zThreshold = -12 }) {
  const meshRef = useRef();

  // Defines the bounds for the rain volume based on scene scale
  const bounds = useMemo(() => {
    return {
      x: 150,
      y: 150,
      zDepth: 80,
    };
  }, []);

  const rainData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * bounds.x,
          Math.random() * bounds.y - bounds.y / 2 + 30, 
          zThreshold - Math.random() * bounds.zDepth 
        ),
        speed: 0.3 + Math.random() * 1,
      });
    }
    return data;
  }, [count, bounds, zThreshold]);

  const tempObject = new THREE.Object3D();
  const rainColor = new THREE.Color('#a4c5ca').multiplyScalar(0.8);
  
  const windStrength = 0.15; 
  const rainAngle = -Math.atan(-windStrength);

  useFrame((state, delta) => {
    if (!meshRef.current || !isRunning) return;

    tempObject.rotation.z = rainAngle;

    const safeDelta = Math.min(delta, 0.1); 

    rainData.forEach((rain, i) => {
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