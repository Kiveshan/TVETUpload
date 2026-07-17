import type { ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  className?: string;
}

export default function Modal({ onClose, children, labelledBy, className }: ModalProps) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className={className ? `modal ${className}` : 'modal'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modalClose" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        {children}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
