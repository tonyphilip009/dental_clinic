
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";

// Check whether the browser supports WebGL
function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");

    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") ||
          canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

// A 3D object with geometry and material
function TestObject() {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Rotate the object smoothly
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={[1.4, 1.4, 1.4]}
      radius={0.15}
      smoothness={4}
      position={[0, 0.2, 0]}
      scale={hovered ? 1.1 : 1}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={hovered ? "#2dd4bf" : "#14b8a6"}
        roughness={0.35}
        metalness={0.1}
      />
    </RoundedBox>
  );
}

export default function Dental3D({
  className = "h-80 w-full sm:h-96",
}) {
  const [supported] = useState(webglAvailable);

  // Show a fallback if WebGL is unavailable
  if (!supported) {
    return (
      <div
        className={`${className} flex items-center justify-center rounded-xl bg-brand-light/30 text-7xl`}
        role="img"
        aria-label="Dental illustration"
      >
        🦷
      </div>
    );
  }

  return (
    <div
      className={className}
      role="img"
      aria-label="Interactive 3D test object"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.8}
        />

        <TestObject />

        <ContactShadows
          position={[0, -1.1, 0]}
          opacity={0.4}
          scale={6}
          blur={2.5}
          far={3}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
        />
      </Canvas>
    </div>
  );
}
