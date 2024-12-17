'use client';
import Link from 'next/link';
import styles from './style.module.scss';
import { FaInfoCircle } from 'react-icons/fa';

export default function Header() {

    return (
        <div className={styles.header}>
            <Link href='/'>
                <p className={styles.logo}>[Ә]</p>
            </Link>
            <Link href='/about'>
                <FaInfoCircle className={styles.aboutMeIcon} />
            </Link>
        </div>
    );
}
