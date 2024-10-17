'use client';
import { Canvas } from '@react-three/fiber';
import styles from './style.module.scss';
import Blob from './blob/blob';
import GradientBackground from './gradientBackground/gradientBackground';

export default function Landing() {

    return (
        <div className={styles.landing}>
            <GradientBackground />

            <Canvas camera={{ position: [0.0, 0.0, 8.0] }}>
                <Blob />
            </Canvas>

            <div className={styles.glass}></div>

        </div>
    );
}