'use client';

import styles from './style.module.scss';
import { Color } from 'three/src/math/Color.js';
import { EffectComposer, Noise } from '@react-three/postprocessing';
import { Suspense } from 'react';
import { BlendFunction } from 'postprocessing';
import { Canvas } from '@react-three/fiber';


export default function Background() {

    const Vases = () => {
        return (
          <Suspense fallback={null}>
            
            <EffectComposer>
              <Noise blendFunction={BlendFunction.MULTIPLY} />
            </EffectComposer>
          </Suspense>
        )
    }

    return (
        <div className={styles.bkgContainer}>
            <div className={styles.bkg}>
            <Canvas
        gl={{ alpha: false, logarithmicDepthBuffer: true, precision: "lowp" }}
        camera={{ position: [0, 2.5, 25], fov: 35 }}
        onCreated={({ gl, scene }) => {
          scene.background = new Color("#272730").convertSRGBToLinear();
        }}>
        <fog attach="fog" args={["#272730", 10, 80]} />
        <ambientLight intensity={0.2} />
        <directionalLight castShadow position={[10, 20, 20]} intensity={1} shadow-bias={-0.0005} />
        <directionalLight position={[-10, 5, -20]} color="#ffc530" intensity={1} />
        <directionalLight position={[10, 5, -20]} color="#ffc530" intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={5} />
        <Vases />
      </Canvas>


            </div>
        </div>
    );
}