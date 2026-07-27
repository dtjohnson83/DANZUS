const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DANZUS Holdings LLC',
  alternateName: 'DANZUS',
  url: 'https://danzus.co',
  logo: 'https://danzus.co/danzus-mark-512.png',
  description:
    'DANZUS builds practical AI software for trades, compliance, and physical-world operations.',
  foundingDate: '2024',
  foundingLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Folsom',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
  },
  knowsAbout: [
    'AI agents',
    'AI-native software',
    'Context engineering',
    'Large language models',
    'Claude Code',
    'Software for the trades',
    'Compliance software',
  ],
  founder: {
    '@type': 'Person',
    name: 'Dan Johnson',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    itemListElement: [
      {
        '@type': 'SoftwareApplication',
        name: 'DimeVision',
        url: 'https://dimevision.app',
        description: 'Free AI welding coach for students and apprentices',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'AgentAudit',
        url: 'https://aiagentaudit.dev',
        description: 'Compliance infrastructure for agentic AI systems',
      },
      {
        '@type': 'Product',
        name: 'Family Agent by DANZUS',
        url: 'https://danzus.co/family-agent',
        description: 'A configurable household assistant for shared calendars, Messages, and family logistics',
      },
    ],
  },
  sameAs: [],
}

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DANZUS',
  url: 'https://danzus.co',
  publisher: { '@type': 'Organization', name: 'DANZUS Holdings LLC' },
  inLanguage: 'en',
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
      />
      {/* Navigation */}
      <nav>
        <div className="wrap nav-inner">
          <div className="nav-mark">
            <img className="brand-glyph-img" src="/danzus-mark.svg" alt="" aria-hidden="true" />
            <span className="name">DANZUS</span>
          </div>
          <div className="nav-links">
            <a href="#thesis">Thesis</a>
            <a href="#work">Work</a>
            <a href="/agent-readiness">Agent Readiness</a>
            <a href="#contact">Signal</a>
          </div>
          <a className="nav-pill" href="/agent-readiness">
            Agent Readiness <span className="pill-arr">↗</span>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="hero-bg"></div>
        <div className="hero-glow"></div>
        <div className="hero-glow-2"></div>

        <div className="wrap">
          <div className="hero-top">
            <div>
              Index / 001<br />
              <strong>Operator-built AI systems</strong>
            </div>
            <div className="right">
              Folsom &middot; California &middot; MMXXIV<br />
              <strong>Privately Held</strong>
            </div>
          </div>

          <div className="wordmark">
            <div className="row"><span>DANZUS</span></div>
          </div>
          <h1 className="hero-display">
            Software for trades, compliance, and AI operations.
          </h1>
        </div>

        <div className="wrap">
          <div className="hero-foot">
            <p className="hero-statement">
              Practical systems for physical-world work.
            </p>
            <div className="hero-scroll">
              Explore
              <br />
              <span className="line"></span>
            </div>
          </div>
        </div>
      </header>

      {/* Thesis */}
      <section className="block thesis" id="thesis">
        <div className="wrap">
          <div className="thesis-head">
            <div>
              <div className="idx">&sect; 002 / Thesis</div>
            </div>
            <h2 className="h-display">
              Operating thesis.
            </h2>
          </div>

          <div className="thesis-numbers">
            <div className="thesis-pillar">
              <span className="pillar-num">i.</span>
              <h3 className="pillar-title">Agents become the interface.</h3>
              <p className="pillar-body">
                Software will act on behalf of people and businesses. It needs audit trails, policy, and control.
              </p>
            </div>
            <div className="thesis-pillar">
              <span className="pillar-num">ii.</span>
              <h3 className="pillar-title">Intelligence moves to the device.</h3>
              <p className="pillar-body">
                The best AI tools belong where the work happens: shops, classrooms, job sites, and vehicles.
              </p>
            </div>
            <div className="thesis-pillar">
              <span className="pillar-num">iii.</span>
              <h3 className="pillar-title">Operators need better software.</h3>
              <p className="pillar-body">
                Welders, drivers, electricians, and inspectors need tools built around real operating conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="block portfolio" id="work">
        <div className="wrap">
          <div className="portfolio-head">
            <div>
              <div className="idx">&sect; 003 / Work</div>
              <h2 className="h-display">
                Shipped work.
              </h2>
            </div>
            <div className="portfolio-meta">
              Active Ventures<br />
              <strong>Seven / 07</strong>
            </div>
          </div>

          <div className="work-list">
            <a className="work" href="https://dimevision.app" target="_blank" rel="noopener">
              <div className="w-num">/01</div>
              <div className="w-name">DimeVision <em>(incl. BeadBuilder)</em></div>
              <div className="w-desc">
                AI weld coaching, bead scoring, and GMAW simulation for students and apprentices.
              </div>
              <div className="w-tags">
                <span className="live">Live</span>
                <span>Mobile</span>
                <span>Vision</span>
                <span>Trades</span>
              </div>
              <div className="w-arrow">&rarr;</div>
            </a>

            <a className="work" href="https://aiagentaudit.dev" target="_blank" rel="noopener">
              <div className="w-num">/02</div>
              <div className="w-name">Agent Audit Trail</div>
              <div className="w-desc">
                Tamper-evident AI agent logs, policy checks, and MCP infrastructure.
              </div>
              <div className="w-tags">
                <span className="live">Live</span>
                <span>MCP</span>
                <span>Compliance</span>
                <span>Infra</span>
              </div>
              <div className="w-arrow">&rarr;</div>
            </a>

            <a className="work" href="https://osha-mcp.vercel.app" target="_blank" rel="noopener">
              <div className="w-num">/03</div>
              <div className="w-name">OSHA Compliance MCP</div>
              <div className="w-desc">
                Structured OSHA standards for compliance-aware AI agents.
              </div>
              <div className="w-tags">
                <span className="live">Live</span>
                <span>MCP</span>
                <span>Compliance</span>
              </div>
              <div className="w-arrow">&rarr;</div>
            </a>

            <a className="work" href="https://dot-mcp.vercel.app" target="_blank" rel="noopener">
              <div className="w-num">/04</div>
              <div className="w-name">DOT / FMCSA MCP</div>
              <div className="w-desc">
                FMCSA rules, hours-of-service logic, and inspection criteria for transport agents.
              </div>
              <div className="w-tags">
                <span className="live">Live</span>
                <span>MCP</span>
                <span>Transport</span>
              </div>
              <div className="w-arrow">&rarr;</div>
            </a>

            <a className="work" href="/agent-readiness">
              <div className="w-num">/05</div>
              <div className="w-name">Agent Readiness <em>Audit</em></div>
              <div className="w-desc">
                A practical audit of how AI systems read and evaluate a business online.
              </div>
              <div className="w-tags">
                <span className="live">Live</span>
                <span>Audit</span>
                <span>AI Discovery</span>
              </div>
              <div className="w-arrow">&rarr;</div>
            </a>

            <a className="work" href="/contextkit">
              <div className="w-num">/06</div>
              <div className="w-name">ContextKit</div>
              <div className="w-desc">
                A free guide for turning chatbots into working agents with files, skills, and context.
              </div>
              <div className="w-tags">
                <span className="live">Live</span>
                <span>Free</span>
                <span>Education</span>
              </div>
              <div className="w-arrow">&rarr;</div>
            </a>

            <a className="work" href="/family-agent">
              <div className="w-num">/07</div>
              <div className="w-name">Family Agent</div>
              <div className="w-desc">
                A configurable household assistant for shared calendars, Messages, and family logistics.
              </div>
              <div className="w-tags">
                <span>Pilot</span>
                <span>Family</span>
                <span>Agents</span>
              </div>
              <div className="w-arrow">&rarr;</div>
            </a>
          </div>
        </div>
      </section>

      {/* Operator */}
      <section className="block operator" id="operator">
        <div className="wrap">
          <div className="idx">&sect; 004 / Operator</div>
          <h2 className="h-display">
            Who&apos;s behind this.
          </h2>

          <div className="op-grid">
            <div className="op-prose">
              <p>
                DANZUS is built from aircraft maintenance, subsea QA, enterprise analytics, and applied AI systems.
              </p>
              <p>
                The throughline is <em>standards, repeatability, and practical execution</em>.
              </p>
              <p>The work focuses on problems most AI companies ignore: trades, compliance, and operators.</p>
            </div>

            <div className="op-card">
              <div className="op-name">Dan Johnson</div>
              <div className="op-handle">Founder &middot; DANZUS Holdings</div>
              <div className="cv">
                <div className="cv-row">
                  <div className="cv-year">2024 &rarr;</div>
                  <div className="cv-body">
                    <strong>DANZUS Holdings</strong>
                    <span>Founder</span>
                  </div>
                </div>
                <div className="cv-row">
                  <div className="cv-year">2024 &rarr;</div>
                  <div className="cv-body">
                    <strong>Applied AI Systems</strong>
                    <span>Enterprise data, AI implementation, and operational software</span>
                  </div>
                </div>
                <div className="cv-row">
                  <div className="cv-year">2016—24</div>
                  <div className="cv-body">
                    <strong>Magnit / PRO Unlimited</strong>
                    <span>Analytics Manager, Strategic Advisory</span>
                  </div>
                </div>
                <div className="cv-row">
                  <div className="cv-year">2013—15</div>
                  <div className="cv-body">
                    <strong>PPI / Chevron Wheatstone</strong>
                    <span>QA/QC, Subsea Systems &middot; Perth, AU</span>
                  </div>
                </div>
                <div className="cv-row">
                  <div className="cv-year">2002—12</div>
                  <div className="cv-body">
                    <strong>Royal Australian Air Force</strong>
                    <span>Aircraft Maintenance Engineer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact" id="contact">
        <div className="contact-glow"></div>
        <div className="wrap">
          <div className="idx">&sect; 005 / Signal</div>
          <h2 className="contact-mega">
            <span className="l1">Say hello.</span>
          </h2>

          <div className="contact-channels">
            <a className="ch" href="/agent-readiness">
              <div className="ch-label">Service &middot; Live</div>
              <div className="ch-value">
                Agent Readiness <span className="arr">→</span>
              </div>
            </a>
            <a className="ch" href="mailto:dan@danzus.co?subject=DANZUS%20inquiry">
              <div className="ch-label">Email &middot; Contact</div>
              <div className="ch-value">
                dan@danzus.co <span className="arr">↗</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="wrap footer-inner">
          <div>&copy; MMXXVI &middot; DANZUS Holdings LLC &middot; Folsom, California</div>
          <div className="mark">Danzus</div>
        </div>
      </footer>
    </>
  )
}
