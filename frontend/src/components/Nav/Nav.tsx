import type { ReactNode } from 'react';
import './Nav.css';

interface NavProps {
  logoSrc?: string;
  logoAlt?: string;
  brand?: string;
  actions?: ReactNode;
}

export default function Nav({
  logoSrc = '/DHEAT_logo.svg',
  logoAlt = 'DHET logo',
  brand = 'TVET Upload Portal',
  actions,
}: NavProps) {
  return (
    <header className="nav">
      <div className="navBrand">
        {logoSrc && <img src={logoSrc} alt={logoAlt} className="navLogo" />}
        <span className="navBrandName">{brand}</span>
      </div>

      {actions && <div className="navActions">{actions}</div>}
    </header>
  );
}
