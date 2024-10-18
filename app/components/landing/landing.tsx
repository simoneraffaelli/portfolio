'use client';
import { Canvas } from '@react-three/fiber';
import styles from './style.module.scss';
import Blob from './blob/blob';
import GradientBackground from './gradientBackground/gradientBackground';
import AnimatedText from '../animatedtext/animatedtext';

interface LandingProps {
    isLoading: boolean;
}

export default function Landing({ isLoading }: LandingProps) {

    const textAnimations = {
        hidden: {
            opacity: 0,
            y: 40,
            x: -20
        },
        visible: {
            opacity: .5,
            y: 0,
            x: 0,
            transition: {
                ease: "easeIn", duration: 0.1,
            },
        },
    };

    return (
        <div className={styles.landing}>
            <GradientBackground />

            <Canvas camera={{ position: [0.0, 0.0, 8.0] }}>
                <Blob />
            </Canvas>

            <div className={styles.glass}></div>

            <div className={styles.txtContainer}>
                <AnimatedText text="simone" trigger={!isLoading} className={styles.name} animation={textAnimations}/>
                <AnimatedText text="yup that's me!" trigger={!isLoading} className={styles.subtitle} animation={textAnimations}/>
            </div>
        </div>
    );
}