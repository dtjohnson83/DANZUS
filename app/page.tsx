export default function Home() {
  return (
    <>
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
              <strong>A studio for the agent era</strong>
            </div>
            <div className="right">
              Folsom &middot; California &middot; MMXXIV<br />
              <strong>Privately Held</strong>
            </div>
          </div>

          <div className="wordmark">
            <div className="row"><span>Danzus</span></div>
            <div className="row"><span>builds</span></div>
            <div className="row"><span>quietly.</span></div>
          </div>
        </div>

        <div className="wrap">
          <div className="hero-foot">
            <p className="hero-statement">
              A privately held software studio shipping AI-native products for the trades, the compliance layer, and the operators who keep the physical world running.{' '}
              <em>No decks. No promises. Just things that ship.</em>
            </p>
            <div className="hero-scroll">
              Scroll to enter
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
              Two beliefs.<br />
              One <em>decade</em> of execution.
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
                Inference belongs where the work happens. The applications that win the next decade are designed for real environments — workshops, job sites, classrooms, the cabs of trucks.
              </p>
            </div>
            <div className="thesis-pillar">
              <span className="pillar-num">iii.</span>
              <h3 className="pillar-title">Operators inherit the future.</h3>
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
                Built. Shipped.<br />
                <em>Still moving.</em>
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
                A Model Context Protocol server giving AI agents structured access to OSHA standards. First-mover infrastructure for compliance-aware automation in the trades.
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
                An in-house operator agent running on a Mac Mini M4. Handles routine engineering work across the portfolio under a tiered architecture that reserves higher-judgment tasks for Claude. The studio&apos;s force multiplier.
              </div>
              <div className="w-tags">
                <span className="live">Internal</span>
                <span>Agent</span>
                <span>Local AI</span>
              </div>
              <div className="w-arrow">&rarr;</div>
            </a>

            <a className="work" href="/context">
              <div className="w-num">/06</div>
              <div className="w-name">ContextKit</div>
              <div className="w-desc">
                A free interactive tool that teaches anyone how to organize their AI assistant&apos;s memory. Explore a working setup, simulate how skills fire, or build your own config.
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
            Built by someone<br />
            who&apos;s done <em>the work.</em>
          </h2>

          <div className="op-grid">
            <div className="op-prose">
              <p>
                An <strong>AI-native builder</strong> with two decades on the line — aircraft maintenance in the Royal Australian Air Force, subsea quality assurance on Chevron&apos;s Wheatstone project, and eight years building analytics for Fortune 500 workforce strategy.
              </p>
              <p>
                The throughline is <em>standards, repeatability, and ruthless attention to what actually flies</em> — a discipline carried from the hangar floor into every line of software the studio puts into the world.
              </p>
              <p>DANZUS is the holding structure. The work is the proof.</p>
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
            <span className="l1">Real problems.</span>
            <span className="l2">Short notes.</span>
            <span className="l3">No decks.</span>
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
