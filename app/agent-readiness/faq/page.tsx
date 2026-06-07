import type { Metadata } from 'next'
import { AgentReadinessPageShell, Card, DisclaimerCard, Section } from '../AgentReadinessShell'

export const metadata: Metadata = {
  title: 'Agent Readiness FAQ',
  description: 'Frequently asked questions about the Agent Readiness Snapshot by DANZUS Holdings LLC.',
  alternates: { canonical: '/agent-readiness/faq' },
}

const faqs = [
  ['What is an Agent Readiness Audit?', 'A review of whether AI systems can clearly classify, evaluate, compare, and recommend a business based on public website content.'],
  ['Is this SEO or GEO?', 'It overlaps with GEO, or generative engine optimization, but it is not a generic SEO package. Traditional SEO focuses on rankings, traffic, backlinks, and keywords. Agent Readiness focuses on whether AI systems can accurately understand, classify, compare, and recommend the business once they encounter the website.'],
  ['Is the report automated?', 'The Snapshot uses a repeatable review process and templates, but reports should be manually quality-gated before outreach. A teaser should not be sent unless it includes specific findings from the actual website.'],
  ['What data is used?', 'Public website content only: homepage, product/service pages, pricing, FAQ/docs/blog content when relevant, metadata, sitemap, robots, schema, and llms.txt if present.'],
  ['What do we get after payment?', 'The full Snapshot includes an Agent Readiness Score, GEO readiness findings, likely AI classification, recommendation confidence, page-level observations, top fixes, suggested copy improvements, and a starter llms.txt draft.'],
  ['Does this guarantee AI systems will recommend us?', 'No. The audit identifies clarity and machine-readability gaps that may affect interpretation, but it does not guarantee ranking or recommendation behavior by any specific AI system.'],
  ['Can we request no further contact?', 'Yes. If a company does not want follow-up, DANZUS marks it as do-not-contact and stops outreach.'],
  ['What if the report is not useful?', 'During the MVP, if the full Snapshot does not provide useful, company-specific findings, reply within 7 days and DANZUS will refund the report fee.'],
]

export default function FaqPage() {
  return (
    <AgentReadinessPageShell>
      <Section>
        <div className="wrap ar-doc">
          <div className="ar-eyebrow">FAQ</div>
          <h1>Questions buyers should be able to answer before unlocking a report.</h1>
          <p className="ar-lead">The offer is designed to be specific, transparent, and based on public website content only.</p>
          <div className="ar-faq-list">
            {faqs.map(([question, answer]) => (
              <Card key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>
      <DisclaimerCard />
    </AgentReadinessPageShell>
  )
}
