import type { Metadata } from 'next'
import { AgentReadinessPageShell, Card, DisclaimerCard, Section } from '../AgentReadinessShell'

export const metadata: Metadata = {
  title: 'Agent Readiness Methodology',
  description: 'How DANZUS Agent Readiness evaluates public websites for AI-agent legibility and recommendation confidence.',
  alternates: { canonical: '/agent-readiness/methodology' },
}

const categories = [
  'Offer clarity',
  'Buyer fit clarity',
  'Use-case specificity',
  'Evidence and trust',
  'Pricing and procurement path',
  'Implementation clarity',
  'FAQ and objection coverage',
  'GEO and machine readability',
  'Comparison readiness',
  'Risk, privacy, and compliance clarity',
]

export default function MethodologyPage() {
  return (
    <AgentReadinessPageShell>
      <Section>
        <div className="wrap ar-doc">
          <div className="ar-eyebrow">Methodology</div>
          <h1>How the Agent Readiness Audit works.</h1>
          <p className="ar-lead">The Snapshot evaluates whether public website content gives AI systems enough clear, structured information to classify, compare, and recommend a business with confidence. It includes GEO readiness: how well the site supports generative engines, AI search, copilots, and answer engines.</p>

          <h2>What is reviewed</h2>
          <p>The standard Snapshot reviews public website content only: homepage, product/service pages, pricing, about/contact, FAQ/docs/blog content when relevant, metadata, sitemap, robots, schema, and <code>llms.txt</code> if present.</p>

          <h2>What is not reviewed</h2>
          <p>Unless separately agreed, the Snapshot does not review private analytics, CRM data, logged-in pages, source code repositories, paid ad accounts, internal documents, legal/compliance controls, or security architecture.</p>

          <h2>Evaluation lens</h2>
          <p>The site is reviewed as if an AI buyer agent were trying to answer what the company sells, who it serves, when it should be recommended, what proof exists, how a buyer takes the next step, and what risks or requirements matter.</p>

          <h2>GEO readiness lens</h2>
          <p>GEO readiness is reviewed through the same practical lens: whether AI systems can extract a clear entity identity, category, buyer, use cases, proof points, comparison signals, constraints, freshness cues, and structured source material from the public site. The goal is not keyword stuffing. The goal is making the business easier for generative systems to understand accurately.</p>

          <h2>Scorecard categories</h2>
          <div className="ar-grid-2">
            {categories.map((category, index) => (
              <Card key={category}><h3>{index + 1}. {category}</h3><p>Scored from 1 to 5, then converted into the overall 100-point Agent Readiness Score.</p></Card>
            ))}
          </div>

          <h2>Recommendation confidence</h2>
          <ul>
            <li><strong>High:</strong> the site gives enough clear information for a confident recommendation.</li>
            <li><strong>Medium:</strong> the site is understandable but missing important buyer-agent context.</li>
            <li><strong>Low:</strong> the site leaves too much ambiguity for confident recommendation.</li>
            <li><strong>Very low:</strong> AI systems may struggle to classify or recommend the business accurately.</li>
          </ul>
        </div>
      </Section>
      <DisclaimerCard />
    </AgentReadinessPageShell>
  )
}
