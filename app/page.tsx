const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DANZUS Holdings LLC',
  alternateName: 'DANZUS',
  url: 'https://danzus.co',
  logo: 'https://danzus.co/icon.svg',
  description:
    'A privately held software studio building AI-native products for the trades, compliance, and the operators who run the physical world.',
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
            <span className="dot"></span>
            <span className="name">DANZUS</span>
          </div>
          <div className="nav-links">
            <a href="#thesis">Thesis</a>
            <a href="#work">Work</a>
            <a href="#operator">Operator</a>
            <a href="#contact">Signal</a>
          </div>
          <a className="nav-pill" href="/contextkit">
            ContextKit <span className="pill-arr">↗</span>
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
              <strong>Applying two decades of experience to frontier AI</strong>
            </div>
            <div className="right">
              Folsom &middot; California &middot; MMXXIV<br />
              <strong>Privately Held</strong>
            </div>
          </div>

          <div className="wordmark">
            <div className="row"><span>DANZUS</span></div>
          </div>
          <div className="wordmark-tagline">builds quietly</div>
          <div className="wordmark-etymology">
            <span className="ety-d">D</span> &middot;{' '}
            <span className="ety-a">AU</span> &middot;{' '}
            <span className="ety-nz">NZ</span> &middot;{' '}
            <span className="ety-us">US</span>
          </div>

          <h1 className="hero-display">
            AI-native software for the trades, compliance, and the operators who run the physical world.
          </h1>
        </div>

        <div className="wrap">
          <div className="hero-foot">
            <p className="hero-statement">
              A privately held software studio. Six active projects across AI, compliance, and the trades.
            </p>
            <div className="hero-scroll">
              Scroll to explore
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
              Three beliefs.
            </h2>
          </div>

          <div className="thesis-numbers">
            <div className="thesis-pillar">
              <span className="pillar-num">i.</span>
              <h3 className="pillar-title">Agents become the interface.</h3>
              <p className="pillar-body">
                The next layer of the internet is mediated by software that acts on our behalf. The infrastructure that makes those agents auditable, governable, and trustworthy is undervalued and under-built.
              </p>
            </div>
            <div className="thesis-pillar">
              <span className="pillar-num">ii.</span>
              <h3 className="pillar-title">Intelligence moves to the device.</h3>
              <p className="pillar-body">
                Inference belongs where the work happens. The applications that matter in the next decade are designed for real environments — workshops, job sites, classrooms, the cabs of trucks.
              </p>
            </div>
            <div className="thesis-pillar">
              <span className="pillar-num">iii.</span>
              <h3 className="pillar-title">Operators need better software.</h3>
              <p className="pillar-body">
                Robots are the future of the factory. Humans are the future of the infrastructure. The next generation of welders, drivers, electricians and inspectors deserves software built for the way the work actually happens.
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
                What we&apos;ve shipped.
              </h2>
            </div>
            <div className="portfolio-meta">
              Active Ventures<br />
              <strong>Six / 06</strong>
            </div>
          </div>

          <div className="work-list">
            <a className="work" href="https://dimevision.app" target="_blank" rel="noopener">
              <div className="w-num">/01</div>
              <div className="w-name">DimeVision <em>(incl. BeadBuilder)</em></div>
              <div className="w-desc">
                An AI mentor for welders. Computer vision scores beads on a phone, Danny Dime coaches in plain English, and BeadBuilder simulates GMAW before students ever strike an arc.
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
                A tamper-evident logging layer for AI agents. Hash-chained records and a policy engine, delivered as an MCP server. Built for SMBs facing Colorado SB{'\u00A0'}205 and the EU AI Act.
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
                A Model Context Protocol server giving AI agents structured access to OSHA standards. Open infrastructure for compliance-aware automation in the trades.
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
                The same playbook applied to commercial transport. Federal motor carrier rules, hours-of-service logic, and inspection criteria — exposed to agents that need them in the cab and the back office.
              </div>
              <div className="w-tags">
                <span className="live">Live</span>
                <span>MCP</span>
                <span>Transport</span>
              </div>
              <div className="w-arrow">&rarr;</div>
            </a>

            <a className="work" href="#">
              <div className="w-num">/05</div>
              <div className="w-name">Ed <em>(clawdbot)</em></div>
              <div className="w-desc">
                An in-house operator agent running on a Mac Mini M4. Handles routine engineering work across the portfolio under a tiered architecture that reserves higher-judgment tasks for Claude.
              </div>
              <div className="w-tags">
                <span className="live">Internal</span>
                <span>Agent</span>
                <span>Local AI</span>
              </div>
              <div className="w-arrow">&rarr;</div>
            </a>

            <a className="work" href="/contextkit">
              <div className="w-num">/06</div>
              <div className="w-name">ContextKit</div>
              <div className="w-desc">
                A free interactive guide to the chatbot-to-agent paradigm shift. Write core files and skills that turn any AI — ChatGPT, Claude, Gemini, Cursor, Claude Code, or OpenClaw — into an agent that does the work, not just answers questions.
              </div>
              <div className="w-tags">
                <span className="live">Live</span>
                <span>Free</span>
                <span>Education</span>
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
                Five industries across three countries. Aircraft maintenance in the Royal Australian Air Force. Subsea quality assurance on Chevron&apos;s Wheatstone project in Western Australia. Eight years building analytics and workforce strategy for Fortune 500 companies in the US. Data visualization. And now, AI-native software.
              </p>
              <p>
                The throughline is <em>standards, repeatability, and close attention to what actually works</em> — applied creatively to whatever frontier technology makes the work better.
              </p>
              <p>DANZUS is the holding structure. The work is experimental — applying hard-won experience from hangars, job sites, and enterprise data to problems most AI companies aren&apos;t looking at.</p>
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
                    <strong>App Orchid</strong>
                    <span>Data Visualization Lead</span>
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
            <a className="ch" href="https://www.linkedin.com/in/danjohnsondata" target="_blank" rel="noopener">
              <div className="ch-label">LinkedIn &middot; Professional</div>
              <div className="ch-value">
                /in/danjohnsondata <span className="arr">↗</span>
              </div>
            </a>
            <a className="ch" href="https://dimevision.app" target="_blank" rel="noopener">
              <div className="ch-label">Flagship &middot; Live</div>
              <div className="ch-value">
                dimevision.app <span className="arr">↗</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Our Products */}
      <section className="block" id="products">
        <div className="wrap">
          <div className="idx">&sect; 006 / Products</div>
          <h2 className="h-display">Our Products</h2>

          <div className="work-list">
            <a className="work" href="https://dimevision.app" target="_blank" rel="noopener">
              <div className="w-num">/01</div>
              <div className="w-name">DimeVision &mdash; AI Welding Coach</div>
              <div className="w-desc">
                Free AI-powered weld analysis for trade students and apprentices. Upload a photo, get instant quality scores and defect detection.
              </div>
              <div className="w-tags">
                <span className="live">Live</span>
                <span>Trades</span>
                <span>Vision</span>
              </div>
              <div className="w-arrow">&rarr;</div>
            </a>

            <a className="work" href="https://aiagentaudit.dev" target="_blank" rel="noopener">
              <div className="w-num">/02</div>
              <div className="w-name">AgentAudit &mdash; AI Compliance Infrastructure</div>
              <div className="w-desc">
                Cryptographically immutable audit logs for AI agents in regulated industries. Tamper-evident, chain-verified, and compliance-ready.
              </div>
              <div className="w-tags">
                <span className="live">Live</span>
                <span>Compliance</span>
                <span>Infra</span>
              </div>
              <div className="w-arrow">&rarr;</div>
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
