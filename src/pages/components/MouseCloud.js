import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function MouseCloud() {
  const [hasPosition, setHasPosition] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 15, mass: 1.2 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 15, mass: 1.2 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!hasPosition) {
        springX.jump(e.clientX);
        springY.jump(e.clientY);
        setHasPosition(true);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasPosition, mouseX, mouseY, springX, springY]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: hasPosition ? 1 : 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        width: 260,
        height: 140,
        pointerEvents: 'none',
        zIndex: 50,
        mixBlendMode: 'screen',
        filter: 'blur(40px)',
        background:
          'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 75%)',
      }}
    />
  );
}