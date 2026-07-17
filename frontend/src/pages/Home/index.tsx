import { useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Nav from '../../components/Nav/Nav';
import { useAuth } from '../../auth/AuthContext';
import type { AuthUser } from '../../types';
import { PATHS } from '../../routes/paths';
import './Home.css';
import SignInModal from '../Authentication/SignInModal';

export default function Home() {
  const [signInOpen, setSignInOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleLoginSuccess(user: AuthUser) {
    flushSync(() => { login(user); });
    navigate(PATHS.providerInformation);
  }

  return (
    <main className="home">
      <Nav />

      <section className="hero">
        <div className="heroInner">
          <div className="heroContent">
            <span className="badge">
              <span className="badgeDot" />
              Technical and Vocational Education and Training
            </span>

            <h1 className="title">
              Upload TVET College
              <br />
              Data Securely
            </h1>

            <p className="subtitle">
              Submit provider, college, student, staff and programme data
              through a secure guided upload process.
            </p>

            <div className="loginButtonWrap">
              <Button icon={<ArrowRightIcon />} onClick={() => setSignInOpen(true)}>
                Login
              </Button>
            </div>
          </div>

          <div className="heroVisual">
            <img
              src="/HomePage_Pic.png"
              alt="Upload illustration showing a drag-and-drop file upload panel"
              className="heroImage"
            />
          </div>
        </div>
      </section>

      {signInOpen && (
        <SignInModal
          onClose={() => setSignInOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </main>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
