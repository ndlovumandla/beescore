import type { ReactNode } from 'react';

type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

const ICONS: Record<AlertVariant, string> = {
  success: '✅',
  warning: '⚠️',
  danger:  '❌',
  info:    'ℹ️',
};

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: ReactNode;
}

export default function Alert({ variant, title, children }: AlertProps) {
  return (
    <div className={`alert alert-${variant}`} role="alert">
      <span className="alert-icon" aria-hidden="true">{ICONS[variant]}</span>
      <div className="alert-body">
        {title && <p className="alert-title">{title}</p>}
        <div className="alert-message">{children}</div>
      </div>
    </div>
  );
}
