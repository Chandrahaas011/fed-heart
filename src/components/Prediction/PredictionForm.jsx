import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, AlertTriangle, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

/* ── Field components ─────────────────────────────── */
const Field = ({ label, children }) => (
  <div>
    <label className="input-label">{label}</label>
    {children}
  </div>
);

const NumberInput = ({ value, field, min, max, step, onChange }) => (
  <input
    type="number"
    className="input-field"
    value={value}
    min={min} max={max} step={step || 1}
    onChange={e => onChange(field, Number(e.target.value))}
  />
);

const SelectInput = ({ value, field, options, onChange }) => (
  <select
    className="input-field"
    value={value}
    onChange={e => onChange(field, Number(e.target.value))}
    style={{ cursor: 'pointer' }}
  >
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const YES_NO = [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }];
const LEVEL3 = [{ label: 'Low', value: 0 }, { label: 'Medium', value: 1 }, { label: 'High', value: 2 }];

/* ── Risk Result ──────────────────────────────────── */
function RiskResult({ score }) {
  const pct = Math.round(score * 100);
  let config;

  if (score > 0.6) {
    config = {
      cls: 'risk-card-high',
      icon: AlertTriangle,
      label: 'High Risk',
      color: '#ef4444',
      desc: 'Significant cardiovascular risk indicators detected. Please consult a cardiologist or physician urgently.',
      action: 'Schedule a cardiac consultation as soon as possible.'
    };
  } else if (score > 0.35) {
    config = {
      cls: 'risk-card-moderate',
      icon: AlertCircle,
      label: 'Moderate Risk',
      color: '#f59e0b',
      desc: 'Elevated cardiovascular risk factors identified. A comprehensive medical check-up is strongly recommended.',
      action: 'Consider a lipid panel, blood pressure monitoring, and lifestyle changes.'
    };
  } else {
    config = {
      cls: 'risk-card-low',
      icon: CheckCircle,
      label: 'Low Risk',
      color: '#10b981',
      desc: 'Your metrics suggest a lower cardiovascular risk profile. Continue maintaining your healthy lifestyle.',
      action: 'Keep up regular exercise, balanced diet, and annual health screenings.'
    };
  }

  const Icon = config.icon;
  return (
    <motion.div
      className={config.cls}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="risk-score-ring" style={{ color: config.color }}>
          <span style={{ fontSize: 30, fontWeight: 900, lineHeight: 1 }}>{pct}%</span>
          <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, marginTop: 2 }}>RISK</span>
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon size={20} style={{ color: config.color }} />
            <h3 style={{ fontSize: 22, fontWeight: 800, color: config.color, letterSpacing: '-0.02em' }}>{config.label}</h3>
          </div>
          <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.7, marginBottom: 12 }}>{config.desc}</p>
          <div style={{
            fontSize: 12, fontWeight: 600, color: config.color,
            background: `${config.color}15`, border: `1px solid ${config.color}25`,
            padding: '8px 14px', borderRadius: 8, display: 'inline-block'
          }}>
            → {config.action}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: '#3f3f46', marginTop: 20 }}>
        ⚠ This tool provides a risk estimate based on established clinical criteria. It is not a medical diagnosis.
        Always consult a qualified healthcare professional for clinical decisions.
      </p>
    </motion.div>
  );
}

/* ── Collapsible Section ──────────────────────────── */
function FormSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 8 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 0', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)',
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em'
        }}
      >
        {title}
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, paddingBottom: 8 }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Form ────────────────────────────────────── */
export const PredictionForm = ({ onPredict }) => {
  const [form, setForm] = useState({
    age: 45, gender: 1, bp: 120, cholesterol: 200,
    exercise: 1, smoking: 0, familyHD: 0, diabetes: 0,
    bmi: 24.5, highBP: 0, lowHDL: 0, highLDL: 0,
    alcohol: 0, stress: 1, sleep: 7, sugar: 1,
    triglycerides: 150, fastingBS: 95, crp: 1.5, homocysteine: 10
  });
  const [result, setResult] = useState(null);
  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = e => {
    e.preventDefault();
    const features = [
      form.age, form.gender, form.bp, form.cholesterol,
      form.exercise, form.smoking, form.familyHD, form.diabetes,
      form.bmi, form.highBP, form.lowHDL, form.highLDL,
      form.alcohol, form.stress, form.sleep, form.sugar,
      form.triglycerides, form.fastingBS, form.crp, form.homocysteine
    ];
    setResult(onPredict(features));
  };

  return (
    <div className="card card-red-accent" style={{ padding: 32, maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
        <div style={{ padding: 10, background: 'var(--red-dim)', border: '1px solid var(--red-border)', borderRadius: 12 }}>
          <Heart size={22} color="var(--red)" />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Patient Risk Assessment</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            All 20 clinical features · Evidence-based Framingham/AHA scoring · Fully client-side
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <FormSection title="Demographics & Vitals" defaultOpen>
          <Field label="Age (years)">
            <NumberInput value={form.age} field="age" min={1} max={120} onChange={set} />
          </Field>
          <Field label="Gender">
            <SelectInput value={form.gender} field="gender" options={[{ label: 'Male', value: 1 }, { label: 'Female', value: 0 }]} onChange={set} />
          </Field>
          <Field label="Blood Pressure (mmHg)">
            <NumberInput value={form.bp} field="bp" min={60} max={300} onChange={set} />
          </Field>
          <Field label="Cholesterol (mg/dL)">
            <NumberInput value={form.cholesterol} field="cholesterol" min={100} max={700} onChange={set} />
          </Field>
          <Field label="BMI">
            <NumberInput value={form.bmi} field="bmi" min={10} max={70} step={0.1} onChange={set} />
          </Field>
          <Field label="Sleep Hours / day">
            <NumberInput value={form.sleep} field="sleep" min={2} max={14} step={0.5} onChange={set} />
          </Field>
        </FormSection>

        <FormSection title="Lab Biomarkers" defaultOpen>
          <Field label="Triglycerides (mg/dL)">
            <NumberInput value={form.triglycerides} field="triglycerides" min={50} max={1000} onChange={set} />
          </Field>
          <Field label="Fasting Blood Sugar">
            <NumberInput value={form.fastingBS} field="fastingBS" min={60} max={400} onChange={set} />
          </Field>
          <Field label="CRP Level (mg/L)">
            <NumberInput value={form.crp} field="crp" min={0} max={20} step={0.1} onChange={set} />
          </Field>
          <Field label="Homocysteine (μmol/L)">
            <NumberInput value={form.homocysteine} field="homocysteine" min={0} max={50} step={0.5} onChange={set} />
          </Field>
        </FormSection>

        <FormSection title="Medical History & Cholesterol Flags">
          <Field label="Diagnosed Diabetes">
            <SelectInput value={form.diabetes} field="diabetes" options={YES_NO} onChange={set} />
          </Field>
          <Field label="Family Heart Disease">
            <SelectInput value={form.familyHD} field="familyHD" options={YES_NO} onChange={set} />
          </Field>
          <Field label="High Blood Pressure">
            <SelectInput value={form.highBP} field="highBP" options={YES_NO} onChange={set} />
          </Field>
          <Field label="Low HDL Cholesterol">
            <SelectInput value={form.lowHDL} field="lowHDL" options={YES_NO} onChange={set} />
          </Field>
          <Field label="High LDL Cholesterol">
            <SelectInput value={form.highLDL} field="highLDL" options={YES_NO} onChange={set} />
          </Field>
          <Field label="Smoking">
            <SelectInput value={form.smoking} field="smoking" options={YES_NO} onChange={set} />
          </Field>
        </FormSection>

        <FormSection title="Lifestyle Factors">
          <Field label="Exercise Habits">
            <SelectInput value={form.exercise} field="exercise" options={LEVEL3} onChange={set} />
          </Field>
          <Field label="Stress Level">
            <SelectInput value={form.stress} field="stress" options={LEVEL3} onChange={set} />
          </Field>
          <Field label="Sugar Consumption">
            <SelectInput value={form.sugar} field="sugar" options={LEVEL3} onChange={set} />
          </Field>
          <Field label="Alcohol Consumption">
            <SelectInput value={form.alcohol} field="alcohol" options={LEVEL3} onChange={set} />
          </Field>
        </FormSection>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: 16, marginTop: 28, padding: '15px' }}
        >
          <Activity size={18} /> Analyze Risk Profile
        </button>
      </form>

      <AnimatePresence>
        {result !== null && (
          <motion.div style={{ marginTop: 28 }}>
            <RiskResult score={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
