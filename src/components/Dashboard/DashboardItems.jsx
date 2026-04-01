import React from 'react';
import { motion } from 'framer-motion';
import { Database, Shield, Activity, Wifi, CheckCircle } from 'lucide-react';

export const NodeCard = ({ name, accuracy, status, isSyncing }) => {
  const statusConfig = {
    training: { label: 'Training', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
    completed: { label: 'Complete', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
    idle: { label: 'Standby', color: '#52525b', bg: 'rgba(82,82,91,0.1)', border: 'rgba(82,82,91,0.25)' },
  };
  const s = statusConfig[status] || statusConfig.idle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{ padding: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ padding: 10, borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <Database size={20} color="#ef4444" />
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
          background: s.bg, color: s.color, border: `1px solid ${s.border}`,
          display: 'flex', alignItems: 'center', gap: 5,
          animation: status === 'training' ? 'pulse 2s infinite' : 'none'
        }}>
          {status === 'training' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />}
          {status === 'completed' && <CheckCircle size={10} />}
          {s.label.toUpperCase()}
        </span>
      </div>

      <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{name}</h3>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Hospital Node · FL Participant</p>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Local Accuracy</span>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#f4f4f5' }}>
            {(accuracy * 100).toFixed(1)}%
          </span>
        </div>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${accuracy * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {isSyncing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, fontSize: 11, color: '#ef4444' }}
        >
          <Wifi size={12} style={{ animation: 'pulse 1s ease-in-out infinite' }} />
          Encrypting & transmitting gradients…
        </motion.div>
      )}
    </motion.div>
  );
};

export const GlobalStats = ({ round, accuracy }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="card card-red-accent"
    style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ padding: 16, borderRadius: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <Activity size={28} color="#ef4444" />
      </div>
      <div>
        <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
          {(accuracy * 100).toFixed(1)}%
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginTop: 4 }}>Global Model Accuracy</div>
      </div>
    </div>

    <div style={{ height: 48, width: 1, background: 'var(--border)' }} />

    <div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>{round || '—'}</div>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginTop: 4 }}>Rounds Completed</div>
    </div>

    <div style={{ height: 48, width: 1, background: 'var(--border)' }} />

    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Shield size={14} color="#10b981" />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>No raw data transmitted</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Gradient vectors only · End-to-end encrypted</div>
    </div>
  </motion.div>
);
