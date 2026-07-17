import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  activeStep: number; // 1-indexed
}

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7l3.5 3.5L12 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Breadcrumb({ items, activeStep }: BreadcrumbProps) {
  return (
    <nav className="stepperContainer" aria-label="Progress steps">
      {items.map((item, index) => {
        const stepNumber = index + 1;
        const isActive   = stepNumber === activeStep;
        const isCompleted = stepNumber < activeStep;

        const circleClass = isActive
          ? 'stepCircle stepCircle--active'
          : isCompleted
          ? 'stepCircle stepCircle--completed'
          : 'stepCircle stepCircle--future';

        const nameClass = isActive
          ? 'stepName'
          : isCompleted
          ? 'stepName stepName--completed'
          : 'stepName stepName--future';

        const inner = (
          <>
            <div className={circleClass}>
              {isCompleted ? <CheckIcon /> : stepNumber}
            </div>
            <div className="stepLabels">
              <span className="stepSubLabel">Step {stepNumber}</span>
              <span className={nameClass}>{item.label}</span>
            </div>
          </>
        );

        return (
          <Fragment key={item.label}>
            {index > 0 && <div className="stepConnector" aria-hidden="true" />}

            {item.href && !isActive ? (
              <Link to={item.href} className="stepperStep stepperStep--link">
                {inner}
              </Link>
            ) : (
              <div className="stepperStep">{inner}</div>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
