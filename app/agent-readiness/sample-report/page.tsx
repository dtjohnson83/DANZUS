import type { Metadata } from 'next'
import { AgentReadinessPageShell, Card, DisclaimerCard, Section } from '../AgentReadinessShell'

export const metadata: Metadata = {
  title: 'Sample Agent Readiness Snapshot',
  description: 'A sanitized sample report showing what an Agent Readiness Snapshot includes.',
  alternates: { canonical: '/agent-readiness/sample-report' },
}

export default function SampleReportPage() {
  return (
    <AgentReadinessPageShell>
      <Section>
        <div className="wrap ar-doc">
          <div className="ar-eyebrow">Sample report</div>
          <h1>Sample Agent Readiness Snapshot</h1>
          <p className="ar-lead">This public sample illustrates the structure and type of findings included in a Snapshot. Real reports are based on the reviewed company&apos;s public website content.</p>

          <div className="ar-report-summary">
            <Card><h3>Overall score</h3><div className="ar-price">64/100</div></Card>
            <Card><h3>Recommendation confidence</h3><div className="ar-price ar-price-small">Medium</div></Card>
            <Card><h3>Likely classification</h3><p>B2B workflow automation platform</p></Card>
          </div>

          <h2>Executive summary</h2>
          <p>SampleCo has a visible product category and credible messaging, but an AI buyer agent would need to infer too much about buyer fit, implementation requirements, pricing, and proof.</p>

          <h2>What AI agents likely understand</h2>
          <ul>
            <li><strong>Business category:</strong> B2B software</li>
            <li><strong>Primary offer:</strong> workflow automation platform</li>
            <li><strong>Target buyer:</strong> operations leader at a mid-market company</li>
            <li><strong>Main CTA:</strong> request demo</li>
          </ul>

          <h2>What AI agents may misunderstand</h2>
          <ul>
            <li>The company may be classified too broadly as generic automation software.</li>
            <li>The ideal buyer is not explicit enough.</li>
            <li>Comparison criteria against adjacent products are unclear.</li>
            <li>Pricing, pilot, security, and implementation details are missing or scattered.</li>
          </ul>

          <h2>Top recommended fixes</h2>
          <ul>
            <li>Rewrite the homepage headline around the buyer outcome.</li>
            <li>Add one buyer-specific landing page.</li>
            <li>Add pricing, pilot, or procurement path language.</li>
            <li>Add an implementation FAQ.</li>
            <li>Publish an <code>llms.txt</code> file.</li>
          </ul>

          <h2>Sample llms.txt excerpt</h2>
          <pre>{`# SampleCo

SampleCo is a B2B workflow automation platform for mid-market operations teams.

## Primary buyers
- Operations leaders
- Revenue operations teams
- Customer success operations teams

## Primary use cases
- recurring workflow automation
- approvals and task routing
- operational reporting
- cross-functional handoffs`}</pre>
        </div>
      </Section>
      <DisclaimerCard />
    </AgentReadinessPageShell>
  )
}
