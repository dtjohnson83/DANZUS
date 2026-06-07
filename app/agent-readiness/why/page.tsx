import type { Metadata } from 'next'
import { AgentReadinessPageShell, Card, DisclaimerCard, Section } from '../AgentReadinessShell'

export const metadata: Metadata = {
  title: 'Why Agent Readiness Matters',
  description: 'Why AI-mediated discovery changes how businesses need to explain, structure, and prove their offers online.',
  alternates: { canonical: '/agent-readiness/why' },
}

export default function WhyAgentReadinessMatters() {
  return (
    <AgentReadinessPageShell>
      <Section>
        <div className="wrap ar-doc">
          <div className="ar-eyebrow">Why it matters</div>
          <h1>AI agents are becoming a third audience for your website.</h1>
          <p className="ar-lead">For years, companies optimized websites for human visitors and traditional search engines. A third audience is emerging: AI agents that classify, compare, summarize, and recommend businesses on behalf of buyers.</p>

          <h2>The shift</h2>
          <p>AI systems do not just show links. They summarize companies, compare vendors, answer buyer questions, draft shortlists, and route people toward next steps.</p>
          <p>That means a website is no longer only a destination. It is source material for AI-generated recommendations.</p>

          <h2>The common problem</h2>
          <p>Many polished websites still leave AI systems uncertain about what the company sells, who the buyer is, what use cases matter, how pricing works, or why the company should be recommended over alternatives.</p>
          <p>The result is often misclassification, not invisibility.</p>

          <div className="ar-grid-3 ar-doc-cards">
            <Card><h3>Category confusion</h3><p>AI systems may compare the company against the wrong alternatives.</p></Card>
            <Card><h3>Missing buyer context</h3><p>Pricing, implementation, security, and FAQ gaps reduce recommendation confidence.</p></Card>
            <Card><h3>Weak machine readability</h3><p>Metadata, headings, schema, sitemap, and <code>llms.txt</code> become positioning infrastructure.</p></Card>
          </div>

          <h2>The value proposition</h2>
          <p>The Agent Readiness Audit gives a business a practical view of how AI systems may interpret its public website. It shows likely classification, buyer interpretation, recommendation confidence, missing questions, and practical fixes.</p>
          <p>The goal is not to chase hype. The goal is to reduce ambiguity. A more agent-ready website is usually also a clearer website for humans.</p>

          <h2>Why now</h2>
          <p>AI-mediated buying is still early. Companies that prepare now can build clearer public source material before agent-mediated discovery becomes standard.</p>
        </div>
      </Section>
      <DisclaimerCard />
    </AgentReadinessPageShell>
  )
}
