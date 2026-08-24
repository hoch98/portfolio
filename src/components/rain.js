import { useMemo } from 'react';

function Rain({ count = 140, zIndex = 4 }) {
  const drops = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: -40 + Math.random() * 140,    
      delay: -Math.random() * 4,        
      duration: 0.4 + Math.random() * 0.4, 
      length: 60 + Math.random() * 80,    
      drift: 150 + Math.random() * 200,
      opacity: 0.3 + Math.random() * 0.5,
      width: Math.random() < 0.3 ? 2 : 1.5, 
    }));
  }, [count]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex,
      }}
    >
      <style>{`
        @keyframes rain-fall {
          /* CHANGED: Swapped skew to a positive angle (25deg) to tilt lines to the right */
          0%   { transform: translate(0, -20%) skewX(25deg); }
          100% { transform: translate(var(--drift), 120vh) skewX(25deg); }
        }
      `}</style>

      {drops.map((d) => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            top: 0,
            left: `${d.left}%`,
            width: `${d.width}px`,
            height: `${d.length}px`,
            background:
              'linear-gradient(to bottom, rgba(240,246,244,0), rgba(240,246,244,0.85))',
            opacity: d.opacity,
            '--drift': `${d.drift}px`,
            animation: `rain-fall ${d.duration}s linear ${d.delay}s infinite`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}

export default Rain;
