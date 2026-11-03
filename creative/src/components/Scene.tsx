import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, PerformanceMonitor } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { CAMERA_RANGE, sceneColors, scrollProgress, stageIndex } from '../lib/stage';

type Colors = ReturnType<typeof sceneColors>;

/** Stops of the 3D data pipeline the camera flies through while the page scrolls. */
const STOPS: { label: string; pos: [number, number, number] }[] = [
  { label: 'PostgreSQL · MySQL', pos: [2.2, 1.1, 0] },
  { label: 'Debezium', pos: [-2.3, -0.9, -5] },
  { label: 'Kafka', pos: [1.9, -1.3, -10] },
  { label: 'Spark · Airflow', pos: [-2.1, 1.3, -15] },
  { label: 'StarRocks', pos: [2.3, 0.4, -20] },
  { label: 'Power BI · Superset', pos: [-2.2, -1.1, -25] },
  { label: 'ELK · Grafana', pos: [1.8, 1.2, -30] },
  { label: 'Docker · Kubernetes', pos: [-0.6, -0.4, -35] },
];

/** Re-reads the palette colours whenever the theme or palette changes. */
function usePaletteColors() {
  const [colors, setColors] = useState(sceneColors);
  useEffect(() => {
    const update = () => setColors(sceneColors());
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-palette'] });
    window.addEventListener('themechange', update);
    return () => {
      obs.disconnect();
      window.removeEventListener('themechange', update);
    };
  }, []);
  return colors;
}

function Node({ label, pos, index, colors }: (typeof STOPS)[number] & { index: number; colors: Colors }) {
  const shell = useRef<THREE.Mesh>(null);
  const shellMat = useRef<THREE.MeshBasicMaterial>(null);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const fg = useMemo(() => new THREE.Color(colors.fg), [colors]);
  const accent = useMemo(() => new THREE.Color(colors.accent), [colors]);

  useFrame((_, dt) => {
    const active = stageIndex(scrollProgress()) === index;
    if (shell.current) {
      shell.current.rotation.x += dt * 0.12;
      shell.current.rotation.y += dt * 0.18;
    }
    const target = active ? accent : fg;
    shellMat.current?.color.lerp(target, 1 - Math.exp(-8 * dt));
    coreMat.current?.color.lerp(target, 1 - Math.exp(-8 * dt));
    if (shellMat.current) shellMat.current.opacity = THREE.MathUtils.damp(shellMat.current.opacity, active ? 0.9 : 0.35, 6, dt);
    if (labelRef.current) {
      labelRef.current.style.color = active ? colors.accent : colors.fg;
      labelRef.current.style.borderColor = active ? colors.accent : colors.muted;
    }
  });

  return (
    <group position={pos}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial ref={shellMat} color={colors.fg} wireframe transparent opacity={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshBasicMaterial ref={coreMat} color={colors.fg} />
      </mesh>
      <Html center position={[0, -0.95, 0]} distanceFactor={7} zIndexRange={[0, 0]} style={{ pointerEvents: 'none' }}>
        <div
          ref={labelRef}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13,
            whiteSpace: 'nowrap',
            padding: '3px 8px',
            border: '1px solid',
            borderRadius: 2,
            background: colors.bg,
          }}
        >
          {String(index + 1).padStart(2, '0')} {label}
        </div>
      </Html>
    </group>
  );
}

function Flow({ curve, count, colors }: { curve: THREE.CatmullRomCurve3; count: number; colors: Colors }) {
  const ref = useRef<THREE.Points>(null);
  const { offsets, speeds, jitter, positions, tints } = useMemo(() => {
    const offsets = new Float32Array(count);
    const speeds = new Float32Array(count);
    const jitter = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const tints = new Uint8Array(count);
    for (let i = 0; i < count; i++) {
      offsets[i] = Math.random();
      speeds[i] = 0.01 + Math.random() * 0.015;
      for (let k = 0; k < 3; k++) jitter[i * 3 + k] = (Math.random() - 0.5) * 0.14;
      tints[i] = Math.random() < 0.18 ? 1 : 0; // ~1 in 5 particles carries the accent
    }
    return { offsets, speeds, jitter, positions, tints };
  }, [count]);

  const colorAttr = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const fg = new THREE.Color(colors.fg);
    const ac = new THREE.Color(colors.accent);
    for (let i = 0; i < count; i++) (tints[i] ? ac : fg).toArray(arr, i * 3);
    return arr;
  }, [colors, count, tints]);

  const dot = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 32;
    const g = c.getContext('2d')!;
    g.fillStyle = '#fff';
    g.beginPath();
    g.arc(16, 16, 14, 0, Math.PI * 2);
    g.fill();
    return new THREE.CanvasTexture(c);
  }, []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const geo = ref.current?.geometry;
    if (!geo) return;
    const attr = geo.attributes.position as THREE.BufferAttribute;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      curve.getPointAt((offsets[i] + t * speeds[i]) % 1, tmp);
      attr.setXYZ(i, tmp.x + jitter[i * 3], tmp.y + jitter[i * 3 + 1], tmp.z + jitter[i * 3 + 2]);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorAttr, 3]} />
      </bufferGeometry>
      <pointsMaterial map={dot} alphaTest={0.5} size={0.05} vertexColors sizeAttenuation />
    </points>
  );
}

function Rig({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const { camera, pointer, size } = useThree();
  const progress = useRef(0);
  const shift = useRef(0);
  const look = useMemo(() => new THREE.Vector3(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const smoothLook = useRef(new THREE.Vector3(0, 0, -5));

  useFrame((_, dt) => {
    progress.current = THREE.MathUtils.damp(progress.current, scrollProgress() * CAMERA_RANGE, 4, dt);
    const p = progress.current;
    curve.getPointAt(p, pos);
    curve.getPointAt(Math.min(p + 0.08, 1), look);
    pos.x *= 0.35;
    pos.y *= 0.35;
    pos.z += 4.5;
    // Wide screens: pipeline on the right of the hero text, then on the left of the reading panels.
    const wide = size.width >= 1024;
    const inHero = window.scrollY < window.innerHeight * 0.6;
    shift.current = THREE.MathUtils.damp(shift.current, wide ? (inHero ? -1.6 : 2.1) : 0, 3, dt);
    pos.x += shift.current + pointer.x * 0.35;
    pos.y += pointer.y * 0.25;
    look.x += shift.current;
    camera.position.lerp(pos, 1 - Math.exp(-5 * dt));
    smoothLook.current.lerp(look, 1 - Math.exp(-4 * dt));
    camera.lookAt(smoothLook.current);
  });
  return null;
}

export default function Scene() {
  const colors = usePaletteColors();
  const small = window.innerWidth < 768;
  const maxDpr = small ? 1.25 : 1.75;
  const [dpr, setDpr] = useState(maxDpr);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(STOPS.map((s) => new THREE.Vector3(...s.pos)), false, 'catmullrom', 0.5), []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 500, 0.008, 5, false), [curve]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ animation: 'scene-in 1.2s ease both' }}
    >
      <Canvas dpr={dpr} camera={{ fov: 55, position: [0, 0, 5], near: 0.1, far: 80 }} gl={{ antialias: !small, powerPreference: 'high-performance', alpha: true }}>
        <PerformanceMonitor flipflops={3} onDecline={() => setDpr(1)} onIncline={() => setDpr(maxDpr)} onFallback={() => setDpr(1)} />
        <fog attach="fog" args={[colors.bg, 7, 26]} />
        <mesh geometry={tube}>
          <meshBasicMaterial color={colors.muted} transparent opacity={0.6} />
        </mesh>
        <Flow curve={curve} count={small ? 260 : 600} colors={colors} />
        {STOPS.map((s, i) => (
          <Node key={s.label} {...s} index={i} colors={colors} />
        ))}
        <Rig curve={curve} />
      </Canvas>
      <style>{'@keyframes scene-in{from{opacity:0}}'}</style>
    </div>
  );
}
