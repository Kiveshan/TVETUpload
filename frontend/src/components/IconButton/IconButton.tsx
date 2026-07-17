import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './IconButton.css';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'success' | 'danger' | 'neutral';
  'aria-label': string;
}

export default function IconButton({ icon, variant = 'neutral', className, ...rest }: IconButtonProps) {
  const classes = ['iconButton', `iconButton-${variant}`, className].filter(Boolean).join(' ');

  return (
    <button type="button" {...rest} className={classes}>
      {icon}
    </button>
  );
}
