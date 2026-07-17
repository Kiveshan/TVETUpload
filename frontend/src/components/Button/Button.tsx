import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  icon,
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = ['button', fullWidth && 'buttonFullWidth', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" {...rest} className={classes}>
      {children}
      {icon}
    </button>
  );
}
