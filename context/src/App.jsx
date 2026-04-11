import { useState, useRef, useEffect } from "react";

const T = {
bg:"#050505",sf:"#0c0c0c",sf2:"#141414",sf3:"#1c1c1c",
gold:"#d4a853",goldD:"#8a6f37",goldG:"rgba(212,168,83,.1)",
tx:"#f5f1e8",txD:"#9a9590",txM:"#555",
red:"#d45252",redD:"#6b2a2a",
grn:"#5cb85c",grnD:"#2d5c2d",
rule:"#222",
};

// ============ PERSONAS ============
const PERSONAS = {
parent: {
label:"Parent / Family", desc:"Managing a household, kids, meals, schedules",
core:[
{id:"id",name:"my-info.md",title:"My Info",why:"Your name and basics. Loads every conversation.",
lines:[{h:"About Me"},{k:"Name",v:"(your name)"},{k:"Timezone",v:"(your timezone)"},{k:"Family",v:"Partner + 2 kids (ages 7 and 4)"},
{a:"Under 100 words. Loads every time, so keep it minimal. Meal preferences go in a skill."}]},
{id:"rules",name:"my-rules.md",title:"My Rules",why:"Universal rules. Always active.",
lines:[{h:"Never Break These"},{r:"1. Don't suggest anything over $100 without flagging"},{r:"2. Always consider kids' allergies (peanuts)"},{r:"3. Be direct, not preachy"},
{a:"Three rules, not thirty. Every rule loads before every response."}]},
{id:"tone",name:"how-to-talk.md",title:"Tone",why:"How the AI speaks. Always consistent.",
lines:[{h:"Voice"},{k:"Style",v:"Casual, practical"},{k:"Length",v:"Short unless asked"},
{a:"Write it once. Never re-explain your preferences again."}]},
],
skills:[
{id:"meals",name:"meal-planning",title:"Meal Planning",why:"Only loads for food questions.",
lines:[{c:"Activates for dinner, recipes, meal prep."},{h:"Preferences"},{k:"Family size",v:"4"},{k:"Restrictions",v:"Peanut-free"},{k:"Weeknight",v:"Under 30 min"},{h:"Go-to meals"},{v:"Tacos, pasta, stir fry, sheet pan chicken"},
{a:"Only loads for food questions. School pickup? This stays closed."}]},
{id:"school",name:"school-logistics",title:"School Logistics",why:"Opens for schedule questions.",
lines:[{h:"Schools"},{k:"Oldest",v:"Pine Elementary, out 3:15"},{k:"Youngest",v:"Little Stars, out 2:30"},{h:"Pickup"},{v:"Preschool first, then elementary. Grandma on Tuesdays."},
{a:"300+ words only relevant for logistics. Not loaded during dinner planning."}]},
{id:"medical",name:"medical-info",title:"Medical Info",why:"Private. Only loads for health topics.",
lines:[{h:"Allergies"},{k:"Oldest",v:"Peanuts (epipen)"},{k:"Youngest",v:"None"},{h:"Doctor"},{k:"Pediatrician",v:"Dr. Rivera"},
{a:"Medical data only appears for health conversations. Better privacy and performance."}]},
{id:"budget",name:"family-budget",title:"Budget",why:"Money questions only.",
lines:[{h:"Monthly"},{k:"Groceries",v:"$800"},{k:"Activities",v:"$400"},{k:"Dining",v:"$200"},{h:"Rule"},{v:"Flag anything over $100."},
{a:"Financial context only loads when talking about money."}]},
],
sims:[
{q:"What should I make for dinner tonight?",match:["meals"],answer:"Based on your 30-min weeknight rule and peanut-free constraint: sheet pan chicken with roasted veggies. You probably have everything already."},
{q:"What's the pickup schedule tomorrow?",match:["school"],answer:"Tomorrow's Tuesday, so Grandma handles pickup. Preschool at 2:30, elementary at 3:15."},
{q:"My oldest has a rash. What should I tell the doctor?",match:["medical"],answer:"Dr. Rivera's on file. Bring allergy history (peanut, epipen). Note when the rash started."},
{q:"Are we over budget on groceries?",match:["budget"],answer:"Target is $800/month. Your usual weekly shop is ~$180, tracking to $720. You have room."},
],
learnExamples:{desk:"Imagine putting medical charts, tax returns, and vacation notes on your desk just to plan dinner.",skill:"'Meal planning' opens for food. 'Medical' opens for health. Everything else stays closed."},
},
founder: {
label:"Startup / Small Biz", desc:"Building a product, wearing every hat",
core:[
{id:"id",name:"identity.md",title:"Identity",why:"Name, timezone, email. No business details.",
lines:[{h:"About"},{k:"Name",v:"(your name)"},{k:"Role",v:"Founder"},{k:"Timezone",v:"(your timezone)"},
{a:"No strategy or metrics. Those go in skills."}]},
{id:"rules",name:"rules.md",title:"Rules",why:"Universal constraints.",
lines:[{h:"Always"},{r:"1. Never fabricate metrics"},{r:"2. Confirm before external actions"},{r:"3. Be direct about what's not working"},
{a:"Applies to blog posts AND code deploys. Brand voice? That's a skill."}]},
{id:"tone",name:"voice.md",title:"Voice",why:"Communication style.",
lines:[{h:"Tone"},{k:"Default",v:"Direct, no filler"},{k:"Professional",v:"Clean, evidence-based"},
{a:"Voice stays consistent. Task-specific context lives in skills."}]},
],
skills:[
{id:"brand",name:"brand-content",title:"Brand & Content",why:"Fires for marketing and public writing.",
lines:[{c:"Triggers: content, blog, social, email"},{h:"Brand"},{k:"Tagline",v:"(yours)"},{h:"Rules"},{v:"Lead with proof. No jargon."},
{a:"Only loads when creating content. Not when debugging."}]},
{id:"sales",name:"sales-outreach",title:"Sales Outreach",why:"Sales work only.",
lines:[{h:"Pipeline"},{k:"Target",v:"(your ICP)"},{k:"Pricing",v:"(your tiers)"},{h:"Approach"},{v:"Problem first. Free pilot."},
{a:"Update one file when pricing changes. Only loads for sales."}]},
{id:"product",name:"product-strategy",title:"Strategy",why:"Roadmap, investors, competition.",
lines:[{h:"Mission"},{v:"(one sentence)"},{h:"Differentiators"},{v:"(what they can't copy)"},{h:"Never"},{v:"No fake social proof."},
{a:"No live metrics. Strategy = durable truths only."}]},
{id:"deploy",name:"deploy-code",title:"Deploy & Code",why:"Engineering only.",
lines:[{h:"Stack"},{v:"(your tech stack)"},{h:"Rule"},{v:"Never push prod without confirmation."},
{a:"Dense engineering context. Irrelevant for 80% of conversations."}]},
],
sims:[
{q:"Draft a LinkedIn post about our new feature",match:["brand"],answer:"Leading with the problem solved, not the feature. Short, proof-driven, no jargon."},
{q:"Write a cold email to a potential partner",match:["sales"],answer:"Leading with their problem. Free pilot offer. Pricing after they see value."},
{q:"How are we positioned against the new competitor?",match:["product"],answer:"Strong on differentiator 1. Exposed on point 2. They can't copy your first-mover advantage."},
{q:"Deploy the latest build to staging",match:["deploy"],answer:"Running conventions. Confirming: staging, not production. Ready?"},
],
learnExamples:{desk:"Reading your entire company wiki before answering a Slack message.",skill:"Blog post? Brand folder. Shipping code? Engineering folder."},
},
corporate: {
label:"Corporate / Enterprise", desc:"Projects, people, stakeholders",
core:[
{id:"id",name:"profile.md",title:"Profile",why:"Name, role, team.",
lines:[{h:"About"},{k:"Name",v:"(your name)"},{k:"Role",v:"Product Manager"},{k:"Team",v:"Platform, 8 reports"},
{a:"OKRs and specs live in skills."}]},
{id:"rules",name:"guardrails.md",title:"Guardrails",why:"Compliance. Always active.",
lines:[{h:"Always"},{r:"1. No confidential data outside approved channels"},{r:"2. Flag legal concerns immediately"},{r:"3. Approved terminology externally"},
{a:"Corporate constraints. Never optional."}]},
{id:"tone",name:"style.md",title:"Style",why:"Adapts per audience.",
lines:[{h:"Defaults"},{k:"Leadership",v:"Concise, data-led"},{k:"Team",v:"Casual, direct"},
{a:"Different audiences, automatic adjustment."}]},
],
skills:[
{id:"prd",name:"write-prd",title:"Write PRD",why:"Product specs only.",
lines:[{c:"Triggers: PRD, spec, requirements"},{h:"Template"},{v:"Problem > User stories > Metrics > Scope"},{h:"Standard"},{v:"Measurable success criteria always."},
{a:"PRD structure while drafting a team email = wasted context."}]},
{id:"comms",name:"stakeholder-comms",title:"Stakeholder Comms",why:"Leadership updates.",
lines:[{h:"Stakeholders"},{k:"VP Eng",v:"Technical depth"},{k:"CEO",v:"Impact, one paragraph"},{h:"Format"},{v:"Decision or ask first."},
{a:"Each stakeholder gets tailored comms automatically."}]},
{id:"data",name:"data-analysis",title:"Data Analysis",why:"Analytics only.",
lines:[{h:"Metrics"},{v:"DAU = unique users with 1+ session"},{h:"Rule"},{v:"Always state date range."},
{a:"Metric definitions encoded. Same definition every time."}]},
{id:"meetings",name:"meeting-notes",title:"Meetings",why:"Meeting mode only.",
lines:[{h:"Format"},{v:"Decisions > Actions > Owners"},{h:"Rule"},{v:"Capture decisions, not discussion."},
{a:"Saves 5 min/meeting. Only loads in meeting context."}]},
],
sims:[
{q:"Write the PRD for the new search feature",match:["prd"],answer:"Starting with your template. Problem statement first. What's the core problem search solves?"},
{q:"Draft an update for the VP of Engineering",match:["comms"],answer:"VP Eng wants technical depth. Decision first, data below, one clear ask."},
{q:"What's our D7 retention?",match:["data"],answer:"D7 = users returning within 7 days. Pulling with date range specified."},
{q:"Summarize today's standup",match:["meetings"],answer:"Decisions made, action items with owners and deadlines. Discussion skipped."},
],
learnExamples:{desk:"Printing every Notion page before starting each task.",skill:"PRD? Template loads. VP email? Stakeholder context loads."},
},
freelancer: {
label:"Freelancer / Creative", desc:"Clients, projects, getting paid",
core:[
{id:"id",name:"me.md",title:"About Me",why:"Name and basics. No client details.",
lines:[{h:"About"},{k:"Name",v:"(your name)"},{k:"Work",v:"Freelance designer/writer"},
{a:"Each client is a separate skill."}]},
{id:"rules",name:"rules.md",title:"Rules",why:"Universal across clients.",
lines:[{h:"Always"},{r:"1. Never mix client details"},{r:"2. Don't promise timelines without checking"},{r:"3. Drafts until approved"},
{a:"Client isolation is why this architecture matters for freelancers."}]},
{id:"tone",name:"voice.md",title:"Voice",why:"Your creative voice.",
lines:[{h:"Writing"},{k:"Default",v:"Warm, clear, visual"},{k:"Clients",v:"Professional but personable"},
{a:"Voice consistent. Client styles in their own skills."}]},
],
skills:[
{id:"clientA",name:"client-acme",title:"Client: Acme",why:"One client, one folder.",
lines:[{c:"Triggers for Acme."},{h:"Project"},{k:"What",v:"Brand refresh + website"},{k:"Contact",v:"Sarah"},{k:"Style",v:"Minimal, navy + white"},
{a:"Acme's context can't contaminate Bloom's project."}]},
{id:"clientB",name:"client-bloom",title:"Client: Bloom",why:"Separate client, separate skill.",
lines:[{c:"Triggers for Bloom."},{h:"Project"},{k:"What",v:"Monthly blog (4/mo)"},{k:"Voice",v:"Earthy, wellness"},
{a:"Different voice, different project. Never load simultaneously unless comparing."}]},
{id:"invoicing",name:"invoicing",title:"Invoicing",why:"Billing only.",
lines:[{h:"Rates"},{k:"Design",v:"$125/hr"},{k:"Writing",v:"$95/hr"},{k:"Rush",v:"+50%"},{h:"Terms"},{v:"Net 30."},
{a:"Rate card during logo design = wasted space."}]},
{id:"portfolio",name:"pitch",title:"Pitch",why:"New work only.",
lines:[{h:"Angle"},{v:"Strategic design, not just pretty."},{h:"Proof"},{v:"(your best projects)"},
{a:"Only when pitching. Not during deliverables."}]},
],
sims:[
{q:"Start the Acme homepage mockup",match:["clientA"],answer:"Acme: minimal, bold type, navy + white. Wireframes approved. Building high-fi mockups."},
{q:"Write Bloom's blog post for this week",match:["clientB"],answer:"Bloom voice: earthy, wellness. What topic did Jay want this week?"},
{q:"Invoice Acme for March",match:["invoicing"],answer:"Design rate $125/hr. Pulling March hours. Net 30. Draft it?"},
{q:"A new cafe wants branding. Draft a pitch",match:["portfolio"],answer:"Strategic design angle. Including Acme rebrand and Bloom system as proof."},
],
learnExamples:{desk:"Opening every client folder, rate card, and tax docs before any task.",skill:"Acme? Open. Bloom? Acme closes, Bloom opens."},
},
student: {
label:"Student / Learner", desc:"Papers, studying, coursework",
core:[
{id:"id",name:"about-me.md",title:"About Me",why:"Name, school, level.",
lines:[{h:"About"},{k:"Name",v:"(your name)"},{k:"Major",v:"(your major)"},{k:"Year",v:"Junior"},
{a:"Level and field determine explanation depth."}]},
{id:"rules",name:"rules.md",title:"Rules",why:"Academic integrity.",
lines:[{h:"Always"},{r:"1. Help understand, don't write for me"},{r:"2. Cite sources (APA)"},{r:"3. Flag plagiarism risks"},
{a:"Non-negotiable for every academic task."}]},
{id:"tone",name:"style.md",title:"Learning Style",why:"How you learn best.",
lines:[{h:"Preferences"},{k:"Explanations",v:"Analogies first, then technical"},{k:"When stuck",v:"Ask what I think first"},
{a:"Consistent across all subjects."}]},
],
skills:[
{id:"bio",name:"biology-201",title:"Biology 201",why:"Bio only. History stays closed.",
lines:[{c:"Triggers for bio, cells, genetics."},{h:"Course"},{k:"Professor",v:"Dr. Kim"},{k:"Focus",v:"Molecular biology"},{h:"Current"},{v:"Gene expression. Lab report Friday."},
{a:"Full focus on bio. History notes not in memory."}]},
{id:"history",name:"history-305",title:"History 305",why:"History only.",
lines:[{c:"Triggers for history."},{h:"Course"},{k:"Professor",v:"Prof. Martinez"},{k:"Focus",v:"Cold War"},{h:"Paper"},{v:"Containment failures. 12 pages, April 20."},
{a:"Thesis context stays out of bio exams."}]},
{id:"writing",name:"paper-writing",title:"Paper Writing",why:"Any paper, any subject.",
lines:[{h:"Format"},{v:"APA 7th"},{h:"Structure"},{v:"Thesis > Evidence > Analysis > Counter > Conclusion"},{h:"Rule"},{v:"Every claim needs citation."},
{a:"Cross-cutting. Fires for any paper."}]},
{id:"study",name:"exam-prep",title:"Exam Prep",why:"Study mode.",
lines:[{h:"Method"},{v:"Active recall > passive reading."},{h:"Schedule"},{v:"5 days out: overview, deep review, practice, weak spots, review."},
{a:"Any exam. Only when studying."}]},
],
sims:[
{q:"Help me with gene expression for the lab report",match:["bio"],answer:"Gene expression: DNA to protein. For your report: promoter region, RNA polymerase, mRNA processing. Dr. Kim wants diagrams."},
{q:"Outline my Cold War paper",match:["history","writing"],answer:"Thesis: containment failures in SE Asia. APA 7th. Thesis > evidence > analysis > counter > conclusion. 12 pages, April 20."},
{q:"Bio exam in 3 days",match:["bio","study"],answer:"Day 3 of your plan: deep review of gene expression. Tomorrow: practice problems. Day 5: weak spots only."},
{q:"Check my citations",match:["writing"],answer:"APA 7th: checking author-date format, et al. rules, page numbers for direct quotes."},
],
learnExamples:{desk:"Opening every textbook and syllabus before one homework question.",skill:"Just the right textbook to the right chapter."},
},
};

// ============ BUILDER PROMPT ============
const buildPrompt = (personaKey) => {
  const persona = PERSONAS[personaKey];
  const skillTitles = persona.skills.map(s => s.title).join(', ');
  return `You are ContextKit, an expert AI agent architect. Your job is to interview me and then generate a complete set of configuration files for my personal AI assistant.

## About me

I'm a ${persona.label.toLowerCase()} — ${persona.desc.toLowerCase()}. I've already picked this role, so don't ask me what I do; use examples specific to my situation.

## What you're building

**Core files (2-3, always loaded, under 100 words each):**
- Identity (name, timezone)
- Universal rules (3-5 max)
- Tone preferences

**Skill files (4-8, loaded only when relevant):**
- Self-contained instructions for one domain
- Only activate when the AI detects a matching task

## Interview me (ONE question at a time)

1. Name and timezone?
2. List 3-5 areas where you want AI help — common areas for someone in your situation are: ${skillTitles}. Pick from these or add your own.
3. For each: what tasks, what info does the AI need?
4. Your 3 non-negotiable rules?
5. How should the AI talk to you?
6. Any sensitive info that should ONLY load when relevant?

## Then generate files

Core files as markdown. Skill files with YAML frontmatter:

\`\`\`
name: skill-name
description: >
  When to activate. Trigger words and topics.

# Skill Name

## Key Info

## Domain-specific rules
\`\`\`

## Then explain setup

1. What loads when
2. Where to put files (Claude Projects, ChatGPT, Claude Code, Cursor, etc.)
3. Three test prompts to try
4. How to improve over time (recursive refinement)

Rules: ONE question at a time. Real content, no placeholders. Tiny core files. Separate sensitive data into skills. Multiple clients/projects = separate skills each.

Start by greeting me and asking question 1.`;
};

// Which setup guides are relevant per persona. Dev tools (Claude Code,
// Cursor, OpenClaw) are hidden for non-technical personas to reduce noise.
const GUIDE_ALLOWLIST = {
  parent:     ["claude", "chatgpt", "gemini", "manual"],
  founder:    ["claude", "chatgpt", "gemini", "claude-code", "cursor", "openclaw", "manual"],
  corporate:  ["claude", "chatgpt", "gemini", "manual"],
  freelancer: ["claude", "chatgpt", "gemini", "claude-code", "cursor", "manual"],
  student:    ["claude", "chatgpt", "gemini", "manual"],
};

// Convert a persona file's line objects to markdown body text.
const linesToMarkdown = (lines) => lines.map(l => {
  if (l.h) return `## ${l.h}`;
  if (l.k) return `- **${l.k}**: ${l.v}`;
  if (l.r) return `- ${l.r}`;
  if (l.v) return `- ${l.v}`;
  return null;
}).filter(Boolean).join("\n");

// Build a bundled starter-kit markdown file for a given persona.
const buildStarterKit = (personaKey) => {
  const persona = PERSONAS[personaKey];
  const header = `# ContextKit Starter Kit — ${persona.label}

Generated by https://danzus.co/context

Below are your core and skill files, ready to paste into your AI tool of choice.

- **Core files** load on every conversation. Paste them into Claude Projects' Custom Instructions, ChatGPT's Custom Instructions, or concatenate them into CLAUDE.md / AGENTS.md for Claude Code.
- **Skill files** load only when relevant. In Claude Projects, upload each as a Knowledge document. In Claude Code, save each as /skills/<name>/SKILL.md. In ChatGPT, paste into a custom GPT's instructions.

Fill in the placeholders (your name, timezone, etc.) with your real info. Then test with the example questions from the Simulate tab.

`;

  const coreSection = persona.core.map(f =>
`---

=== CORE FILE: ${f.name} (always loaded) ===

${linesToMarkdown(f.lines)}
`
  ).join("\n");

  const skillSection = persona.skills.map(f =>
`---

=== SKILL FILE: ${f.name}/SKILL.md (${f.why}) ===

\`\`\`yaml
name: ${f.name}
description: >
  ${f.why}
\`\`\`

# ${f.title}

${linesToMarkdown(f.lines)}
`
  ).join("\n");

  return header + coreSection + "\n" + skillSection;
};

// ============ COMPONENTS ============
function Nav() {
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:".9rem 1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(5,5,5,.94)",backdropFilter:"blur(14px)",borderBottom:`1px solid ${T.rule}`}}>
      <span style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:".9rem",color:T.tx,letterSpacing:".15em"}}>CONTEXTKIT</span>
      <a href="https://danzus.co" style={{fontSize:".68rem",color:T.txD,textDecoration:"none"}}>by DANZUS</a>
    </div>
  );
}

function Intake({onSelect}) {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"6rem 1.5rem 3rem",maxWidth:800,margin:"0 auto"}}>
      <div style={{fontFamily:"var(--fh)",fontSize:".7rem",color:T.gold,letterSpacing:".2em",marginBottom:"1.2rem"}}>CONTEXTKIT</div>
      <h1 style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:"clamp(2.2rem,6vw,4rem)",lineHeight:.92,marginBottom:"1.2rem"}}>
        Build your AI's <span style={{color:T.gold}}>memory.</span>
      </h1>
      <p style={{fontSize:".95rem",color:T.txD,maxWidth:460,lineHeight:1.7,marginBottom:"2.5rem"}}>
        Your AI reads instructions before every response. How you organize them determines how good the AI is. Start by telling us who you are.
      </p>
      <div style={{fontFamily:"var(--fh)",fontSize:".75rem",color:T.goldD,letterSpacing:".12em",marginBottom:".8rem"}}>I AM A…</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:".8rem",maxWidth:600}}>
        {Object.entries(PERSONAS).map(([k,v]) => (
          <button key={k} onClick={() => onSelect(k)} style={{
            background:T.sf,border:`2px solid ${T.rule}`,borderRadius:8,padding:"1.1rem",
            cursor:"pointer",textAlign:"left",color:T.tx,transition:"all .2s"
          }}
          onMouseEnter={e => {e.currentTarget.style.borderColor=T.goldD;e.currentTarget.style.transform="translateY(-2px)"}}
          onMouseLeave={e => {e.currentTarget.style.borderColor=T.rule;e.currentTarget.style.transform="none"}}>
            <div style={{fontFamily:"var(--fh)",fontSize:".95rem",fontWeight:700,marginBottom:".2rem"}}>{v.label}</div>
            <div style={{fontSize:".72rem",color:T.txD,lineHeight:1.4}}>{v.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ SIMULATE ============
function SimulateTab({persona}) {
  const [selQ, setSelQ] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [activeCore, setActiveCore] = useState([]);
  const [scanIdx, setScanIdx] = useState(-1);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const tRef = useRef([]);

  const clr = () => { tRef.current.forEach(clearTimeout); tRef.current = []; };

  const run = (idx) => {
    clr();
    setSelQ(idx); setPhase("idle"); setActiveCore([]); setScanIdx(-1); setMatchedSkills([]); setShowAnswer(false);
    const sim = persona.sims[idx];
    let d = 200;

    tRef.current.push(setTimeout(() => setPhase("reading-core"), d));
    persona.core.forEach((c) => { d += 350; tRef.current.push(setTimeout(() => setActiveCore(p => [...p, c.id]), d)); });

    d += 400;
    tRef.current.push(setTimeout(() => setPhase("scanning"), d));
    persona.skills.forEach((_, i) => { d += 300; tRef.current.push(setTimeout(() => setScanIdx(i), d)); });

    d += 400;
    tRef.current.push(setTimeout(() => { setPhase("matching"); setScanIdx(-1); setMatchedSkills(sim.match); }, d));

    d += 500;
    tRef.current.push(setTimeout(() => setPhase("loading"), d));

    d += 600;
    tRef.current.push(setTimeout(() => { setPhase("responding"); setShowAnswer(true); }, d));
  };

  useEffect(() => () => clr(), []);
  const sim = selQ !== null ? persona.sims[selQ] : null;

  const nStyle = (active, scanning, matched, dim) => ({
    padding:".45rem .65rem",borderRadius:5,
    border:`1.5px solid ${matched?T.grn:active?T.gold:scanning?T.goldD+"77":T.rule}`,
    background:matched?T.grnD:active?T.goldD+"33":scanning?T.sf3:T.sf2,
    fontFamily:"var(--fm)",fontSize:".62rem",color:matched?T.tx:active?T.gold:scanning?T.txD:dim?T.txM:T.txD,
    transition:"all .3s cubic-bezier(.4,0,.2,1)",opacity:dim?.3:1,
    transform:(matched||active)?"scale(1.04)":"scale(1)",
    boxShadow:matched?`0 0 12px ${T.grnD}`:active?`0 0 10px ${T.goldG}`:"none",
    position:"relative",whiteSpace:"nowrap",
  });

  const dot = (color) => ({
    width:5,height:5,borderRadius:"50%",background:color,
    position:"absolute",top:-2,right:-2,animation:"pulse .8s ease-in-out infinite",
  });

  const conn = (lit) => ({width:2,height:14,margin:"0 auto",background:lit?T.gold:T.rule,transition:"background .3s"});
  const isDim = phase === "responding" || phase === "loading";

  return (
    <div>
      <p style={{color:T.txD,maxWidth:460,marginBottom:"1.2rem",fontSize:".88rem",lineHeight:1.7}}>
        Ask a question. Watch the AI decide which files to open.
      </p>
      <div style={{display:"flex",flexDirection:"column",gap:".4rem",marginBottom:"1.5rem"}}>
        <div style={{fontFamily:"var(--fm)",fontSize:".55rem",color:T.goldD,letterSpacing:".1em",marginBottom:".15rem"}}>TAP A QUESTION</div>
        {persona.sims.map((s,i) => (
          <button key={i} onClick={() => run(i)} style={{
            textAlign:"left",padding:".55rem .75rem",background:selQ===i?T.sf2:T.sf,
            border:`1px solid ${selQ===i?T.gold:T.rule}`,borderRadius:6,cursor:"pointer",
            color:selQ===i?T.gold:T.txD,fontFamily:"var(--fb)",fontSize:".8rem",lineHeight:1.4,transition:"all .2s",
          }}>"{s.q}"</button>
        ))}
      </div>

      {sim && (
        <div style={{background:T.sf,border:`1px solid ${T.rule}`,borderRadius:8,padding:"1rem",overflow:"hidden"}}>
          <div style={{textAlign:"center",marginBottom:".5rem",padding:".5rem",borderRadius:5,background:phase!=="idle"?T.sf3:"transparent",border:`1px solid ${phase!=="idle"?T.goldD:"transparent"}`,fontFamily:"var(--fb)",fontSize:".82rem",color:T.gold,fontStyle:"italic",transition:"all .3s"}}>
            "{sim.q}"
          </div>
          <div style={conn(phase!=="idle")} />
          <div style={{textAlign:"center",margin:".2rem 0",fontFamily:"var(--fm)",fontSize:".5rem",color:T.goldD,letterSpacing:".1em",minHeight:".8rem"}}>
            {phase==="reading-core"&&"READING CORE FILES…"}{phase==="scanning"&&"SCANNING SKILLS…"}{phase==="matching"&&"MATCH FOUND"}{phase==="loading"&&"LOADING SKILL…"}{phase==="responding"&&"GENERATING RESPONSE"}
          </div>

          <div style={{display:"flex",gap:".4rem",justifyContent:"center",marginBottom:".3rem",flexWrap:"wrap"}}>
            {persona.core.map(c => (
              <div key={c.id} style={nStyle(activeCore.includes(c.id),false,false,false)}>
                {activeCore.includes(c.id)&&<div style={dot(T.gold)}/>}{c.name}
              </div>
            ))}
          </div>
          <div style={conn(phase==="scanning"||phase==="matching"||phase==="loading"||phase==="responding")} />
          <div style={{display:"flex",gap:".35rem",justifyContent:"center",flexWrap:"wrap",marginBottom:".3rem"}}>
            {persona.skills.map((s,i) => {
              const m=matchedSkills.includes(s.id);
              return (
                <div key={s.id} style={nStyle(false,scanIdx===i,m,isDim&&!m)}>
                  {scanIdx===i&&<div style={dot(T.gold)}/>}{m&&<div style={dot(T.grn)}/>}{s.name}
                </div>
              );
            })}
          </div>

          {showAnswer && <>
            <div style={conn(true)} />
            <div style={{padding:".7rem",borderRadius:5,background:T.sf2,border:`1px solid ${T.grnD}`,fontFamily:"var(--fb)",fontSize:".8rem",color:T.txD,lineHeight:1.55,animation:"fadeUp .4s ease-out"}}>
              <div style={{fontFamily:"var(--fm)",fontSize:".5rem",color:T.grn,letterSpacing:".1em",marginBottom:".3rem"}}>RESPONSE</div>
              {sim.answer}
            </div>
          </>}

          <div style={{display:"flex",gap:".6rem",justifyContent:"center",marginTop:".8rem",fontSize:".52rem",fontFamily:"var(--fm)",color:T.txM,flexWrap:"wrap"}}>
            <span style={{display:"flex",alignItems:"center",gap:".2rem"}}><span style={{width:7,height:7,borderRadius:2,background:T.goldD+"55",border:`1px solid ${T.gold}`,display:"inline-block"}}/>Core</span>
            <span style={{display:"flex",alignItems:"center",gap:".2rem"}}><span style={{width:7,height:7,borderRadius:2,background:T.sf3,border:`1px solid ${T.rule}`,display:"inline-block"}}/>Scanned</span>
            <span style={{display:"flex",alignItems:"center",gap:".2rem"}}><span style={{width:7,height:7,borderRadius:2,background:T.grnD,border:`1px solid ${T.grn}`,display:"inline-block"}}/>Loaded</span>
            <span style={{display:"flex",alignItems:"center",gap:".2rem"}}><span style={{width:7,height:7,borderRadius:2,background:T.sf2,border:`1px solid ${T.rule}`,opacity:.3,display:"inline-block"}}/>Skipped</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ EXPLORER ============
function ExplorerTab({persona}) {
  const [sel,setSel] = useState(null);
  const all = [...persona.core,...persona.skills];
  const file = sel ? all.find(f => f.id===sel) : null;
  const isCore = sel ? persona.core.some(f => f.id===sel) : false;

  return (
    <div>
      <p style={{color:T.txD,maxWidth:460,marginBottom:"1.2rem",fontSize:".88rem",lineHeight:1.7}}>Click any file to see what goes inside and why.</p>
      <div style={{border:`1px solid ${T.rule}`,borderRadius:8,overflow:"hidden",background:T.sf}}>
        <div style={{background:T.bg,borderBottom:sel?`1px solid ${T.rule}`:"none",padding:".5rem 0",maxHeight:sel?170:"none",overflowY:"auto",transition:"max-height .3s"}}>
          <div style={{fontFamily:"var(--fm)",fontSize:".5rem",color:T.txM,letterSpacing:".1em",padding:"0 .8rem .4rem",borderBottom:`1px solid ${T.rule}`,marginBottom:".2rem"}}>FILE SYSTEM</div>
          <div style={{fontFamily:"var(--fm)",fontSize:".45rem",color:T.goldD,letterSpacing:".1em",padding:".3rem .8rem .1rem"}}>ALWAYS LOADED</div>
          {persona.core.map(f => <TI key={f.id} f={f} sel={sel===f.id} gold onClick={() => setSel(sel===f.id?null:f.id)} />)}
          <div style={{fontFamily:"var(--fm)",fontSize:".45rem",color:T.goldD,letterSpacing:".1em",padding:".4rem .8rem .1rem"}}>LOADS WHEN NEEDED</div>
          {persona.skills.map(f => <TI key={f.id} f={f} sel={sel===f.id} onClick={() => setSel(sel===f.id?null:f.id)} />)}
        </div>
        {file && (
          <div style={{padding:"1.1rem",borderTop:`1px solid ${T.rule}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".5rem"}}>
              <div>
                <div style={{fontFamily:"var(--fm)",fontSize:".5rem",color:T.txM,letterSpacing:".1em"}}>{isCore?"ALWAYS LOADED":"LOADS WHEN NEEDED"}</div>
                <div style={{fontFamily:"var(--fh)",fontSize:"1.2rem",fontWeight:700}}>{file.title}</div>
              </div>
              <button onClick={() => setSel(null)} style={{background:"none",border:`1px solid ${T.rule}`,borderRadius:4,color:T.txD,fontSize:".6rem",padding:".15rem .4rem",cursor:"pointer",fontFamily:"var(--fm)",flexShrink:0}}>close</button>
            </div>
            <div style={{fontSize:".76rem",color:T.gold,fontStyle:"italic",marginBottom:".7rem",paddingBottom:".5rem",borderBottom:`1px solid ${T.rule}`}}>{file.why}</div>
            <div style={{fontFamily:"var(--fm)",fontSize:".65rem",lineHeight:1.7,color:T.txD}}>
              {file.lines.map((l,i) => <FL key={i} l={l} />)}
            </div>
          </div>
        )}
        {!file && <div style={{padding:"1.5rem 1rem",textAlign:"center",color:T.txM,fontFamily:"var(--fm)",fontSize:".72rem"}}>Tap a file above to inspect it</div>}
      </div>
    </div>
  );
}

function TI({f,sel,gold,onClick}) {
  return (
    <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:".4rem",padding:".32rem .8rem .32rem 1rem",cursor:"pointer",fontFamily:"var(--fm)",fontSize:".68rem",color:sel?T.gold:T.txD,background:sel?T.sf2:"transparent",borderLeft:`3px solid ${sel?T.gold:"transparent"}`,transition:"all .12s"}}>
      <div style={{width:6,height:6,borderRadius:"50%",flexShrink:0,background:gold?T.goldD:(sel?T.grnD:T.sf3),border:gold?"none":`1px solid ${sel?T.grn:T.rule}`}} />
      {f.name}
    </div>
  );
}

function FL({l}) {
  if (l.h) return (<div style={{color:T.tx,fontWeight:600,marginTop:".5rem"}}>## {l.h}</div>);
  if (l.k) return (<div style={{padding:"1px 0"}}><span style={{color:T.gold}}>{l.k}:</span> <span style={{color:T.tx}}>{l.v}</span></div>);
  if (l.v) return (<div style={{padding:"1px 0",color:T.tx}}>{l.v}</div>);
  if (l.r) return (<div style={{padding:"1px 0",color:T.red,fontWeight:500}}>{l.r}</div>);
  if (l.c) return (<div style={{padding:"1px 0",color:T.txM,fontStyle:"italic"}}>{"# "+l.c}</div>);
  if (l.a) return (<div style={{display:"block",margin:".3rem 0 .5rem",padding:".4rem .55rem",background:"rgba(212,168,83,.04)",borderLeft:`2px solid ${T.goldD}`,fontFamily:"var(--fb)",fontSize:".72rem",color:T.txD,lineHeight:1.5,borderRadius:"0 4px 4px 0"}}>{l.a}</div>);
  return null;
}

// ============ BUILD (PROMPT + SETUP GUIDE) ============
function BuildTab({personaKey}) {
  const [copied, setCopied] = useState(false);
  const [openGuide, setOpenGuide] = useState(null);
  const [downloaded, setDownloaded] = useState(false);

  const prompt = buildPrompt(personaKey);
  const persona = PERSONAS[personaKey];

  const copy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const download = () => {
    const content = buildStarterKit(personaKey);
    const blob = new Blob([content], {type: "text/markdown;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contextkit-${personaKey}-starter.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const guides = [
    {
      id: "claude",
      name: "Claude.ai",
      difficulty: "Easy",
      steps: [
        "Go to claude.ai and create a new Project (left sidebar, 'Projects', then '+ Create')",
        "In the Project settings, paste your core files (identity, rules, tone) into the 'Custom Instructions' box. This loads them on every conversation inside that project.",
        "Upload each skill file as a document in the Project's Knowledge section. Claude will pull from them when relevant.",
        "Start a new conversation inside the project. Ask it something that should trigger a skill. Verify the right context loaded.",
        "To test: ask 'What files do you have access to?' and confirm it lists your skills.",
      ],
      tip: "Claude Projects are the closest match to the skill architecture. Each project can hold different skill sets for different areas of your life.",
    },
    {
      id: "chatgpt",
      name: "ChatGPT",
      difficulty: "Easy",
      steps: [
        "Go to Settings > Personalization > Custom Instructions.",
        "In 'What would you like ChatGPT to know about you?' paste your core identity file.",
        "In 'How would you like ChatGPT to respond?' paste your rules and tone files.",
        "For skills: ChatGPT doesn't have native skill loading. Instead, create a GPT (Explore > Create a GPT) with skills pasted into its instructions.",
        "Alternative: keep skill files in a notes app and paste the relevant one at the start of conversations that need it. Less automatic, but it works.",
      ],
      tip: "ChatGPT's Custom Instructions have a character limit (~1,500 chars each box). Keep core files tight. For heavy skill use, a custom GPT is better.",
    },
    {
      id: "gemini",
      name: "Google Gemini",
      difficulty: "Easy",
      steps: [
        "Open Gemini and go to Settings > Extensions or Gems.",
        "Create a Gem with your core files as the instruction set.",
        "For skills: paste them into the Gem instructions if they're small, or keep them in Google Docs and reference them.",
        "Start a conversation with the Gem and test that your rules are being followed.",
      ],
      tip: "Gems are Gemini's closest equivalent to a persistent AI config. One Gem per major role (work Gem, home Gem) works well.",
    },
    {
      id: "claude-code",
      name: "Claude Code",
      difficulty: "Technical",
      steps: [
        "In your project root, create a file called CLAUDE.md (or AGENTS.md). Paste your core files here. Claude Code reads this automatically.",
        "Create a /skills directory in your project root.",
        "Save each skill as its own folder: /skills/skill-name/SKILL.md",
        "Claude Code will read skill descriptions and load the full file only when the task matches.",
        "Test: ask Claude Code to do a task that should trigger a specific skill. Check if it references the skill content in its response.",
      ],
      tip: "This is the native format. Skills were designed for Claude Code. Your files work out of the box.",
    },
    {
      id: "cursor",
      name: "Cursor",
      difficulty: "Technical",
      steps: [
        "Create a .cursorrules file in your project root. Paste your core files here.",
        "For skills: create a /skills directory with SKILL.md files following the same format.",
        "Cursor reads .cursorrules on every interaction. Skills load when referenced or relevant.",
        "You can also add rules in Cursor Settings > Rules for AI.",
      ],
      tip: "Cursor's .cursorrules file is equivalent to AGENTS.md. Same concept, different filename.",
    },
    {
      id: "openclaw",
      name: "OpenClaw",
      difficulty: "Technical (but guided)",
      steps: [
        "PREREQUISITES\n\nYou need a Mac, Linux, or Windows (WSL2) computer, and an API key from an AI provider (Anthropic, OpenAI, etc). Mac is the easiest path. You'll use the Terminal app for everything below.",
        "INSTALL NODE.JS\n\nOpen Terminal and check if you have Node:\n\nnode --version\n\nYou need v22 or higher. If you don't have it, install it via Homebrew (Mac):\n\n/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"\nbrew install node\n\nApple Silicon users: if Homebrew tells you to add it to PATH, run the two commands it shows you, then open a new Terminal window.",
        "INSTALL OPENCLAW\n\nIn Terminal, run:\n\nnpm install -g openclaw@latest\n\nThen start the setup wizard:\n\nopenclaw onboard --install-daemon\n\nThe wizard walks you through:\n- Creating a Gateway token (save this)\n- Choosing your AI model + entering your API key\n- Optionally connecting a chat channel (Telegram, WhatsApp, etc)\n- Installing the background daemon so it stays running\n\nDon't stress about getting everything perfect. Every setting can be changed later in ~/.openclaw/openclaw.json",
        "VERIFY IT'S RUNNING\n\nAfter onboarding finishes:\n\nopenclaw doctor\n\nThis checks your setup for issues. Then test it:\n\nopenclaw agent --message \"Hello, what time is it?\"\n\nIf you get a response, OpenClaw is working. You can also open the web dashboard:\n\nopenclaw ui --open\n\nTo watch live logs:\n\nopenclaw logs --follow",
        "ADD YOUR CORE FILES\n\nYour core files (identity, rules, tone) go in the agent directory. Find it:\n\nls ~/.openclaw/agents/main/agent/\n\nCreate or edit the main agent file (this is your always-on config):\n\nnano ~/.openclaw/agents/main/agent/AGENTS.md\n\nPaste the core files that ContextKit generated for you. Save with Ctrl+O, Enter, Ctrl+X.",
        "CREATE YOUR FIRST SKILL\n\nSkills live in folders. Create one:\n\nmkdir -p ~/.openclaw/skills/meal-planning\n\nCreate the skill file:\n\nnano ~/.openclaw/skills/meal-planning/SKILL.md\n\nPaste in the skill content (with the YAML frontmatter at the top). The format looks like:\n\n---\nname: meal-planning\ndescription: >\n  Use this skill when the user asks about\n  dinner, recipes, or meal prep.\n---\n\n# Meal Planning\n## Preferences\n(your content here)\n\nSave the file. OpenClaw auto-detects new skills.",
        "VERIFY YOUR SKILLS LOADED\n\nList all active skills:\n\nopenclaw skills list\n\nYour new skill should appear. Now test it by talking to your agent and asking a question that should trigger it. Check the logs to confirm:\n\nopenclaw logs --follow\n\nYou should see the skill name referenced when the agent processes the matching question.",
        "ADD MORE SKILLS\n\nRepeat step 6 for each skill:\n\nmkdir -p ~/.openclaw/skills/school-logistics\nnano ~/.openclaw/skills/school-logistics/SKILL.md\n\nSkills in ~/.openclaw/skills/ are global (available in every workspace). For project-specific skills, put them in <your-project>/skills/ instead.",
        "INSTALL COMMUNITY SKILLS (OPTIONAL)\n\nBrowse skills at clawhub.ai. Install one:\n\nopenclaw skills install <skill-name>\n\nThis downloads into your workspace /skills directory. IMPORTANT: Review any community skill before installing. Read the SKILL.md file. Check what permissions it needs. Treat third-party skills as untrusted code.",
        "USEFUL COMMANDS\n\nopenclaw doctor          — check setup health\nopenclaw skills list     — see loaded skills\nopenclaw logs --follow   — watch live logs\nopenclaw daemon restart  — restart after config changes\nopenclaw daemon status   — check if running\nopenclaw gateway status  — check gateway\nopenclaw config edit     — open config in editor",
      ],
      tip: "Mac Mini M4 is the most popular dedicated OpenClaw machine. The daemon keeps it running 24/7 even when Terminal is closed. If you ever get 'command not found', your npm global directory isn't in your PATH. Run: npm config get prefix — then add /bin to that path in your shell config (~/.zshrc on Mac).",
    },
    {
      id: "manual",
      name: "Any AI / Manual Setup",
      difficulty: "Simple",
      steps: [
        "Save your core file somewhere you can quickly copy it (notes app, pinned doc, bookmarked file).",
        "At the start of important conversations, paste the core file as your first message.",
        "Save each skill as a separate note or file.",
        "When starting a task that matches a skill, paste that skill file into the conversation too.",
        "It's manual, but it works with any AI tool, no special features required.",
      ],
      tip: "This is the 'no-frills' approach. You're doing what the fancy tools automate. It still works because the principle is the same: only load what's relevant.",
    },
  ];

  return (
    <div>
      {/* STEP 1: GET YOUR FILES */}
      <div style={{fontFamily:"var(--fh)",fontSize:".7rem",color:T.goldD,letterSpacing:".12em",marginBottom:".4rem"}}>STEP 1</div>
      <div style={{fontFamily:"var(--fh)",fontSize:"1.15rem",fontWeight:700,marginBottom:".5rem"}}>Generate your files</div>
      <p style={{color:T.txD,maxWidth:480,marginBottom:"1.2rem",fontSize:".86rem",lineHeight:1.7}}>
        Two paths. The fast path gives you a ready-made starter kit for a {persona.label.toLowerCase()}. The custom path interviews you for a bespoke setup.
      </p>

      {/* Fast path: download starter kit */}
      <div style={{background:T.sf,border:`1px solid ${T.gold}`,borderRadius:8,padding:"1rem 1.1rem",marginBottom:"1rem",boxShadow:`0 0 0 1px ${T.goldD}33`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem",flexWrap:"wrap"}}>
          <div style={{flex:"1 1 280px",minWidth:0}}>
            <div style={{fontFamily:"var(--fm)",fontSize:".52rem",color:T.gold,letterSpacing:".12em",marginBottom:".25rem"}}>FAST PATH &middot; 10 SECONDS</div>
            <div style={{fontFamily:"var(--fh)",fontSize:"1rem",fontWeight:700,marginBottom:".35rem"}}>Download a starter kit</div>
            <div style={{fontSize:".75rem",color:T.txD,lineHeight:1.55}}>
              A single markdown file with all {persona.core.length} core files and {persona.skills.length} skills pre-filled for a {persona.label.toLowerCase()}. Fill in your name, timezone, and any placeholders, then paste into your AI tool.
            </div>
          </div>
          <button onClick={download} style={{
            padding:".4rem .9rem",fontFamily:"var(--fh)",fontSize:".78rem",fontWeight:700,letterSpacing:".05em",
            background:downloaded?T.grnD:T.gold,color:downloaded?T.tx:T.bg,
            border:"none",borderRadius:5,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap",flexShrink:0,
          }}>{downloaded?"Downloaded ✓":"Download .md"}</button>
        </div>
      </div>

      {/* Custom path: copy builder prompt */}
      <div style={{background:T.sf,border:`1px solid ${T.rule}`,borderRadius:8,overflow:"hidden",marginBottom:"2.5rem"}}>
        <div style={{padding:".55rem .8rem .3rem",fontFamily:"var(--fm)",fontSize:".52rem",color:T.goldD,letterSpacing:".12em"}}>CUSTOM PATH &middot; 5 MINUTES</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 .8rem .5rem",borderBottom:`1px solid ${T.rule}`}}>
          <span style={{fontFamily:"var(--fm)",fontSize:".62rem",color:T.gold}}>contextkit-builder-prompt.md</span>
          <button onClick={copy} style={{
            padding:".22rem .65rem",fontFamily:"var(--fh)",fontSize:".7rem",fontWeight:600,
            background:copied?T.grnD:T.gold,color:copied?T.tx:T.bg,
            border:"none",borderRadius:4,cursor:"pointer",transition:"all .2s",
          }}>{copied?"Copied":"Copy prompt"}</button>
        </div>
        <div style={{padding:".8rem",fontFamily:"var(--fm)",fontSize:".55rem",lineHeight:1.65,color:T.txD,maxHeight:220,overflowY:"auto",whiteSpace:"pre-wrap"}}>
          {prompt}
        </div>
      </div>

      {/* STEP 2: WHERE TO PUT THEM */}
      <div style={{fontFamily:"var(--fh)",fontSize:".7rem",color:T.goldD,letterSpacing:".12em",marginBottom:".4rem"}}>STEP 2</div>
      <div style={{fontFamily:"var(--fh)",fontSize:"1.15rem",fontWeight:700,marginBottom:".5rem"}}>Put the files where your AI can read them</div>
      <p style={{color:T.txD,maxWidth:480,marginBottom:"1.2rem",fontSize:".86rem",lineHeight:1.7}}>
        Pick the tool you use. Each one handles files differently.
      </p>

      <div style={{display:"flex",flexDirection:"column",gap:".6rem",marginBottom:"2.5rem"}}>
        {guides.filter(g => GUIDE_ALLOWLIST[personaKey].includes(g.id)).map(g => (
          <div key={g.id} style={{background:T.sf,border:`1px solid ${openGuide===g.id?T.gold:T.rule}`,borderRadius:8,overflow:"hidden",transition:"border-color .2s"}}>
            <button onClick={() => setOpenGuide(openGuide===g.id?null:g.id)} style={{
              width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:".7rem .9rem",background:"transparent",border:"none",cursor:"pointer",color:T.tx,textAlign:"left",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:".6rem"}}>
                <span style={{fontFamily:"var(--fh)",fontSize:".9rem",fontWeight:600}}>{g.name}</span>
                <span style={{fontFamily:"var(--fm)",fontSize:".55rem",color:T.txM,background:T.sf3,padding:".1rem .4rem",borderRadius:100}}>{g.difficulty}</span>
              </div>
              <span style={{fontFamily:"var(--fm)",fontSize:".7rem",color:T.goldD,transition:"transform .2s",transform:openGuide===g.id?"rotate(90deg)":"none"}}>&#9654;</span>
            </button>

            {openGuide===g.id && (
              <div style={{padding:"0 .9rem .9rem",borderTop:`1px solid ${T.rule}`,marginTop:0}}>
                <div style={{paddingTop:".7rem"}}>
                  {g.steps.map((step, si) => (
                    <div key={si} style={{display:"flex",gap:".6rem",marginBottom:".6rem",alignItems:"flex-start"}}>
                      <div style={{
                        fontFamily:"var(--fh)",fontSize:".85rem",fontWeight:700,color:T.goldD,
                        width:20,flexShrink:0,textAlign:"center",lineHeight:"1.4",
                      }}>{si+1}</div>
                      <div style={{fontSize:".78rem",color:T.txD,lineHeight:1.55,whiteSpace:"pre-wrap"}}>{step}</div>
                    </div>
                  ))}
                  <div style={{marginTop:".6rem",padding:".5rem .6rem",background:"rgba(212,168,83,.04)",borderLeft:`2px solid ${T.goldD}`,borderRadius:"0 4px 4px 0",fontSize:".74rem",color:T.txD,lineHeight:1.5,fontStyle:"italic"}}>
                    {g.tip}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* STEP 3: TEST IT */}
      <div style={{fontFamily:"var(--fh)",fontSize:".7rem",color:T.goldD,letterSpacing:".12em",marginBottom:".4rem"}}>STEP 3</div>
      <div style={{fontFamily:"var(--fh)",fontSize:"1.15rem",fontWeight:700,marginBottom:".5rem"}}>Test that it works</div>
      <p style={{color:T.txD,maxWidth:480,marginBottom:"1rem",fontSize:".86rem",lineHeight:1.7}}>
        Try these three tests after setup. If the AI behaves correctly on all three, your config is working.
      </p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:".7rem"}}>
        <div style={{background:T.sf,border:`1px solid ${T.rule}`,borderRadius:6,padding:".9rem"}}>
          <div style={{fontFamily:"var(--fh)",fontSize:".8rem",fontWeight:600,color:T.grn,marginBottom:".3rem"}}>Test 1: Skill trigger</div>
          <div style={{fontSize:".74rem",color:T.txD,lineHeight:1.5}}>Ask a question that should activate one specific skill. Does the AI use information from that skill without you mentioning it?</div>
        </div>
        <div style={{background:T.sf,border:`1px solid ${T.rule}`,borderRadius:6,padding:".9rem"}}>
          <div style={{fontFamily:"var(--fh)",fontSize:".8rem",fontWeight:600,color:T.gold,marginBottom:".3rem"}}>Test 2: Skill isolation</div>
          <div style={{fontSize:".74rem",color:T.txD,lineHeight:1.5}}>Ask about something unrelated to any skill. The AI should answer using only core context, not pulling in irrelevant skill data.</div>
        </div>
        <div style={{background:T.sf,border:`1px solid ${T.rule}`,borderRadius:6,padding:".9rem"}}>
          <div style={{fontFamily:"var(--fh)",fontSize:".8rem",fontWeight:600,color:T.gold,marginBottom:".3rem"}}>Test 3: Rules check</div>
          <div style={{fontSize:".74rem",color:T.txD,lineHeight:1.5}}>Try to get the AI to break one of your rules. If it refuses or flags it, your guardrails are working.</div>
        </div>
      </div>
    </div>
  );
}

// ============ LEARN ============
function LearnTab({persona}) {
  const rules = [
    {n:"01",t:"Keep the always-on file small",p:"Only your name, rules, and tone. Everything else waits."},
    {n:"02",t:"Skills are the unlock",p:"A skill sits idle using almost no memory until the AI needs it."},
    {n:"03",t:"Let the AI write the skill",p:"Succeed at a workflow once. Then have the AI write the skill from what worked."},
    {n:"04",t:"Fix it when it breaks",p:"Update the skill so the same mistake never recurs. Your setup improves over time."},
    {n:"05",t:"Earn complexity",p:"One workflow first. Make it reliable. Then add the next."},
    {n:"06",t:"Your process is the moat",p:"The AI knows everything. What it lacks is your way of doing things."},
  ];
  return (
    <div>
      <div style={{background:T.sf,border:`1px solid ${T.rule}`,borderRadius:8,padding:"1.2rem",marginBottom:"1.5rem"}}>
        <div style={{fontFamily:"var(--fh)",fontSize:"1.05rem",fontWeight:700,marginBottom:".4rem"}}>Why does this matter?</div>
        <p style={{fontSize:".84rem",color:T.txD,lineHeight:1.7,marginBottom:".5rem"}}>{persona.learnExamples.desk}</p>
        <p style={{fontSize:".84rem",color:T.txD,lineHeight:1.7}}>{persona.learnExamples.skill}</p>
      </div>
      <div style={{fontFamily:"var(--fh)",fontSize:"1.05rem",fontWeight:700,marginBottom:"1rem"}}>Six rules</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:".8rem"}}>
        {rules.map((r,i) => (
          <div key={i} style={{background:T.sf,border:`1px solid ${T.rule}`,borderRadius:8,padding:"1.1rem",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:i%2===0?T.gold:T.grn}} />
            <div style={{fontFamily:"var(--fh)",fontSize:"1.5rem",fontWeight:800,color:T.goldD,lineHeight:1,marginBottom:".25rem"}}>{r.n}</div>
            <div style={{fontFamily:"var(--fh)",fontSize:".88rem",fontWeight:600,marginBottom:".2rem"}}>{r.t}</div>
            <p style={{fontSize:".75rem",color:T.txD,lineHeight:1.5}}>{r.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ MAIN ============
function MainApp({pk, onReset}) {
  const [tab, setTab] = useState("simulate");
  const p = PERSONAS[pk];
  const tabs = [{id:"simulate",l:"Simulate"},{id:"explore",l:"Explore"},{id:"build",l:"Build Mine"},{id:"learn",l:"Learn"}];

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"5rem 1.2rem 2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.2rem",flexWrap:"wrap",gap:".8rem"}}>
        <div>
          <div style={{fontFamily:"var(--fm)",fontSize:".55rem",color:T.txM}}>SHOWING FOR</div>
          <div style={{fontFamily:"var(--fh)",fontSize:"1rem",fontWeight:700,display:"flex",alignItems:"center",gap:".5rem",flexWrap:"wrap"}}>
            {p.label}
            <button onClick={onReset} style={{fontSize:".58rem",color:T.goldD,background:"none",border:`1px solid ${T.rule}`,borderRadius:4,padding:".1rem .35rem",cursor:"pointer",fontFamily:"var(--fm)"}}>change</button>
          </div>
        </div>
        <div style={{display:"flex",gap:0,border:`1px solid ${T.rule}`,borderRadius:6,overflow:"hidden",flexWrap:"wrap"}}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:".42rem .7rem",fontFamily:"var(--fh)",fontSize:".7rem",fontWeight:600,
              background:tab===t.id?T.gold:"transparent",color:tab===t.id?T.bg:T.txD,border:"none",cursor:"pointer"
            }}>{t.l}</button>
          ))}
        </div>
      </div>
      {tab==="simulate" && <SimulateTab persona={p} />}
      {tab==="explore" && <ExplorerTab persona={p} />}
      {tab==="build" && <BuildTab personaKey={pk} />}
      {tab==="learn" && <LearnTab persona={p} />}
      <div style={{marginTop:"2.5rem",paddingTop:"1rem",borderTop:`1px solid ${T.rule}`,textAlign:"center"}}>
        <p style={{fontSize:".58rem",color:T.txM}}>&copy; MMXXVI &middot; <a href="https://danzus.co" style={{color:T.goldD,textDecoration:"none"}}>DANZUS Holdings LLC</a></p>
      </div>
    </div>
  );
}

export default function App() {
  const [pk, setPk] = useState(null);
  return (
    <div style={{background:T.bg,color:T.tx,minHeight:"100vh",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');:root{--fh:'Barlow Condensed',sans-serif;--fb:'DM Sans',sans-serif;--fm:'JetBrains Mono',monospace}*{box-sizing:border-box;margin:0;padding:0}input::placeholder{color:${T.txM}}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${T.bg}}::-webkit-scrollbar-thumb{background:${T.rule};border-radius:3px}@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Nav />
      {!pk ? <Intake onSelect={setPk} /> : <MainApp pk={pk} onReset={() => setPk(null)} />}
    </div>
  );
}
