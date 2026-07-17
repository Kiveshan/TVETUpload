import { useId, useState } from 'react';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import { api, ApiError } from '../../../lib/api';
import type { AuthUser } from '../../../types';
import './SignInModal.css';

interface SignInModalProps {
  onClose: () => void;
  onSuccess?: (user: AuthUser) => void;
}

export default function SignInModal({ onClose, onSuccess }: SignInModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const usernameId = useId();
  const passwordId = useId();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await api.post<{ user: AuthUser }>('/auth/login', { email, password });
      onSuccess?.(user);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal onClose={onClose} labelledBy="sign-in-title">
      <div className="modalIconWrap">
        <LockIcon />
      </div>

      <h2 id="sign-in-title" className="modalTitle">
        Sign in
      </h2>
      <p className="modalSubtitle">Access the TVET Management Portal</p>

      <form className="modalForm" onSubmit={handleSubmit}>
        <label htmlFor={usernameId} className="modalLabel">
          Username
        </label>
        <input
          id={usernameId}
          type="email"
          placeholder="you@gmail.com"
          className="modalInput"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
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

        {error && <p className="modalError" role="alert">{error}</p>}

        <Button type="submit" fullWidth className="modalSubmit" disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
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
