import { useScorecard } from '../../context/ScorecardContext';
import { formatPoints } from '../../lib/formatters';

const ELEMENT_NAMES = ['Ownership', 'Management', 'Skills', 'ESD', 'SED'];
const ELEMENT_MAX   = [25, 15, 20, 40, 5];

export default function ScoreSidebar() {
  const { state } = useScorecard();
  const { result } = state;

  if (!result) {
    return (
      <aside className="score-sidebar" aria-label="Score summary">
        <p className="score-sidebar-title">Live Score</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
          Complete the wizard to see your score.
        </p>
      </aside>
    );
  }

  const scores = [
    result.ownershipScore.totalEarned,
    result.managementScore.totalEarned,
    result.skillsScore.totalEarned,
    result.esdScore.totalEarned,
    result.sedScore.totalEarned,
  ];
  const total = scores.reduce((a, b) => a + b, 0);

  return (
    <aside className="score-sidebar" aria-label="Score summary">
      <p className="score-sidebar-title">Score Summary</p>
      {ELEMENT_NAMES.map((name, i) => (
        <div key={name} className="score-sidebar-row">
          <span className="score-sidebar-label">{name}</span>
          <span className="score-sidebar-pts">{formatPoints(scores[i])} / {ELEMENT_MAX[i]}</span>
        </div>
      ))}
      <div className="score-sidebar-total">
        <span className="score-sidebar-total-label">Total</span>
        <span className="score-sidebar-total-pts">{formatPoints(total)}</span>
      </div>
      <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>B-BBEE Level</div>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>
          {result.finalLevel}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
          {result.recognitionPct}% Recognition
        </div>
      </div>
    </aside>
  );
}
