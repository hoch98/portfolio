import { useEffect, useRef } from 'react';
import './styles/About.css';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Matter from 'matter-js';
import BackButton from './components/backbutton';

const DIAGONAL = 40;
const MOBILE_BREAKPOINT = 1024;

const whiteBgClip = `polygon(${DIAGONAL}% 0, 100% 0, 100% 100%, 0% 100%)`;
const magentaLineClip = `polygon(calc(${DIAGONAL}% - 4px) 0, ${DIAGONAL}% 0, 0% 100%, calc(0% - 4px) 100%)`;
const blueLineClip = `polygon(calc(${DIAGONAL}% + 6px) 0, calc(${DIAGONAL}% + 2px) 0, calc(0% + 6px) 100%, calc(0% + 2px) 100%)`;
const whiteLineClip = `polygon(${DIAGONAL}% 0, calc(${DIAGONAL}% + 3px) 0, calc(0% + 3px) 100%, 0% 100%)`;

export default function About() {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const sceneRef = useRef(null);

  useEffect(() => {
    const { Engine, Render, Runner, Bodies, Composite, Events, Body, Query } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: 1 }
    });

    const width = window.innerWidth;
    const height = window.innerHeight;
    const wallThickness = 200;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio || 1
      }
    });

    const floorHeight = height * 0.15;
    const floorY = height - floorHeight / 2;
    const floor = Bodies.rectangle(width / 2, floorY, width, floorHeight, {
      isStatic: true,
      render: { fillStyle: '#ddccbd', strokeStyle: '#2b002b', lineWidth: 2 }
    });

    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true, render: { visible: false } }
    );

    const rightWall = Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true, render: { visible: false } }
    );

    const topWall = Bodies.rectangle(
      width / 2,
      -wallThickness / 2,
      width * 2,
      wallThickness,
      { isStatic: true, render: { visible: false } }
    );

    const topX = width * 0.88;
    const bottomX = width * 0.80;
    const diagCenterX = (topX + bottomX) / 2;
    const diagCenterY = height / 2;
    const dx = bottomX - topX;
    const dy = height;
    const diagLength = Math.hypot(dx, dy);
    const diagAngle = Math.atan2(dy, dx);

    const diagonalWall = Bodies.rectangle(
      diagCenterX + wallThickness / 2,
      diagCenterY,
      diagLength + 200,
      wallThickness,
      {
        isStatic: true,
        angle: diagAngle,
        render: { visible: false }
      }
    );

    const box = Bodies.rectangle(width * 0.45, 100, 70, 70, {
      restitution: 0.6,
      friction: 0.1,
      render: {
        fillStyle: '#ffa500',
        strokeStyle: '#FF00FF',
        lineWidth: 2
      }
    });

    const box2 = Bodies.rectangle(width * 0.5, 100, 70, 70, {
      restitution: 0.6,
      friction: 0.1,
      render: {
        fillStyle: '#fbff00',
        strokeStyle: '#FF00FF',
        lineWidth: 2
      }
    });

    const isDesktop = width > MOBILE_BREAKPOINT;
    let activeBoxes = isDesktop ? [box, box2] : [box];
    const initialBodies = [floor, leftWall, rightWall, topWall, ...activeBoxes];

    let isWallInWorld = isDesktop;
    if (isWallInWorld) {
      initialBodies.push(diagonalWall);
    }

    Composite.add(engine.world, initialBodies);

    let draggedBody = null;
    let dragPos = { x: 0, y: 0 };

    const canvas = render.canvas;

    const getCanvasPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handlePointerDown = (e) => {
      const pos = getCanvasPos(e);
      const currentBoxes = window.innerWidth > MOBILE_BREAKPOINT ? [box, box2] : [box];
      const clickedBodies = Query.point(currentBoxes, pos);

      if (clickedBodies.length > 0) {
        draggedBody = clickedBodies[0];
        dragPos = pos;
        engine.timing.timeScale = 0.15;

        if (canvas.setPointerCapture) {
          try {
            canvas.setPointerCapture(e.pointerId);
          } catch (_) {}
        }
      }
    };

    const handlePointerMove = (e) => {
      if (draggedBody) {
        dragPos = getCanvasPos(e);
      }
    };

    const handlePointerUp = (e) => {
      if (!draggedBody) return;

      if (e && canvas.releasePointerCapture) {
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }

      engine.timing.timeScale = 1.0;

      const launchVector = {
        x: draggedBody.position.x - dragPos.x,
        y: draggedBody.position.y - dragPos.y
      };

      const forceScale = 0.0015;

      Body.applyForce(draggedBody, draggedBody.position, {
        x: launchVector.x * forceScale,
        y: launchVector.y * forceScale
      });

      draggedBody = null;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    Events.on(render, 'afterRender', () => {
      if (!draggedBody) return;

      const ctx = render.context;
      const bX = draggedBody.position.x;
      const bY = draggedBody.position.y;

      const pullDx = dragPos.x - bX;
      const pullDy = dragPos.y - bY;

      const aimX = bX - pullDx;
      const aimY = bY - pullDy;

      ctx.save();

      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(bX, bY);
      ctx.lineTo(dragPos.x, dragPos.y);
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.moveTo(bX, bY);
      ctx.lineTo(aimX, aimY);
      ctx.strokeStyle = '#eb835d';
      ctx.lineWidth = 4;
      ctx.stroke();

      const angle = Math.atan2(-pullDy, -pullDx);
      const headLen = 14;
      ctx.beginPath();
      ctx.moveTo(aimX, aimY);
      ctx.lineTo(
        aimX - headLen * Math.cos(angle - Math.PI / 6),
        aimY - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        aimX - headLen * Math.cos(angle + Math.PI / 6),
        aimY - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.lineTo(aimX, aimY);
      ctx.fillStyle = '#ff4500';
      ctx.fill();

      ctx.restore();
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const handleResize = () => {
      if (!render.canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      render.canvas.width = w;
      render.canvas.height = h;

      Body.setPosition(floor, { x: w / 2, y: h - (h * 0.15) / 2 });
      Body.setPosition(leftWall, { x: -wallThickness / 2, y: h / 2 });
      Body.setPosition(rightWall, { x: w + wallThickness / 2, y: h / 2 });
      Body.setPosition(topWall, { x: w / 2, y: -wallThickness / 2 });

      if (w > MOBILE_BREAKPOINT) {
        const tX = w * 0.88;
        const bX = w * 0.80;
        const dCenterX = (tX + bX) / 2;
        const dCenterY = h / 2;
        const dDx = bX - tX;
        const dDy = h;
        const dAngle = Math.atan2(dDy, dDx);

        Body.setPosition(diagonalWall, {
          x: dCenterX + wallThickness / 2,
          y: dCenterY
        });
        Body.setAngle(diagonalWall, dAngle);

        if (!isWallInWorld) {
          Composite.add(engine.world, diagonalWall);
          isWallInWorld = true;
        }

        if (!Composite.allBodies(engine.world).includes(box2)) {
          Composite.add(engine.world, box2);
        }
      } else {
        if (isWallInWorld) {
          Composite.remove(engine.world, diagonalWall);
          isWallInWorld = false;
        }

        if (Composite.allBodies(engine.world).includes(box2)) {
          Composite.remove(engine.world, box2);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      Runner.stop(runner);
      Render.stop(render);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
    };
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: shouldReduceMotion
        ? {}
        : { staggerChildren: 0.12, delayChildren: 0.7 },
    },
  };

  const itemVariants = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
      };

  return (
    <div
      className="about-body"
      style={{ position: 'relative', overflow: 'hidden', width: '100vw', height: '100vh' }}
    >
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="pencilTexture" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.9" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div
        ref={sceneRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          touchAction: 'none'
        }}
      />

      <div
        className="about-panel"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <motion.h1 className="about-headline" variants={itemVariants}>
            Hi, I'm Ho Yun.
          </motion.h1>

          <motion.p className="about-subline" variants={itemVariants}>
            Student and aspiring software engineer, based in Singapore.
          </motion.p>

          <motion.p className="about-intro" variants={itemVariants}>
            I'm still early in figuring out what I want to build, but probably something to do with math, 3D design, and UI.
            <br />
            I like making cool things that solve problems.
          </motion.p>

          <motion.div className="about-divider" variants={itemVariants} />

          <motion.section variants={itemVariants}>
            <h2 className="about-section-title">Currently</h2>
            <p className="about-intro">
              Studying at UWCSEA in Singapore, and working on small projects on the side to build my skillset.
            </p>
          </motion.section>

          <motion.div className="about-divider cool-things-divider" variants={itemVariants} />

          <motion.section className="cool-things-section" variants={itemVariants}>
            <h2 className="about-section-title">cool things</h2>
            <motion.button
              className="about-contact-link"
              onClick={() => navigate('/projects')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'none',
                cursor: 'pointer',
                fontFamily: "'Patrick Hand', cursive",
                pointerEvents: 'auto'
              }}
            >
              Explore Projects
            </motion.button>
          </motion.section>
        </motion.div>
      </div>

      <motion.div
        style={{ position: 'absolute', width: '100vw', height: '100vh', zIndex: 100, backgroundColor: 'orange', top: 0, pointerEvents: 'none' }}
        initial={{ left: 0 }}
        animate={{ left: '-100vw' }}
        exit={{ left: 0 }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
      />

      <motion.div
        className="about-envelope"
        onClick={() => navigate('/projects')}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '20vw',
          height: '100vh',
          zIndex: 20,
          overflow: 'hidden',
          pointerEvents: 'auto',
          cursor: 'pointer'
        }}
        role="button"
        tabIndex={0}
        aria-label="Check out my projects"
      >
        <motion.div
          style={{ position: 'absolute', inset: 0, clipPath: whiteBgClip }}
          initial={{ backgroundColor: '#100f0f' }}
          animate={{ backgroundColor: '#ff6600' }}
          variants={{ hover: { backgroundColor: '#ff7700' } }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ff00ff', clipPath: magentaLineClip, pointerEvents: 'none', zIndex: 3 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#00aaff', clipPath: blueLineClip, pointerEvents: 'none', zIndex: 3 }} />

        <div
          className="pencil-line"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'black',
            clipPath: whiteLineClip,
            pointerEvents: 'none',
            zIndex: 3,
            filter: 'url(#pencilTexture)',
          }}
        />

        <motion.div
          className="envelope-portal-content"
          variants={{
            hover: { x: -6 }
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <span className="portal-tag">CHECK OUT</span>
          <h2 className="portal-title">MY PROJECTS</h2>
          <span className="portal-arrow">→</span>
        </motion.div>
      </motion.div>

      <BackButton />
    </div>
  );
}