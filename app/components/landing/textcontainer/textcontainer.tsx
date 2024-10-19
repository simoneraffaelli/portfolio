'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import styles from './style.module.scss';
import AnimatedText from '../../animatedtext/animatedtext';
import { textAnimations } from './anim';
import { LandingProps } from '@/app/utils/types/LandingProps';


export default function TextContainer({ isLoading }: LandingProps) {
    const { scrollYProgress } = useScroll();

    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
        console.log(latest);
    });

    return (
        <motion.div className={styles.textcontainer}>
            <AnimatedText text="simone" trigger={!isLoading} className={styles.name} animation={textAnimations} />
            <AnimatedText text="yup that's me!" trigger={!isLoading} className={styles.subtitle} animation={textAnimations} />
        </motion.div>
    );
}