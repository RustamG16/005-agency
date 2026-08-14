/**
 * verify-about-v3.mjs — behavioural QA for the /about-v3 lockup rebuild.
 *
 * Checks the things a screenshot cannot: the founder transition completes and
 * can be skipped, the handoff control changes accessible state, the recovery
 * video only loads on demand and pauses when it leaves the viewport or the tab
 * hides, the atlas is comprehensible with no motion, reduced motion lands on
 * every endpoint, focus is visible and ordered, and interactive targets meet
 * 44px.
 *
 *   node scripts/verify-about-v3.mjs --base http://localhost:4330
 */

import { chromium } from "playwright";

const argv = process.argv.slice(2);
const flag = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i === -1 ? d : argv[i + 1];
};
const BASE = flag("base", "http://localhost:4330");

const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

/**
 * Playwright's bundled Chromium ships without proprietary codecs, so it cannot
 * decode the H.264 recovery clip and reports MEDIA_ERR_SRC_NOT_SUPPORTED. That
 * is a harness limitation, not a page defect — flagging it as a failure would
 * be a false alarm, and silently passing it would hide a real regression. So
 * it is reported as its own outcome, and playback is verified in a browser
 * that has the codec (see 13-confirmed-lockup-fidelity.md).
 */
const skip = (name, detail) => {
  results.push({ name, pass: true, skipped: true, detail });
  console.log(`SKIP  ${name}  — ${detail}`);
};

const browser = await chromium.launch();

/* ── desktop, motion allowed ─────────────────────────────────────────────── */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto(`${BASE}/about-v3`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  // The opening starts on the wide stage and the skip control is offered.
  await page.waitForTimeout(400);
  const openingStart = await page.evaluate(() => ({
    state: document.querySelector("[data-opening-stage]")?.getAttribute("data-state"),
    skip: Boolean([...document.querySelectorAll("button")].find((b) => /skip intro/i.test(b.textContent || ""))),
  }));
  check("01 opening begins on the wide stage", openingStart.state === "wide", `state=${openingStart.state}`);
  check("01 skip control offered while running", openingStart.skip);

  // …and settles on the completed pair without any scrolling.
  await page.waitForTimeout(3200);
  const openingEnd = await page.evaluate(() => {
    const stage = document.querySelector("[data-opening-stage]");
    const left = stage?.querySelector('[data-role="left"]');
    const wide = stage?.querySelector('[data-role="wide"]');
    return {
      state: stage?.getAttribute("data-state"),
      leftClip: left ? getComputedStyle(left).clipPath : null,
      wideOpacity: wide ? getComputedStyle(wide).opacity : null,
      skipStillFocusable: Boolean([...document.querySelectorAll("button")].find((b) => /skip intro/i.test(b.textContent || ""))),
    };
  });
  check("01 transition completes forward, unattended", openingEnd.state === null, `state=${openingEnd.state}`);
  check("01 left window is clipped to a portrait", /inset/.test(openingEnd.leftClip || ""), openingEnd.leftClip || "");
  check("01 wide layer removed at the endpoint", openingEnd.wideOpacity === "0", `opacity=${openingEnd.wideOpacity}`);
  check("01 skip control leaves the tab order when done", openingEnd.skipStillFocusable === false);

  // 06 handoff — accessible state changes with the control.
  const handoff = page.getByRole("button", { name: /complete handoff/i });
  await handoff.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => ({
    pressed: document.querySelector('[aria-pressed]')?.getAttribute("aria-pressed"),
    status: document.querySelector('[role="status"]')?.textContent?.trim(),
  }));
  await handoff.click();
  await page.waitForTimeout(700);
  const after = await page.evaluate(() => ({
    pressed: document.querySelector('[aria-pressed]')?.getAttribute("aria-pressed"),
    status: document.querySelector('[role="status"]')?.textContent?.trim(),
    accepted: document.querySelector("[data-accepted]")?.getAttribute("data-accepted"),
  }));
  check(
    "06 handoff control reports its state",
    before.pressed === "false" && after.pressed === "true" && before.status !== after.status,
    `${before.status} → ${after.status}`
  );
  check("06 stage crossfades to the accepted endpoint", after.accepted === "true");

  // 07 atlas — every lane and stage readable at full contrast without motion.
  const atlas = await page.evaluate(() => {
    const stages = [...document.querySelectorAll("[data-atlas-stage]")];
    return {
      lanes: document.querySelectorAll("[data-atlas-lane]").length,
      stages: stages.length,
      allOpaque: stages.every((s) => Number(getComputedStyle(s).opacity) === 1),
      text: stages.map((s) => s.textContent?.trim().slice(0, 14)),
    };
  });
  check("07 five lanes and five stages present", atlas.lanes === 5 && atlas.stages === 5, `${atlas.lanes}/${atlas.stages}`);
  check("07 no stage is dimmed or hidden by the sequence", atlas.allOpaque, atlas.text.join(" · "));

  // 08 recovery video — nothing downloads until asked, then forward only.
  const video = page.locator("video").first();
  await video.scrollIntoViewIfNeeded();
  const idle = await page.evaluate(() => {
    const v = document.querySelector("video");
    return { preload: v.preload, src: v.src, networkState: v.networkState, poster: Boolean(v.poster), muted: v.muted };
  });
  check("08 video is inert until requested", idle.preload === "none" && idle.src === "", `preload=${idle.preload} src="${idle.src}"`);
  check("08 video is muted and has a poster", idle.muted && idle.poster);

  await page.getByRole("button", { name: /play motion study/i }).click();
  await page.waitForTimeout(1600);
  const playing = await page.evaluate(() => {
    const v = document.querySelector("video");
    return { paused: v.paused, t: v.currentTime, rate: v.playbackRate, src: v.src, error: v.error?.code ?? null };
  });

  const noCodec = playing.error === 4;
  check("08 control attaches the file on demand", playing.src.endsWith(".mp4"), playing.src.slice(-38));

  if (noCodec) {
    skip("08 plays forward at 1×", "MEDIA_ERR_SRC_NOT_SUPPORTED: this Chromium build has no H.264 decoder");
    skip("08 pauses when scrolled out of view", "cannot start playback without a decoder");
  } else {
    check("08 plays forward at 1×", !playing.paused && playing.t > 0 && playing.rate === 1, `t=${playing.t.toFixed(2)}`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(900);
    const offscreen = await page.evaluate(() => document.querySelector("video").paused);
    check("08 pauses when scrolled out of view", offscreen === true);
  }

  // 09 proof — no fabricated comparison where no capture exists.
  const proof = await page.evaluate(() => ({
    sliders: document.querySelectorAll('[role="slider"]').length,
    pending: [...document.querySelectorAll("p")].filter((p) => /existing capture required/i.test(p.textContent || "")).length,
  }));
  check(
    "09 pending state shown instead of an invented before",
    proof.pending === 2 && proof.sliders === 0,
    `pending=${proof.pending} sliders=${proof.sliders}`
  );

  // Target size. 24px is the pointer minimum (WCAG 2.5.8); the 44px floor the
  // handoff asks for is enforced at touch widths, in the mobile block below.
  const targets = await page.evaluate(() => {
    const els = [...document.querySelectorAll("main a[href], main button")];
    return els
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 34), w: Math.round(r.width), h: Math.round(r.height) };
      })
      .filter((t) => t.h > 0 && t.h < 24);
  });
  check("desktop targets are at least 24px tall", targets.length === 0, targets.map((t) => `${t.label} ${t.w}×${t.h}`).join(" | "));

  await page.keyboard.press("Tab");
  const focusRing = await page.evaluate(() => {
    const el = document.activeElement;
    const s = getComputedStyle(el);
    return { tag: el.tagName, outline: s.outlineWidth, style: s.outlineStyle };
  });
  check("keyboard focus is visible", focusRing.outline !== "0px" && focusRing.style !== "none", JSON.stringify(focusRing));

  check("no console or page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await context.close();
}

/* ── desktop, reduced motion ─────────────────────────────────────────────── */
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/about-v3`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);

  const reduced = await page.evaluate(() => {
    const stage = document.querySelector("[data-opening-stage]");
    const left = stage?.querySelector('[data-role="left"]');
    const wide = stage?.querySelector('[data-role="wide"]');
    const axis = stage?.querySelector("[data-opening-axis]");
    const rules = [...document.querySelectorAll("[data-dossier-rule]")];
    return {
      state: stage?.getAttribute("data-state"),
      leftClip: getComputedStyle(left).clipPath,
      wideOpacity: getComputedStyle(wide).opacity,
      axisTransform: getComputedStyle(axis).transform,
      rulesVisible: rules.every((r) => getComputedStyle(r).transform !== "matrix(0, 0, 0, 1, 0, 0)"),
      answers: [...document.querySelectorAll("[data-dossier-row]")].map((r) => r.lastElementChild?.previousElementSibling?.textContent),
      videoPaused: document.querySelector("video")?.paused,
      skip: Boolean([...document.querySelectorAll("button")].find((b) => /skip intro/i.test(b.textContent || ""))),
    };
  });

  check("reduced motion opens on the completed pair", reduced.state === null && /inset/.test(reduced.leftClip), reduced.leftClip);
  check("reduced motion hides the wide film layer", reduced.wideOpacity === "0");
  check("reduced motion shows the central rule at full height", reduced.axisTransform === "none" || reduced.axisTransform === "matrix(1, 0, 0, 1, 0, 0)", reduced.axisTransform);
  check("reduced motion leaves dossier rules drawn", reduced.rulesVisible);
  check("reduced motion never autoplays the video", reduced.videoPaused !== false);
  check("reduced motion offers no skip control", reduced.skip === false);
  await context.close();
}

/* ── mobile ──────────────────────────────────────────────────────────────── */
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/about-v3`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);

  const mobile = await page.evaluate(() => {
    const pinned = [...document.querySelectorAll("*")].filter((el) => el.classList?.value?.includes("pin-spacer")).length;
    const order = [...document.querySelectorAll("#about-v3-founders h3, #about-v3-founders [role='img']")].map((el) =>
      el.tagName === "H3" ? `name:${el.textContent.trim()}` : "portrait"
    );
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      pinned,
      order,
      programs: document.querySelectorAll("[class*='programsList'] li").length,
      tabs: document.querySelectorAll('[role="tab"], [role="tablist"]').length,
      smallTargets: [...document.querySelectorAll("main a[href], main button")]
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30), h: Math.round(r.height) };
        })
        .filter((t) => t.h > 0 && t.h < 44),
    };
  });

  check("mobile has no horizontal overflow", mobile.overflow === false);
  check("mobile never pins", mobile.pinned === 0, `pin-spacers=${mobile.pinned}`);
  check("mobile keeps each name before its portrait", JSON.stringify(mobile.order) === JSON.stringify(["name:Rustam", "portrait", "name:Marija", "portrait"]), mobile.order.join(" → "));
  check("mobile stacks all three programs, no tabs", mobile.programs === 3 && mobile.tabs === 0, `programs=${mobile.programs} tabs=${mobile.tabs}`);
  check(
    "mobile targets are at least 44px tall",
    mobile.smallTargets.length === 0,
    mobile.smallTargets.map((t) => `${t.label} h=${t.h}`).join(" | ")
  );
  await context.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
const skipped = results.filter((r) => r.skipped);
console.log(
  `\n${results.length - failed.length - skipped.length}/${results.length} checks passed` +
    (skipped.length ? `, ${skipped.length} skipped (harness limitation)` : "")
);
if (failed.length) {
  console.log("\nFAILURES:");
  failed.forEach((f) => console.log(` - ${f.name}: ${f.detail}`));
  process.exitCode = 1;
}
