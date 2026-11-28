import { BellRing, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import Brand from './Brand';

const HIGHLIGHTS = [
  { icon: Layers3, text: 'Every note, beautifully organised' },
  { icon: ShieldCheck, text: 'Your ideas stay yours' },
  { icon: BellRing, text: 'Reminders that keep you on track' },
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="auth-shell">
      <section className="auth-showcase">
        <div className="auth-showcase__glow auth-showcase__glow--one" />
        <div className="auth-showcase__glow auth-showcase__glow--two" />
        <div className="auth-showcase__inner">
          <Brand />
          <div className="auth-showcase__copy">
            <span className="auth-showcase__eyebrow">
              <Sparkles size={15} /> A calmer way to remember
            </span>
            <h1>
              Good ideas deserve
              <br />
              a <em>good home.</em>
            </h1>
            <p>
              Capture a thought, pin what matters, and find everything in seconds.
              Fundoo Notes keeps your workspace light and your mind clearer.
            </p>
            <ul className="auth-showcase__list">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <span className="auth-showcase__icon">
                    <Icon size={17} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <p className="auth-showcase__footnote">
            Built with React + Spring Boot · Made for focused minds
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <header className="auth-card__header">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </header>
          {children}
          {footer && <footer className="auth-card__footer">{footer}</footer>}
        </div>
      </section>
    </main>
  );
}
