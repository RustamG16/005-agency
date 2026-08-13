import Image from "next/image";
import Link from "next/link";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { aboutV3 } from "@/content/about-v3";
import { AboutInquiry } from "./AboutInquiry";
import { HandoffSequence, ProgramSelector, RecoveryMedia } from "./AboutV3Interactions";
import { TwoLensesMotionShell } from "./TwoLensesMotionShell";
import styles from "./TwoLensesPage.module.css";

function SectionIndex({ index, label, light = false }: { index: string; label: string; light?: boolean }) {
  return (
    <div className={`${styles.sectionIndex} ${light ? styles.sectionIndexLight : ""}`} aria-hidden="true">
      <span>{index}</span>
      <i />
      <span>{label}</span>
    </div>
  );
}

function FounderMediaHold({ side, name }: { side: "left" | "right"; name: string }) {
  return (
    <div className={`${styles.founderMediaHold} ${styles[side]}`} role="img" aria-label={`${name} portrait production placeholder`}>
      <span className={styles.holdTarget} aria-hidden="true"><i /><i /></span>
      <div>
        <small>Joint founder media</small>
        <strong>{name}</strong>
        <span>Portrait deferred</span>
      </div>
    </div>
  );
}

export function TwoLensesPage() {
  return (
    <TwoLensesMotionShell>
      <HeaderZone theme="dark">
        <section className={styles.hero} aria-labelledby="about-v3-title" data-about-hero>
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroTopline} data-hero-line>
            <span>{aboutV3.hero.eyebrow}</span>
            <span>{aboutV3.hero.location}</span>
          </div>

          <div className={styles.heroStage} aria-hidden="true" data-hero-stage>
            <div className={styles.heroFigureLeft}><i>R</i></div>
            <div className={styles.heroAperture}>
              <span>Founder film</span>
              <strong>Production hold</strong>
              <small>Rustam + Marija / walk scene deferred</small>
            </div>
            <div className={styles.heroFigureRight}><i>M</i></div>
          </div>

          <div className={styles.heroCopy} data-hero-copy>
            <h1 id="about-v3-title">{aboutV3.hero.title}</h1>
            <div className={styles.heroBody}>
              <p>{aboutV3.hero.body}</p>
              <a href="#about-founders">Meet the founders</a>
            </div>
          </div>
        </section>
      </HeaderZone>

      <HeaderZone theme="light">
        <section className={`${styles.section} ${styles.founders}`} id="about-founders" aria-labelledby="founders-title" data-reveal-section>
          <SectionIndex index="02" label="The founders" />
          <div className={styles.sectionHeading}>
            <h2 id="founders-title">Different ownership.<br />Shared accountability.</h2>
          </div>
          <div className={styles.founderGrid}>
            {aboutV3.founders.map((founder, index) => (
              <article className={styles.founderProfile} key={founder.key} data-reveal-item>
                <FounderMediaHold side={index === 0 ? "left" : "right"} name={founder.name} />
                <div className={styles.founderProfileCopy}>
                  <span>{String(index + 1).padStart(2, "0")} / {founder.role}</span>
                  <h3>{founder.name}</h3>
                  <p className={styles.founderStatement}>{founder.statement}</p>
                  <p>{founder.detail}</p>
                  {founder.key === "rustam" ? (
                    <a href="https://russolutions.netlify.app/" target="_blank" rel="noreferrer">Inspect Rustam&apos;s public record</a>
                  ) : (
                    <span className={styles.pendingLabel}>Biography and work pending confirmation</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </HeaderZone>

      <HeaderZone theme="light">
        <section className={`${styles.section} ${styles.arrival}`} aria-labelledby="arrival-title" data-reveal-section data-about-arrival>
          <SectionIndex index="03" label="The arrival" />
          <div className={styles.arrivalMedia} data-reveal-media>
            <picture>
              <source media="(max-width: 700px)" srcSet="/images/about-v3/arrival-mobile.webp" />
              <img src="/images/about-v3/arrival.webp" alt="A compact ivory-and-burgundy project companion rests safely on an acrylic intake surface in a quiet threshold space." width="1920" height="1080" loading="lazy" />
            </picture>
            <div className={styles.arrivalCopy}>
              <h2 id="arrival-title">An idea does not need theatre.<br />It needs attention.</h2>
              <span>One subject / unchanged scale / intact core</span>
            </div>
          </div>
        </section>
      </HeaderZone>

      <HeaderZone theme="dark">
        <section className={`${styles.section} ${styles.diagnosis}`} aria-labelledby="diagnosis-title" data-reveal-section>
          <SectionIndex index="04" label="Diagnosis" light />
          <div className={styles.sectionHeadingDark}>
            <h2 id="diagnosis-title">We make the real problem visible.</h2>
            <span>No invented quote. No diagnosis performed by an image model. The live record carries the meaning.</span>
          </div>
          <div className={styles.diagnosisGrid}>
            <div className={styles.labMedia} data-reveal-media>
              <picture>
                <source media="(max-width: 700px)" srcSet="/images/about-v3/lab-mobile.webp" />
                <img src="/images/about-v3/lab.webp" alt="The same compact companion sits on a restrained diagnostic surface surrounded by careful physical markers." width="1920" height="1080" loading="lazy" />
              </picture>
            </div>
            <div className={styles.dossier} aria-label="Idea profile diagnostic questions">
              <div className={styles.dossierHeader}><span>Idea profile</span><span>01 / live record</span></div>
              {aboutV3.dossier.map((item, index) => (
                <div className={styles.dossierRow} key={item.label} data-reveal-item data-dossier-reveal>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{item.label}</strong><p>{item.value}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </HeaderZone>

      <HeaderZone theme="light">
        <section className={`${styles.section} ${styles.programs}`} aria-labelledby="programs-title" data-reveal-section>
          <SectionIndex index="05" label="The choice" />
          <div className={styles.programsHeading}>
            <div>
              <h2 id="programs-title">Three credible futures.</h2>
            </div>
            <p>We do not force a rebrand when repair is enough. Each direction is tested against the same agreed profile before one is selected.</p>
          </div>
          <ProgramSelector />
          <p className={styles.conceptNote}>Concept demonstration using one consistent fictional companion—not client work.</p>
        </section>
      </HeaderZone>

      <HeaderZone theme="dark">
        <section className={`${styles.section} ${styles.handoff}`} aria-labelledby="handoff-title" data-reveal-section>
          <SectionIndex index="06" label="System intake" light />
          <div className={styles.handoffHeading}>
            <div>
              <h2 id="handoff-title">Responsibility enters the system.</h2>
            </div>
            <div>
              <p>Rustam entrusts Apollo with the same compact idea and one approved plan. The exchange starts coordination—not production theatre.</p>
              <span>Original Rustam identity authorities / locked Apollo / locked companion</span>
            </div>
          </div>
          <HandoffSequence />
        </section>
      </HeaderZone>

      <HeaderZone theme="light">
        <section className={`${styles.section} ${styles.orchestration}`} aria-labelledby="orchestration-title" data-reveal-section>
          <SectionIndex index="07" label="Orchestration" />
          <div className={styles.orchestrationIntro}>
            <div>
              <h2 id="orchestration-title">The route is visible.<br />The internals stay private.</h2>
            </div>
            <p>Apollo decomposes the approved direction into bounded work packages, matches each to a specialist role and skill, then returns reviewed outputs for integration under founder accountability.</p>
          </div>

          <div className={styles.atlas}>
            <div className={styles.atlasImage} data-reveal-media>
              <Image src="/images/about-v3/orchestration-overview.webp" alt="Editorial overview of Apollo coordinating five bounded specialist lanes around one approved plan." fill sizes="(max-width: 900px) 100vw, 45vw" />
            </div>
            <ol className={styles.atlasFlow} aria-label="Public orchestration flow">
              <li><span>Input</span><strong>Approved plan</strong><p>One direction, constraints and acceptance criteria.</p></li>
              <li><span>Coordinator</span><strong>Apollo</strong><p>Packages work, tracks dependencies and protects the agreed route.</p></li>
              <li><span>Integration</span><strong>Reviewed system</strong><p>Outputs return to one coherent experience before founder review.</p></li>
              <li><span>Accountability</span><strong>Rustam</strong><p>Final technical and design direction remains human-owned.</p></li>
            </ol>
          </div>

          <div className={styles.specialistLanes}>
            {aboutV3.lanes.map((lane, index) => (
              <article key={lane.key} data-reveal-item>
                <div className={styles.laneMedia}><Image src={lane.image} alt="" fill sizes="(max-width: 767px) 44vw, 18vw" /></div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{lane.title}</h3>
                <p>{lane.skill}</p>
              </article>
            ))}
          </div>
          <p className={styles.publicBoundary}>Role categories and handoffs only. No prompts, private skills, hidden checks or reproducible internal routing are exposed.</p>
        </section>
      </HeaderZone>

      <HeaderZone theme="dark">
        <section className={`${styles.section} ${styles.recovery}`} aria-labelledby="recovery-title" data-reveal-section>
          <SectionIndex index="08" label="Recovery" light />
          <div className={styles.recoveryGrid}>
            <div className={styles.recoveryCopy}>
              <h2 id="recovery-title">Built to work.<br />Returned coherent.</h2>
              <p>The apparatus recedes. The result must stand without the process around it: recognisable, functional and ready for accountable review.</p>
              <ul>
                <li><span>01</span>Same compact scale</li>
                <li><span>02</span>One coherent endpoint</li>
                <li><span>03</span>Forward-only physical motion</li>
              </ul>
            </div>
            <RecoveryMedia />
          </div>
        </section>
      </HeaderZone>

      <HeaderZone theme="light">
        <section className={`${styles.section} ${styles.proof}`} aria-labelledby="proof-title" data-reveal-section>
          <SectionIndex index="09" label="Proof" />
          <div className={styles.proofHeading}>
            <div>
              <h2 id="proof-title">Proof without outcome theatre.</h2>
            </div>
            <p>These examples demonstrate proposed digital craft. They are not presented as shipped Convenium results, testimonials or performance evidence.</p>
          </div>
          <div className={styles.proofGrid}>
            {aboutV3.proof.map((project, index) => (
              <article key={project.key} data-reveal-item>
                <Link href={project.href} className={styles.proofMedia} aria-label={`View the work index for ${project.title}`}>
                  <Image src={project.image} alt={`${project.title} proposal cover.`} fill sizes="(max-width: 767px) 100vw, 50vw" />
                  <span>{String(index + 1).padStart(2, "0")} / Proposal evidence</span>
                </Link>
                <div className={styles.proofCopy}>
                  <div><p>{project.type}</p><h3>{project.title}</h3></div>
                  <p>{project.note}</p>
                </div>
              </article>
            ))}
          </div>
          <Link href="/works" className={styles.indexLink}>Review the current work index</Link>
        </section>
      </HeaderZone>

      <HeaderZone theme="dark">
        <section className={`${styles.section} ${styles.inquiry}`} aria-label="Start a project inquiry" data-reveal-section>
          <SectionIndex index="10" label="Begin" light />
          <AboutInquiry />
        </section>
      </HeaderZone>
    </TwoLensesMotionShell>
  );
}
