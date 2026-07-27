import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './family-agent.module.css'

const PAGE_URL = 'https://danzus.co/family-agent'
const CONTACT_URL = 'mailto:dan@danzus.co?subject=Family%20Agent%20Founding%20Pilot'

export const metadata: Metadata = {
  title: 'Family Agent for Shared Calendars and Messages',
  description:
    'A configurable family AI that connects approved calendars, sports, school information, weather, and household rules in one Messages conversation.',
  keywords: [
    'family AI agent',
    'family calendar assistant',
    'AI family organizer',
    'shared family calendar AI',
    'Apple family assistant',
    'AI assistant for parents',
    'private family AI',
    'family schedule assistant',
  ],
  alternates: { canonical: '/family-agent' },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    title: 'Family Agent by DANZUS',
    description: 'One message for the whole family schedule. Join the founding-family pilot.',
    images: [
      {
        url: '/family-agent/og-family-agent.png',
        width: 1200,
        height: 630,
        alt: 'Family Agent by DANZUS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Family Agent by DANZUS',
    description: 'One message for the whole family schedule.',
    images: ['/family-agent/og-family-agent.png'],
  },
}

const FAQS = [
  {
    question: 'What is Family Agent?',
    answer:
      'Family Agent is a configurable household assistant that reads approved calendars and family information, answers schedule questions in Messages, and follows role-based rules for parents, children, and helpers.',
  },
  {
    question: 'Is every family getting Taz?',
    answer:
      'No. Taz is the Johnson family instance and the reference system behind this pilot. Each household chooses its own assistant name, connects its own sources, and receives a separate household profile.',
  },
  {
    question: 'Does it replace our calendars and team apps?',
    answer:
      'No. Family Agent works with the systems the household already uses. It reads only approved sources and brings the relevant information into one answer instead of forcing the family to rebuild every schedule in a new app.',
  },
  {
    question: 'How is family information protected?',
    answer:
      'Each household runs in a separate profile with its own credentials, source allowlists, roles, and audit checks. Selected AI, messaging, and voice providers may process information required for a request. Those providers and boundaries are disclosed during setup.',
  },
  {
    question: 'Who can change a calendar?',
    answer:
      'Verified parents can approve changes on explicitly allowed calendars. Children and helpers are read-only by default. Deletion is disabled by default, and ambiguous dates or destinations require clarification.',
  },
  {
    question: 'What hardware is required?',
    answer:
      'The initial pilot is designed for Apple households using shared calendars and Messages. An always-on Mac or a managed Mac mini may be part of the setup, depending on the household and the connections selected.',
  },
  {
    question: 'What is included in the founding-family pilot?',
    answer:
      'The pilot includes household setup, calendar and messaging connections, member and role mapping, privacy boundaries, health checks, and a controlled first-use test. Optional capabilities are enabled only when the family asks for them.',
  },
  {
    question: 'How much does the pilot cost?',
    answer:
      'Pilot scope and price are confirmed before setup. No hardware, telephone service, or third-party account is purchased without the family’s approval.',
  },
]

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Family Agent by DANZUS',
  alternateName: 'DANZUS Family Agent',
  description:
    'A configurable family AI that connects approved calendars, sports, school information, weather, and household rules in one Messages conversation.',
  url: PAGE_URL,
  image: 'https://danzus.co/family-agent/og-family-agent.png',
  brand: {
    '@type': 'Brand',
    name: 'DANZUS',
  },
  manufacturer: {
    '@type': 'Organization',
    name: 'DANZUS Holdings LLC',
    url: 'https://danzus.co',
  },
  audience: {
    '@type': 'Audience',
    audienceType: 'Families using shared calendars and Apple Messages',
  },
}

const VIDEO_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Family Agent by DANZUS product demo',
  description:
    'A narrated walkthrough of a configurable family agent connecting calendars, team apps, school information, weather, family permissions, files, meal planning, and requested voice notes.',
  thumbnailUrl: ['https://danzus.co/family-agent/family-agent-demo-poster.jpg'],
  uploadDate: '2026-07-27T00:00:00-07:00',
  duration: 'PT57.606S',
  contentUrl: 'https://danzus.co/video/family-agent-demo-v1.mp4',
  embedUrl: PAGE_URL,
  publisher: {
    '@type': 'Organization',
    name: 'DANZUS Holdings LLC',
    logo: {
      '@type': 'ImageObject',
      url: 'https://danzus.co/danzus-mark-512.png',
    },
  },
}

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

const SOURCES = [
  'Apple Calendar',
  'Team apps',
  'School information',
  'Public schedules',
  'Weather',
  'Messages',
  'Household rules',
  'Protected documents',
]

const OUTPUTS = [
  'Schedule answers',
  'Parent-approved updates',
  'Meal plans and grocery lists',
  'Protected family files',
  'Requested voice notes',
  'Useful household alerts',
]

export default function FamilyAgentPage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(VIDEO_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />

      <nav className={styles.nav} aria-label="Family Agent navigation">
        <div className={styles.navInner}>
          <Link className={styles.brand} href="/">
            <img src="/danzus-mark.svg" alt="" aria-hidden="true" />
            <span>DANZUS</span>
          </Link>
          <div className={styles.navLinks}>
            <a href="#system">System</a>
            <a href="#permissions">Permissions</a>
            <a href="#setup">Setup</a>
            <a href="#faq">FAQ</a>
          </div>
          <a className={styles.navCta} href={CONTACT_URL}>Founding pilot</a>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.ambient} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>DANZUS / FAMILY AGENT / FOUNDING PILOT</div>
              <h1>One message for the whole family schedule.</h1>
              <p className={styles.lead}>
                Family Agent connects approved calendars, team apps, school information, weather, and household rules. Ask what is happening Saturday and get one answer that respects who is asking.
              </p>
              <div className={styles.actions}>
                <a className={styles.primaryButton} href={CONTACT_URL}>Join the founding pilot</a>
                <a className={styles.secondaryButton} href="#demo">Watch the 58-second demo</a>
              </div>
              <div className={styles.originNote}>
                <span>Built from a working household system</span>
                Taz is already coordinating schedules, family files, permissions, and requested voice notes in Dan Johnson&apos;s own family.
              </div>
            </div>

            <figure className={styles.demoCard} id="demo">
              <div className={styles.demoMeta}>
                <span>Product demonstration</span>
                <span>00:58</span>
              </div>
              <video
                className={styles.video}
                src="/video/family-agent-demo-v1.mp4"
                poster="/family-agent/family-agent-demo-poster.jpg"
                controls
                playsInline
                preload="metadata"
              />
              <figcaption>Narrated demo using fictional household data.</figcaption>
            </figure>
          </div>
        </div>
      </header>

      <section className={styles.problemSection} aria-labelledby="problem-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionIndex}>§ 002 / THE PROBLEM</div>
            <h2 id="problem-heading">Saturday is hiding in four places.</h2>
          </div>
          <div className={styles.problemGrid}>
            <div className={styles.sourceStack} aria-label="Example family information sources">
              <div><span>TEAM APP</span><strong>Match time updated</strong></div>
              <div><span>SCHOOL EMAIL</span><strong>Field day moved</strong></div>
              <div><span>SHARED CALENDAR</span><strong>Family dinner at 3:00</strong></div>
              <div><span>TEXT THREAD</span><strong>Who can handle pickup?</strong></div>
            </div>
            <div className={styles.problemCopy}>
              <p>
                Families already have calendars and apps. The friction comes from checking each one, resolving conflicts, and deciding what applies to which person.
              </p>
              <p>
                Family Agent reads the approved sources, applies the household&apos;s rules, and returns the answer in the conversation the family already uses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.systemSection} id="system" aria-labelledby="system-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionIndex}>§ 003 / FAMILY KNOWLEDGE GRAPH</div>
            <h2 id="system-heading">One context. Every useful source.</h2>
            <p>The graph is operational, not decorative. Each connection maps to an approved source, a household rule, or an allowed result.</p>
          </div>

          <figure className={styles.knowledgeGraph} aria-labelledby="graph-caption">
            <div className={styles.graphColumn}>
              <div className={styles.graphLabel}>Approved sources</div>
              <div className={styles.nodeGrid}>
                {SOURCES.map((source, index) => (
                  <div className={styles.sourceNode} key={source}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {source}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.graphHubWrap}>
              <div className={styles.inputRail} aria-hidden="true" />
              <div className={styles.graphHub}>
                <img src="/danzus-mark.svg" alt="" aria-hidden="true" />
                <strong>Family context</strong>
                <span>Isolated profile</span>
                <span>Identity checked</span>
                <span>Permissioned</span>
              </div>
              <div className={styles.outputRail} aria-hidden="true" />
            </div>

            <div className={styles.graphColumn}>
              <div className={styles.graphLabel}>Allowed results</div>
              <div className={styles.outputList}>
                {OUTPUTS.map((output, index) => (
                  <div className={styles.outputNode} key={output}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {output}
                  </div>
                ))}
              </div>
            </div>
            <figcaption id="graph-caption">Approved family sources flow into a bounded household context. Only allowed answers and actions come out.</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.permissionsSection} id="permissions" aria-labelledby="permissions-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionIndex}>§ 004 / PERMISSIONS</div>
            <h2 id="permissions-heading">The answer changes with the person asking.</h2>
          </div>
          <div className={styles.roleGrid}>
            <article className={styles.roleCard}>
              <div className={styles.roleTop}><span>01</span><strong>Parent</strong></div>
              <p>Read the household schedule, approve allowed calendar changes, request protected files, and control which capabilities are active.</p>
            </article>
            <article className={styles.roleCard}>
              <div className={styles.roleTop}><span>02</span><strong>Child</strong></div>
              <p>See their own activities and the family logistics needed for the day. Calendar changes remain parent-controlled.</p>
            </article>
            <article className={styles.roleCard}>
              <div className={styles.roleTop}><span>03</span><strong>Helper</strong></div>
              <p>Receive narrow pickup, sports, school, or transport information without gaining access to the rest of the household.</p>
            </article>
            <article className={styles.roleCard}>
              <div className={styles.roleTop}><span>04</span><strong>Unknown</strong></div>
              <p>No household access. Identity and route checks happen before family information or tools are made available.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.boundarySection} aria-labelledby="boundary-heading">
        <div className={styles.container}>
          <div className={styles.boundaryGrid}>
            <div>
              <div className={styles.sectionIndex}>§ 005 / CURRENT CAPABILITIES</div>
              <h2 id="boundary-heading">Useful on an ordinary family day.</h2>
              <ul className={styles.checkList}>
                <li>Answer today, weekend, game, practice, and appointment questions</li>
                <li>Find relevant school and public schedule information</li>
                <li>Create schedule-aware meal plans and grocery lists</li>
                <li>Create protected spreadsheets, documents, and PDFs</li>
                <li>Send requested voice notes in an approved conversation</li>
                <li>Prepare parent-approved calendar additions and updates</li>
              </ul>
            </div>
            <div className={styles.boundaryCard}>
              <div className={styles.graphLabel}>Default boundaries</div>
              <ul>
                <li>No automatic location tracking</li>
                <li>No live calling or new phone service</li>
                <li>No calendar deletion by default</li>
                <li>No open-ended inbox access</li>
                <li>No business accounts mixed into family context</li>
                <li>No consequential action based only on caller ID</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.setupSection} id="setup" aria-labelledby="setup-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionIndex}>§ 006 / SETUP</div>
            <h2 id="setup-heading">Four decisions before the first question.</h2>
            <p>The founding pilot is guided while the installer and self-service onboarding are being standardized.</p>
          </div>
          <ol className={styles.steps}>
            <li><span>01</span><div><strong>Name the assistant</strong><p>Choose the household name, tone, and optional voice.</p></div></li>
            <li><span>02</span><div><strong>Connect approved sources</strong><p>Select the calendars, messaging routes, and optional family tools.</p></div></li>
            <li><span>03</span><div><strong>Map people and roles</strong><p>Define parents, children, helpers, and exactly what each person may access.</p></div></li>
            <li><span>04</span><div><strong>Run the household checks</strong><p>Test schedule answers, denied requests, audit logs, and recovery before launch.</p></div></li>
          </ol>
          <div className={styles.pilotNote}>
            <strong>Initial fit</strong>
            Apple households using shared calendars and Messages. An always-on Mac or managed Mac mini may be required.
          </div>
        </div>
      </section>

      <section className={styles.faqSection} id="faq" aria-labelledby="faq-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionIndex}>§ 007 / FAQ</div>
            <h2 id="faq-heading">Before you bring an agent into the family.</h2>
          </div>
          <div className={styles.faqList}>
            {FAQS.map((item) => (
              <details key={item.question}>
                <summary>{item.question}<span aria-hidden="true">+</span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection} aria-labelledby="cta-heading">
        <div className={styles.ambientBottom} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.ctaGrid}>
            <div>
              <div className={styles.sectionIndex}>§ 008 / FOUNDING FAMILIES</div>
              <h2 id="cta-heading">Want to test this in your house?</h2>
            </div>
            <div className={styles.ctaCopy}>
              <p>I am opening a small founding-family group to test the setup, permissions, and day-to-day usefulness outside my own household.</p>
              <a className={styles.primaryButton} href={CONTACT_URL}>Ask about the pilot</a>
              <p className={styles.emailFallback}>If the button does not open your email app, write to <a href="mailto:dan@danzus.co">dan@danzus.co</a>.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <span>© MMXXVI · DANZUS Holdings LLC · Folsom, California</span>
            <Link href="/">DANZUS.co</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
