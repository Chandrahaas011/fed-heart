import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable animated SVG heart+EKG logo.
 * @param {number} size - overall pixel size (default 36)
 * @param {boolean} animate - whether to run the draw animation (false = static, for navbar)
 */
export function HeartLogo({ size = 36, animate = false }) {
  const pathProps = animate
    ? {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
      }
    : { style: { opacity: 1 } };

  const ekgProps = animate
    ? {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
        transition: { delay: 0.7, duration: 0.6, ease: 'easeOut' },
      }
    : { style: { opacity: 1 } };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Heart fill */}
      <motion.path
        d="M50 75 C50 75 18 55 18 35 C18 24 26 16 35 16 C41 16 46 20 50 24 C54 20 59 16 65 16 C74 16 82 24 82 35 C82 55 50 75 50 75Z"
        fill="rgba(239,68,68,0.15)"
        {...(animate
          ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 } }
          : {})}
      />

      {/* Heart outline */}
      <motion.path
        d="M50 75 C50 75 18 55 18 35 C18 24 26 16 35 16 C41 16 46 20 50 24 C54 20 59 16 65 16 C74 16 82 24 82 35 C82 55 50 75 50 75Z"
        stroke="#ef4444"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        {...pathProps}
        transition={animate ? { duration: 0.75, ease: 'easeOut' } : undefined}
      />

      {/* EKG pulse line */}
      <motion.path
        d="M25 48 L34 48 L38 38 L42 58 L46 42 L50 52 L54 52 L58 44 L62 52 L66 48 L75 48"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        {...ekgProps}
        transition={animate ? { delay: 0.7, duration: 0.6, ease: 'easeOut' } : undefined}
      />
    </svg>
  );
}
