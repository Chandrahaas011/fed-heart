import React from 'react';
import { motion } from 'framer-motion';
import { Database, Users, BarChart2, ShieldCheck, Dna, Activity } from 'lucide-react';

const Stat = ({ icon: Icon, label, value, color = '#ef4444' }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="card"
    style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}
  >
    <div style={{ padding: 10, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}28`, flexShrink: 0 }}>
      <Icon size={18} style={{ color }} />
    </div>
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>{label}</div>
    </div>
  </motion.div>
);

const featureGroups = [
  { label: 'Demographics', items: ['Age', 'Gender'] },
  { label: 'Vitals', items: ['Blood Pressure', 'BMI', 'Sleep Hours'] },
  { label: 'Lipid Panel', items: ['Cholesterol', 'Triglycerides', 'HDL', 'LDL'] },
  { label: 'Biomarkers', items: ['Fasting Blood Sugar', 'CRP Level', 'Homocysteine'] },
  { label: 'Conditions', items: ['Diabetes', 'Family History', 'High Blood Pressure'] },
  { label: 'Lifestyle', items: ['Exercise', 'Smoking', 'Alcohol', 'Stress', 'Sugar'] },
];

export const DatasetInsights = () => (
  <div>
    {/* Top stats row */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
      <Stat icon={Database} label="Total Patient Records" value="10,000" color="#ef4444" />
      <Stat icon={Users} label="Demographics Balance" value="Balanced" color="#a78bfa" />
      <Stat icon={BarChart2} label="Clinical Features" value="20 Variables" color="#f59e0b" />
      <Stat icon={Dna} label="Lab Biomarkers" value="4 Markers" color="#10b981" />
      <Stat icon={ShieldCheck} label="Privacy Preserved" value="100%" color="#38bdf8" />
      <Stat icon={Activity} label="Positive Cases" value="20% (2,000)" color="#fb923c" />
    </div>

    {/* Feature Groups */}
    <div className="card" style={{ padding: 28 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Database size={16} color="#ef4444" /> Feature Coverage
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
        {featureGroups.map(group => (
          <div key={group.label}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>
              {group.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {group.items.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#d4d4d8' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
