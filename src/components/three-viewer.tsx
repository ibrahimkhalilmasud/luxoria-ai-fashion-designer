"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Mannequin() {
  return (
    <group>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.42, 0.24, 1.3, 24]} />
        <meshStandardMaterial color="#f3d8c3" metalness={0.1} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#f6dfcb" />
      </mesh>
    </group>
  );
}

export function ThreeViewer() {
  return (
    <div className="h-[320px] rounded-xl border border-zinc-800 bg-black/30">
      <Canvas camera={{ position: [0, 0, 2.6], fov: 42 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 4]} intensity={1} />
        <Suspense fallback={null}>
          <Mannequin />
        </Suspense>
        <OrbitControls enablePan enableZoom />
      </Canvas>
    </div>
  );
}
