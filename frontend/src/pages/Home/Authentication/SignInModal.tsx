import { useId, useState } from 'react';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import './SignInModal.css';

interface SignInModalProps {
  onClose: () => void;
}

export default function SignInModal({ onClose }: SignInModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const usernameId = useId();
  const passwordId = useId();

  return (
    <Modal onClose={onClose} labelledBy="sign-in-title">
      <div className="modalIconWrap">
        <LockIcon />
      </div>

      <h2 id="sign-in-title" className="modalTitle">
        Sign in
      </h2>
      <p className="modalSubtitle">Access the TVET Management Portal</p>

      <form
        className="modalForm"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label htmlFor={usernameId} className="modalLabel">
          Username
        </label>
        <input
          id={usernameId}
          type="email"
          placeholder="you@dhet.gov.za"
          className="modalInput"
          autoComplete="username"
        />

        <label htmlFor={passwordId} className="modalLabel">
          Password
        </label>
        <div className="passwordField">
          <input
            id={passwordId}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="modalInput"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="passwordToggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>

        <Button type="submit" fullWidth className="modalSubmit">
          Login
        </Button>
      </form>
    </Modal>
  );
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="#0047a2" strokeWidth="2" />
      <path
        d="M8 11V7a4 4 0 0 1 8 0v4"
        stroke="#0047a2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.2A9.8 9.8 0 0 1 12 5c5.5 0 9 7 9 7a13.5 13.5 0 0 1-2.6 3.4M6.6 6.6C4.3 8.1 3 12 3 12s3.5 7 9 7c1.2 0 2.3-.2 3.3-.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
