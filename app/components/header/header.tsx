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
            <Link href='/about'>
                <FaUser className={styles.icon} />
            </Link>
        </div>
    );
}
