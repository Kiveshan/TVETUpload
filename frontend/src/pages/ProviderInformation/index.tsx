import { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../../layouts/PortalLayout/PortalLayout';
import Button from '../../components/Button/Button';
import { useAuth } from '../../auth/useAuth';
import { api } from '../../lib/api';
import { PATHS } from '../../routes/paths';
import './ProviderInformation.css';

const STEPS = [
  { number: 'Step 1', title: 'Provider' },
  { number: 'Step 2', title: 'College Upload' },
  { number: 'Step 3', title: 'Summary & Confirmation' },
];

const STORAGE_KEY = 'tvet_provider_form';

function loadSaved() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as { provider: string; fullName: string; email: string; contact: string };
  } catch { /* ignore */ }
  return { provider: '', fullName: '', email: '', contact: '' };
}

function validateSAPhone(val: string): string {
  if (!val.trim()) return '';
  const stripped = val.replace(/[\s\-()]/g, '');
  if (!/^(\+27|0)[0-9]{9}$/.test(stripped)) {
    return 'Enter a valid SA number (e.g. 071 234 5678 or +27 71 234 5678)';
  }
  return '';
}

export default function ProviderInformation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const saved = loadSaved();

  const [provider] = useState(saved.provider || user?.providerName || '');
  const [fullName, setFullName] = useState(saved.fullName || user?.fullName || '');
  const [email, setEmail]       = useState(saved.email || user?.email || '');
  const [contact, setContact] = useState(saved.contact);

  const providerId  = useId();
  const fullNameId  = useId();
  const emailId     = useId();
  const contactId   = useId();

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ provider, fullName, email, contact }));
  }, [provider, fullName, email, contact]);

  const phoneError = contact.trim() ? validateSAPhone(contact) : '';
  const phoneValid = !phoneError;

  const isComplete =
    provider.trim() !== '' &&
    fullName.trim() !== '' &&
    email.trim() !== '' &&
    contact.trim() !== '' &&
    phoneValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phoneError) return;
    try {
      await api.patch('/auth/contact', { contactNumber: contact });
    } catch { /* non-blocking — navigate regardless */ }
    navigate(PATHS.collegeUpload);
  }

  return (
    <PortalLayout>
      <ol className="stepper">
        {STEPS.map((step, index) => (
          <li key={step.title} className="stepItem" style={{ display: 'contents' }}>
            <div className={`step${index === 0 ? ' stepActive' : ''}`}>
              <span className="stepCircle">{index + 1}</span>
              <span className="stepLabel">
                <span className="stepNumber">{step.number}</span>
                <span className="stepTitle">{step.title}</span>
              </span>
            </div>
            {index < STEPS.length - 1 && <span className="stepConnector" />}
          </li>
        ))}
      </ol>

      <section className="providerCard">
        <h1 className="providerCardTitle">Provider Information</h1>
        <p className="providerCardSubtitle">Please complete all fields to continue.</p>

        <form onSubmit={handleSubmit}>
          <div className="providerGrid">
            <div className="providerField">
              <label htmlFor={providerId} className="providerLabel">
                Provider Name <span className="providerRequired">*</span>
              </label>
              <input
                id={providerId}
                type="text"
                className="providerInput providerInput--readonly"
                value={provider}
                readOnly
              />
            </div>

            <div className="providerField">
              <label htmlFor={fullNameId} className="providerLabel">
                Full Name <span className="providerRequired">*</span>
              </label>
              <input
                id={fullNameId}
                type="text"
                className="providerInput"
                placeholder="e.g. Thabo Mokoena"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="providerField">
              <label htmlFor={emailId} className="providerLabel">
                Email Address <span className="providerRequired">*</span>
              </label>
              <input
                id={emailId}
                type="email"
                className="providerInput"
                placeholder="name@dhet.gov.za"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="providerField">
              <label htmlFor={contactId} className="providerLabel">
                Contact Number <span className="providerRequired">*</span>
              </label>
              <input
                id={contactId}
                type="tel"
                className={`providerInput${phoneError ? ' providerInput--error' : ''}`}
                placeholder="+27 71 234 5678"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
              {phoneError && (
                <span className="providerError">{phoneError}</span>
              )}
            </div>
          </div>

          <div className="providerActions">
            <Button
              type="submit"
              className={`providerNext${isComplete ? ' providerNext--active' : ''}`}
              icon={<ArrowRightIcon />}
              disabled={!isComplete}
            >
              Next
            </Button>
          </div>
        </form>
      </section>
    </PortalLayout>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
