import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";
import { defaultAnimations } from "./defaultAnim";
import { AnimatedTextProps } from "@/app/utils/types/AnimatedTextProps";

export default function AnimatedText({
    text,
    className,
    trigger,
    animation = defaultAnimations,
}: AnimatedTextProps) {
    const controls = useAnimation();
    const textArray = Array.isArray(text) ? text : [text];
    const ref = useRef<HTMLSpanElement>(null);


    useEffect(() => {
        if (trigger) {
            setTimeout(() => {
                ref.current?.classList.add(trigger ? "visible" : "hidden");
                ref.current?.classList.remove(!trigger? "visible" : "hidden");
                controls.start("visible");
            }, 350);
        } else {
            controls.start("hidden").then(() => {
                ref.current?.classList.add(trigger? "visible" : "hidden");
                ref.current?.classList.remove(!trigger? "visible" : "hidden");
            });
        }
    }, [trigger]);

    return (
        <span className={className} ref={ref}>
            <span className="sr-only">{textArray.join(" ")}</span>
            <motion.span
                initial="hidden"
                animate={controls}
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } },
                    hidden: {},
                }}
                aria-hidden
            >
                {textArray.map((line, lineIndex) => (
                    <span className="block" key={`${line}-${lineIndex}`}>
                        {line.split(" ").map((word, wordIndex) => (
                            <span className="inline-block" key={`${word}-${wordIndex}`}>
                                {word.split("").map((char, charIndex) => (
                                    <motion.span
                                        key={`${char}-${charIndex}`}
                                        className="inline-block"
                                        variants={animation}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                                <span className="inline-block">&nbsp;</span>
                            </span>
                        ))}
                    </span>
                ))}
            </motion.span>
        </span>
    );
};
