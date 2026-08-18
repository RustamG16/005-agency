import Image from "next/image";
import Link from "next/link";
import { anton } from "@/app/fonts";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { aboutV3 } from "@/content/about-v3";
import { site } from "@/content/site";
import { AboutHero } from "./AboutHero";
import { AtlasSequence, DeliveryStage } from "./AboutV3Interactions";
import { JourneySequence } from "./JourneySequence";
import {
  CentralAxis,
  Heading,
  MediaFrame,
  RegistrationCross,
  RuledRow,
  SectionIndex,
} from "./Primitives";
import { ProofComparison } from "./ProofComparison";
import styles from "./AboutV3Page.module.css";

const { orchestration, delivery, proof, cta } = aboutV3;

/* -----------------------------------------------------------------------------
   07 — Orchestration atlas

   The whole architecture is semantic HTML and CSS. The locked stills appear
   only inside media regions; every node, label, connector and stage
   description is browser-rendered. Nothing here exposes prompts, routing
   criteria, model configuration or any other reproducible internal logic.
   -------------------------------------------------------------------------- */

function OrchestrationSection() {
  return (
    <AtlasSequence>
      <section className={styles.atlas} aria-labelledby="about-v3-atlas-title">
        <HeaderZone theme="dark">
          <div className={styles.atlasHero}>
            <div className={styles.atlasHeroHead}>
              <SectionIndex index={orchestration.index} label={orchestration.label} tone="cotton" />
              <Heading
                id="about-v3-atlas-title"
                lines={orchestration.heading}
                tone="cotton"
                size="compact"
              />
            </div>

            <p className={styles.prose} data-tone="cotton">
              {orchestration.body}
            </p>

            <MediaFrame ratio="16 / 9" className={styles.atlasHeroMedia}>
              <Image
                src={orchestration.overview.src}
                alt={orchestration.overview.alt}
                fill
                sizes="(max-width: 1180px) 100vw, 32vw"
              />
            </MediaFrame>

            <div className={styles.atlasInside}>
              <p className={styles.atlasInsideTitle}>{orchestration.inside.title}</p>
              {orchestration.inside.steps.map((step, i) => (
                <RuledRow
                  key={step}
                  index={String(i + 1).padStart(2, "0")}
                  term={step}
                  tone="cotton"
                />
              ))}
            </div>
          </div>
        </HeaderZone>

        <div className={styles.atlasDiagramBand}>
          <div className={styles.atlasDiagramIntro}>
            <h3 className={styles.atlasDiagramTitle}>{orchestration.diagram.title}</h3>
            <p className={styles.atlasDiagramBody}>{orchestration.diagram.body}</p>
            <dl className={styles.atlasFacts}>
              {orchestration.diagram.facts.map((fact) => (
                <div key={fact.term} className={styles.atlasFact}>
                  <dt>{fact.term}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.atlasDiagram}>
            <p className={`${styles.atlasNode} ${styles.atlasOrchestrator}`}>
              {orchestration.diagram.orchestrator}
            </p>

            <div className={styles.atlasBus} aria-hidden="true" />
            <div className={styles.atlasDrops} aria-hidden="true">
              {orchestration.lanes.map((lane) => (
                <i key={lane.key} />
              ))}
            </div>

            <div className={styles.atlasLanesRow}>
              <div className={styles.atlasInput}>
                <span>{orchestration.diagram.input}</span>
                <span className={styles.atlasInputMark} aria-hidden="true" />
              </div>

              <ol className={styles.atlasLanes}>
                {orchestration.lanes.map((lane) => (
                  <li key={lane.key} className={styles.atlasLane} data-atlas-lane>
                    <p className={styles.atlasLaneHead}>
                      <b>{lane.index}</b> {lane.role}
                    </p>
                    <p className={styles.atlasLaneSkill}>
                      <span>Skill</span>
                      <strong>{lane.skill}</strong>
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.atlasDrops} aria-hidden="true">
              {orchestration.lanes.map((lane) => (
                <i key={lane.key} />
              ))}
            </div>

            <div className={styles.atlasOut}>
              <p className={styles.atlasNode}>{orchestration.diagram.integration}</p>
              <span className={styles.atlasArrow} aria-hidden="true" />
              <p className={styles.atlasNode}>{orchestration.diagram.output}</p>
            </div>
          </div>
        </div>

        <ol className={styles.atlasSpecialists}>
          {orchestration.lanes.map((lane) => (
            <li key={lane.key} className={styles.atlasSpecialist}>
              <MediaFrame ratio="3 / 2" className={styles.atlasSpecialistMedia}>
                <Image
                  src={lane.image}
                  alt={lane.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 19vw"
                />
              </MediaFrame>
              <p className={styles.atlasSpecialistHead}>
                <b>{lane.index}</b> {lane.short}
              </p>
              <p>{lane.summary}</p>
            </li>
          ))}
        </ol>

        <HeaderZone theme="dark">
          <ol className={styles.atlasStages} data-atlas-strip>
            {orchestration.stages.map((stage) => (
              <li key={stage.index} className={styles.atlasStage} data-atlas-stage>
                <p className={styles.atlasStageHead}>
                  <b>{stage.index}</b> {stage.verb}
                </p>
                <p>{stage.body}</p>
              </li>
            ))}
          </ol>
        </HeaderZone>

        <div className={styles.atlasIntegration}>
          <div className={styles.atlasDiagramIntro}>
            <h3 className={styles.atlasIntegrationTitle}>{orchestration.integration.title}</h3>
            <p className={styles.atlasDiagramBody}>{orchestration.integration.body}</p>
          </div>

          <MediaFrame ratio="21 / 9" className={styles.atlasIntegrationMedia}>
            <Image
              src={orchestration.integration.media.src}
              alt={orchestration.integration.media.alt}
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
            />
          </MediaFrame>

          <p className={styles.atlasClaim}>
            {orchestration.integration.claim.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>

        <div className={styles.atlasPrinciples}>
          {orchestration.principles.map((principle) => (
            <div key={principle.title} className={styles.atlasPrinciple}>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </div>
          ))}
          <p className={styles.atlasBoundary}>{orchestration.boundary}</p>
        </div>
      </section>
    </AtlasSequence>
  );
}

/* -----------------------------------------------------------------------------
   08 — Delivery

   The companion is the same size and the same species it was at intake. It
   became coherent, not larger, and the caption says so.
   -------------------------------------------------------------------------- */

function DeliverySection() {
  return (
    <section className={styles.section} aria-labelledby="about-v3-delivery-title">
      <CentralAxis />
      <RegistrationCross corners={["tr", "bl", "br"]} />

      <div className={styles.deliveryTop}>
        <div className={styles.deliveryHead}>
          <SectionIndex index={delivery.index} label={delivery.label} />
          <Heading id="about-v3-delivery-title" lines={delivery.heading} />
        </div>

        <p className={`${styles.prose} ${styles.deliveryProse}`}>{delivery.body}</p>

        <p className={styles.deliveryState}>
          <span>{delivery.state}</span>
          <i aria-hidden="true" />
        </p>
      </div>

      <DeliveryStage />
    </section>
  );
}

/* -----------------------------------------------------------------------------
   09 — Proof

   Two real projects at proposal stage. No metrics, no testimonials, no launch
   or approval claims. A comparison slider appears only where matched captures
   of both states genuinely exist.
   -------------------------------------------------------------------------- */

function ProofSection() {
  return (
    <section className={styles.section} aria-labelledby="about-v3-proof-title">
      <RegistrationCross corners={["tr", "br"]} />

      <div className={styles.proofHead}>
        <SectionIndex index={proof.index} label={proof.label} />
        <Heading id="about-v3-proof-title" lines={proof.heading} />
        <p className={styles.prose}>{proof.body}</p>
      </div>

      {proof.projects.map((project) => (
        <article key={project.key} className={styles.proofRow}>
          <div className={styles.proofMeta}>
            <h3 className={styles.proofName}>
              <b>{project.index}</b> / {project.name}
            </h3>
            <p className={styles.proofStage}>{project.stage}</p>
            <p className={styles.proofScope}>
              {project.scope.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <p className={styles.proofNote}>{project.note}</p>
          </div>

          <div className={styles.proofPanels}>
            <p className={styles.proofPanelLabels}>
              <span>{proof.labels.proposed}</span>
              <span>{proof.labels.existing}</span>
            </p>

            <div className={styles.proofCompare}>
              <div className={styles.proofProposed}>
                <Image
                  src={project.source.proposed}
                  alt={`The proposed new direction for ${project.name}, captured from the live build at ${project.source.viewport}.`}
                  width={1440}
                  height={810}
                />
              </div>
              <ProofComparison source={project.source} name={project.name} />
            </div>

            <div className={styles.proofActions}>
              <a
                className={styles.controlGhost}
                href={project.newHref}
                target="_blank"
                rel="noreferrer"
              >
                {proof.labels.viewNew} — {project.name}
              </a>
              {project.oldHref ? (
                <a
                  className={styles.controlGhost}
                  href={project.oldHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {proof.labels.viewOld} — {project.name}
                </a>
              ) : null}
              {project.source.existing ? (
                <p className={styles.proofHint}>{proof.labels.hint}</p>
              ) : null}
            </div>
          </div>
        </article>
      ))}

      <HeaderZone theme="dark">
        <div className={styles.proofMarks}>
          {proof.marks.map((mark) => (
            <p key={mark} className={styles.proofMark}>
              {mark}
            </p>
          ))}
          <p className={`${styles.proofMark} ${styles.proofFootnote}`}>{proof.footnote}</p>
        </div>
      </HeaderZone>
    </section>
  );
}

/* -----------------------------------------------------------------------------
   10 — CTA

   Typography-led and short. The inquiry form lives on /contact; this section
   sends people there rather than duplicating it.
   -------------------------------------------------------------------------- */

function CtaSection() {
  return (
    <section className={styles.cta} aria-labelledby="about-v3-cta-title">
      <CentralAxis />
      <RegistrationCross corners={["tl", "tr", "bl", "br"]} />

      <SectionIndex index={cta.index} label={cta.label} />
      <Heading id="about-v3-cta-title" lines={cta.heading} size="hero" />
      <span className={styles.ctaRule} aria-hidden="true" />
      <p className={styles.ctaBody}>{cta.body}</p>

      <div className={styles.ctaActions}>
        <Link className={styles.control} href={cta.primary.href}>
          {cta.primary.label}
        </Link>
        <a className={styles.ctaEmail} href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>
    </section>
  );
}

export function AboutV3Page() {
  return (
    <div className={`${styles.page} ${anton.variable}`}>
      {/* The masthead, and the page's only founder section. The drawn
          placeholder stage (01) and the founder profile pair (02) both said the
          same thing this does — two figures, two names, two disciplines — so
          both went when this landed. It carries its own header-theme zones
          because it opens on a near-black film and ends on cotton. */}
      <AboutHero />

      {/* Sections 03–06 are one pinned cinematic sequence rather than four
          ivory bands. It ends in darkness, and Section 07 opens dark, so the
          seam between them is invisible — which is why both sit inside the
          same dark header zone. */}
      <HeaderZone theme="dark">
        <JourneySequence />
      </HeaderZone>

      <OrchestrationSection />

      <HeaderZone theme="light">
        <DeliverySection />
        <ProofSection />
        <CtaSection />
      </HeaderZone>
    </div>
  );
}
