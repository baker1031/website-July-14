"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const VIDEO_SOURCE =
  "https://videos.pexels.com/video-files/3129595/3129595-uhd_2560_1440_25fps.mp4";
const HERO_POSTER =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=85";

const GOALS = [
  "All goals",
  "Monthly Income",
  "1031 Exchange",
  "Estate Planning",
  "Diversification",
  "Long-Term Growth",
];

const STRATEGIES = [
  {
    title: "Delaware Statutory Trust (DST) Properties",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
    description:
      "Fractional ownership in professionally managed real estate designed to support passive income and replacement-property planning.",
    goals: ["Monthly Income", "1031 Exchange", "Estate Planning"],
  },
  {
    title: "Qualified Opportunity Zone Funds",
    image:
      "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=1400&q=85",
    description:
      "Funds focused on eligible development and redevelopment opportunities for investors evaluating long-horizon growth strategies.",
    goals: ["Long-Term Growth", "Diversification", "Estate Planning"],
  },
  {
    title: "Real Estate Investment Trusts (REITs)",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
    description:
      "A more liquid real estate structure for investors seeking access to diversified portfolios and professionally managed property exposure.",
    goals: ["Monthly Income", "Diversification", "Long-Term Growth"],
  },
  {
    title: "721 Exchange (UPREIT) DST Properties",
    image:
      "https://images.unsplash.com/photo-1503387762-592deo58a6d?auto=format&fit=crop&w=1400&q=85",
    description:
      "A potential path from private real estate ownership into an operating partnership, subject to offering terms and professional advice.",
    goals: ["1031 Exchange", "Diversification", "Long-Term Growth"],
  },
  {
    title: "Mineral Royalties",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85",
    description:
      "Specialty real asset exposure tied to royalty interests, with a distinct income profile and a different set of diligence questions.",
    goals: ["Monthly Income", "Diversification", "Estate Planning"],
  },
];

const FULL_CYCLE_ROWS = [
  [
    {
      name: "Bluewater Medical Campus",
      sponsor: "Northstar Real Assets",
      annualReturn: "6.42%",
      multiple: "1.58x",
      hold: "7 years",
      propertyType: "Healthcare",
    },
    {
      name: "Atlas Distribution Center",
      sponsor: "Harborline Capital",
      annualReturn: "6.78%",
      multiple: "1.71x",
      hold: "10 years",
      propertyType: "Industrial",
    },
    {
      name: "Eastfield Market Hall",
      sponsor: "Lumen Ridge Partners",
      annualReturn: "6.11%",
      multiple: "1.49x",
      hold: "6 years",
      propertyType: "Retail",
    },
  ],
  [
    {
      name: "Juniper Garden Apartments",
      sponsor: "Crestview Residential",
      annualReturn: "7.06%",
      multiple: "1.82x",
      hold: "9 years",
      propertyType: "Multifamily",
    },
    {
      name: "Copperline Business Park",
      sponsor: "Oak & Pine Advisors",
      annualReturn: "6.72%",
      multiple: "1.66x",
      hold: "8 years",
      propertyType: "Industrial",
    },
    {
      name: "Northlake Medical Pavilion",
      sponsor: "Stonebridge Holdings",
      annualReturn: "6.60%",
      multiple: "1.57x",
      hold: "10 years",
      propertyType: "Medical Office",
    },
  ],
  [
    {
      name: "Sierra Ridge Flats",
      sponsor: "Red Oak Communities",
      annualReturn: "6.55%",
      multiple: "1.63x",
      hold: "8 years",
      propertyType: "Multifamily",
    },
    {
      name: "High Plains Royalty Trust",
      sponsor: "Frontier Mineral Partners",
      annualReturn: "7.55%",
      multiple: "1.86x",
      hold: "10 years",
      propertyType: "Mineral Royalties",
    },
    {
      name: "Summit Office Commons",
      sponsor: "Summit Street Capital",
      annualReturn: "6.80%",
      multiple: "1.54x",
      hold: "7 years",
      propertyType: "Office",
    },
  ],
];

function formatGoalCount(count: number) {
  return `${count} ${count === 1 ? "strategy" : "strategies"}`;
}

export default function Home() {
  const [activeGoal, setActiveGoal] = useState(GOALS[0]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const visibleStrategies = useMemo(
    () =>
      activeGoal === GOALS[0]
        ? STRATEGIES
        : STRATEGIES.filter((strategy) => strategy.goals.includes(activeGoal)),
    [activeGoal],
  );

  useEffect(() => {
    const rows = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cycle-row]"),
    );
    if (!rows.length) return;

    const updateRows = () => {
      rows.forEach((row) => {
        const bounds = row.getBoundingClientRect();
        const centerOffset = bounds.top + bounds.height / 2 - window.innerHeight / 2;
        const shift = Math.max(-28, Math.min(28, centerOffset * -0.035));
        const direction = row.dataset.direction === "reverse" ? -1 : 1;
        row.style.setProperty("--scroll-shift", `${shift * direction}px`);
      });
    };

    updateRows();
    window.addEventListener("scroll", updateRows, { passive: true });
    window.addEventListener("resize", updateRows);
    return () => {
      window.removeEventListener("scroll", updateRows);
      window.removeEventListener("resize", updateRows);
    };
  }, []);

  function handleAccessRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Property Exchange home">
          <span className="wordmark-mark" aria-hidden="true">PX</span>
          <span>Property Exchange</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="property-exchange-cards.html#property-catalog">Investments</a>
          <a href="content.html">Content</a>
          <a href="learning-hub.html">Learning Hub</a>
        </nav>
        <span className="header-note">New opportunities, thoughtfully selected</span>
      </header>

      <section className="home-hero" id="top">
        <video className="home-hero-video" autoPlay muted loop playsInline poster={HERO_POSTER} aria-hidden="true">
          <source src={VIDEO_SOURCE} type="video/mp4" />
        </video>
        <div className="home-hero-overlay" aria-hidden="true" />
        <div className="home-hero-content">
          <div className="home-hero-copy">
            <p className="eyebrow eyebrow-light">Property Exchange</p>
            <h1>Build confidence for your next exchange.</h1>
            <p>
              Thoughtfully selected real estate opportunities, practical education, and a clearer way to evaluate what comes next.
            </p>
          </div>
          <div className="access-card">
            <p className="access-kicker">Start with access</p>
            <h2>Request Investment Access</h2>
            <p>Enter your email to receive access to current offerings and future opportunities.</p>
            <form onSubmit={handleAccessRequest}>
              <label htmlFor="access-email">Email address</label>
              <div className="access-form-row">
                <input
                  id="access-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setSubmitted(false);
                  }}
                />
                <button type="submit">Request access</button>
              </div>
            </form>
            <p className="access-note" aria-live="polite">
              {submitted ? "Thanks — your request has been noted for follow-up." : "No commitment. We’ll use your information to respond to your request."}
            </p>
          </div>
        </div>
      </section>

      <section className="home-section strategy-section" id="strategies" aria-labelledby="strategies-heading">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Explore the possibilities</p>
            <h2 id="strategies-heading">Strategies built around your goals.</h2>
          </div>
          <p className="section-intro-copy">Different structures can support different objectives. Start with what matters most to you.</p>
        </div>
        <div className="goal-pills" aria-label="Filter investment strategies by goal">
          {GOALS.map((goal) => (
            <button
              className={`goal-pill${activeGoal === goal ? " is-active" : ""}`}
              type="button"
              key={goal}
              aria-pressed={activeGoal === goal}
              onClick={() => setActiveGoal(goal)}
            >
              {goal}
            </button>
          ))}
        </div>
        <div className="strategy-grid">
          {visibleStrategies.map((strategy) => (
            <article className="strategy-card" key={strategy.title}>
              <div className="strategy-image-wrap"><img src={strategy.image} alt="" loading="lazy" /></div>
              <div className="strategy-card-body">
                <p className="strategy-count">{formatGoalCount(strategy.goals.length)}</p>
                <h3>{strategy.title}</h3>
                <p>{strategy.description}</p>
                <div className="strategy-tags">
                  {strategy.goals.map((goal) => <span key={goal}>{goal}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section full-cycle-section" id="full-cycle" aria-labelledby="full-cycle-heading">
        <div className="section-intro">
          <div>
            <p className="eyebrow">A record of completed cycles</p>
            <h2 id="full-cycle-heading">Full-Cycle Investments</h2>
          </div>
          <p className="section-intro-copy">Historical examples are shown for context and are not a guarantee of future results.</p>
        </div>
        <div className="cycle-rows">
          {FULL_CYCLE_ROWS.map((row, rowIndex) => (
            <div className="cycle-row" data-cycle-row data-direction={rowIndex === 1 ? "reverse" : "forward"} key={`row-${rowIndex}`}>
              {row.map((investment) => (
                <article className="cycle-card" key={investment.name}>
                  <div className="cycle-card-top"><span>Full-cycle</span><span>{investment.propertyType}</span></div>
                  <h3>{investment.name}</h3>
                  <p className="cycle-sponsor">{investment.sponsor}</p>
                  <dl className="cycle-metrics">
                    <div><dt>Annual return</dt><dd>{investment.annualReturn}</dd></div>
                    <div><dt>Equity multiple</dt><dd>{investment.multiple}</dd></div>
                    <div><dt>Hold period</dt><dd>{investment.hold}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="home-section about-section" id="about" aria-labelledby="about-heading">
        <div className="about-copy">
          <p className="eyebrow">About our firm</p>
          <h2 id="about-heading">A steadier way to evaluate what’s next.</h2>
          <p>
            Baker 1031 helps investors make sense of exchange-related real estate decisions through thoughtful offering review, practical education, and a clear view of the details that matter.
          </p>
          <p>
            Our role is to help you ask better questions, understand the tradeoffs, and connect a strategy to your broader investment plan.
          </p>
          <a className="text-link" href="content.html">Learn more about our approach <span aria-hidden="true">↗</span></a>
        </div>
        <div className="about-stats" aria-label="Firm overview">
          <div><strong>1031</strong><span>Exchange-focused perspective</span></div>
          <div><strong>5</strong><span>Strategy categories to explore</span></div>
          <div><strong>1</strong><span>Clearer starting point</span></div>
        </div>
      </section>

      <section className="home-section faq-section" id="faq" aria-labelledby="faq-heading">
        <div className="section-intro">
          <div><p className="eyebrow">Questions, answered</p><h2 id="faq-heading">Frequently Asked Questions</h2></div>
          <p className="section-intro-copy">A starting point for learning how the Property Exchange is organized.</p>
        </div>
        <div className="faq-list">
          <details open><summary>What is the Property Exchange?</summary><p>The Property Exchange is a place to explore real estate investment structures, current offerings, educational resources, and the questions investors should consider before making a decision.</p></details>
          <details><summary>How do I request investment access?</summary><p>Submit your email in the access form above. The current form is a prototype and will be connected to the appropriate access workflow later.</p></details>
          <details><summary>Which strategies can I explore?</summary><p>You can browse DST properties, Qualified Opportunity Zone Funds, REITs, 721 Exchange strategies, and Mineral Royalties, with additional categories added over time.</p></details>
          <details><summary>Are the full-cycle examples a promise of future performance?</summary><p>No. Full-cycle examples are provided for context only. Historical performance does not guarantee future results, and every offering requires its own review.</p></details>
        </div>
      </section>

      <footer className="site-footer"><span>Property Exchange</span><span>Learn with clarity. Invest with confidence.</span></footer>
    </main>
  );
}
