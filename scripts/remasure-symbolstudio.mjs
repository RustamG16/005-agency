/**
 * Focused remasure pass — improves Framer-site sampling after first audit.
 * Still read-only; no asset downloads. Hard 12-minute cap.
 */
import puppeteer from 'puppeteer';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SHOTS = join(ROOT, 'audit-shots');
const NOTES_PATH = join(ROOT, 'audit-notes.json');
const TARGET = 'https://www.symbolstudio.pl/en/';
const LIMIT_MS = 12 * 60 * 1000;
const started = Date.now();

const notes = existsSync(NOTES_PATH)
  ? JSON.parse(readFileSync(NOTES_PATH, 'utf8'))
  : { meta: {}, desktop: {}, mobile: {}, animations: [], hoverObservations: [], screenshots: [] };

notes.remasure = { startedAt: new Date().toISOString(), samples: {}, errors: [] };

function log(m) {
  console.log(`[${((Date.now() - started) / 1000).toFixed(1)}s] ${m}`);
}

async function acceptCookies(page) {
  const clicked = await page.evaluate(() => {
    const all = [...document.querySelectorAll('button, a, div, span')];
    const btn = all.find((el) => /i accept|accept/i.test((el.textContent || '').trim()) && (el.textContent || '').trim().length < 40);
    if (btn) {
      btn.click();
      return (btn.textContent || '').trim();
    }
    return null;
  });
  if (clicked) {
    log(`Cookie: ${clicked}`);
    await new Promise((r) => setTimeout(r, 800));
  }
}

async function sampleByText(page, queries) {
  return page.evaluate((qs) => {
    const out = {};
    function styleDump(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        text: (el.innerText || '').trim().slice(0, 120),
        tag: el.tagName.toLowerCase(),
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        border: cs.border,
        padding: cs.padding,
        margin: cs.margin,
        display: cs.display,
        position: cs.position,
        gap: cs.gap,
        transform: cs.transform,
        opacity: cs.opacity,
        transition: `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction}`,
        boxShadow: cs.boxShadow,
        cursor: cs.cursor,
        overflow: cs.overflow,
        zIndex: cs.zIndex,
        top: cs.top,
        backdropFilter: cs.backdropFilter,
      };
    }
    function findText(substr, exact = false) {
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      let best = null;
      let bestScore = Infinity;
      while (walk.nextNode()) {
        const el = walk.currentNode;
        const t = (el.innerText || '').trim();
        if (!t) continue;
        const match = exact ? t === substr : t.includes(substr) && t.length < substr.length + 80;
        if (!match) continue;
        const score = t.length;
        if (score < bestScore) {
          best = el;
          bestScore = score;
        }
      }
      return best;
    }
    for (const q of qs) {
      const el = findText(q.text, !!q.exact);
      out[q.key] = styleDump(el);
    }
    // Header chrome: fixed elements near top
    const fixedTop = [...document.querySelectorAll('body *')].filter((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return cs.position === 'fixed' && r.top < 80 && r.height > 20 && r.height < 80 && r.width > 30;
    });
    out._fixedTop = fixedTop.slice(0, 12).map(styleDump);

    // Orange accent elements
    const orange = [...document.querySelectorAll('body *')].filter((el) => {
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor;
      return /254,\s*85,\s*46|255,\s*\d+,\s*0|fe552e/i.test(bg) && el.getBoundingClientRect().width > 20;
    });
    out._orangeEls = orange.slice(0, 8).map(styleDump);

    // Rounded media / images
    const media = [...document.querySelectorAll('img, video, canvas')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 120 && r.height > 80;
    });
    out._media = media.slice(0, 8).map((el) => {
      const d = styleDump(el);
      const parent = styleDump(el.parentElement);
      return { media: d, parent };
    });

    // Nav segment outer (black pill)
    const navPill = [...document.querySelectorAll('body *')].find((el) => {
      const t = (el.innerText || '').replace(/\s+/g, ' ');
      const r = el.getBoundingClientRect();
      return /Home/.test(t) && /Works/.test(t) && /Contact/.test(t) && r.height >= 32 && r.height <= 56 && r.width > 300 && r.width < 600;
    });
    out.navPill = styleDump(navPill);

    // Active Home segment
    const homeSeg = [...document.querySelectorAll('body *')].find((el) => {
      const t = (el.innerText || '').trim();
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return t === 'Home' && r.height >= 28 && r.height <= 44 && /255,\s*255,\s*255/.test(cs.backgroundColor);
    });
    out.navHomeActive = styleDump(homeSeg);

    const worksSeg = [...document.querySelectorAll('body *')].find((el) => {
      const t = (el.innerText || '').trim();
      const r = el.getBoundingClientRect();
      return t === 'Works' && r.height >= 28 && r.height <= 44 && r.width > 50;
    });
    out.navWorksInactive = styleDump(worksSeg);

    document.fonts && document.fonts.status;
    out.fontsReady = document.fonts ? document.fonts.status : 'unknown';
    out.fontFaces = [];
    if (document.fonts) {
      for (const f of document.fonts) {
        if (f.status === 'loaded') out.fontFaces.push({ family: f.family, weight: f.weight, style: f.style });
      }
    }
    return out;
  }, queries);
}

async function realHover(page, text) {
  const box = await page.evaluate((t) => {
    const el = [...document.querySelectorAll('body *')].find((node) => {
      const tx = (node.innerText || '').trim();
      const r = node.getBoundingClientRect();
      return tx === t && r.width > 40 && r.height > 20 && r.height < 60;
    });
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const before = {
      color: getComputedStyle(el).color,
      backgroundColor: getComputedStyle(el).backgroundColor,
      opacity: getComputedStyle(el).opacity,
      transform: getComputedStyle(el).transform,
      transition: `${getComputedStyle(el).transitionProperty} ${getComputedStyle(el).transitionDuration}`,
    };
    el.__auditBefore = before;
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, before };
  }, text);
  if (!box) return { text, found: false };
  await page.mouse.move(box.x, box.y);
  await new Promise((r) => setTimeout(r, 450));
  const after = await page.evaluate((t) => {
    const el = [...document.querySelectorAll('body *')].find((node) => {
      const tx = (node.innerText || '').trim();
      const r = node.getBoundingClientRect();
      return tx === t && r.width > 40 && r.height > 20 && r.height < 60;
    });
    if (!el) return null;
    return {
      color: getComputedStyle(el).color,
      backgroundColor: getComputedStyle(el).backgroundColor,
      opacity: getComputedStyle(el).opacity,
      transform: getComputedStyle(el).transform,
      transition: `${getComputedStyle(el).transitionProperty} ${getComputedStyle(el).transitionDuration}`,
    };
  }, text);
  return { text, found: true, before: box.before, after, changed: JSON.stringify(box.before) !== JSON.stringify(after) };
}

async function scrollToProjects(page) {
  const y = await page.evaluate(() => {
    const el = [...document.querySelectorAll('h1,h2,h3,div,p,span')].find((node) => {
      const t = (node.innerText || '').trim();
      return /^PROJECTS$/i.test(t) || t === 'See our selected projects';
    });
    if (!el) return 2942;
    return Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - 100));
  });
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await new Promise((r) => setTimeout(r, 900));
  return y;
}

async function openMenu(page) {
  // Click MENU button via mouse
  const box = await page.evaluate(() => {
    const el = [...document.querySelectorAll('body *')].find((node) => {
      const t = (node.innerText || '').trim();
      const r = node.getBoundingClientRect();
      return /^MENU$/i.test(t) && r.width > 50 && r.height > 24 && r.height < 56;
    });
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  if (!box) return { opened: false };
  await page.mouse.click(box.x, box.y);
  await new Promise((r) => setTimeout(r, 700));
  const state = await page.evaluate(() => {
    const overlays = [...document.querySelectorAll('body *')].filter((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return (cs.position === 'fixed' || cs.position === 'absolute') && r.width > 200 && r.height > 300 && r.top < 100;
    });
    const links = [...document.querySelectorAll('a, button, div, span')]
      .filter((el) => /^(Home|Works|Services|About|Contact)$/i.test((el.innerText || '').trim()))
      .map((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          text: (el.innerText || '').trim(),
          w: Math.round(r.width),
          h: Math.round(r.height),
          fontSize: cs.fontSize,
          fontFamily: cs.fontFamily,
          color: cs.color,
          y: Math.round(r.y),
        };
      });
    return {
      overlayCount: overlays.length,
      overlays: overlays.slice(0, 5).map((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          text: (el.innerText || '').trim().slice(0, 100),
          w: Math.round(r.width),
          h: Math.round(r.height),
          bg: cs.backgroundColor,
          opacity: cs.opacity,
          transform: cs.transform,
          transition: `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction}`,
          position: cs.position,
          zIndex: cs.zIndex,
        };
      }),
      links: links.slice(0, 20),
    };
  });
  return { opened: true, ...state };
}

let browser;
const timer = setTimeout(async () => {
  log('TIMEOUT');
  try { if (browser) await browser.close(); } catch {}
}, LIMIT_MS);

try {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  );

  log('Desktop load');
  await page.goto(TARGET, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1200));
  await acceptCookies(page);

  await page.screenshot({ path: join(SHOTS, '01-desktop-initial.png') });

  const queries = [
    { key: 'heroH1', text: 'We are a branding studio.' },
    { key: 'heroBody', text: 'Through a strategic approach' },
    { key: 'scrollCue', text: 'SCROLL DOWN AND LEARN MORE' },
    { key: 'showreelLabel', text: 'SEE SHOWREEL' },
    { key: 'showreelTime', text: '00:01:47' },
    { key: 'ctaHowToStart', text: 'HOW TO START?' },
    { key: 'manifesto', text: 'WE DESIGN BRANDS' },
    { key: 'projectsHeading', text: 'PROJECTS' },
    { key: 'projectsSub', text: 'See our selected projects' },
    { key: 'brandingTool', text: 'BRANDING IS A TOOL' },
    { key: 'trusted', text: 'THEY TRUSTED US' },
    { key: 'faq', text: 'FAQ' },
    { key: 'services', text: 'SERVICES' },
    { key: 'cookieTitle', text: 'Cookie Settings' },
  ];
  notes.remasure.samples.desktop = await sampleByText(page, queries);
  log('Desktop samples collected');

  // Hover Works nav + CTA
  const hoverWorks = await realHover(page, 'Works');
  const hoverCta = await realHover(page, 'HOW TO START?');
  notes.remasure.hover = { hoverWorks, hoverCta };
  await page.screenshot({ path: join(SHOTS, '03-desktop-hover.png') });

  // Scroll manifesto then projects
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 600));
  const midSamples = await sampleByText(page, [
    { key: 'manifestoFull', text: 'WE DESIGN BRANDS THAT SYMBOLIZE THE FUTURE' },
    { key: 'marquee', text: 'SYMBOLSTUDIO' },
  ]);
  notes.remasure.samples.mid = midSamples;

  const py = await scrollToProjects(page);
  log(`Projects at y=${py}`);
  notes.remasure.projectY = py;
  const projectSamples = await page.evaluate(() => {
    const cards = [];
    for (const el of document.querySelectorAll('a, div, article, figure')) {
      const r = el.getBoundingClientRect();
      if (r.top < 60 || r.top > 800 || r.width < 200 || r.height < 150 || r.width > 900) continue;
      const hasMedia = !!el.querySelector('img, video, canvas');
      if (!hasMedia && r.height < 200) continue;
      const cs = getComputedStyle(el);
      cards.push({
        text: (el.innerText || '').trim().slice(0, 80),
        w: Math.round(r.width),
        h: Math.round(r.height),
        x: Math.round(r.x),
        y: Math.round(r.y),
        radius: cs.borderRadius,
        overflow: cs.overflow,
        transform: cs.transform,
        transition: `${cs.transitionProperty} ${cs.transitionDuration}`,
        bg: cs.backgroundColor,
        hasMedia,
      });
      if (cards.length >= 12) break;
    }
    return cards;
  });
  notes.remasure.projectCards = projectSamples;

  // Hover first project card
  if (projectSamples[0]) {
    const c = projectSamples[0];
    const before = await page.evaluate((x, y) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { tag: el.tagName, transform: cs.transform, opacity: cs.opacity, transition: cs.transitionDuration };
    }, c.x + c.w / 2, c.y + Math.min(c.h / 2, 200));
    await page.mouse.move(c.x + c.w / 2, c.y + Math.min(c.h / 2, 200));
    await new Promise((r) => setTimeout(r, 500));
    const after = await page.evaluate((x, y) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { tag: el.tagName, transform: cs.transform, opacity: cs.opacity, transition: cs.transitionDuration };
    }, c.x + c.w / 2, c.y + Math.min(c.h / 2, 200));
    notes.remasure.projectHover = { before, after, changed: JSON.stringify(before) !== JSON.stringify(after) };
  }
  await page.screenshot({ path: join(SHOTS, '02-desktop-projects.png') });

  // Scroll animations sample
  const scrollAnim = await page.evaluate(async () => {
    const start = window.scrollY;
    const transforms = [];
    for (let i = 0; i < 6; i++) {
      window.scrollBy(0, 400);
      await new Promise((r) => setTimeout(r, 200));
      const big = [...document.querySelectorAll('h1,h2,h3,div')].find((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 400 && parseFloat(getComputedStyle(el).fontSize) > 40;
      });
      if (big) {
        transforms.push({
          text: (big.innerText || '').slice(0, 40),
          fontSize: getComputedStyle(big).fontSize,
          transform: getComputedStyle(big).transform,
          opacity: getComputedStyle(big).opacity,
          y: Math.round(big.getBoundingClientRect().y),
        });
      }
    }
    return { start, end: window.scrollY, transforms };
  });
  notes.remasure.scrollAnim = scrollAnim;

  // Mobile
  log('Mobile');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(TARGET, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1000));
  await acceptCookies(page);
  await page.screenshot({ path: join(SHOTS, '04-mobile-initial.png') });

  notes.remasure.samples.mobile = await sampleByText(page, [
    { key: 'brandTitle', text: 'SYMBOL STUDIO' },
    { key: 'heroH1', text: 'We are a branding studio.' },
    { key: 'heroBody', text: 'Through a strategic approach' },
    { key: 'scrollCue', text: 'SCROLL DOWN AND LEARN MORE' },
    { key: 'menuBtn', text: 'MENU' },
    { key: 'ctaHowToStart', text: 'HOW TO START?' },
    { key: 'manifesto', text: 'WE DESIGN BRANDS' },
  ]);

  const menu = await openMenu(page);
  notes.remasure.mobileMenu = menu;
  log(`Menu overlays=${menu.overlayCount || 0}`);
  await page.screenshot({ path: join(SHOTS, '05-mobile-menu-open.png') });

  // Mobile type after scroll
  await page.mouse.click(200, 100); // try close if overlay
  await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 500));
  notes.remasure.samples.mobileMid = await sampleByText(page, [
    { key: 'manifesto', text: 'WE DESIGN BRANDS' },
  ]);

  notes.remasure.finishedAt = new Date().toISOString();
  notes.remasure.elapsedMs = Date.now() - started;
  notes.screenshots = [
    'audit-shots/01-desktop-initial.png',
    'audit-shots/02-desktop-projects.png',
    'audit-shots/03-desktop-hover.png',
    'audit-shots/04-mobile-initial.png',
    'audit-shots/05-mobile-menu-open.png',
  ];
  writeFileSync(NOTES_PATH, JSON.stringify(notes, null, 2));
  await browser.close();
  log('Done remasure');
} catch (e) {
  notes.remasure.errors.push(String(e.stack || e));
  writeFileSync(NOTES_PATH, JSON.stringify(notes, null, 2));
  console.error(e);
  try { if (browser) await browser.close(); } catch {}
} finally {
  clearTimeout(timer);
}
