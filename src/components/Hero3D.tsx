import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

const TShirtMesh = () => {
  return (
    <mesh rotation={[0, 0.3, 0]}>
      {/* T-shirt body */}
      <group>
        {/* Main body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 2.5, 0.2]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.5} metalness={0.1} />
        </mesh>
        
        {/* Left sleeve */}
        <mesh position={[-1.3, 0.8, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.8, 0.6, 0.2]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.5} metalness={0.1} />
        </mesh>
        
        {/* Right sleeve */}
        <mesh position={[1.3, 0.8, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.8, 0.6, 0.2]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.5} metalness={0.1} />
        </mesh>
        
        {/* Design on front - gradient effect */}
        <mesh position={[0, 0.2, 0.11]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshStandardMaterial 
            color="#a855f7" 
            emissive="#a855f7"
            emissiveIntensity={0.3}
            roughness={0.3}
          />
        </mesh>
        
        {/* Accent circle */}
        <mesh position={[0, 0.2, 0.12]}>
          <circleGeometry args={[0.4, 32]} />
          <meshStandardMaterial 
            color="#ec4899" 
            emissive="#ec4899"
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>
      </group>
    </mesh>
  );
};

export const Hero3D = () => {
  return (
    <div className="w-full h-[600px] md:h-screen relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
          <spotLight
            position={[0, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
            color="#ffffff"
          />
          <TShirtMesh />
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={2}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-hero opacity-50 pointer-events-none" />
    </div>
  );
};
