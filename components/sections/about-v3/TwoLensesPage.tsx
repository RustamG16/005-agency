import Link from "next/link";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { aboutV3, type BriefReading } from "@/content/about-v3";
import { AboutInquiry } from "./AboutInquiry";
import { ConversationReel } from "./ConversationReel";
import { LanguageContinuity } from "./LanguageContinuity";
import { TwoLensesMotionShell } from "./TwoLensesMotionShell";
import styles from "./TwoLensesPage.module.css";

type MediaPlaceholderProps = {
  assetId: string;
  title: string;
  detail: string;
  className?: string;
  focalSide?: "left" | "center" | "right";
  initial?: string;
};

function MediaPlaceholder({
  assetId,
  title,
  detail,
  className = "",
  focalSide = "center",
  initial,
}: MediaPlaceholderProps) {
  return (
    <div
      className={`${styles.mediaPlaceholder} ${styles[`focal${focalSide}`]} ${className}`}
      data-development-placeholder={assetId.toLowerCase()}
      data-media-asset={assetId}
      role="img"
      aria-label={`${assetId}: ${title}. ${detail}`}
    >
      <div className={styles.mediaDiagram} aria-hidden="true">
        <span className={styles.mediaSafeArea}>Safe area</span>
        <span className={styles.mediaFocalPoint}>{initial ?? "•"}</span>
        <span className={styles.mediaAxis} />
      </div>
      <div className={styles.mediaPlaceholderCopy}>
        <span className={styles.mediaAssetId}>{assetId}</span>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}

function PortraitPlaceholder({ founder }: { founder: "rustam" | "marija" }) {
  const isRustam = founder === "rustam";

  return (
    <MediaPlaceholder
      assetId={isRustam ? "A03" : "A04"}
      title={`${isRustam ? "Rustam" : "Marija"} opening portrait`}
      detail={isRustam ? "4:5 · subject outer-left · gaze inward" : "4:5 · subject outer-right · gaze inward"}
      className={`${styles.portraitPlaceholder} ${styles[founder]}`}
      focalSide={isRustam ? "left" : "right"}
      initial={isRustam ? "R" : "M"}
    />
  );
}

function BriefVisual({ reading }: { reading: BriefReading }) {
  const visualPlans = {
    warmth: {
      assetId: "A14-01",
      title: "Warmth through a human cue",
      detail: "8:5 · gesture, material or welcome moment · not architecture-only",
    },
    continuity: {
      assetId: "A14-02",
      title: "Modern system, established signal",
      detail: "8:5 · real interface behavior plus one durable physical cue",
    },
    memory: {
      assetId: "A14-03",
      title: "One memorable signature",
      detail: "8:5 · a single repeatable gesture, crop or interaction detail",
    },
  } as const;
  const plan = visualPlans[reading.visual];

  return (
    <MediaPlaceholder
      assetId={plan.assetId}
      title={plan.title}
      detail={plan.detail}
      className={styles.briefVisual}
    />
  );
}

export function TwoLensesPage() {
  return (
    <TwoLensesMotionShell>
      <HeaderZone theme="light">
        <section className={styles.hero} aria-labelledby="about-v3-title" data-about-hero>
          <span className={styles.liveSeam} aria-hidden="true" data-about-seam />
          <div className={styles.heroIndex} aria-hidden="true">
            <span>About</span>
            <span className={styles.heroRail}>
              <i />
              <i className={styles.heroRailActive} />
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className={`${styles.founderOpening} ${styles.rustamOpening}`} data-founder-opening="rustam">
            <div className={styles.founderCopy}>
              <p className={styles.founderName}>{aboutV3.hero.founders[0].name}</p>
              <p className={styles.founderStatement}>{aboutV3.hero.founders[0].statement}</p>
              <p className={styles.founderDetail}>{aboutV3.hero.founders[0].detail}</p>
            </div>
            <PortraitPlaceholder founder="rustam" />
          </div>

          <div className={`${styles.founderOpening} ${styles.marijaOpening}`} data-founder-opening="marija">
            <div className={styles.founderCopy}>
              <p className={styles.founderName}>{aboutV3.hero.founders[1].name}</p>
              <p className={styles.founderStatement}>{aboutV3.hero.founders[1].statement}</p>
              <p className={styles.founderDetail}>{aboutV3.hero.founders[1].detail}</p>
            </div>
            <PortraitPlaceholder founder="marija" />
          </div>

          <div className={styles.sharedHero} data-shared-thesis>
            <h1 id="about-v3-title">{aboutV3.hero.title}</h1>
            <div className={styles.heroSupport}>
              <p>{aboutV3.hero.support}</p>
              <p className={styles.location}>{aboutV3.hero.location}</p>
            </div>
          </div>
        </section>
      </HeaderZone>

      <HeaderZone theme="light">
        <section className={`wrap ${styles.origins}`} aria-labelledby="origins-title">
          <div className={styles.sectionIntro}>
            <h2 id="origins-title">{aboutV3.origins.title}</h2>
            <p>{aboutV3.origins.intro}</p>
          </div>

          <div className={styles.originGrid}>
            <div className={styles.originFounder}>
              <div className={styles.originHead}>
                <span>R</span>
                <h3>Rustam</h3>
              </div>
              <div className={styles.originMediaPlan} aria-label="Planned Rustam process media">
                <MediaPlaceholder
                  assetId="A06-01"
                  title="Observed working portrait"
                  detail="3:4 · Rustam making one visible system decision"
                  className={styles.originPrimaryMedia}
                  focalSide="left"
                  initial="R"
                />
                <MediaPlaceholder
                  assetId="A06-02"
                  title="Decision detail"
                  detail="3:2 · real hands, interface and paper relationship"
                  className={styles.originDetailMedia}
                  focalSide="right"
                />
              </div>
              <ol className={styles.timeline}>
                {aboutV3.origins.rustam.map((item) => (
                  <li key={item.title} data-origin-milestone>
                    <span className={styles.timelineDot} aria-hidden="true" />
                    <p className={styles.provenance}>{item.provenance}</p>
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                  </li>
                ))}
              </ol>
              <div className={styles.originLinks}>
                <a href="https://russolutions.netlify.app/" target="_blank" rel="noreferrer">
                  Rustam portfolio
                </a>
                <a href="https://russolutions.netlify.app/cv" target="_blank" rel="noreferrer">
                  Public CV
                </a>
              </div>
            </div>

            <div className={`${styles.originFounder} ${styles.marijaOrigin}`}>
              <div className={styles.originHead}>
                <span>M</span>
                <h3>Marija</h3>
              </div>
              <div className={styles.originMediaPlan} aria-label="Planned Marija process media">
                <MediaPlaceholder
                  assetId="A07-01"
                  title="Observed communication portrait"
                  detail="3:4 · Marija editing sequence, tone or audience meaning"
                  className={styles.originPrimaryMedia}
                  focalSide="right"
                  initial="M"
                />
                <MediaPlaceholder
                  assetId="A07-02"
                  title="Communication detail"
                  detail="3:2 · a real decision artifact, not a generic moodboard"
                  className={styles.originDetailMedia}
                  focalSide="left"
                />
              </div>
              <div className={styles.provisionalPanel} role="note">
                <p className={styles.provenance}>Development placeholder</p>
                <h4>Verified founder record required</h4>
                <p>
                  Biography, dates, named work, contribution boundaries, language roles and
                  publishable artifacts remain intentionally unpublished until Marija confirms
                  them.
                </p>
              </div>
              <div className={styles.placeholderRows} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </section>
      </HeaderZone>

      <HeaderZone theme="dark">
        <section className={`wrap ${styles.reelSection}`} aria-labelledby="reel-title">
          <div className={styles.darkIntro}>
            <h2 id="reel-title">Conversation reel</h2>
            <p>
              The final reel will place systems, interfaces and implementation beside visual
              communication and human context, then let the strongest work occupy the whole frame.
            </p>
          </div>
          <ConversationReel />
        </section>
      </HeaderZone>

      <HeaderZone theme="light">
        <section className={`wrap ${styles.briefSection}`} aria-labelledby="brief-title">
          <div className={styles.sectionIntro}>
            <h2 id="brief-title">How we read a brief</h2>
            <p>
              Structured conversation uncovers motives, references and trade-offs behind the first
              wording. These examples demonstrate the method; they are not client quotes or client
              work.
            </p>
            <p className={styles.demoLabel}>Demonstration — not client work</p>
          </div>

          <div className={styles.briefReadings}>
            {aboutV3.briefReadings.map((reading, index) => (
              <article className={styles.briefReading} key={reading.phrase} data-brief-reading>
                <div className={styles.briefPrompt}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>“{reading.phrase}”</h3>
                  <BriefVisual reading={reading} />
                </div>
                <div className={styles.readingVoices}>
                  <div>
                    <p className={styles.voiceLabel}>Rustam reads</p>
                    <p>{reading.rustam}</p>
                  </div>
                  <div>
                    <p className={styles.voiceLabel}>Marija reads</p>
                    <p>{reading.marija}</p>
                  </div>
                  <div className={styles.sharedDecision}>
                    <p className={styles.voiceLabel}>We decide</p>
                    <p>{reading.decision}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </HeaderZone>

      <HeaderZone theme="light">
        <section className={`wrap ${styles.languageSection}`} aria-labelledby="language-title">
          <div className={styles.sectionIntro}>
            <h2 id="language-title">Our language, one continuity.</h2>
            <p>
              The operating system is simple: match the conversation, write the interpretation,
              confirm it, and carry the same record into implementation.
            </p>
          </div>
          <LanguageContinuity />
        </section>
      </HeaderZone>

      <HeaderZone theme="light">
        <section className={`wrap ${styles.duetSection}`} aria-labelledby="duet-title">
          <div className={styles.sectionIntro}>
            <h2 id="duet-title">Different ownership. Shared accountability.</h2>
            <p>
              Responsibilities alternate, but the decision never disappears between disciplines.
              Deliverables stay on the Services page; this is how the relationship behaves.
            </p>
          </div>

          <div className={styles.duetTable}>
            <div className={styles.duetHeader} aria-hidden="true">
              <span />
              <span>R</span>
              <span>M</span>
              <span>We</span>
            </div>
            {aboutV3.decisionRows.map((row) => (
              <article className={styles.duetRow} key={row.title} data-duet-row>
                <h3>{row.title}</h3>
                <p><span className={styles.mobileVoice}>Rustam</span>{row.rustam}</p>
                <p><span className={styles.mobileVoice}>Marija</span>{row.marija}</p>
                <p className={styles.duetShared}><span className={styles.mobileVoice}>Together</span>{row.shared}</p>
              </article>
            ))}
          </div>
          <Link href="/services" className={styles.textLink}>See service scopes</Link>
        </section>
      </HeaderZone>

      <HeaderZone theme="dark">
        <section className={`wrap ${styles.credibility}`} aria-labelledby="credibility-title">
          <div className={styles.darkIntro}>
            <h2 id="credibility-title">Credibility without scale theatre.</h2>
            <p>Every proof item keeps its source visible. No employer is presented as a Convenium client.</p>
          </div>

          <div className={styles.ledger}>
            <article>
              <p className={styles.ledgerLabel}>Founder career</p>
              <h3>Experience you can inspect</h3>
              <p>Rustam’s public portfolio and CV hold the current career record and linked documents.</p>
              <a href="https://russolutions.netlify.app/" target="_blank" rel="noreferrer">Open portfolio</a>
            </article>
            <article>
              <p className={styles.ledgerLabel}>Independent work</p>
              <h3>Contribution before claim</h3>
              <p>Two selected digital pieces will appear only after publication rights and contribution labels are confirmed.</p>
              <span className={styles.pendingEvidence}>Development evidence slot</span>
            </article>
            <article>
              <p className={styles.ledgerLabel}>Convenium standard</p>
              <h3>Direct access, written decisions</h3>
              <p>Founder accountability, language continuity and honest scope are operating commitments—not invented outcomes.</p>
              <Link href="/works">Review current work index</Link>
            </article>
          </div>
        </section>
      </HeaderZone>

      <HeaderZone theme="dark">
        <section className={`wrap ${styles.inquirySection}`} aria-label="Start a project inquiry">
          <AboutInquiry />
        </section>
      </HeaderZone>
    </TwoLensesMotionShell>
  );
}
