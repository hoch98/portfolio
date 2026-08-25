
import { motion, useTime, useTransform } from "framer-motion";

export default function WavyBox() {
  const time = useTime();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const baseTopY = window.innerHeight*0.65;

  const pathD = useTransform(time, (t) => {
    const phase1 = t * 0.001;
    const phase2 = t * 0.0025; 
    const phase3 = t * 0.0045;

    const getWaveY = (x) => {
      const layer1 = Math.sin(x * 0.002 + phase1) * 50; 
      
      const layer2 = Math.sin(x * 0.007 - phase2) * 4; 
      
      const layer3 = Math.sin(x * 0.02 + phase3) * 2;

      return baseTopY + layer1 + layer2 + layer3;
    };

    let path = `M 0, ${getWaveY(0)}`;

    for (let x = 5; x <= width; x += 5) {
      path += ` L ${x}, ${getWaveY(x)}`;
    }

    path += ` L ${width}, ${height}`;
    path += ` L 0, ${height}`;
    path += ` Z`;

    return path;
  });


  return (
    <div style={{ display: "flex", justifyContent: "center", zIndex: 1}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <motion.path
          d={pathD}
          fill="#dfcebf"
          stroke="#dfcebf"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
