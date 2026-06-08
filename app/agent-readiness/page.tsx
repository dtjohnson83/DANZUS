import type { Metadata } from 'next'
import Link from 'next/link'
import { AgentReadinessPageShell, Card, DisclaimerCard, Section } from './AgentReadinessShell'

export const metadata: Metadata = {
  title: 'AI Buyer Readiness & Agent Readiness Audit',
  description:
    'DANZUS reviews whether AI search tools, answer engines, copilots, and buyer agents can correctly find, understand, compare, and recommend your business.',
  keywords: [
    'AI buyer readiness',
    'agent readiness audit',
    'AI search readiness',
    'generative engine optimization readiness',
    'GEO readiness audit',
    'AI visibility audit',
    'AI buyer journey',
    'answer engine optimization',
    'AI recommendation readiness',
    'llms.txt audit',
  ],
  alternates: { canonical: '/agent-readiness' },
  openGraph: {
    title: 'AI Buyer Readiness & Agent Readiness Audit',
    description:
      'Check whether AI search tools, answer engines, copilots, and buyer agents can correctly understand, compare, and recommend your business.',
    url: 'https://danzus.co/agent-readiness',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DANZUS AI Buyer Readiness' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Buyer Readiness & Agent Readiness Audit',
    description:
      'Check whether AI search tools and buyer agents can correctly understand, compare, and recommend your business.',
    images: ['/og-image.png'],
  },
}

const SERVICE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Buyer Readiness & Agent Readiness Audit',
  alternateName: ['AI Buyer Readiness Audit', 'Agent Readiness Snapshot', 'GEO Readiness Audit'],
  serviceType: ['AI Buyer Readiness Audit', 'Agent Readiness Snapshot', 'GEO Readiness Audit'],
  provider: { '@type': 'Organization', name: 'DANZUS Holdings LLC', url: 'https://danzus.co' },
  url: 'https://danzus.co/agent-readiness',
  description:
    'A practical review of whether AI search tools, answer engines, copilots, and buyer agents can correctly find, classify, compare, and recommend a business based on public website content.',
  offers: {
    '@type': 'Offer',
    price: '149',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
}

export default function AgentReadinessHome() {
  return (
    <AgentReadinessPageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSONLD) }} />
      <header className="ar-hero">
        <div className="wrap ar-hero-grid">
          <div className="ar-hero-copy">
            <div className="ar-eyebrow">AI Buyer Readiness &amp; Agent Readiness Audit by DANZUS Holdings LLC</div>
            <h1>Will AI buyers understand and recommend your business?</h1>
            <p className="ar-lead">
              The Agent Readiness Snapshot reviews how AI search tools, answer engines, copilots, and buyer agents may find, classify, compare, and recommend your company based on public website content.
            </p>
            <div className="ar-actions">
              <a className="ar-btn ar-btn-primary" href="mailto:dan@dimevision.app?subject=Agent%20Readiness%20Snapshot">
                Request or unlock a report
              </a>
              <Link className="ar-btn ar-btn-secondary" href="/agent-readiness/sample-report">
                View sample report
              </Link>
            </div>
          </div>

          <div className="ar-video-card" aria-label="AI Buyer Readiness Audit explainer video">
            <div className="ar-video-frame">
              <video
                className="ar-video"
                src="/video/danzus-ai-buyer-readiness-mobile-v6.mp4"
                poster="/video/danzus-ai-buyer-readiness-mobile-v6-poster.jpg"
                controls
                playsInline
                preload="metadata"
              />
            </div>
            <div className="ar-video-caption">
              69-second walkthrough: how DANZUS checks whether AI buyers can find, explain, trust, and recommend your business.
            </div>
          </div>
        </div>
      </header>

      <Section>
        <div className="wrap ar-grid-2">
          <div>
            <h2>AI systems are becoming part of the buyer journey.</h2>
            <p>
              Buyers increasingly use AI-powered search tools, copilots, and assistants to research vendors, compare options, draft shortlists, and prepare questions before speaking to sales. That makes GEO readiness, or generative engine optimization readiness, part of the buyer journey.
            </p>
          </div>
          <Card>
            <h3>The risk is not just invisibility. It is misclassification.</h3>
            <p>
              A polished website can still leave AI systems uncertain about what the company sells, who it serves, what proof exists, how implementation works, or why it should be recommended over alternatives.
            </p>
          </Card>
        </div>
      </Section>

      <Section className="ar-dark">
        <div className="wrap">
          <h2>What the Snapshot includes</h2>
          <div className="ar-grid-3">
            <Card>
              <h3>Agent Readiness Score</h3>
              <p>A 100-point score across offer clarity, buyer fit, evidence, pricing path, GEO readiness, machine readability, and risk clarity.</p>
            </Card>
            <Card>
              <h3>AI interpretation summary</h3>
              <p>How AI systems may classify your company, identify your buyer, and evaluate recommendation confidence.</p>
            </Card>
            <Card>
              <h3>Practical fixes</h3>
              <p>Page-level observations, top recommended changes, suggested copy improvements, GEO-oriented content gaps, and a starter <code>llms.txt</code> draft.</p>
            </Card>
          </div>
        </div>
      </Section>

      <Section>
        <div className="wrap ar-grid-2">
          <div>
            <h2>Methodology</h2>
            <p>The Snapshot uses public website content only and reviews how an AI buyer agent may interpret the business.</p>
          </div>
          <div className="ar-steps">
            <div className="ar-step"><h3>Review public content</h3><p>Homepage, product pages, pricing, FAQ/docs, metadata, sitemap/schema, and <code>llms.txt</code> if present.</p></div>
            <div className="ar-step"><h3>Score 10 categories</h3><p>Offer clarity, buyer fit, use cases, evidence, procurement path, implementation, FAQ, GEO and machine readability, comparison readiness, and risk clarity.</p></div>
            <div className="ar-step"><h3>Recommend fixes</h3><p>Translate findings into practical copy, structure, and machine-readability improvements.</p></div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="wrap ar-grid-2">
          <Card>
            <h3>Introductory unlock price</h3>
            <div className="ar-price">$149</div>
            <p>For a pre-generated Agent Readiness Snapshot based on public website content.</p>
          </Card>
          <div>
            <h2>What happens after unlock?</h2>
            <ul>
              <li>You receive the full report and starter <code>llms.txt</code> draft by email.</li>
              <li>If the report does not contain useful, company-specific findings, reply within 7 days for a refund.</li>
              <li>If you want the fixes implemented, request an Agent-Ready Implementation Sprint.</li>
            </ul>
          </div>
        </div>
      </Section>

      <DisclaimerCard />
    </AgentReadinessPageShell>
  )
}
