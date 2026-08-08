"use client";

/**
 * STALE AS OF R6 (2026-08-08) — do not trust this harness's readout.
 *
 * The hero it previews no longer exists: the film changed from a dark
 * architectural ascent to the Convenium ident, the hero inverted from
 * cotton-on-noir to ink-on-cotton, the §4.4 grade ramp below was RETIRED
 * (Hero.tsx no longer grades the film at all), the "cover" here is a
 * height-percentage div where production now uses a clip-path panel shared
 * with a second `.statement` layer, and the headline text below is the
 * pre-R6 copy. `HANDOFF_AT`/`CHROME_FLIP_AT` are the old constants; the real
 * ones are `INVERT_FROM`/`INVERT_TO`/`REVEAL_AT` in `Hero.tsx`.
 *
 * R6's actual verification tool is `scripts/verify-hero.mjs` — it drives the
 * real pin via `Hero.tsx`'s dev-only `__heroRange()`, not a re-implementation,
 * so it cannot drift the way this harness did. Every R6 hero constant was
 * chosen against ITS output, not this one's.
 *
 * Left in place rather than deleted or half-patched: partially updating the
 * constants without also replacing the cover mechanic and dropping the grade
 * would make this MORE misleading, not less — a plausible-looking readout
 * that quietly lies about how the real hero behaves. Full rewrite is P1
 * backlog (`AUDIT-R6.md`), gated out of production builds either way.
 *
 * Everything below this notice is the PRE-R6 docblock, unmodified, for
 * whoever does that rewrite.
 * ---
 *
 * The hero-preview harness (spec §4.5).
 *
 * WHAT IT REBUILDS, AND WHAT IT BORROWS. The stage, the media box, the grade and
 * the statement are the REAL production pieces: `Hero.module.css`,
 * `HeroMedia.module.css` and the real `<HeroMedia>` component, under the root
 * layout's real `next/font` faces and `tokens.css`. Only two things are
 * re-implemented here, both deliberately:
 *
 *   1. The progress source. Production gets it from a pinned ScrollTrigger with
 *      `scrub: 0.3`; here it is a slider, so a progress value can be held exactly
 *      and screenshotted. Deterministic stepping is the entire point of the rig.
 *   2. The type parallax. Re-derived from `Hero.tsx`'s timeline rather than run
 *      through GSAP — see TIMELINE below. Same numbers, same linear easing, no
 *      scrub smoothing.
 *
 * THE COVER RISES, IT DOES NOT DESCEND. The spec calls the Capabilities edge
 * "descending". The mechanics say otherwise and this harness follows the
 * mechanics: the hero pins with `pinSpacing: false`, so the section below it
 * scrolls UP over a fixed hero — cotton is anchored to the bottom of the frame
 * and its top edge travels upward. Progress is still exactly the fraction of the
 * frame covered, which is the load-bearing part of §3/§4.4; the visible sliver of
 * film is simply above the seam, not below it. The seam sampler reads the film
 * immediately above the edge for that reason.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HeroMedia, type HeroMediaHandle } from "@/components/sections/home/HeroMedia";
import heroStyles from "@/components/sections/home/Hero.module.css";
import mediaStyles from "@/components/sections/home/HeroMedia.module.css";
import { site } from "@/content/site";
import styles from "./hero-preview.module.css";

/* Mirrored from Hero.tsx. If those constants ever move, these move with them —
 * the harness is worthless the moment it stops matching the real timeline. */
const HANDOFF_AT = 0.62;
const CHROME_FLIP_AT = 0.92;

/* TIMELINE, read off Hero.tsx — and off `motion/gsap.ts`, which is the part
 * that is easy to get wrong.
 *
 * The parallax tweens carry no explicit duration, so they inherit the site-wide
 * `gsap.defaults({ duration: 0.6 })` — NOT GSAP's stock 0.5 — and sit at
 * position 0. The handoff tween sits at 0.62 with duration 0.38, so total
 * timeline length is exactly 1.0 and a scrubbed timeline maps progress → time
 * 1:1. The consequence matters: the parallax finishes by progress ~0.64, and the
 * back of the pin is the handoff lift alone. These numbers were checked against
 * the real page's computed transforms at seven progress values, not assumed. */
const TWEEN = 0.6;
const DISPLAY_STAGGER = 0.04;
const CUE_DURATION = 0.15;

/** Production grade, from `HeroMedia.module.css`. Start of the §4.4 ramp. */
const GRADE_START = { brightness: 0.78, contrast: 1.08 };
/** End of the ramp — the film is as close to cotton as the encode allows. */
const GRADE_END = { brightness: 1.0, contrast: 1.0 };
/** Saturation never ramps: the film is monochrome and stays that way. */
const SATURATE = 0.78;

/** Cotton, `--color-cotton` / `--color-bone`. The colour the seam must close on. */
const COTTON: [number, number, number] = [0xed, 0xeb, 0xdd];

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const seg = (t: number, start: number, duration: number) => clamp01((t - start) / duration);
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
/** Rec. 709 luma, on 0–255 channels. */
const luma = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

type MediaKind = "image" | "video";

type Slot = {
  id: string;
  name: string;
  kind: MediaKind;
  url: string;
  /** True when we minted the object URL and therefore owe it a revoke. */
  owned: boolean;
};

type Sample = {
  film: [number, number, number];
  delta: number;
};

export function HeroPreview() {
  const [progress, setProgress] = useState(0);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [active, setActive] = useState(0);
  const [ramp, setRamp] = useState(true);
  const [showCover, setShowCover] = useState(true);
  const [showType, setShowType] = useState(true);
  const [showPanel, setShowPanel] = useState(true);
  const [sample, setSample] = useState<Sample | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const mediaHandleRef = useRef<HeroMediaHandle>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = slots[active];

  /* ---- URL params ----------------------------------------------------
     `?p=0.75&panel=0&src=/media/hero_scrub.mp4&kind=video` gives Playwright a
     deterministic entry point in Phases 4–6, where the checks want a held
     progress value and no harness chrome in the frame. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const p = Number(params.get("p"));
    if (Number.isFinite(p) && params.get("p") !== null) setProgress(clamp01(p));
    if (params.get("panel") === "0") setShowPanel(false);
    if (params.get("cover") === "0") setShowCover(false);
    if (params.get("type") === "0") setShowType(false);
    if (params.get("ramp") === "0") setRamp(false);

    const src = params.get("src");
    if (src) {
      const kind: MediaKind = params.get("kind") === "video" || /\.(mp4|webm|mov)$/i.test(src)
        ? "video"
        : "image";
      setSlots([{ id: "url", name: src, kind, url: src, owned: false }]);
    }
  }, []);

  /* Revoke every object URL we minted. Runs on unmount only — slot replacement
   * revokes the outgoing URL inline, where the identity is still known. */
  useEffect(() => {
    const owned = slots.filter((s) => s.owned).map((s) => s.url);
    return () => owned.forEach((url) => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- The real handle ------------------------------------------------
     This is the plumbing check: the slider drives the same
     `HeroMediaHandle.setProgress` the pinned timeline drives. With no candidate
     loaded, the real `HeroMedia` is visible underneath and its horizon rule
     travels — proof the contract runs end to end before any candidate exists. */
  useEffect(() => {
    mediaHandleRef.current?.setProgress(progress);
  }, [progress]);

  /* ---- Grade ---------------------------------------------------------- */
  const rampU = seg(progress, HANDOFF_AT, 1 - HANDOFF_AT);
  const brightness = ramp ? lerp(GRADE_START.brightness, GRADE_END.brightness, rampU) : GRADE_START.brightness;
  const contrast = ramp ? lerp(GRADE_START.contrast, GRADE_END.contrast, rampU) : GRADE_START.contrast;
  const filter = `brightness(${brightness.toFixed(4)}) saturate(${SATURATE}) contrast(${contrast.toFixed(4)})`;

  /* ---- Type parallax, re-derived from Hero.tsx ------------------------- */
  const handoffU = seg(progress, HANDOFF_AT, 1 - HANDOFF_AT);
  const handoffY = -8 * handoffU;
  const displayY = (i: number) => -14 * seg(progress, i * DISPLAY_STAGGER, TWEEN) + handoffY;
  const serifY = -6 * seg(progress, 0, TWEEN) + handoffY;
  const supportU = seg(progress, 0, TWEEN);
  const supportY = -4 * supportU + handoffY;
  const supportAlpha = lerp(1, 0.55, supportU);
  const cueU = seg(progress, 0, CUE_DURATION);

  /* ---- Seam sampler (§4.4 / §9) ---------------------------------------
     Reads the graded film one 4px row above the cotton edge and reports its
     distance from cotton in luma. The step must NARROW as progress rises; a
     widening step means the ramp is wrong or the clip does not brighten. */
  const takeSample = useCallback(() => {
    const stage = stageRef.current;
    const el: HTMLImageElement | HTMLVideoElement | null =
      current?.kind === "video" ? videoRef.current : imgRef.current;
    if (!stage || !el || !current) {
      setSample(null);
      return;
    }

    const nw = el instanceof HTMLVideoElement ? el.videoWidth : el.naturalWidth;
    const nh = el instanceof HTMLVideoElement ? el.videoHeight : el.naturalHeight;
    if (!nw || !nh) {
      setSample(null);
      return;
    }

    const rect = stage.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      setSample(null);
      return;
    }

    // Same grade the CSS applies, and the same `object-fit: cover` geometry, so
    // the sampled pixel is the pixel on screen.
    ctx.filter = filter;
    const scale = Math.max(w / nw, h / nh);
    const dw = nw * scale;
    const dh = nh * scale;
    ctx.drawImage(el, (w - dw) / 2, (h - dh) / 2, dw, dh);

    // The cotton edge sits at (1 - progress) of the height and rises.
    const edgeY = Math.round(h * (1 - progress));
    const y = Math.min(h - 1, Math.max(0, edgeY - 4));

    let data: Uint8ClampedArray;
    try {
      data = ctx.getImageData(0, y, w, 1).data;
    } catch {
      setSample(null); // tainted canvas — a cross-origin candidate
      return;
    }

    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    const n = data.length / 4;
    const film: [number, number, number] = [
      Math.round(r / n),
      Math.round(g / n),
      Math.round(b / n),
    ];

    setSample({
      film,
      delta: Math.round(luma(...COTTON) - luma(...film)),
    });
  }, [current, filter, progress]);

  useEffect(() => {
    const id = requestAnimationFrame(takeSample);
    return () => cancelAnimationFrame(id);
  }, [takeSample]);

  /* ---- Video scrubbing -------------------------------------------------
     A harness-local seek, coalesced so held seeks do not queue. The production
     seek path lands in `HeroMedia` in Phase 4; this exists only so a previz can
     be judged here before that work starts. */
  const seeking = useRef(false);
  const pending = useRef<number | null>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || current?.kind !== "video") return;

    const apply = (p: number) => {
      const d = video.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      if (seeking.current) {
        pending.current = p;
        return;
      }
      seeking.current = true;
      video.currentTime = p * d;
    };

    const onSeeked = () => {
      seeking.current = false;
      if (pending.current !== null) {
        const next = pending.current;
        pending.current = null;
        apply(next);
      } else {
        takeSample();
      }
    };

    video.addEventListener("seeked", onSeeked);
    apply(progress);
    return () => video.removeEventListener("seeked", onSeeked);
  }, [progress, current, takeSample]);

  /* ---- Loading candidates ---------------------------------------------- */
  const addFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    const added: Slot[] = Array.from(files)
      .slice(0, 3)
      .map((file, i) => ({
        id: `${file.name}-${Date.now()}-${i}`,
        name: file.name,
        kind: file.type.startsWith("video") ? "video" : "image",
        url: URL.createObjectURL(file),
        owned: true,
      }));
    setSlots((prev) => {
      const next = [...prev, ...added].slice(-3);
      prev
        .filter((s) => s.owned && !next.includes(s))
        .forEach((s) => URL.revokeObjectURL(s.url));
      return next;
    });
    setActive(0);
  }, []);

  /* ---- Keys ------------------------------------------------------------
     Arrows nudge, 1–3 switch candidate, H hides the panel for a clean capture. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") setProgress((p) => clamp01(p + (e.shiftKey ? 0.01 : 0.05)));
      else if (e.key === "ArrowLeft") setProgress((p) => clamp01(p - (e.shiftKey ? 0.01 : 0.05)));
      else if (e.key === "h") setShowPanel((v) => !v);
      else if (/^[123]$/.test(e.key)) setActive(Number(e.key) - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const chrome = progress >= CHROME_FLIP_AT ? "light" : "dark";
  const steps = useMemo(() => [0, 0.25, 0.5, 0.62, 0.7, 0.75, 0.8, 0.9, 0.92, 1], []);

  return (
    <>
      <section className={heroStyles.hero} aria-label="Hero preview harness">
        <div ref={stageRef} className={heroStyles.stage}>
          {/* The real component, driven by the real handle. Visible whenever no
              candidate is loaded — that is the plumbing check. */}
          <HeroMedia handleRef={mediaHandleRef} />

          {current ? (
            <div className={mediaStyles.media} aria-hidden="true">
              {current.kind === "video" ? (
                <video
                  ref={videoRef}
                  key={current.id}
                  className={mediaStyles.video}
                  style={{ filter }}
                  src={current.url}
                  muted
                  playsInline
                  preload="auto"
                  onLoadedMetadata={takeSample}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  ref={imgRef}
                  key={current.id}
                  className={mediaStyles.video}
                  style={{ filter }}
                  src={current.url}
                  alt=""
                  onLoad={takeSample}
                />
              )}
            </div>
          ) : null}

          {showCover ? (
            <div
              className={styles.cover}
              style={{ height: `${(progress * 100).toFixed(3)}%` }}
              aria-hidden="true"
            />
          ) : null}

          {showType ? (
            <div className={`wrap ${heroStyles.content}`}>
              <h1 className={heroStyles.headline}>
                <span
                  className={heroStyles.display}
                  style={{ transform: `translateY(${displayY(0).toFixed(3)}%)` }}
                >
                  We take businesses
                </span>{" "}
                <span
                  className={heroStyles.display}
                  style={{ transform: `translateY(${displayY(1).toFixed(3)}%)` }}
                >
                  to the level
                </span>{" "}
                <span
                  className={heroStyles.serif}
                  style={{ transform: `translateY(${serifY.toFixed(3)}%)` }}
                >
                  their ambition deserves.
                </span>
              </h1>
              <p
                className={heroStyles.support}
                style={{
                  transform: `translateY(${supportY.toFixed(3)}%)`,
                  opacity: supportAlpha.toFixed(3),
                }}
              >
                {site.supporting}
              </p>
            </div>
          ) : null}

          {showType ? (
            <div
              className={heroStyles.cue}
              aria-hidden="true"
              style={{
                opacity: (1 - cueU).toFixed(3),
                transform: `translateY(${(12 * cueU).toFixed(2)}px)`,
              }}
            >
              <span className={heroStyles.cueLine} />
              Scroll to go up
            </div>
          ) : null}
        </div>
      </section>

      {showPanel ? (
        <aside className={styles.panel} aria-label="Harness controls">
          <div className={styles.row}>
            <strong className={styles.title}>hero-preview</strong>
            <button type="button" className={styles.ghost} onClick={() => setShowPanel(false)}>
              hide (h)
            </button>
          </div>

          <label className={styles.field}>
            <span>
              progress <b className={styles.num}>{progress.toFixed(3)}</b>
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
            />
          </label>

          <div className={styles.steps}>
            {steps.map((s) => (
              <button
                key={s}
                type="button"
                className={styles.step}
                data-on={Math.abs(progress - s) < 0.0005 || undefined}
                onClick={() => setProgress(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <label className={styles.field}>
            <span>candidates (up to 3 — image or video)</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => addFiles(e.target.files)}
            />
          </label>

          {slots.length ? (
            <div className={styles.steps}>
              {slots.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={styles.step}
                  data-on={i === active || undefined}
                  onClick={() => setActive(i)}
                  title={s.name}
                >
                  {i + 1}. {s.name.slice(0, 14)}
                </button>
              ))}
            </div>
          ) : (
            <p className={styles.note}>
              No candidate loaded — the real <code>HeroMedia</code> is showing, and its horizon
              rule is being driven by the real <code>setProgress</code> handle.
            </p>
          )}

          <div className={styles.toggles}>
            <label>
              <input type="checkbox" checked={ramp} onChange={(e) => setRamp(e.target.checked)} />
              §4.4 grade ramp
            </label>
            <label>
              <input
                type="checkbox"
                checked={showCover}
                onChange={(e) => setShowCover(e.target.checked)}
              />
              cotton cover
            </label>
            <label>
              <input
                type="checkbox"
                checked={showType}
                onChange={(e) => setShowType(e.target.checked)}
              />
              statement
            </label>
          </div>

          <dl className={styles.readout}>
            <div>
              <dt>grade</dt>
              <dd>
                b {brightness.toFixed(3)} · c {contrast.toFixed(3)}
              </dd>
            </div>
            <div>
              <dt>chrome</dt>
              <dd>{chrome}</dd>
            </div>
            <div>
              <dt>seam Δluma</dt>
              <dd>
                {sample ? (
                  <>
                    {sample.delta}
                    <span className={styles.swatch} style={{ background: `rgb(${sample.film.join(",")})` }} />
                    <span className={styles.swatch} style={{ background: `rgb(${COTTON.join(",")})` }} />
                  </>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>

          <p className={styles.note}>
            Cotton rises from the bottom, because the pinned hero is fixed and Capabilities
            scrolls up over it. The sample reads the graded film 4px above the seam; the step
            must narrow as progress rises (§4.4).
          </p>
        </aside>
      ) : null}
    </>
  );
}
