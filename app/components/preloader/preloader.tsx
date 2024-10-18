'use client';
import styles from './style.module.scss';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { textOpacity, unblurAndFadeOut } from './anim';

const words = ["Hello", "Bonjour", "Olà", "やあ", "Hallå", "Guten tag", "Hallo", "Ciao"]

export default function Preloader() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index == words.length - 1) return;
        const timeout: NodeJS.Timeout = setTimeout(() => {
            setIndex(index + 1)
        }, index == 0 ? 1000 : 150);
        return () => clearTimeout(timeout);
    }, [index])

    return (
        <motion.div variants={unblurAndFadeOut} initial="initial" exit="exit" className={styles.introduction}>
            <motion.p variants={textOpacity} initial="initial" animate="enter" exit="exit"><span></span>{words[index]}</motion.p>
        </motion.div>
    )
}