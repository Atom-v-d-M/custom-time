import { useRef, useEffect, useState } from "react";
import styles from "./index.module.scss";

export const RandomShapeLoading = () => {
    const pathRef = useRef<SVGPathElement>(null);
    const [animationProgress, setAnimationProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationProgress(prev => (prev + 0.01) % 30); // Cycle from 0 to 1 continuously
        }, 50); // Update every 50ms for smooth animation

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (pathRef.current) {
            const path = pathRef.current;
            
            // Change stroke width based on animation progress
            const strokeWidth = 5 + (animationProgress * 15); // 5 to 20
            path.style.strokeWidth = strokeWidth.toString();
            
            // Change stroke color based on animation progress
            const hue = animationProgress * 360; // 0 to 360 degrees
            path.style.stroke = `hsl(${hue}, 70%, 50%)`;
            
            // Change stroke dasharray for animation effect
            const dashLength = 20 + (animationProgress * 80); // 20 to 100
            const gapLength = 10 + (animationProgress * 40); // 10 to 50
            path.style.strokeDasharray = `${dashLength} ${gapLength}`;
            
            // Animate stroke dashoffset for drawing effect
            const dashOffset = animationProgress * 100;
            path.style.strokeDashoffset = dashOffset.toString();
        }
    }, [animationProgress]);

    return (
        <svg className={styles.randomShapeLoading} width="407" height="305" viewBox="0 0 407 305" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                ref={pathRef}
                d="M119.5 89.5C83.1 68.4844 67.3333 117.744 64 145C37 169.504 -9.9 230.81 18.5 280C54 341.488 64 193.871 119.5 179C163.9 167.103 138 220.043 119.5 248C146.833 250.667 207 244.6 229 199C256.5 142 289 242.5 366.5 214C444 185.5 352.799 35 318.158 95C283.517 155 251.5 52.5 242.658 19.5C235.584 -6.9 201.605 30.5 185.5 52.5C178.667 73.5898 155.9 110.516 119.5 89.5Z" 
                stroke="white" 
                strokeWidth="19"
            />
        </svg>
    )
}