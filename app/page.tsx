'use client';
import { useEffect, useState } from "react";
import Landing from "./components/landing/landing";
import { AnimatePresence } from "framer-motion";
import Preloader from "./components/preloader/preloader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout: NodeJS.Timeout = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'default'
      window.scrollTo(0, 0);
    }, 3500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className={`w-dvh h-dvh`}>
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader />}
      </AnimatePresence>
      <Landing isLoading={isLoading} />
    </main>
  );
}
