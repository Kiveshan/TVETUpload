import './Footer.css';

interface FooterProps {
  text?: string;
}

export default function Footer({ text = 'TVET Management Portal' }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footerText">
        © {year} {text}
      </p>
    </footer>
  );
}
