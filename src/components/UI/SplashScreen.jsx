import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartLogo } from './HeartLogo';

/**
 * Animated SVG splash screen.
 * Shows for ~2s on first load, then fades out revealing the app.
 */
export function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('draw'); // draw → pulse → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('pulse'), 800);
    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#080810',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 28,
          }}
        >
          {/* Glow backdrop */}
          <div style={{
            position: 'absolute',
            width: 320, height: 320,
            background: 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />

          {/* Animated SVG Logo */}
          <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeartLogo size={120} animate />

            {/* Pulse ripple rings */}
            {phase === 'pulse' && (
              <>
                <PulseRing delay={0} />
                <PulseRing delay={0.4} />
              </>
            )}
          </div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: 28, fontWeight: 900, letterSpacing: '-0.04em',
              color: '#f4f4f5', fontFamily: 'Inter, sans-serif'
            }}>
              Fed<span style={{ color: '#ef4444' }}>Heart</span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              style={{
                fontSize: 12, color: '#52525b', marginTop: 6,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif', fontWeight: 500
              }}
            >
              Privacy-Preserving Cardiac AI
            </motion.div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            style={{
              width: 120, height: 2, borderRadius: 999,
              background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
              marginTop: 8
            }}
          >
            <motion.div
              style={{ height: '100%', background: '#ef4444', borderRadius: 999 }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'linear' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PulseRing({ delay }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: -16,
        borderRadius: '50%',
        border: '1.5px solid rgba(239,68,68,0.5)',
        pointerEvents: 'none',
      }}
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: 1.6, opacity: 0 }}
      transition={{
        delay,
        duration: 1.1,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: 0.4,
      }}
    />
  );
}
