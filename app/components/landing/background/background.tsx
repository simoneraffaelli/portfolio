'use client';

import styles from './style.module.scss';
import { Canvas } from "@react-three/fiber";
import Blob from '../../blob/blob';
import GradientBackground from "../../gradientBackground/gradientBackground";


export default function Background() {

    return (
        <div className={styles.bkgContainer}>
            <GradientBackground />
            <Canvas camera={{ position: [0.0, 0.0, 8.0] }} className='canvas'>
                <Blob />
            </Canvas>
            <div className={styles.glass}></div>
        </div>
    );
}