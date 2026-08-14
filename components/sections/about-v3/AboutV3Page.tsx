import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { anton } from "@/app/fonts";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { aboutV3 } from "@/content/about-v3";
import { site } from "@/content/site";
import { AtlasSequence, DeliveryStage, DossierReveal, IntakeStage } from "./AboutV3Interactions";
import { FounderOpening } from "./FounderOpening";
import { FounderPortrait } from "./FounderSilhouette";
import {
  CentralAxis,
  Heading,
  MediaFrame,
  MetaStrip,
  RegistrationCross,
  RuledRow,
  SectionIndex,
} from "./Primitives";
import { ProofComparison } from "./ProofComparison";
import styles from "./AboutV3Page.module.css";

const { founders, arrival, analysis, programs, intake, orchestration, delivery, proof, cta } =
  aboutV3;

/* -----------------------------------------------------------------------------
   02 — Founder profiles

   Equal authority left and right: the same rule weight, the same three
   responsibility rows, the same statement size. Where Marija's biography has
   not been confirmed, the gap is labelled rather than filled.
   -------------------------------------------------------------------------- */

function FoundersSection() {
  const [rustam, marija] = founders.people;

  return (
    <section className={styles.section} id="about-v3-founders" aria-labelledby="about-v3-founders-title">
      <CentralAxis />
      <RegistrationCross />

      <div className={styles.founders}>
        <div className={styles.foundersHead}>
          <SectionIndex index={founders.index} label={founders.label} />
          <Heading id="about-v3-founders-title" lines={founders.heading} accent />
        </div>

        {/* Each founder is emitted as name → portrait → detail, and the desktop
            lockup is reassembled by explicit grid placement. That keeps the
            source order right for a stacked phone and a screen reader — the
            name always precedes the portrait it belongs to — without giving up
            the two-column composition. */}
        {[rustam, marija].map((person, index) => {
          const side = index === 0 ? "left" : "right";

          return (
            <Fragment key={person.key}>
              <div className={styles.founderIdent} data-side={side}>
                <h3 className={styles.founderName}>{person.name}</h3>
                <p className={styles.founderRole}>
                  {person.role.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>

              <MediaFrame
                ratio="27 / 50"
                className={styles.founderPortrait}
                data-side={side}
                role="img"
                aria-label={`Drawn placeholder standing in for ${person.name}'s portrait. Founder portrait media is pending.`}
              >
                <FounderPortrait variant={index === 0 ? "a" : "b"} />
              </MediaFrame>

              <div className={styles.founderDetail} data-side={side}>
                <div className={styles.founderRows}>
                  {person.responsibilities.map((item, i) => (
                    <RuledRow key={item} index={String(i + 1).padStart(2, "0")} term={item} />
                  ))}
                </div>

                <p className={styles.founderStatement}>
                  {person.statement.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>

                {person.note.href ? (
                  <a
                    className={styles.founderNote}
                    href={person.note.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {person.note.text}
                  </a>
                ) : (
                  <p className={styles.founderNote}>{person.note.text}</p>
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}

/* -----------------------------------------------------------------------------
   03 — Your idea is enough
   -------------------------------------------------------------------------- */

function ArrivalSection() {
  return (
    <section className={styles.section} aria-labelledby="about-v3-arrival-title">
      <CentralAxis />
      <RegistrationCross corners={["bl", "tr", "br"]} />

      <div className={styles.arrival}>
        <div className={styles.arrivalCopy}>
          <SectionIndex index={arrival.index} label={arrival.label} />
          <Heading id="about-v3-arrival-title" lines={arrival.heading} size="tall" />
          <p className={styles.prose}>{arrival.body}</p>
        </div>

        <div className={styles.arrivalMedia}>
          <MediaFrame ratio="16 / 9">
            <picture>
              <source media="(max-width: 900px)" srcSet={arrival.media.mobile} />
              <img
                src={arrival.media.src}
                alt={arrival.media.alt}
                width={1920}
                height={1080}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </MediaFrame>

          <div className={styles.arrivalFoot}>
            <p className={styles.arrivalCaption}>{arrival.caption}</p>
            <MetaStrip items={arrival.meta} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -----------------------------------------------------------------------------
   04 — Analysis

   Everything readable is HTML: the dossier terms, their answers, the status
   line and the supporting field. The generated plate supplies only the
   companion, the cradle and the light.
   -------------------------------------------------------------------------- */

function AnalysisSection() {
  return (
    <section className={styles.section} aria-labelledby="about-v3-analysis-title">
      <CentralAxis />
      <RegistrationCross corners={["tr", "bl", "br"]} />

      <div className={styles.analysisTop}>
        <div className={styles.analysisHead}>
          <SectionIndex index={analysis.index} label={analysis.label} />
          <Heading id="about-v3-analysis-title" lines={analysis.heading} size="tall" />
        </div>
        <p className={`${styles.prose} ${styles.analysisProse}`}>{analysis.body}</p>
      </div>

      <div className={styles.analysisBody}>
        <div className={styles.analysisMedia}>
          <MediaFrame ratio="16 / 9">
            <picture>
              <source media="(max-width: 900px)" srcSet={analysis.media.mobile} />
              <img
                src={analysis.media.src}
                alt={analysis.media.alt}
                width={1920}
                height={1080}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </MediaFrame>
          <MetaStrip items={analysis.meta} />
        </div>

        <DossierReveal>
          <p className={styles.label}>
            {analysis.profile.title} / {analysis.profile.number}
          </p>

          <div className={styles.dossierRows}>
            {analysis.profile.rows.map((row) => (
              <div
                key={row.term}
                className={`${styles.ruledRow} ${styles.dossierRow}`}
                data-dossier-row
              >
                <span className={styles.ruledTerm}>
                  <em>{row.term}</em>
                  <span>— {row.question}</span>
                </span>
                <span className={styles.ruledValue}>{row.answer}</span>
                <i data-dossier-rule aria-hidden="true" />
              </div>
            ))}
          </div>

          <p className={styles.dossierStatus}>{analysis.profile.status}</p>

          {/* Browser-drawn supporting field — the four profile terms restated as
              a ruled sheet. There is no generated asset for this panel and the
              handoff forbids inventing one. */}
          <div className={styles.profileSheet} aria-hidden="true">
            {analysis.profile.rows.map((row) => (
              <div key={row.term} className={styles.profileSheetCell}>
                <span>{row.term}</span>
                <i />
                <i />
                <i />
              </div>
            ))}
          </div>
        </DossierReveal>
      </div>
    </section>
  );
}

/* -----------------------------------------------------------------------------
   05 — Three ways forward

   All three directions are shown at once and none is preselected: this is a
   comparison, not a chooser. One real companion stays lit on the plinth; the
   three cases behind it are projections of the same figure.
   -------------------------------------------------------------------------- */

function ProgramsSection() {
  return (
    <section className={styles.section} aria-labelledby="about-v3-programs-title">
      <CentralAxis />
      <RegistrationCross corners={["tr", "bl", "br"]} />

      <div className={styles.programsTop}>
        <div className={styles.programsHead}>
          <SectionIndex index={programs.index} label={programs.label} />
          <Heading id="about-v3-programs-title" lines={programs.heading} />
        </div>
        <p className={styles.prose}>{programs.body}</p>
      </div>

      <MediaFrame ratio="16 / 9" className={styles.programsStage}>
        <Image
          src={programs.media.src}
          alt={programs.media.alt}
          fill
          sizes="(max-width: 900px) 100vw, 96vw"
        />

        <ul className={styles.programsOverlay}>
          {programs.items.map((item) => (
            <li key={item.key} className={styles.programCard}>
              <p className={styles.programCardHead}>
                <b>{item.index}</b> / {item.title}
              </p>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </MediaFrame>

      {/* Mobile shows the same three directions stacked — no carousel, no tabs. */}
      <ul className={styles.programsList}>
        {programs.items.map((item) => (
          <li key={item.key} className={styles.programCard}>
            <p className={styles.programCardHead}>
              <b>{item.index}</b> / {item.title}
            </p>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>

      <div className={styles.programsFoot}>
        <MetaStrip items={programs.meta} />
      </div>
    </section>
  );
}

/* -----------------------------------------------------------------------------
   06 — System intake
   -------------------------------------------------------------------------- */

function IntakeSection() {
  return (
    <section className={styles.section} aria-labelledby="about-v3-intake-title">
      <CentralAxis />
      <RegistrationCross corners={["tr", "bl", "br"]} />

      <div className={styles.intakeTop}>
        <div className={styles.intakeHead}>
          <SectionIndex index={intake.index} label={intake.label} />
          <Heading id="about-v3-intake-title" lines={intake.heading} />
        </div>
        <p className={styles.prose}>{intake.body}</p>
      </div>

      <IntakeStage meta={intake.meta} />
    </section>
  );
}

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
      <HeaderZone theme="light">
        <FounderOpening />
        <FoundersSection />
        <ArrivalSection />
        <AnalysisSection />
        <ProgramsSection />
        <IntakeSection />
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
