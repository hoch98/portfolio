import { useEffect, useRef } from "react";
import { motion, useTime, useTransform } from "framer-motion";

export default function WavyBox({ width, height }) {
  const time = useTime();
  const dims = useRef({ width, height });

  useEffect(() => {
    dims.current = { width, height };
  }, [width, height]);

  const pathD = useTransform(time, (t) => {
    const { width: w, height: h } = dims.current;
    const topY = h * 0.65;
    const phase1 = t * 0.001;
    const phase2 = t * 0.0025;
    const phase3 = t * 0.0045;

    const getWaveY = (x) => {
      const layer1 = Math.sin(x * 0.002 + phase1) * 50;
      const layer2 = Math.sin(x * 0.007 - phase2) * 4;
      const layer3 = Math.sin(x * 0.02 + phase3) * 2;
      return topY + layer1 + layer2 + layer3;
    };

    let path = `M 0, ${getWaveY(0)}`;
    for (let x = 5; x <= w; x += 5) {
      path += ` L ${x}, ${getWaveY(x)}`;
    }
    path += ` L ${w}, ${h}`;
    path += ` L 0, ${h}`;
    path += ` Z`;

    return path;
  });

  return (
    <div style={{ position: 'absolute', inset: 0, display: "flex", justifyContent: "center", zIndex: 1 }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <motion.path d={pathD} fill="#dfcebf" stroke="#dfcebf" strokeWidth="2" />
      </svg>
    </div>
  );
}