import { useEffect, useState } from 'react';
import './PageBadgeCSS.css';
import { motion } from 'framer-motion';

interface prop {
    title: string;
}
const PageBadge = ({title}:prop) => {
    const [displayIndex, setDisplayIndex] = useState(0);
    const [direction, setDirection] = useState('forward'); 

    useEffect(() => {
        const intervalId = setInterval(() => {
        if (direction === 'forward') {
            if (displayIndex < title.length) {
                setDisplayIndex(displayIndex + 1);
            } else {
                setDirection('backward'); 
            }
        } else { 
            if (displayIndex > 1) {
                setDisplayIndex(displayIndex - 1);
            } else {
                setDirection('forward'); 
            }
        }
        }, 1000); // Adjust typing speed here

        return () => clearInterval(intervalId);
    }, [displayIndex, direction]);

    const displayedText = title.substring(0, displayIndex);

    const variants = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -20 },
    };

    return (
        <div className="main shadow">
            <motion.h3 
                className="head"
                variants={variants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5 }} 
            >
                {displayedText}
            </motion.h3>
        </div>
    );
}
export default PageBadge;