import type { ReactNode } from 'react'
import Link from 'next/link'

const navItems = [
  { href: '/agent-readiness', label: 'Overview' },
  { href: '/agent-readiness/why', label: 'Why it matters' },
  { href: '/agent-readiness/methodology', label: 'Methodology' },
  { href: '/agent-readiness/sample-report', label: 'Sample report' },
  { href: '/agent-readiness/faq', label: 'FAQ' },
]

export function AgentReadinessNav() {
  return (
    <nav className="ar-nav">
      <div className="wrap ar-nav-inner">
        <Link className="ar-brand" href="/agent-readiness">
          DANZUS Agent Readiness
        </Link>
        <div className="ar-nav-links">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export function AgentReadinessFooter() {
  return (
    <footer className="ar-footer">
      <div className="wrap ar-footer-inner">
        <div>DANZUS Agent Readiness · A service from DANZUS Holdings LLC</div>
        <Link href="/">DANZUS.co</Link>
      </div>
    </footer>
  )
}

export function AgentReadinessPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="agent-readiness-page">
      <AgentReadinessNav />
      {children}
      <AgentReadinessFooter />
    </div>
  )
}

export function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`ar-section ${className}`}>{children}</section>
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="ar-card">{children}</div>
}

export function DisclaimerCard() {
  return (
    <Section>
      <div className="wrap">
        <div className="ar-card ar-disclaimer">
          <h2>Important note</h2>
          <p>
            The Agent Readiness Snapshot is based on publicly available website content and practical
            AI-agent evaluation heuristics. It is not legal, compliance, cybersecurity, or SEO advice,
            and it does not guarantee ranking or recommendation behavior by any specific AI system.
          </p>
        </div>
      </div>
    </Section>
  )
}
