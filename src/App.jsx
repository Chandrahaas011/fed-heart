import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse, Play, ShieldCheck, Github, Zap, Activity,
  Server, X, ExternalLink, BookOpen, Database, Lock
} from 'lucide-react';
import { useFederatedLearning } from './hooks/useFederatedLearning';
import { NodeCard, GlobalStats } from './components/Dashboard/DashboardItems';
import { PredictionForm } from './components/Prediction/PredictionForm';
import { LearningChart } from './components/Analytics/LearningChart';
import { DatasetInsights } from './components/Analytics/DatasetInsights';
import { SplashScreen } from './components/UI/SplashScreen';
import { HeartLogo } from './components/UI/HeartLogo';

/* ── Modal Content ───────────────────────────────── */
const MODAL_CONTENT = {
  framework: {
    icon: Server,
    title: 'Federated Learning Architecture',
    color: '#ef4444',
    sections: [
      {
        heading: 'How It Works',
        body: 'Instead of uploading sensitive patient records to a central server, each hospital trains a local model on its own data. Only the encrypted model weights — never raw data — are transmitted to the global aggregator.'
      },
      {
        heading: 'FedAvg Algorithm',
        body: 'The global model is updated by averaging the locally trained weight updates from all participating hospital nodes, weighted by their local dataset size. This is the core of the McMahan et al. (2017) Federated Averaging protocol.'
      },
      {
        heading: 'Fault Tolerance',
        body: 'Nodes can join or leave mid-training without disrupting the global learning process. The aggregator continues with available nodes, making the system robust to hospital dropouts or network failures.'
      }
    ],
    link: { href: 'https://arxiv.org/abs/1602.05629', label: 'Read the Original FedAvg Paper' }
  },
  dataset: {
    icon: Database,
    title: 'Dataset Details',
    color: '#a78bfa',
    sections: [
      {
        heading: 'Source & Size',
        body: '10,000 anonymized patient records spanning 21 clinical and lifestyle features, including blood pressure, cholesterol, BMI, triglycerides, CRP, homocysteine, and behavioral risk factors.'
      },
      {
        heading: 'Features Used',
        body: 'Age, Gender, Blood Pressure, Cholesterol Level, Exercise Habits, Smoking, Family Heart Disease History, Diabetes, BMI, High Blood Pressure, HDL/LDL Cholesterol markers, Alcohol, Stress, Sleep, Sugar Consumption, Triglycerides, Fasting Blood Sugar, CRP Level, Homocysteine.'
      },
      {
        heading: 'Privacy Processing',
        body: 'All normalization and feature engineering is performed locally in the browser. No data ever leaves the client device during the simulation.'
      }
    ]
  },
  privacy: {
    icon: Lock,
    title: 'Privacy & Security Model',
    color: '#10b981',
    sections: [
      {
        heading: 'Differential Privacy',
        body: "Statistical noise is added to gradient updates before transmission, ensuring that no individual patient's data can be reverse-engineered from the model weights even if the global server is compromised."
      },
      {
        heading: 'Encrypted Communication',
        body: 'All weight transmissions between hospital nodes and the global aggregator are signed and encrypted. Man-in-the-middle attacks on gradient updates are prevented by protocol-level verification.'
      },
      {
        heading: 'Zero Data Centralization',
        body: 'At no point does raw patient data leave the originating hospital node. The global model converges entirely through the exchange of mathematical weight vectors, not health records.'
      }
    ],
    link: { href: 'https://arxiv.org/abs/1412.6980', label: 'Explore the Privacy Research' }
  }
};

/* ── InfoModal ────────────────────────────────────── */
function InfoModal({ modalKey, onClose }) {
  if (!modalKey) return null;
  const data = MODAL_CONTENT[modalKey];
  if (!data) return null;
  const Icon = data.icon;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-box"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}><X size={16} /></button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <div style={{ padding: 10, borderRadius: 12, background: `${data.color}18`, border: `1px solid ${data.color}30` }}>
              <Icon size={22} style={{ color: data.color }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{data.title}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {data.sections.map((s, i) => (
              <div key={i}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: data.color, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.heading}</h3>
                <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.75 }}>{s.body}</p>
              </div>
            ))}
          </div>

          {data.link && (
            <a
              href={data.link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 32,
                paddingTop: 24, borderTop: '1px solid #27272a', color: data.color,
                fontSize: 14, fontWeight: 600, textDecoration: 'none'
              }}
            >
              {data.link.label} <ExternalLink size={14} />
            </a>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── App ─────────────────────────────────────────── */
export default function App() {
  const { status, metrics, startSimulation, predict } = useFederatedLearning();
  const [modal, setModal] = useState(null);
  const [splashDone, setSplashDone] = useState(false);
  const [logs, setLogs] = useState([
    'System initialized. Pre-trained global model loaded.',
    'Privacy protocols active. Data isolation enforced.',
    'Federated nodes standing by.'
  ]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (status === 'training') {
      const msgs = [
        `[ROUND ${metrics.round}] Distributing global model to ${metrics.hospitalAccuracies.length} nodes...`,
        `[ROUND ${metrics.round}] Local training complete. Accuracies: ${metrics.hospitalAccuracies.map(a => (a * 100).toFixed(1) + '%').join(', ')}`,
        `[ROUND ${metrics.round}] Aggregating encrypted weight vectors via FedAvg...`,
        `[ROUND ${metrics.round}] Global accuracy synchronized: ${(metrics.globalAccuracy * 100).toFixed(2)}%`,
      ];
      setLogs(prev => [...prev, ...msgs].slice(-12));
    }
    if (status === 'completed') {
      setLogs(prev => [...prev, '[DONE] Federated simulation complete. Global model stabilized.'].slice(-12));
    }
  }, [status, metrics.round]);

  const handleRunSimulation = () => {
    startSimulation('/data set/heart_disease.csv', 3, 5);
  };

  const isSimRunning = status === 'loading' || status === 'training';

  if (!splashDone) {
    return <SplashScreen onComplete={() => setSplashDone(true)} />;
  }

  return (
    <div>
      {/* ── NAVBAR ── */}
      <nav className="navbar" style={{ boxShadow: scrolled ? '0 1px 32px rgba(0,0,0,0.4)' : 'none' }}>
        <div className="navbar-brand">
          <motion.div
            animate={{ scale: [1, 1.1, 1, 1.06, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.14, 0.28, 0.42, 1] }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.5))' }}
          >
            <HeartLogo size={34} />
          </motion.div>
          FedHeart
        </div>

        <div className="navbar-nav">
          <button className="nav-btn" onClick={() => setModal('framework')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Server size={14} /> Framework</span>
          </button>
          <button className="nav-btn" onClick={() => setModal('dataset')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Database size={14} /> Dataset</span>
          </button>
          <button className="nav-btn" onClick={() => setModal('privacy')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Lock size={14} /> Privacy</span>
          </button>
          <div className="nav-divider" />
          <div className="nav-badge">
            <ShieldCheck size={13} /> Privacy Secured
          </div>
          <div className="nav-divider" />
          <a
            href="https://drive.google.com/file/d/16V_VO41QDsWZ1u7sMI7yGGdgAn2UA7jI/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <BookOpen size={14} /> Research
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="hero-eyebrow">
            <ShieldCheck size={12} /> Federated Learning · Privacy-Preserving AI
          </div>
        </motion.div>

        <div className="hero-icon-wrap">
          <HeartPulse size={46} color="#ef4444" />
        </div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          Heart Disease<br /><span className="line2">Prediction</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          A privacy-preserving diagnostic system powered by federated machine learning.
          Trained across decentralized hospital nodes — <strong style={{ color: '#f4f4f5' }}>your data never leaves your device.</strong>
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className="btn-primary"
            style={{ fontSize: 16, padding: '15px 32px' }}
            onClick={() => document.getElementById('diagnose')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Activity size={18} /> Run Diagnosis
          </button>
          <button
            className="btn-ghost"
            style={{ fontSize: 16, padding: '15px 32px' }}
            onClick={() => document.getElementById('engine')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Server size={18} /> See FL Engine
          </button>
          <button className="btn-ghost btn-sm" onClick={() => setModal('framework')}>
            <BookOpen size={14} /> How it works
          </button>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { value: '10,000', label: 'Patient Records' },
            null,
            { value: '20', label: 'Clinical Features' },
            null,
            { value: '3', label: 'Hospital Nodes' },
            null,
            { value: '82%', label: 'Model Accuracy' },
          ].map((item, i) =>
            item === null ? (
              <div key={i} className="hero-stat-divider" />
            ) : (
              <div key={i} className="hero-stat-item">
                <div className="hero-stat-value">{item.value}</div>
                <div className="hero-stat-label">{item.label}</div>
              </div>
            )
          )}
        </motion.div>
      </section>

      {/* ── DATASET INSIGHTS ── */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)' }}>
        <div className="page-wrap">
          <DatasetInsights />
        </div>
      </section>

      {/* ── PREDICTION FORM ── */}
      <section id="diagnose" style={{ padding: '80px 0', borderTop: '1px solid var(--border)', scrollMarginTop: 64 }}>
        <div className="page-wrap">
          <div className="section-header">
            <p className="section-eyebrow">Patient Diagnostic Tool</p>
            <h2 className="section-title">Cardiovascular Risk Assessment</h2>
            <p className="section-desc">
              Enter your clinical metrics below. Our evidence-based model analyzes 20 biomarkers
              against established Framingham Risk Score criteria — instantly, client-side, privately.
            </p>
          </div>
          <PredictionForm onPredict={predict} isModelReady={true} />
        </div>
      </section>

      {/* ── FL ENGINE ── */}
      <section id="engine" style={{ padding: '80px 0', borderTop: '1px solid var(--border)', scrollMarginTop: 64 }}>
        <div className="page-wrap">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 48, gap: 24, flexWrap: 'wrap' }}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <p className="section-eyebrow">Live Simulation</p>
              <h2 className="section-title">Federated Learning Engine</h2>
              <p className="section-desc">
                Visualize how the global model is trained across three decentralized hospital nodes without sharing any raw patient data.
              </p>
            </div>
            <button
              className={isSimRunning ? 'btn-ghost' : 'btn-primary'}
              onClick={handleRunSimulation}
              disabled={isSimRunning}
              style={{ flexShrink: 0 }}
            >
              {isSimRunning ? (
                <><Zap size={16} style={{ animation: 'spin 1s linear infinite' }} /> Running Simulation...</>
              ) : (
                <><Play size={16} /> Run Simulation</>
              )}
            </button>
          </div>

          {/* Node Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
            {['City General Hospital', 'St. Mary Medical Trust', 'North Regional Clinic'].map((name, i) => (
              <NodeCard
                key={name}
                name={name}
                accuracy={metrics.hospitalAccuracies[i] || 0}
                status={status === 'training' ? 'training' : (metrics.hospitalAccuracies[i] > 0 ? 'completed' : 'idle')}
                isSyncing={status === 'training'}
              />
            ))}
          </div>

          {/* Chart + Terminal + Global Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <LearningChart history={metrics.history} />

            {/* Terminal */}
            <div className="terminal" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="terminal-header">
                <div className="terminal-dot" style={{ background: '#ef4444' }} />
                <div className="terminal-dot" style={{ background: '#f59e0b' }} />
                <div className="terminal-dot" style={{ background: '#10b981' }} />
                <span style={{ marginLeft: 8, fontSize: 11, color: '#52525b', fontFamily: 'JetBrains Mono, monospace' }}>protocol.log</span>
              </div>
              <div className="terminal-body">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="log-line"
                  >
                    <span className="log-ts">[{new Date().toLocaleTimeString()}]</span>
                    <span className="log-msg">{log}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <GlobalStats round={metrics.round} accuracy={metrics.globalAccuracy} />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '48px 0' }}>
        <div className="page-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="navbar-logo" style={{ width: 30, height: 30 }}>
              <HeartPulse size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>FedHeart Framework</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Privacy-preserving cardiovascular AI research</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="nav-btn" onClick={() => setModal('framework')}>Architecture</button>
            <button className="nav-btn" onClick={() => setModal('dataset')}>Dataset</button>
            <button className="nav-btn" onClick={() => setModal('privacy')}>Privacy</button>
            <a
              href="https://github.com/Chandrahaas011/fed-heart"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
            >
              <Github size={18} />
            </a>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            © 2026 FedHeart · For academic research use only
          </div>
        </div>
      </footer>

      {/* ── MODAL ── */}
      <InfoModal modalKey={modal} onClose={() => setModal(null)} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}