'use client';

import { motion } from 'framer-motion';
import styles from './style.module.scss';
import AnimatedText from '../../animatedtext/animatedtext';
import { textAnimations } from './anim';
import { LandingProps } from '@/app/utils/types/LandingProps';
import { useEffect, useState } from 'react';


export default function TextContainer({ isLoading }: LandingProps) {
    const titles = [
        "Hello! Simone here",
        "Salut! Je m'appelle Simone",
        "¡Hola! Soy Simone",
        "こんにちは！私はシモーネです",
        "Hallå! ég er Simone",
        "Guten tag! Ich bin Simone.",
        "สวัสดี! ฉันชื่อ ซิโมน",
        "Ciao! Sono Simone"];
    const subtitles = [
        "I do things with computers",
        "Je fais des choses avec les ordinateurs",
        "Me dedico a la informática",
        "コンピューターを使って仕事をしています", 
        "Ég geri hluti með tölvum", 
        "Ich mache Computerarbeiten",
        "ฉันทำสิ่งต่างๆด้วยคอมพิวเตอร์",
        "Faccio cose con i computer"];

        const [index, setIndex] = useState(0)
        useEffect(() => {
            if (isLoading) return;
            const timeout: NodeJS.Timeout = setInterval(() => {
                const idx = Math.max(Math.floor(Math.random() * titles.length) - 1, 0);
                setIndex(idx);
            }, 25000);
            return () => clearInterval(timeout);
        }, [isLoading])

    return (
        <motion.div className={styles.textcontainer}>
            {
                !isLoading && titles.map((_, idx) => (
                    <div key={`d-${idx}`}>
                        <AnimatedText key={`t-${idx}`} text={titles[idx]} trigger={!isLoading && index === idx} className={`${styles.title} text-center`} animation={textAnimations}/>
                        <AnimatedText key={`st-${idx}`} text={subtitles[idx]} trigger={!isLoading && index === idx} className={`${styles.subtitle} text-center`} animation={textAnimations} />
                    </div>
                    )

                )
            }
        </motion.div>
    );
}