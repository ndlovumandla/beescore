interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  showValue?: boolean;
  unit?: string;
}

function getColorClass(pct: number): string {
  if (pct >= 80) return 'pct-excellent';
  if (pct >= 60) return 'pct-good';
  if (pct >= 40) return 'pct-fair';
  return 'pct-poor';
}

export default function ProgressBar({ label, value, max, showValue = true, unit = 'pts' }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="progress-wrap">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        {showValue && (
          <span className="progress-value">{value.toFixed(2)} / {max} {unit}</span>
        )}
      </div>
      <div className="progress-bar-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div
          className={`progress-bar-fill ${getColorClass(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
