import { useNavigate } from 'react-router-dom';
import { useScorecard } from '../context/ScorecardContext';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';
import Badge from '../components/UI/Badge';
import ProgressBar from '../components/UI/ProgressBar';
import { formatPoints } from '../lib/formatters';
import { BEE_LEVEL_THRESHOLDS } from '../lib/constants';
import type { ElementScore } from '../types/bbbee';

function levelColor(level: number): string {
  if (level <= 2) return '#16a34a';
  if (level <= 4) return '#eab308';
  if (level <= 6) return '#f97316';
  return '#dc2626';
}

function ElementCard({ score }: { score: ElementScore }) {
  const pct = score.maxPoints > 0 ? (score.earnedPoints / score.maxPoints) * 100 : 0;
  void pct;
  return (
    <div className="element-card">
      <div className="element-card-header">
        <div>
          <div className="element-card-name">{score.name}</div>
          <div className="element-card-code">{score.code}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="element-card-pts">{formatPoints(score.totalEarned)}</div>
          <div className="element-card-max">/ {score.maxPoints + score.bonusMaxPoints} pts</div>
        </div>
      </div>
      <ProgressBar label="" value={score.earnedPoints} max={score.maxPoints} showValue={false} />
      {score.isPriority && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          <Badge variant={score.subMinimumMet ? 'success' : 'danger'} size="sm">
            {score.subMinimumMet ? '\u2713 Sub-Minimum Met' : '\u26a0 Sub-Minimum Not Met'}
          </Badge>
        </div>
      )}
      {score.breakdown.length > 0 && (
        <details className="element-breakdown">
          <summary style={{ fontSize: '0.78rem', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, userSelect: 'none' }}>
            View breakdown ({score.breakdown.length} items)
          </summary>
          {score.breakdown.map(b => (
            <div key={b.label} className="breakdown-row">
              <span className="breakdown-label" title={b.label}>{b.label}</span>
              <span className={`breakdown-pts${b.isBonus ? ' bonus' : b.earnedPoints === 0 ? ' zero' : ''}`}>
                {formatPoints(b.earnedPoints)} / {b.maxPoints}
                {b.isBonus && ' \u2605'}
              </span>
            </div>
          ))}
        </details>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useScorecard();
  const { result } = state;

  if (!result) {
    return (
      <div className="results-page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
          No scorecard results yet. Please complete the assessment first.
        </p>
        <Button variant="primary" onClick={() => navigate('/calculator')}>
          Go to Calculator
        </Button>
      </div>
    );
  }

  const color = levelColor(result.finalLevel);

  return (
    <div className="results-page">
      <div className="results-hero">
        <div className="results-level-badge" style={{ borderColor: color }}>
          <div className="results-level-num" style={{ color }}>{result.finalLevel}</div>
          <div className="results-level-label">B-BBEE Level</div>
        </div>
        <div className="results-summary">
          <div className="results-company">{result.companyName || 'Your Company'}</div>
          <div className="results-meta">{result.companySize} Entity</div>
          <div className="results-stats">
            <div>
              <div className="results-stat-label">Total Points</div>
              <div className="results-stat-value" style={{ color: '#fff' }}>{formatPoints(result.totalPoints)}</div>
              <div className="results-stat-sub">out of 105 max</div>
            </div>
            <div>
              <div className="results-stat-label">Recognition</div>
              <div className="results-stat-value" style={{ color }}>{result.recognitionPct}%</div>
              <div className="results-stat-sub">procurement value</div>
            </div>
            <div>
              <div className="results-stat-label">Calculated Level</div>
              <div className="results-stat-value" style={{ color: '#fff' }}>
                {result.calculatedLevel === result.finalLevel ? result.finalLevel : `${result.calculatedLevel} \u2192 ${result.finalLevel}`}
              </div>
              {result.autoLevel !== null && <div className="results-stat-sub">Auto-level applied</div>}
            </div>
          </div>
        </div>
      </div>

      {result.discountApplied && (
        <div className="discount-panel">
          <p className="discount-panel-title">\u26a0 Level Discount Applied (+1 level)</p>
          <ul className="discount-list">
            {result.discountReasons.map(r => <li key={r}>{r}</li>)}
          </ul>
        </div>
      )}

      {result.autoLevel !== null && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Alert variant="success" title={`Automatic Level ${result.autoLevel} Applied`}>
            Your entity qualifies for an automatic B-BBEE level based on size and Black ownership percentage.
          </Alert>
        </div>
      )}

      <div className="element-grid">
        <ElementCard score={result.ownershipScore} />
        <ElementCard score={result.managementScore} />
        <ElementCard score={result.skillsScore} />
        <ElementCard score={result.esdScore} />
        <ElementCard score={result.sedScore} />
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Level Reference</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
          {BEE_LEVEL_THRESHOLDS.filter(t => t.level <= 8).map(t => (
            <div key={t.level} style={{
              padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)',
              background: t.level === result.finalLevel ? 'var(--primary-50)' : 'var(--bg)',
              border: t.level === result.finalLevel ? '2px solid var(--primary)' : '1px solid var(--border)',
              fontSize: '0.78rem', textAlign: 'center',
            }}>
              <div style={{ fontWeight: 700, color: levelColor(t.level) }}>Level {t.level}</div>
              <div style={{ color: 'var(--muted)' }}>{t.minPoints}+ pts</div>
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>{t.recognition}% recog.</div>
            </div>
          ))}
        </div>
      </div>

      <div className="results-actions">
        <Button variant="outline" onClick={() => window.print()}>
          \ud83d\udda8 Print / Save PDF
        </Button>
        <Button variant="ghost" onClick={() => {
          dispatch({ type: 'SET_STEP', payload: 0 });
          navigate('/calculator');
        }}>
          Edit Inputs
        </Button>
        <Button variant="danger" onClick={() => {
          dispatch({ type: 'RESET' });
          navigate('/');
        }}>
          Start New Assessment
        </Button>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', marginTop: '1.5rem', lineHeight: 1.6 }}>
        \u26a0\ufe0f <strong>Disclaimer:</strong> This tool provides indicative B-BBEE scores based on self-reported data.
        It is not a substitute for a formal B-BBEE verification by an accredited rating agency.
        Always consult a qualified B-BBEE consultant for compliance advice.
      </p>
    </div>
  );
}
