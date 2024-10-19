import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";
import { defaultAnimations } from "./defaultAnim";
import { AnimatedTextProps } from "@/app/utils/types/AnimatedTextProps";

export default function AnimatedText({
    text,
    el: Wrapper = "p",
    className,
    repeatDelay,
    trigger,
    animation = defaultAnimations,
}: AnimatedTextProps) {
    const controls = useAnimation();
    const textArray = Array.isArray(text) ? text : [text];
    const ref = useRef(null);


    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const show = () => {
            controls.start("visible");

            if (repeatDelay) {
                timeout = setTimeout(async () => {
                    await controls.start("hidden");
                    controls.start("visible");
                }, repeatDelay);
            }
        };

        if (trigger) {
            show();
        } else {
            controls.start("hidden");
        }

        return () => clearTimeout(timeout);
    }, [trigger]);

    return (
        <Wrapper className={className} object={{}}>
            <span className="sr-only">{textArray.join(" ")}</span>
            <motion.span
                ref={ref}
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
        </Wrapper>
    );
};
