'use client';

import styles from './style.module.scss';
import Background from './background/background';
import LogoContainer from './logocontainer/logocontainer';
import { LandingProps } from '@/app/utils/types/LandingProps';
import AnimatedTextContainer from './animatedtextcontainer/animatedtextcontainer';
import { FluidCursor } from '../fluidcursor/fluidcursor';
import Contact from '../contact/contact';
import Link from 'next/link';
import NameText from './name/nametext';

export default function Landing({ isLoading }: LandingProps) {
    return (
        <div className={styles.landing}>
            <Background />
            <div className={styles.content}>
                {/* Top Name */}
                <div className={styles.nameText} >
                    <NameText isLoading={isLoading}/>
                </div>
                {/* Center Logo */}
                <div className={styles.logoContainer}>
                    <LogoContainer/>
                </div>
                {/* Bottom Texts */}
                <div className={styles.animatedText}>
                    <AnimatedTextContainer isLoading={isLoading}/>
                </div>
                {/* Vertical Text */}
                <div className={styles.verticalText}>
                    <Link href={'https://linktr.ee/simone.fyi'} target='_blank'>サイモン</Link>
                </div>

            </div>
            <FluidCursor/>
            <Contact/>
        </div>
    );
}