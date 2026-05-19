import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';

const FEATURES = [
  {
    icon: '🏆',
    title: 'All 5 Elements',
    desc: 'Full Generic scorecard: Ownership, Management Control, Skills Development, ESD, and SED.',
  },
  {
    icon: '⚡',
    title: 'Instant Calculation',
    desc: 'Real-time score updates as you enter data. See your B-BBEE level immediately.',
  },
  {
    icon: '📊',
    title: 'Priority Elements',
    desc: 'Automatic sub-minimum tracking for Ownership, Skills and ESD. Level discounts applied correctly.',
  },
  {
    icon: '🏢',
    title: 'EME / QSE / Generic',
    desc: 'Entity size auto-detected from turnover. Automatic level calculations for EME/QSE entities.',
  },
  {
    icon: '📄',
    title: 'Procurement Scoring',
    desc: 'Track multiple suppliers, recognition levels, designated groups and bonus points automatically.',
  },
  {
    icon: '🔒',
    title: 'No Data Stored',
    desc: 'All calculations run in your browser. Nothing is sent to any server.',
  },
];

const LEVELS = [
  { level: 1, pts: '100+',  recog: '135%', color: '#16a34a' },
  { level: 2, pts: '95–99', recog: '125%', color: '#22c55e' },
  { level: 3, pts: '90–94', recog: '110%', color: '#84cc16' },
  { level: 4, pts: '80–89', recog: '100%', color: '#eab308' },
  { level: 5, pts: '75–79', recog: '80%',  color: '#f97316' },
  { level: 6, pts: '70–74', recog: '60%',  color: '#ef4444' },
  { level: 7, pts: '55–69', recog: '50%',  color: '#dc2626' },
  { level: 8, pts: '40–54', recog: '10%',  color: '#991b1b' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span>🇿🇦</span>
            South African B-BBEE Platform
          </div>
          <h1 className="hero-title">
            Know Your <span>B-BBEE Level</span><br />Before the Auditors Do
          </h1>
          <p className="hero-subtitle">
            BEEscore calculates your Broad-Based Black Economic Empowerment scorecard
            across all five elements using the Generic Codes of Good Practice.
          </p>
          <div className="hero-actions">
            <Button variant="secondary" size="lg" onClick={() => navigate('/calculator')}>
              Start Free Assessment
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById('levels')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>
              View Levels Table
            </Button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-heading">
          <p className="section-eyebrow">Why BEEscore</p>
          <h2 className="section-title">Everything You Need for B-BBEE Compliance</h2>
          <p className="section-sub">Built to the Generic Codes. Updated for the 2017 amendments.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon" aria-hidden="true">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="levels" style={{ background: 'var(--card)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="section-heading">
            <p className="section-eyebrow">Reference</p>
            <h2 className="section-title">B-BBEE Recognition Levels</h2>
            <p className="section-sub">Generic Codes of Good Practice thresholds</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {LEVELS.map(l => (
              <div key={l.level} style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '1rem', textAlign: 'center',
                borderTop: `4px solid ${l.color}`,
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: l.color }}>Level {l.level}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0.2rem 0' }}>{l.pts} pts</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>{l.recog}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>recognition</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <h2 className="cta-banner-title">Ready to Calculate Your Score?</h2>
        <p className="cta-banner-sub">Takes less than 10 minutes. No registration required.</p>
        <Button variant="secondary" size="lg" onClick={() => navigate('/calculator')}>
          Start Assessment →
        </Button>
      </section>
    </div>
  );
}
