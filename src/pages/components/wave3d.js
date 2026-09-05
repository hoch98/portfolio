import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Four sine layers traveling at different angles through (x, z) so the
// surface genuinely folds in two dimensions — no two cross-sections
// along z are ever identical, unlike a 2D profile swept along depth.
function waveHeight(x, z, t, amp) {
  const p1 = t * 0.00035;
  const p2 = t * 0.0009;
  const p3 = t * 0.0016;

  const swell = Math.sin(x * 0.055 + z * 0.04 + p1) * amp * 0.85;
  const cross =
    Math.sin(x * 0.025 - z * 0.06 + p1 * 0.6) *
    Math.cos(z * 0.03 + p2 * 0.4) *
    amp * 0.35;
  const ripple = Math.sin(x * 0.14 + z * 0.11 - p2) * amp * 0.12;
  const fine = Math.sin(x * 0.32 - z * 0.27 + p3) * amp * 0.05;

  return swell + cross + ripple + fine;
}

export default function WavySlab({
  width = 40,
  depth = 30,
  thickness = 8,
  amplitude,
  segments = 40,
  color = "#deb490",
  position = [0, 0, 0],
}) {
  const amp = amplitude ?? thickness * 0.55; // keep the top above the flat base

  const segX = segments;
  const segZ = Math.max(4, Math.round(segments * (depth / width)));

  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const crestColor = useMemo(
    () => baseColor.clone().lerp(new THREE.Color("#ffffff"), 0.28),
    [baseColor]
  );
  const troughColor = useMemo(
    () => baseColor.clone().lerp(new THREE.Color("#000000"), 0.22),
    [baseColor]
  );
  const wallColor = useMemo(
    () => baseColor.clone().lerp(new THREE.Color("#000000"), 0.14),
    [baseColor]
  );
  const tmpColor = useMemo(() => new THREE.Color(), []);

  // ---- top surface: smooth, shared-vertex indexed grid ------------------
  const top = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = (segX + 1) * (segZ + 1);
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const xs = new Float32Array(count);
    const zs = new Float32Array(count);

    let p = 0;
    for (let iz = 0; iz <= segZ; iz++) {
      const z = (iz / segZ - 0.5) * depth;
      for (let ix = 0; ix <= segX; ix++) {
        const x = (ix / segX - 0.5) * width;
        xs[p] = x;
        zs[p] = z;
        positions[p * 3] = x;
        positions[p * 3 + 2] = z;
        normals[p * 3 + 1] = 1;
        p++;
      }
    }

    const index = [];
    for (let iz = 0; iz < segZ; iz++) {
      for (let ix = 0; ix < segX; ix++) {
        const a = iz * (segX + 1) + ix;
        const b = a + 1;
        const c = a + (segX + 1);
        const d = c + 1;
        index.push(a, c, b, b, c, d);
      }
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setIndex(index);

    return { geo, xs, zs, count };
  }, [segX, segZ, width, depth]);

  // ---- boundary points used to build the four side walls -----------------
  const edges = useMemo(() => {
    const front = [], back = [], left = [], right = [];
    for (let ix = 0; ix <= segX; ix++) {
      const x = (ix / segX - 0.5) * width;
      front.push([x, -depth / 2]);
      back.push([x, depth / 2]);
    }
    for (let iz = 0; iz <= segZ; iz++) {
      const z = (iz / segZ - 0.5) * depth;
      left.push([-width / 2, z]);
      right.push([width / 2, z]);
    }
    return [
      { pts: front, normal: [0, 0, -1] },
      { pts: back, normal: [0, 0, 1] },
      { pts: left, normal: [-1, 0, 0] },
      { pts: right, normal: [1, 0, 0] },
    ];
  }, [segX, segZ, width, depth]);

  // ---- walls: faceted (flat, constant per-panel normal), non-indexed -----
  const walls = useMemo(() => {
    let total = 0;
    edges.forEach((e) => (total += (e.pts.length - 1) * 6));
    const positions = new Float32Array(total * 3);
    const normals = new Float32Array(total * 3);
    const colors = new Float32Array(total * 3);

    let p = 0;
    edges.forEach(({ pts, normal }) => {
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, z0] = pts[i];
        const [x1, z1] = pts[i + 1];
        const verts = [
          [x0, 0, z0], [x0, -thickness, z0], [x1, 0, z1],
          [x1, 0, z1], [x0, -thickness, z0], [x1, -thickness, z1],
        ];
        verts.forEach(([vx, vy, vz]) => {
          positions[p * 3] = vx;
          positions[p * 3 + 1] = vy;
          positions[p * 3 + 2] = vz;
          normals[p * 3] = normal[0];
          normals[p * 3 + 1] = normal[1];
          normals[p * 3 + 2] = normal[2];
          colors[p * 3] = wallColor.r;
          colors[p * 3 + 1] = wallColor.g;
          colors[p * 3 + 2] = wallColor.b;
          p++;
        });
      }
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [edges, thickness, wallColor]);

  const topRef = useRef();
  const wallsRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * 1000;
    const eps = Math.max(width, depth) * 0.01; // finite-difference step for normals

    // -- smooth top surface: height + analytic-ish (finite diff) normal + color --
    const { xs, zs, count } = top;
    const posAttr = topRef.current.geometry.attributes.position;
    const normAttr = topRef.current.geometry.attributes.normal;
    const colAttr = topRef.current.geometry.attributes.color;

    for (let i = 0; i < count; i++) {
      const x = xs[i];
      const z = zs[i];
      const h = waveHeight(x, z, t, amp);
      const hX = waveHeight(x + eps, z, t, amp);
      const hZ = waveHeight(x, z + eps, t, amp);
      const dhdx = (hX - h) / eps;
      const dhdz = (hZ - h) / eps;

      posAttr.array[i * 3 + 1] = h;

      const nx = -dhdx, ny = 1, nz = -dhdz;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      normAttr.array[i * 3] = nx / len;
      normAttr.array[i * 3 + 1] = ny / len;
      normAttr.array[i * 3 + 2] = nz / len;

      const s = THREE.MathUtils.clamp(h / amp, -1, 1);
      tmpColor.copy(s >= 0 ? crestColor : troughColor);
      tmpColor.lerp(baseColor, 1 - Math.abs(s));
      colAttr.array[i * 3] = tmpColor.r;
      colAttr.array[i * 3 + 1] = tmpColor.g;
      colAttr.array[i * 3 + 2] = tmpColor.b;
    }
    posAttr.needsUpdate = true;
    normAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // -- walls: only the top rim needs to track the wave each frame --
    const wPos = wallsRef.current.geometry.attributes.position;
    let p = 0;
    edges.forEach(({ pts }) => {
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, z0] = pts[i];
        const [x1, z1] = pts[i + 1];
        const h0 = waveHeight(x0, z0, t, amp);
        const h1 = waveHeight(x1, z1, t, amp);
        wPos.array[(p + 0) * 3 + 1] = h0; // top0
        wPos.array[(p + 2) * 3 + 1] = h1; // top1
        wPos.array[(p + 3) * 3 + 1] = h1; // top1 (2nd triangle)
        p += 6;
      }
    });
    wPos.needsUpdate = true;
  });

  return (
    <group position={position}>
      <mesh ref={topRef} geometry={top.geo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={wallsRef} geometry={walls} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.9} />
      </mesh>
      <mesh position={[0, -thickness, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}