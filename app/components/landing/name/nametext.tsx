'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './style.module.scss';
import { LandingProps } from '@/app/utils/types/LandingProps';
import { CSSProperties, useEffect, useState } from 'react';


export default function NameText({ isLoading }: LandingProps) {

    
  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  }

  const smoothMouse = {
    x: useSpring(mouse.x, {stiffness: 75, damping: 100, mass: 3}),
    y: useSpring(mouse.y, {stiffness: 75, damping: 100, mass: 3}),
  }

  const [mousePerc, setMousePerc] = useState({x: 0, y: 0});
  const [mouseRotate, setMouseRotate] = useState({x: 0, y: 0, p:0});

  const manageMouse = (e: { clientX: any; clientY: any; }) => {
    const { innerWidth, innerHeight } = window;
    const { clientX, clientY } = e;
    const x = clientX / innerWidth
    const y = clientY / innerHeight

    const perspective = window.innerWidth * 4;
    const rotateX = 45 * x - 45 / 2; 
    const rotateY = (45 * y - 45 / 2) 

    mouse.x.set(x);
    mouse.y.set(y);
    setMousePerc({ x: x * 100, y: y * 100 });
    setMouseRotate({ x: rotateX, y: rotateY, p: perspective });
  }

  useEffect( () => {
    window.addEventListener("mousemove", manageMouse)
    return () => window.removeEventListener("mousemove", manageMouse)
  }, [])

  const textStyle: CSSProperties = {
    transform: `perspective(${mouseRotate.p}px) rotateX(${mouseRotate.y}deg) rotateY(${mouseRotate.x}deg)`,
  }


    return (
        <motion.div className={styles.name}>
            {
              !isLoading && 
                <div style={textStyle} className="animated-text">
                  <p className={styles.text}>simone</p>
                </div>
            }
        </motion.div>
    );
}