'use client';
import Link from 'next/link';
import styles from './style.module.scss';
import { FaUser } from 'react-icons/fa';

export default function Header() {

    return (
        <div className={styles.header}>
            <Link href='/'>
                <p className={styles.logo}>[Ә]</p>
            </Link>
            <div className={styles.aboutMeIcon}>
                <Link href='/about'>
                    <FaUser />
                </Link>
            </div>
        </div>
    );
}