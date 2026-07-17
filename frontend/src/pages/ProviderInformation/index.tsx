import { useId, useState } from 'react';
import PortalLayout from '../../layouts/PortalLayout/PortalLayout';
import Button from '../../components/Button/Button';
import './ProviderInformation.css';

const PROVIDERS = ['Coltech', 'ITS', 'Academia', 'Thusanang'] as const;

const STEPS = [
  { number: 'Step 1', title: 'Provider' },
  { number: 'Step 2', title: 'College Upload' },
  { number: 'Step 3', title: 'Summary & Confirmation' },
];

export default function ProviderInformation() {
  const [provider, setProvider] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  const providerId = useId();
  const fullNameId = useId();
  const emailId = useId();
  const contactId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Proceed to the next step (College Upload).
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
              <select
                id={providerId}
                className={`providerSelect${provider ? ' hasValue' : ''}`}
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select provider
                </option>
                {PROVIDERS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
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
                className="providerInput"
                placeholder="+27 12 345 6789"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="providerActions">
            <Button type="submit" className="providerNext" icon={<ArrowRightIcon />}>
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
