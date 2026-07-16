"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useInView, useReducedMotion } from "framer-motion";
import * as random from "maath/random";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Theme colors (design-system): purple #7042f8, cyan #22d3ee
const PURPLE = { r: 112, g: 66, b: 248 };
const CYAN = { r: 34, g: 211, b: 238 };

interface Blob {
  x: number; // 0..1 fraction of texture size
  y: number;
  radius: number; // fraction of texture size
  alpha: number;
}

// Procedural nebula texture: layered radial gradients on a 2D canvas.
// Deterministic blob layout so every mount renders the same clouds.
function makeNebulaTexture(
  color: { r: number; g: number; b: number },
  blobs: Blob[]
): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const paint = (cx: number, cy: number, radius: number, alpha: number) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    g.addColorStop(0, `rgba(${color.r},${color.g},${color.b},${alpha})`);
    g.addColorStop(0.4, `rgba(${color.r},${color.g},${color.b},${alpha * 0.4})`);
    g.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  };

  // Core glow + offset blobs for cloudiness
  paint(size / 2, size / 2, size / 2, 0.5);
  for (const blob of blobs) {
    paint(blob.x * size, blob.y * size, blob.radius * size, blob.alpha);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface NebulaPlaneProps {
  color: { r: number; g: number; b: number };
  blobs: Blob[];
  position: [number, number, number];
  scale: number;
  rotationSpeed: number;
  pulseSpeed: number;
  phase: number;
  baseOpacity: number;
}

const NebulaPlane = ({
  color,
  blobs,
  position,
  scale,
  rotationSpeed,
  pulseSpeed,
  phase,
  baseOpacity,
}: NebulaPlaneProps) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const texture = useMemo(() => makeNebulaTexture(color, blobs), [color, blobs]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * rotationSpeed;
    }
    if (materialRef.current) {
      materialRef.current.opacity =
        baseOpacity +
        Math.sin(state.clock.elapsedTime * pulseSpeed + phase) * baseOpacity * 0.35;
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={baseOpacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Sparse star field with slow z-drift toward the camera (warp feel).
// Pattern cloned from star-background.tsx; positions mutated in place.
const WarpPoints = ({ count }: { count: number }) => {
  const ref = useRef<THREE.Points | null>(null);
  const [positions] = useState(
    () => random.inSphere(new Float32Array(count * 3), { radius: 1.4 }) as Float32Array
  );

  useFrame((_state, delta) => {
    const points = ref.current;
    if (!points) return;
    points.rotation.z += delta / 25;
    const attribute = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;
    for (let i = 2; i < array.length; i += 3) {
      array[i] += delta * 0.12;
      if (array[i] > 1.4) array[i] -= 2.8;
    }
    attribute.needsUpdate = true;
  });

  return (
    <Points ref={ref} stride={3} positions={positions} frustumCulled>
      <PointMaterial
        transparent
        color="#c4b5fd"
        size={0.0035}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
};

// prefers-reduced-motion fallback: two blurred radial-gradient divs, no WebGL.
const StaticNebula = () => (
  <>
    <div
      className="absolute left-[10%] top-[15%] h-[60%] w-[55%] rounded-full blur-3xl"
      style={{
        background:
          "radial-gradient(circle, rgba(112,66,248,0.18) 0%, rgba(112,66,248,0) 70%)",
      }}
    />
    <div
      className="absolute right-[8%] bottom-[10%] h-[55%] w-[50%] rounded-full blur-3xl"
      style={{
        background:
          "radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(34,211,238,0) 70%)",
      }}
    />
  </>
);

const PURPLE_BLOBS: Blob[] = [
  { x: 0.32, y: 0.4, radius: 0.3, alpha: 0.35 },
  { x: 0.66, y: 0.58, radius: 0.26, alpha: 0.3 },
  { x: 0.52, y: 0.28, radius: 0.2, alpha: 0.25 },
];

const CYAN_BLOBS: Blob[] = [
  { x: 0.6, y: 0.44, radius: 0.28, alpha: 0.3 },
  { x: 0.38, y: 0.62, radius: 0.22, alpha: 0.25 },
];

const ACCENT_BLOBS: Blob[] = [
  { x: 0.5, y: 0.5, radius: 0.34, alpha: 0.3 },
  { x: 0.3, y: 0.34, radius: 0.18, alpha: 0.22 },
];

// Ambient background for "What We Build": nebula drift, code-generated (no
// video asset). Lazy-mounts via useInView and unmounts off-screen so the one
// extra WebGL context (beyond the global StarsCanvas) costs nothing on the
// rest of /about.
export const CosmicNebula = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(wrapperRef, { margin: "200px 0px" });
  const reducedMotion = useReducedMotion();
  const [particleCount] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 200 : 400
  );

  return (
    // Bleeds 160px past the section's top/bottom (section uses overflow-x-clip,
    // so vertical overflow shows) and fades out via mask so the glow never has
    // a hard edge against the neighboring sections.
    <div
      ref={wrapperRef}
      aria-hidden
      className="absolute inset-x-0 -top-40 -bottom-40 -z-10 pointer-events-none"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 200px, black calc(100% - 200px), transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, black 200px, black calc(100% - 200px), transparent)",
      }}
    >
      {reducedMotion ? (
        <StaticNebula />
      ) : (
        inView && (
          <Canvas
            camera={{ position: [0, 0, 1] }}
            dpr={[1, 1.5]}
            performance={{ min: 0.5 }}
            gl={{ alpha: true }}
            style={{ background: "transparent", pointerEvents: "none" }}
          >
            <Suspense fallback={null}>
              <NebulaPlane
                color={PURPLE}
                blobs={PURPLE_BLOBS}
                position={[-0.35, 0.1, -0.4]}
                scale={2.6}
                rotationSpeed={0.02}
                pulseSpeed={0.35}
                phase={0}
                baseOpacity={0.32}
              />
              <NebulaPlane
                color={CYAN}
                blobs={CYAN_BLOBS}
                position={[0.45, -0.15, -0.2]}
                scale={1.9}
                rotationSpeed={-0.015}
                pulseSpeed={0.28}
                phase={Math.PI / 2}
                baseOpacity={0.22}
              />
              <NebulaPlane
                color={PURPLE}
                blobs={ACCENT_BLOBS}
                position={[0.1, 0.35, -0.6]}
                scale={1.4}
                rotationSpeed={0.028}
                pulseSpeed={0.45}
                phase={Math.PI}
                baseOpacity={0.26}
              />
              <WarpPoints count={particleCount} />
            </Suspense>
          </Canvas>
        )
      )}
    </div>
  );
};
