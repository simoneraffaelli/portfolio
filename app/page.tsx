'use client';
import { useEffect, useState } from "react";
import Landing from "./components/landing/landing";
import { AnimatePresence } from "framer-motion";
import Preloader from "./components/preloader/preloader";
import Lenis from "lenis";
import Footer from "./components/footer/footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout: NodeJS.Timeout = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'default'
      window.scrollTo(0, 0);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect( () => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <main className={`w-dvh overflow-hidden ${isLoading ? 'h-dvh' : ''}`}>
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader />}
      </AnimatePresence>
      <Landing isLoading={isLoading} />
      <Footer />
    </main>
  );
}
