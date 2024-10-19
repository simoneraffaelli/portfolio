import { Variant } from "framer-motion";

export type AnimatedTextProps = {
    text: string | string[];
    el?: keyof JSX.IntrinsicElements;
    className?: string;
    repeatDelay?: number;
    trigger: boolean;
    animation?: {
        hidden: Variant;
        visible: Variant;
    };
};