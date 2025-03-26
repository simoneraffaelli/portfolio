'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { handleEasterEgg } from './eastereggutils';

interface KeySequenceHandlerProps {
  sequence: string[]; // The key sequence to match
  onMatch?: () => void; // Callback when the sequence matches
  children?: ReactNode; // Optional children to render
}

const KeySequenceHandler: React.FC<KeySequenceHandlerProps> = ({
  sequence,
  onMatch = handleEasterEgg,
  children,
}) => {
  const keySequenceRef = useRef<string[]>([]); // Use a ref to store the key sequence

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Update the key sequence in the ref
      keySequenceRef.current = [...keySequenceRef.current, event.key].slice(-sequence.length);

      // Check if the current sequence matches the target sequence
      if (keySequenceRef.current.join('') === sequence.join('')) {
        onMatch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sequence, onMatch]); // Dependencies only include sequence and onMatch

  return <>{children}</>; // Render children if provided
};

export default KeySequenceHandler;