import './styles/About.css';
import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { MouseCloud } from './components/MouseCloud';
import BackButton from './components/backbutton';

function generateClouds(count, bounds) {
  const clouds = [];
  for (let i = 0; i < count; i++) {
    clouds.push({
      x: Math.random() * bounds.width,
      y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
      rx: bounds.minRx + Math.random() * (bounds.maxRx - bounds.minRx),
      ry: bounds.minRy + Math.random() * (bounds.maxRy - bounds.minRy),
      opacity: bounds.minOpacity + Math.random() * (bounds.maxOpacity - bounds.minOpacity),
    });
  }
  return clouds;
}

function CloudLayer({ clouds, width, height, blur = 20 }) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        mixBlendMode: 'screen',
      }}
    >
      <defs>
        <radialGradient id="cloudGradient">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id="cloudBlur">
          <feGaussianBlur stdDeviation={blur} />
        </filter>
      </defs>
      <g filter="url(#cloudBlur)">
        {clouds.map((c, i) => (
          <ellipse
            key={i}
            cx={c.x}
            cy={c.y}
            rx={c.rx}
            ry={c.ry}
            fill="url(#cloudGradient)"
            opacity={c.opacity}
          />
        ))}
      </g>
    </svg>
  );
}

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1000
  );

  useEffect(() => {
    let frame;
    const handleResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return width;
}

function generateBuildings(targetWidth, { minWidth, maxWidth, minHeight, maxHeight }) {
  const buildings = [];
  let x = 0;
  while (x < targetWidth) {
    const width = minWidth + Math.random() * (maxWidth - minWidth);
    const height = minHeight + Math.random() * (maxHeight - minHeight);
    buildings.push({ x, width, height });
    x += width;
  }
  return buildings;
}

function BuildingLayer({ buildings, viewBoxWidth, color, opacity, bottom = 0, gradientId, gradientStops, duration = 20 }) {
  const duplicatedBuildings = useMemo(() => {
    const secondSet = buildings.map((b) => ({
      ...b,
      x: b.x + viewBoxWidth,
    }));
    return [...buildings, ...secondSet];
  }, [buildings, viewBoxWidth]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 0,
        width: '100%',
        height: '40%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          width: '200%',
          height: '100%',
        }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: duration,
        }}
      >
        <svg
          viewBox={`0 0 ${viewBoxWidth * 2} 300`}
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: '100%',
            opacity,
          }}
        >
          {gradientId && (
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                {gradientStops.map((stop, i) => (
                  <stop key={i} offset={stop.offset} stopColor={stop.color} />
                ))}
              </linearGradient>
            </defs>
          )}
          {duplicatedBuildings.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={300 - b.height}
              width={b.width}
              height={b.height}
              fill={gradientId ? `url(#${gradientId})` : color}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

export default function About() {
  const windowWidth = useWindowWidth();
  const roundedWidth = Math.ceil(windowWidth / 50) * 50;

  const backBuildings = useMemo(
    () =>
      generateBuildings(roundedWidth, {
        minWidth: 40,
        maxWidth: 50,
        minHeight: 80,
        maxHeight: 150,
      }),
    [roundedWidth]
  );

  const frontBuildings = useMemo(
    () =>
      generateBuildings(roundedWidth, {
        minWidth: 30,
        maxWidth: 50,
        minHeight: 40,
        maxHeight: 120,
      }),
    [roundedWidth]
  );

  const clouds = useMemo(
    () =>
      generateClouds(8, {
        width: 1000,
        minY: 100,
        maxY: 500,
        minRx: 80,
        maxRx: 220,
        minRy: 20,
        maxRy: 50,
        minOpacity: 0.4,
        maxOpacity: 0.9,
      }),
    []
  );

  return (
    <div className='about-body' style={{ position: 'relative', overflow: 'hidden' }}>
      <BackButton />
      <BuildingLayer
        buildings={backBuildings}
        viewBoxWidth={roundedWidth}
        color="#BFC1D3"
        opacity={0.5}
        bottom={0}
        duration={50} 
      />
      <BuildingLayer
        buildings={frontBuildings}
        viewBoxWidth={roundedWidth}
        gradientId="frontBuildingGradient"
        gradientStops={[
          { offset: '0%', color: '#9FA3B6' },
          { offset: '60%', color: '#8A96AF' },
          { offset: '100%', color: '#717f94' },
        ]}
        opacity={0.9}
        bottom={0}
        duration={35}
      />

      <CloudLayer clouds={clouds} width={1000} height={800} blur={25} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        style={{
          position: 'absolute',
          top: '18%',
          left: '8%',
          maxWidth: '480px',
          zIndex: 10,
          fontFamily: 'monospace',
          color: '#3c4556',
          textShadow: '0 1px 12px rgba(255,255,255,0.6)',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 600, margin: 0, letterSpacing: '-0.5px' }}>
          Hi, I'm Ho Yun.
        </h1>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, marginTop: '1rem', opacity: 0.85 }}>
          Student and aspiring software engineer, based in Singapore.
          I'm still early in figuring out what I want to build, but probably
          something to do with math, 3D design, and UI. 
          <br/><br/>
          I like making cool
          things that solve problems.
        </p>

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6, margin: 0 }}>
            Currently
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginTop: '0.5rem', opacity: 0.85 }}>
            Studying at UWCSEA in Singapore, and working on small projects
            on the side to build my skillset.
          </p>
        </div>
      </motion.div>
      <MouseCloud/>

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
        transition={{ duration: 0.5, ease: "easeIn" }}
      />
    </div>
  );
}