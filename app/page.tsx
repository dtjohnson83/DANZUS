export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block mb-6 px-3 py-1 border border-[#222222] rounded-full text-sm text-[#888888]">
          est. 2025
        </div>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">
          Danzus builds quietly.
        </h1>
        <p className="text-xl text-[#888888] max-w-2xl mx-auto leading-relaxed">
          We build products that work. No noise, no hype, no unnecessary complexity.
          Just software that solves real problems for real people.
        </p>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="border-t border-[#222222]" />
      </div>

      {/* Thesis */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-sm uppercase tracking-widest text-[#FFB347] mb-12">
          Thesis
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#111111] rounded-xl border border-[#222222]">
            <div className="text-2xl mb-4">01</div>
            <h3 className="text-lg font-semibold mb-3">Depth over breadth</h3>
            <p className="text-[#888888] leading-relaxed">
              A dozen half-built projects gather dust. One polished product changes
              behavior. We would rather go deep on a problem than spread thin.
            </p>
          </div>
          <div className="p-6 bg-[#111111] rounded-xl border border-[#222222]">
            <div className="text-2xl mb-4">02</div>
            <h3 className="text-lg font-semibold mb-3">Earn trust slowly</h3>
            <p className="text-[#888888] leading-relaxed">
              The market rewards consistency. We ship when we have something worth
              shipping. We do not announce things we cannot deliver.
            </p>
          </div>
          <div className="p-6 bg-[#111111] rounded-xl border border-[#222222]">
            <div className="text-2xl mb-4">03</div>
            <h3 className="text-lg font-semibold mb-3">Tools for the trades</h3>
            <p className="text-[#888888] leading-relaxed">
              Blue collar work is real work. We are building software that respects
              the expertise of people who make things with their hands.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="border-t border-[#222222]" />
      </div>

      {/* Portfolio */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-sm uppercase tracking-widest text-[#FFB347] mb-12">
          Portfolio
        </h2>
        <div className="grid gap-4">
          {[
            {
              name: "DimeVision",
              description:
                "AI-powered welding coach. Takes a photo of your weld, gives you instant, specific feedback. Built for welders who want to get better without a master looking over their shoulder.",
              status: "Live",
              link: "https://dimevision.app",
            },
            {
              name: "Agent Audit Trail",
              description:
                "Compliance-grade logging for AI agents. MCP server that records every tool call, every decision, every artifact. For regulated industries where 'it seemed to work' is not enough.",
              status: "Live",
              link: "#",
            },
            {
              name: "OSHA MCP",
              description:
                "Model Context Protocol server for OSHA standards and enforcement data. Give any AI agent accurate, up-to-date regulatory context in under 5 minutes of setup.",
              status: "Live",
              link: "#",
            },
            {
              name: "DOT MCP",
              description:
                "Department of Transportation regulations as a living API. Real citations, real penalties, real guidance. Not scraped lawyer websites.",
              status: "Live",
              link: "#",
            },
            {
              name: "Ed",
              description:
                "Personal AI assistant running on OpenClaw. Handles research, scheduling, content pipeline, and infrastructure so Dan can stay in flow.",
              status: "Active",
              link: "#",
            },
          ].map((project) => (
            <a
              key={project.name}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 bg-[#111111] rounded-xl border border-[#222222] hover:border-[#FFB347] transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold group-hover:text-[#FFB347] transition-colors">
                  {project.name}
                </h3>
                <span className="text-xs px-2 py-1 bg-[#1a1a1a] rounded-full text-[#888888]">
                  {project.status}
                </span>
              </div>
              <p className="text-[#888888] leading-relaxed">
                {project.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="border-t border-[#222222]" />
      </div>

      {/* Operator */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-sm uppercase tracking-widest text-[#FFB347] mb-12">
          Operator
        </h2>
        <div className="p-8 bg-[#111111] rounded-xl border border-[#222222]">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-[#222222] flex items-center justify-center text-2xl font-semibold shrink-0">
              DJ
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Dan Johnson</h3>
              <p className="text-[#888888] leading-relaxed mb-4">
                Data Visualization Lead by day. DANZUS Holdings founder by necessity.
                Built DimeVision because his brother is a master welder and deserved
                better tooling than YouTube and crossed fingers.
              </p>
              <div className="flex gap-4 text-sm">
                <a
                  href="https://linkedin.com/in/dtjohnson83"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFB347] hover:underline"
                >
                  LinkedIn
                </a>
                <a
                  href="https://dimevision.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFB347] hover:underline"
                >
                  DimeVision
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="border-t border-[#222222]" />
      </div>

      {/* Contact */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-sm uppercase tracking-widest text-[#FFB347] mb-6">
          Contact
        </h2>
        <p className="text-xl text-[#888888] mb-8">
          Working on something interesting? Let&apos;s talk.
        </p>
        <a
          href="mailto:dan@danzus.com"
          className="inline-block px-8 py-4 bg-[#FFB347] text-[#0A0A0A] font-semibold rounded-xl hover:bg-[#ffa726] transition-colors"
        >
          dan@danzus.com
        </a>
        <div className="mt-12 text-sm text-[#888888]">
          <p>Folsom, CA</p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} DANZUS Holdings LLC. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}
