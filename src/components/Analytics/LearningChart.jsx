import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: '#111118', border: '1px solid #27272a', borderRadius: 10,
        padding: '10px 14px', fontSize: 12
      }}>
        <div style={{ color: '#71717a', marginBottom: 4 }}>{label}</div>
        <div style={{ color: '#ef4444', fontWeight: 700 }}>{payload[0].value}% accuracy</div>
      </div>
    );
  }
  return null;
};

export const LearningChart = ({ history }) => {
  const data = history.map(h => ({
    round: typeof h.round === 'number' ? `R${h.round}` : h.round,
    accuracy: parseFloat((h.globalAccuracy * 100).toFixed(1)),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{ padding: 24, minHeight: 280 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>Learning Convergence</h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Global model accuracy over rounds</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#10b981' }}>
          <TrendingUp size={14} />
          <span style={{ fontWeight: 600 }}>{data.length > 0 ? data[data.length - 1].accuracy + '%' : '—'}</span>
        </div>
      </div>

      {data.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, color: 'var(--text-muted)', fontSize: 13 }}>
          Run the simulation to see learning curves
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" vertical={false} />
            <XAxis dataKey="round" stroke="#3f3f46" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#3f3f46" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="accuracy" stroke="#ef4444" strokeWidth={2.5} fill="url(#accGrad)" animationDuration={1000} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};
