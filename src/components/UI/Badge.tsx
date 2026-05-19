import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'muted';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'lg';
  children: ReactNode;
}

export default function Badge({ variant = 'primary', size, children }: BadgeProps) {
  const cls = ['badge', `badge-${variant}`, size === 'lg' ? 'badge-lg' : ''].filter(Boolean).join(' ');
  return <span className={cls}>{children}</span>;
}
