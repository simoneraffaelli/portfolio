'use client';

import { LandingProps } from '@/app/utils/types/LandingProps';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, OrbitControls, Resize } from '@react-three/drei';
import Logo from './logo';


export default function LogoContainer({ isLoading }: LandingProps) {
  return (
    <Canvas
      className="main-canvas"
      orthographic
      camera={{ position: [0, 0, 0], zoom: 300 }}
    >
            <Float
        speed={0.5}
        rotationIntensity={0.5}
        floatIntensity={0.5}
        floatingRange={[0.2, 0.2]}
        >
        <Resize width={true} precise={true}>
          <Logo isLoading={isLoading} />
          </Resize>
      </Float>
      <Environment preset="studio" />
      <OrbitControls enableZoom={false} enableRotate={true} />
    </Canvas>
  );
}