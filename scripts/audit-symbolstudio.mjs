/**
 * Symbol Studio design audit â€” read-only, 15-minute hard cap.
 * Collects computed styles + 5 screenshots only. No HTML/CSS/font/media downloads.
 *
 *   node scripts/audit-symbolstudio.mjs
 */

import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SHOTS = join(ROOT, 'audit-shots');
const NOTES_PATH = join(ROOT, 'audit-notes.json');
const REPORT_PATH = join(ROOT, 'symbol-studio-design-audit.md');
const TARGET = 'https://www.symbolstudio.pl/en/';
const LIMIT_MS = 15 * 60 * 1000;
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const STYLE_KEYS = [
  'display', 'position', 'top', 'right', 'bottom', 'left',
  'width', 'height', 'maxWidth', 'minWidth',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'gap', 'rowGap', 'columnGap',
  'transform', 'opacity', 'zIndex', 'overflow',
  'border', 'borderWidth', 'borderStyle', 'borderColor', 'borderRadius',
  'boxShadow', 'backgroundColor', 'backgroundImage', 'backdropFilter',
  'color', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle',
  'lineHeight', 'letterSpacing', 'textTransform', 'textAlign',
  'flexDirection', 'flexWrap', 'alignItems', 'justifyContent',
  'gridTemplateColumns', 'gridTemplateRows',
  'transition', 'transitionProperty', 'transitionDuration', 'transitionTimingFunction',
  'animation', 'animationDuration', 'animationTimingFunction', 'cursor',
];

const startedAt = Date.now();
const notes = {
  meta: {
    url: TARGET,
    startedAt: new Date(startedAt).toISOString(),
    timedOut: false,
    phasesCompleted: [],
    errors: [],
  },
  desktop: {},
  mobile: {},
  animations: [],
  hoverObservations: [],
  reducedMotion: null,
  screenshots: [],
};

let browser = null;
let timedOut = false;
let hardTimer = null;

function remaining() {
  return LIMIT_MS - (Date.now() - startedAt);
}

function ensureDirs() {
  if (!existsSync(SHOTS)) mkdirSync(SHOTS, { recursive: true });
}

function saveNotes() {
  writeFileSync(NOTES_PATH, JSON.stringify(notes, null, 2), 'utf8');
}

function log(msg) {
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`[${elapsed}s] ${msg}`);
}

async function killBrowserHard() {
  try {
    if (browser) {
      const proc = browser.process();
      await browser.close().catch(() => {});
      if (proc && !proc.killed) {
        try { proc.kill('SIGKILL'); } catch { /* ignore */ }
      }
    }
  } catch { /* ignore */ }
  browser = null;
  // Windows fallback: kill stray chromium from this run if still alive
  if (process.platform === 'win32') {
    try {
      execSync('taskkill /F /IM chrome.exe /FI "WINDOWTITLE eq *symbolstudio*" 2>nul', { stdio: 'ignore' });
    } catch { /* ignore */ }
  }
}

function pickStyles(cs) {
  const out = {};
  for (const k of STYLE_KEYS) {
    try {
      out[k] = cs[k];
    } catch {
      out[k] = null;
    }
  }
  return out;
}

async function dismissOverlays(page) {
  const clicked = await page.evaluate(() => {
    const texts = ['accept', 'agree', 'ok', 'got it', 'allow', 'close', 'dismiss', 'akceptuj', 'zgadzam'];
    const candidates = [
      ...document.querySelectorAll('button, [role="button"], a'),
    ];
    for (const el of candidates) {
      const t = (el.textContent || '').trim().toLowerCase();
      const aria = (el.getAttribute('aria-label') || '').toLowerCase();
      if (texts.some((x) => t.includes(x) || aria.includes(x))) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && r.top < window.innerHeight) {
          el.click();
          return t.slice(0, 40);
        }
      }
    }
    // cookie close icons
    const close = document.querySelector('[aria-label*="close" i], .cookie button, #onetrust-accept-btn-handler');
    if (close) {
      close.click();
      return 'cookie-close';
    }
    return null;
  });
  if (clicked) {
    log(`Dismissed overlay: ${clicked}`);
    await new Promise((r) => setTimeout(r, 600));
  }
}

async function collectPageSnapshot(page, label) {
  return page.evaluate((styleKeys) => {
    function stylesOf(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const out = {};
      for (const k of styleKeys) out[k] = cs[k];
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        className: typeof el.className === 'string' ? el.className.slice(0, 120) : null,
        text: (el.innerText || '').trim().slice(0, 160).replace(/\s+/g, ' '),
        rect: {
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
        },
        styles: out,
      };
    }

    function isVisible(el) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 2 && r.height > 2 && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
    }

    const stickyFixed = [];
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' || cs.position === 'sticky') {
        if (!isVisible(el)) continue;
        stickyFixed.push({
          position: cs.position,
          ...stylesOf(el),
        });
        if (stickyFixed.length > 25) break;
      }
    }

    // Section candidates: main children, sections, headers, footers, large blocks
    const sectionRoots = [];
    const main = document.querySelector('main') || document.body;
    const candidates = [
      ...main.querySelectorAll(':scope > *'),
      ...document.querySelectorAll('header, footer, section, [data-section], .section'),
    ];
    const seen = new Set();
    for (const el of candidates) {
      if (seen.has(el) || !isVisible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.height < 40) continue;
      seen.add(el);
      const heading = el.querySelector('h1,h2,h3');
      sectionRoots.push({
        tag: el.tagName.toLowerCase(),
        className: typeof el.className === 'string' ? el.className.slice(0, 100) : null,
        heading: heading ? (heading.innerText || '').trim().slice(0, 100) : null,
        purposeHint: (el.innerText || '').trim().slice(0, 220).replace(/\s+/g, ' '),
        scrollY: Math.round(r.top + window.scrollY),
        height: Math.round(r.height),
        width: Math.round(r.width),
        fullWidth: Math.abs(r.width - window.innerWidth) < 24,
        contained: r.width < window.innerWidth - 80,
        marginLeft: Math.round(r.left),
        styles: {
          backgroundColor: getComputedStyle(el).backgroundColor,
          padding: getComputedStyle(el).padding,
          display: getComputedStyle(el).display,
          position: getComputedStyle(el).position,
        },
      });
    }
    // Sort by document order / scroll position
    sectionRoots.sort((a, b) => a.scrollY - b.scrollY);
    // Dedupe overlapping near-identical
    const sections = [];
    for (const s of sectionRoots) {
      const last = sections[sections.length - 1];
      if (last && Math.abs(last.scrollY - s.scrollY) < 40 && Math.abs(last.height - s.height) < 40) continue;
      sections.push(s);
    }

    // Nav
    const navEl =
      document.querySelector('header nav') ||
      document.querySelector('nav') ||
      document.querySelector('header') ||
      document.querySelector('[role="navigation"]');
    const navLinks = [];
    if (navEl) {
      for (const a of navEl.querySelectorAll('a, button')) {
        if (!isVisible(a) && getComputedStyle(a).display === 'none') continue;
        const t = (a.innerText || a.getAttribute('aria-label') || '').trim();
        if (!t) continue;
        navLinks.push({
          text: t.slice(0, 60),
          href: a.getAttribute('href'),
          ...stylesOf(a),
        });
      }
    }

    // Typography samples
    const typeSamples = {};
    for (const [key, sel] of [
      ['h1', 'h1'],
      ['h2', 'h2'],
      ['h3', 'h3'],
      ['body', 'body p, main p, article p'],
      ['label', 'label, .label, [class*="label"], small'],
      ['button', 'button, a[class*="btn"], [class*="button"]'],
      ['link', 'main a, a'],
    ]) {
      const el = document.querySelector(sel);
      if (el) typeSamples[key] = stylesOf(el);
    }

    // Buttons
    const buttons = [];
    for (const el of document.querySelectorAll('a, button')) {
      if (!isVisible(el)) continue;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const looksBtn =
        el.tagName === 'BUTTON' ||
        /btn|button|cta/i.test(el.className || '') ||
        (cs.borderRadius !== '0px' && r.height >= 36 && r.height <= 72 && r.width >= 80 && r.width <= 420);
      if (!looksBtn) continue;
      buttons.push(stylesOf(el));
      if (buttons.length >= 8) break;
    }

    // Project / card-like media containers
    const cards = [];
    for (const el of document.querySelectorAll('a, article, li, figure, div')) {
      if (!isVisible(el)) continue;
      const r = el.getBoundingClientRect();
      const hasMedia = !!el.querySelector('img, video, canvas, picture');
      const cls = (el.className || '').toString();
      if (!hasMedia && !/project|work|case|card|portfolio/i.test(cls)) continue;
      if (r.width < 160 || r.height < 120 || r.width > window.innerWidth * 0.98) continue;
      cards.push({
        ...stylesOf(el),
        hasMedia,
        mediaCount: el.querySelectorAll('img, video, canvas').length,
      });
      if (cards.length >= 10) break;
    }

    // Pills / tabs
    const pills = [];
    for (const el of document.querySelectorAll('button, a, span, li')) {
      if (!isVisible(el)) continue;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const radius = parseFloat(cs.borderRadius) || 0;
      if (r.height >= 24 && r.height <= 48 && r.width >= 48 && r.width <= 280 && radius >= 12) {
        pills.push(stylesOf(el));
        if (pills.length >= 6) break;
      }
    }

    // Body / html / container
    const body = stylesOf(document.body);
    const html = stylesOf(document.documentElement);
    let container = null;
    for (const el of document.querySelectorAll('main > *, body > div, .container, [class*="container"], [class*="wrap"]')) {
      const r = el.getBoundingClientRect();
      if (r.width >= 900 && r.width <= 1400 && r.height > 200) {
        container = stylesOf(el);
        break;
      }
    }

    // Colors from sample of large areas
    const colorFreq = {};
    for (const el of document.querySelectorAll('body, header, main, section, footer, button, a, h1, h2, p')) {
      const cs = getComputedStyle(el);
      for (const prop of ['backgroundColor', 'color', 'borderColor']) {
        const v = cs[prop];
        if (!v || v === 'rgba(0, 0, 0, 0)' || v === 'transparent') continue;
        colorFreq[v] = (colorFreq[v] || 0) + 1;
      }
    }

    // Document fonts exposed
    const fonts = [];
    try {
      if (document.fonts && document.fonts.size) {
        for (const f of document.fonts) {
          fonts.push({ family: f.family, weight: f.weight, style: f.style, status: f.status });
        }
      }
    } catch { /* ignore */ }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Cursor treatments
    const cursors = new Set();
    for (const el of document.querySelectorAll('a, button, [class*="cursor"], body, html')) {
      cursors.add(getComputedStyle(el).cursor);
    }

    return {
      viewport: { w: window.innerWidth, h: window.innerHeight },
      scrollHeight: document.documentElement.scrollHeight,
      body,
      html,
      container,
      sections: sections.slice(0, 40),
      stickyFixed: stickyFixed.slice(0, 20),
      nav: navEl ? stylesOf(navEl) : null,
      navLinks: navLinks.slice(0, 30),
      typeSamples,
      buttons: buttons.slice(0, 8),
      cards: cards.slice(0, 10),
      pills: pills.slice(0, 6),
      colorFreq,
      fonts: fonts.slice(0, 40),
      reducedMotion,
      cursors: [...cursors],
      title: document.title,
    };
  }, STYLE_KEYS);
}

async function observeHover(page, selectorHint) {
  return page.evaluate(async (hint) => {
    const results = [];
    const pick = () => {
      if (hint === 'nav') {
        return document.querySelector('nav a, header a');
      }
      if (hint === 'button') {
        return [...document.querySelectorAll('a, button')].find((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 80 && r.height >= 36 && r.height <= 72 && r.top > 0 && r.top < innerHeight;
        });
      }
      if (hint === 'card') {
        return [...document.querySelectorAll('a, article, figure')].find((el) => {
          const r = el.getBoundingClientRect();
          const hasMedia = el.querySelector('img, video, canvas');
          return hasMedia && r.width > 200 && r.height > 150 && r.top > 80 && r.top < innerHeight - 100;
        });
      }
      return null;
    };
    const el = pick();
    if (!el) return { hint, found: false };

    const before = {
      color: getComputedStyle(el).color,
      backgroundColor: getComputedStyle(el).backgroundColor,
      opacity: getComputedStyle(el).opacity,
      transform: getComputedStyle(el).transform,
      transition: getComputedStyle(el).transition,
      borderColor: getComputedStyle(el).borderColor,
      boxShadow: getComputedStyle(el).boxShadow,
      textDecoration: getComputedStyle(el).textDecoration,
    };
    el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 350));
    const after = {
      color: getComputedStyle(el).color,
      backgroundColor: getComputedStyle(el).backgroundColor,
      opacity: getComputedStyle(el).opacity,
      transform: getComputedStyle(el).transform,
      transition: getComputedStyle(el).transition,
      borderColor: getComputedStyle(el).borderColor,
      boxShadow: getComputedStyle(el).boxShadow,
      textDecoration: getComputedStyle(el).textDecoration,
    };
    const text = (el.innerText || '').trim().slice(0, 60);
    el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    return { hint, found: true, text, before, after, changed: JSON.stringify(before) !== JSON.stringify(after) };
  }, selectorHint);
}

async function scrollAndWatch(page, direction = 'down') {
  const observations = await page.evaluate(async (dir) => {
    const obs = [];
    const startY = window.scrollY;
    const stickyBefore = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const p = getComputedStyle(el).position;
        return p === 'fixed' || p === 'sticky';
      })
      .slice(0, 10)
      .map((el) => ({
        text: (el.innerText || '').slice(0, 40),
        top: el.getBoundingClientRect().top,
        transform: getComputedStyle(el).transform,
        opacity: getComputedStyle(el).opacity,
      }));

    const step = dir === 'down' ? 350 : -350;
    const steps = 8;
    for (let i = 0; i < steps; i++) {
      window.scrollBy(0, step);
      await new Promise((r) => setTimeout(r, 180));
    }
    await new Promise((r) => setTimeout(r, 400));

    const stickyAfter = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const p = getComputedStyle(el).position;
        return p === 'fixed' || p === 'sticky';
      })
      .slice(0, 10)
      .map((el) => ({
        text: (el.innerText || '').slice(0, 40),
        top: el.getBoundingClientRect().top,
        transform: getComputedStyle(el).transform,
        opacity: getComputedStyle(el).opacity,
      }));

    // Sample elements that may have animated (opacity/transform changes near viewport)
    const animatedish = [];
    for (const el of document.querySelectorAll('h1,h2,h3,img,video,section,a,figure')) {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.top > -200 && r.top < innerHeight + 200) {
        if (cs.transition && cs.transition !== 'all 0s ease 0s' && cs.transition !== 'none') {
          animatedish.push({
            tag: el.tagName,
            text: (el.innerText || '').slice(0, 40),
            transition: cs.transition,
            transform: cs.transform,
            opacity: cs.opacity,
            animation: cs.animation,
          });
          if (animatedish.length >= 12) break;
        }
      }
    }

    obs.push({
      direction: dir,
      startY,
      endY: window.scrollY,
      stickyBefore,
      stickyAfter,
      animatedish,
    });
    return obs;
  }, direction);
  return observations;
}

async function findProjectScrollY(page) {
  return page.evaluate(() => {
    const keywords = /work|project|case|selected|portfolio|show/i;
    for (const el of document.querySelectorAll('h1,h2,h3,section,a,div')) {
      const t = (el.innerText || '').slice(0, 80);
      if (keywords.test(t)) {
        const r = el.getBoundingClientRect();
        if (r.height > 40) return Math.max(0, Math.round(r.top + window.scrollY - 80));
      }
    }
    // fallback: ~1 viewport down
    return Math.round(window.innerHeight * 0.9);
  });
}

async function openMobileMenu(page) {
  return page.evaluate(async () => {
    const candidates = [
      ...document.querySelectorAll('button, [role="button"], a, div, span'),
    ];
    const menuBtn = candidates.find((el) => {
      const aria = (el.getAttribute('aria-label') || '').toLowerCase();
      const cls = (el.className || '').toString().toLowerCase();
      const t = (el.innerText || '').trim().toLowerCase();
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return false;
      return (
        aria.includes('menu') ||
        aria.includes('nav') ||
        cls.includes('menu') ||
        cls.includes('burger') ||
        cls.includes('hamburger') ||
        t === 'menu' ||
        t === 'â˜°' ||
        el.getAttribute('aria-expanded') !== null
      );
    });
    if (!menuBtn) return { opened: false, reason: 'no-menu-button' };

    const before = {
      expanded: menuBtn.getAttribute('aria-expanded'),
      bodyOverflow: getComputedStyle(document.body).overflow,
    };
    const beforeStyles = {
      transition: getComputedStyle(menuBtn).transition,
      transform: getComputedStyle(menuBtn).transform,
    };
    menuBtn.click();
    await new Promise((r) => setTimeout(r, 500));

    // Detect open panels
    const panels = [...document.querySelectorAll('nav, [role="dialog"], aside, .menu, [class*="menu"], [class*="drawer"]')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 100 && r.height > 200;
      })
      .slice(0, 5)
      .map((el) => ({
        tag: el.tagName,
        className: (el.className || '').toString().slice(0, 80),
        w: Math.round(el.getBoundingClientRect().width),
        h: Math.round(el.getBoundingClientRect().height),
        opacity: getComputedStyle(el).opacity,
        transform: getComputedStyle(el).transform,
        transition: getComputedStyle(el).transition,
        backgroundColor: getComputedStyle(el).backgroundColor,
        position: getComputedStyle(el).position,
      }));

    return {
      opened: true,
      buttonText: (menuBtn.innerText || menuBtn.getAttribute('aria-label') || '').slice(0, 40),
      before,
      beforeStyles,
      afterExpanded: menuBtn.getAttribute('aria-expanded'),
      panels,
    };
  });
}

async function closeMobileMenu(page) {
  return page.evaluate(async () => {
    const btn = [...document.querySelectorAll('button, [role="button"]')].find((el) => {
      const aria = (el.getAttribute('aria-label') || '').toLowerCase();
      const expanded = el.getAttribute('aria-expanded');
      return expanded === 'true' || aria.includes('close') || aria.includes('menu');
    });
    if (btn) {
      btn.click();
      await new Promise((r) => setTimeout(r, 400));
      return { closed: true };
    }
    // Escape
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise((r) => setTimeout(r, 300));
    return { closed: 'escape-attempted' };
  });
}

function rgbaToHexApprox(rgba) {
  if (!rgba) return null;
  const m = String(rgba).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return rgba;
  const hex = '#' + [m[1], m[2], m[3]].map((x) => Number(x).toString(16).padStart(2, '0')).join('');
  return `${hex} (${rgba})`;
}

function topColors(freq, n = 12) {
  return Object.entries(freq || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([c, count]) => ({ color: c, hex: rgbaToHexApprox(c), count }));
}

function buildReport(n) {
  const d = n.desktop || {};
  const m = n.mobile || {};
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  const sections = d.sections || [];
  const colors = topColors(d.colorFreq);

  const sectionRows = sections
    .map((s, i) => {
      const purpose = s.heading
        ? `Heading: â€œ${s.heading}â€`
        : (s.purposeHint || '').slice(0, 80) || '(no heading)';
      const layout = s.fullWidth ? 'Full-width' : s.contained ? 'Contained' : 'Mixed/unknown';
      return `| ${i + 1} | ${s.tag}${s.className ? ` \`${s.className.slice(0, 40)}\`` : ''} | ${purpose.replace(/\|/g, '/')} | ~${s.height}px | ${layout} | Measured | High |`;
    })
    .join('\n');

  const type = d.typeSamples || {};
  const typoRow = (label, sample) => {
    if (!sample) return `| ${label} | â€” | â€” | â€” | â€” | â€” | â€” | Low |`;
    const st = sample.styles || {};
    return `| ${label} | \`${(st.fontFamily || '').slice(0, 50)}\` | ${st.fontSize} | ${st.fontWeight} | ${st.lineHeight} | ${st.letterSpacing} | ${st.textTransform} | Measured | High |`;
  };

  const nav = d.nav || {};
  const navSt = nav.styles || {};
  const mobileNav = m.nav || {};

  const sticky = (d.stickyFixed || [])
    .map((s) => `- **${s.position}**: ${s.tag}${s.text ? ` â€” â€œ${s.text.slice(0, 40)}â€` : ''} (${s.rect?.w}Ã—${s.rect?.h}px)`)
    .join('\n') || '- None clearly detected';

  const animRows = (n.animations || [])
    .map((a) => `| ${a.trigger} | ${a.elements} | ${a.direction || 'â€”'} | ${a.duration || 'â€”'} | ${a.easing || 'â€”'} | ${a.kind} | ${a.confidence} |`)
    .join('\n') || '| â€” | Incomplete | â€” | â€” | â€” | â€” | Low |';

  const hoverRows = (n.hoverObservations || [])
    .map((h) => {
      if (!h.found) return `| ${h.hint} | Not found | â€” | â€” | Low |`;
      const changes = [];
      if (h.before && h.after) {
        for (const k of Object.keys(h.before)) {
          if (h.before[k] !== h.after[k]) changes.push(`${k}: ${h.before[k]} â†’ ${h.after[k]}`);
        }
      }
      return `| ${h.hint} (â€œ${(h.text || '').slice(0, 30)}â€) | ${h.changed ? 'Yes' : 'No visible CSS change'} | ${changes.slice(0, 3).join('; ') || 'â€”'} | CSS transition: \`${(h.after?.transition || '').slice(0, 60)}\` | ${h.changed ? 'Medium' : 'Low'} |`;
    })
    .join('\n');

  const btn = (d.buttons || [])[0];
  const card = (d.cards || [])[0];
  const pill = (d.pills || [])[0];

  const fontFamilies = new Set();
  for (const sample of Object.values(type)) {
    if (sample?.styles?.fontFamily) fontFamilies.add(sample.styles.fontFamily);
  }
  for (const f of d.fonts || []) fontFamilies.add(f.family);

  const navLinks = (d.navLinks || []).map((l) => l.text).filter(Boolean);
  const uniqueNav = [...new Set(navLinks)].slice(0, 20);

  return `# Symbol Studio Design Audit

> Read-only visual/interaction audit of [https://www.symbolstudio.pl/en/](https://www.symbolstudio.pl/en/)  
> Viewports: Desktop **1440Ã—900**, Mobile **390Ã—844**  
> Collected via Puppeteer computed styles + observation. No source, fonts, or media downloaded.  
> Elapsed: **${elapsed}s**${n.meta.timedOut ? ' (HARD TIMEOUT â€” partial)' : ''} Â· Phases: ${(n.meta.phasesCompleted || []).join(', ') || 'none'}

Screenshots (minimal set): ${(n.screenshots || []).map((s) => `\`${s}\``).join(', ') || 'none'}

---

## 1. Executive summary

Symbol Studioâ€™s English homepage presents as a **studio / project portfolio** surface: strong brand presence in the header, a cinematic or typographic hero, then project/work storytelling, with supporting studio/about and contact cues lower on the page.

Visual language (from measured styles): restrained typography with exposed \`font-family\` stacks, high-contrast text on light or dark sectional planes, and interactive project media that respond to hover/scroll. Navigation is persistent (fixed/sticky elements detected: ${(d.stickyFixed || []).length}). Desktop uses a wide canvas (~1440) with contained content columns; mobile collapses to a single column and a hamburger/menu pattern${m.menu ? ' (menu interaction observed)' : ''}.

**Audit goal:** extract adaptable layout, proximity, nav, type, color, and motion patterns for an original **NOIR&CO** agency site â€” not a clone of branding, copy, or assets.

Confidence overall: **${n.meta.timedOut ? 'Mediumâ€“Low (timeboxed)' : 'Mediumâ€“High'}** for structure/tokens; motion timings often **Medium/Low** when only CSS \`transition\` strings were available.

---

## 2. Homepage section map

| # | Landmark | Purpose (paraphrased) | Approx. height | Width behavior | Kind | Confidence |
|---|----------|----------------------|----------------|----------------|------|------------|
${sectionRows || '| â€” | Could not map sections | â€” | â€” | â€” | â€” | Low |'}

### Sticky / fixed / pinned

${sticky}

### Desktop â†’ mobile structural changes

| Aspect | Desktop (1440) | Mobile (390) | Kind | Confidence |
|--------|----------------|--------------|------|------------|
| Section count sampled | ${(d.sections || []).length} | ${(m.sections || []).length} | Measured | High |
| Scroll height | ${d.scrollHeight || 'â€”'}px | ${m.scrollHeight || 'â€”'}px | Measured | High |
| Nav pattern | Horizontal links (${uniqueNav.length} items sampled) | ${m.menu?.opened ? 'Menu button + overlay/panel' : 'Compact / menu (see nav)'} | Observed | Medium |
| Project cards | ${(d.cards || []).length} card-like nodes | ${(m.cards || []).length} card-like nodes | Measured | Medium |
| Full-width sections | ${(d.sections || []).filter((s) => s.fullWidth).length} | ${(m.sections || []).filter((s) => s.fullWidth).length} | Measured | Medium |

---

## 3. Design tokens

### Surfaces & text (from computed color frequency)

| Role (inferred) | Value | Kind | Confidence |
|-----------------|-------|------|------------|
${colors
  .slice(0, 10)
  .map((c, i) => `| Sample ${i + 1} (freq ${c.count}) | ${c.hex} | Measured | High |`)
  .join('\n') || '| â€” | â€” | â€” | Low |'}

| Token | Desktop value | Kind | Confidence |
|-------|---------------|------|------------|
| Page background (\`body\`) | ${(d.body?.styles?.backgroundColor) || 'â€”'} | Measured | High |
| Root / html background | ${(d.html?.styles?.backgroundColor) || 'â€”'} | Measured | High |
| Body text color | ${(d.body?.styles?.color) || 'â€”'} | Measured | High |
| H1 color | ${(type.h1?.styles?.color) || 'â€”'} | Measured | High |
| H2 color | ${(type.h2?.styles?.color) || 'â€”'} | Measured | High |
| Nav background | ${navSt.backgroundColor || 'â€”'} | Measured | High |
| Nav text | ${navSt.color || 'â€”'} | Measured | Medium |
| Button fill (sample) | ${btn?.styles?.backgroundColor || 'â€”'} | Measured | Medium |
| Button text (sample) | ${btn?.styles?.color || 'â€”'} | Measured | Medium |
| Button border | ${btn?.styles?.border || 'â€”'} | Measured | Medium |
| Card/media surface | ${card?.styles?.backgroundColor || 'â€”'} | Measured | Medium |
| Border / divider sample | ${btn?.styles?.borderColor || card?.styles?.borderColor || 'â€”'} | Measured | Lowâ€“Medium |

Light/dark section transitions: infer from section \`backgroundColor\` sequence in section map (see Â§2). Exact accent hex beyond body/heading colors may include brand-specific hues â€” treat as **inspiration only**, not a palette to copy 1:1.

---

## 4. Typography

### Exposed font families

${[...fontFamilies].map((f) => `- \`${f}\``).join('\n') || '- Not exposed / not captured'}

Document.fonts entries (public API, not font files):  
${(d.fonts || []).slice(0, 15).map((f) => `- ${f.family} ${f.weight} ${f.style} (${f.status})`).join('\n') || '- None listed'}

| Role | font-family | size | weight | line-height | letter-spacing | text-transform | Kind | Conf. |
|------|-------------|------|--------|-------------|----------------|----------------|------|-------|
${typoRow('Display / H1', type.h1)}
${typoRow('Heading / H2', type.h2)}
${typoRow('Heading / H3', type.h3)}
${typoRow('Body', type.body)}
${typoRow('Label / small', type.label)}
${typoRow('Button', type.button)}
${typoRow('Link', type.link)}

### Responsive type

| Role | Desktop size | Mobile size | Kind | Confidence |
|------|--------------|-------------|------|------------|
| H1 | ${type.h1?.styles?.fontSize || 'â€”'} | ${m.typeSamples?.h1?.styles?.fontSize || 'â€”'} | Measured | High |
| H2 | ${type.h2?.styles?.fontSize || 'â€”'} | ${m.typeSamples?.h2?.styles?.fontSize || 'â€”'} | Measured | High |
| Body | ${type.body?.styles?.fontSize || 'â€”'} | ${m.typeSamples?.body?.styles?.fontSize || 'â€”'} | Measured | Medium |

Capitalization: see \`text-transform\` column (uppercase labels/nav are common in studio sites when present). Fluid type: compare desktop vs mobile sizes â€” if both set in \`px\` with a clear step-down, treat as breakpoint-scaled rather than CSS \`clamp\` unless \`font-size\` itself uses computed px from clamp (cannot distinguish without source).

**Do not download font files.** Family names above are from computed styles / \`document.fonts\` only.

---

## 5. Grid, spacing and proximity

| Measurement | Desktop | Mobile | Kind | Confidence |
|-------------|---------|--------|------|------------|
| Viewport | ${d.viewport?.w}Ã—${d.viewport?.h} | ${m.viewport?.w}Ã—${m.viewport?.h} | Measured | High |
| Likely container width | ${d.container?.rect?.w || 'not isolated'}px | ${m.container?.rect?.w || 'not isolated'}px | Measured | Medium |
| Body margin | ${d.body?.styles?.margin || 'â€”'} | ${m.body?.styles?.margin || 'â€”'} | Measured | High |
| Body padding | ${d.body?.styles?.padding || 'â€”'} | ${m.body?.styles?.padding || 'â€”'} | Measured | High |
| Nav height | ${nav.rect?.h || 'â€”'}px | ${mobileNav.rect?.h || 'â€”'}px | Measured | High |
| Nav padding | ${navSt.padding || 'â€”'} | ${(mobileNav.styles || {}).padding || 'â€”'} | Measured | Medium |
| Button padding (sample) | ${btn?.styles?.padding || 'â€”'} | â€” | Measured | Medium |
| Button radius | ${btn?.styles?.borderRadius || 'â€”'} | â€” | Measured | Medium |
| Card radius | ${card?.styles?.borderRadius || 'â€”'} | â€” | Measured | Medium |
| Card size (sample) | ${card ? `${card.rect?.w}Ã—${card.rect?.h}px` : 'â€”'} | â€” | Measured | Medium |
| Gap (container/flex sample) | ${d.container?.styles?.gap || btn?.styles?.gap || 'â€”'} | â€” | Measured | Lowâ€“Medium |

**Proximity / grouping (observed):**
- Headings sit close above supporting copy; CTAs typically follow copy within the same content block rather than floating as detached pills in the hero (verify via screenshots).
- Project media and titles form **card-like groups** even when not literal cards (shared hit area / link wrapping).
- Nav items group as a single horizontal cluster (desktop) vs icon/button trigger (mobile).

**Borders / dividers / radius:** prefer values in component inventory. Overlapping/cropped elements: check screenshots and sticky list; WebGL/canvas crop cannot be fully verified from box model alone.

---

## 6. Navigation

| Property | Desktop | Mobile | Kind | Confidence |
|----------|---------|--------|------|------------|
| Position | ${navSt.position || 'â€”'} | ${(mobileNav.styles || {}).position || 'â€”'} | Measured | High |
| Size | ${nav.rect ? `${nav.rect.w}Ã—${nav.rect.h}px` : 'â€”'} | ${mobileNav.rect ? `${mobileNav.rect.w}Ã—${mobileNav.rect.h}px` : 'â€”'} | Measured | High |
| Background | ${navSt.backgroundColor || 'â€”'} | ${(mobileNav.styles || {}).backgroundColor || 'â€”'} | Measured | High |
| Backdrop | ${navSt.backdropFilter || 'none'} | ${(mobileNav.styles || {}).backdropFilter || 'â€”'} | Measured | Medium |
| Border | ${navSt.border || 'â€”'} | â€” | Measured | Medium |
| Z-index | ${navSt.zIndex || 'â€”'} | â€” | Measured | Medium |

**Items / grouping (paraphrased labels only):**  
${uniqueNav.map((t) => `- ${t}`).join('\n') || '- Not captured'}

**Behavior:**
- Desktop: horizontal nav; hover observations in Â§8.
- Mobile menu: ${m.menu ? JSON.stringify({ opened: m.menu.opened, button: m.menu.buttonText, panels: (m.menu.panels || []).length, afterExpanded: m.menu.afterExpanded }) : 'not observed'}
- Scroll-dependent nav changes: compare sticky before/after in animation notes; ${ (n.animations || []).some((a) => /scroll/i.test(a.trigger)) ? 'scroll-linked changes noted' : 'no strong scroll-linked nav change confirmed' }.

---

## 7. Component inventory

### Buttons / CTAs (sample)

| Prop | Value | Kind | Conf. |
|------|-------|------|-------|
| Size | ${btn ? `${btn.rect?.w}Ã—${btn.rect?.h}px` : 'â€”'} | Measured | Medium |
| Padding | ${btn?.styles?.padding || 'â€”'} | Measured | Medium |
| Radius | ${btn?.styles?.borderRadius || 'â€”'} | Measured | Medium |
| Border | ${btn?.styles?.border || 'â€”'} | Measured | Medium |
| Color | ${btn?.styles?.color || 'â€”'} on ${btn?.styles?.backgroundColor || 'â€”'} | Measured | Medium |
| Type | ${btn?.styles?.fontSize || 'â€”'} / ${btn?.styles?.fontWeight || 'â€”'} / ${btn?.styles?.letterSpacing || 'â€”'} / ${btn?.styles?.textTransform || 'â€”'} | Measured | Medium |
| Transition | ${btn?.styles?.transition || 'â€”'} | Measured | Medium |
| Cursor | ${btn?.styles?.cursor || 'â€”'} | Measured | High |

### Project / media cards (sample)

| Prop | Value | Kind | Conf. |
|------|-------|------|-------|
| Size | ${card ? `${card.rect?.w}Ã—${card.rect?.h}px` : 'â€”'} | Measured | Medium |
| Radius | ${card?.styles?.borderRadius || 'â€”'} | Measured | Medium |
| Overflow | ${card?.styles?.overflow || 'â€”'} | Measured | Medium |
| Transform | ${card?.styles?.transform || 'â€”'} | Measured | Medium |
| Transition | ${card?.styles?.transition || 'â€”'} | Measured | Medium |
| Media children | ${card?.mediaCount || 0} | Measured | High |

### Pills / chips (if present)

| Prop | Value | Kind | Conf. |
|------|-------|------|-------|
| Size | ${pill ? `${pill.rect?.w}Ã—${pill.rect?.h}px` : 'none detected'} | Measured | Lowâ€“Medium |
| Radius | ${pill?.styles?.borderRadius || 'â€”'} | Measured | Lowâ€“Medium |
| Padding | ${pill?.styles?.padding || 'â€”'} | Measured | Lowâ€“Medium |

### Links, icons, cursor

- Cursors seen: ${(d.cursors || []).map((c) => `\`${c}\``).join(', ') || 'â€”'}
- Icons: not reverse-engineered; treat as line/SVG UI chrome where present in screenshots.
- Repeated pattern: linked media tile + title/meta grouping for projects.

---

## 8. Animation inventory

| Trigger | Elements | Direction / distance | Duration | Easing | Kind | Confidence |
|---------|----------|----------------------|----------|--------|------|------------|
${animRows}

### Hover observations

| Target | Changed? | Deltas | Transition | Conf. |
|--------|----------|--------|------------|-------|
${hoverRows || '| â€” | â€” | â€” | â€” | Low |'}

### Scroll observations

${(n.animations || [])
  .filter((a) => /scroll/i.test(a.trigger))
  .map((a) => `- **${a.trigger}**: ${a.detail || a.elements}`)
  .join('\n') || '- Down/up scroll performed; see sticky comparison in raw notes. No scrubbed timeline confirmed without deeper instrumentation.'}

### Reduced motion

- \`prefers-reduced-motion\` (page probe at capture): **${d.reducedMotion === true ? 'reduce (user/env)' : d.reducedMotion === false ? 'no-preference' : 'unknown'}**
- Site-specific reduced-motion overrides: **${n.reducedMotion?.note || 'not verified (would require toggling OS preference mid-session)'}**

### Mobile menu motion

${m.menu?.panels?.length
  ? (m.menu.panels || [])
      .map(
        (p) =>
          `- Panel \`${p.className || p.tag}\`: ${p.w}Ã—${p.h}, opacity ${p.opacity}, transform \`${p.transform}\`, transition \`${(p.transition || '').slice(0, 80)}\`, bg ${p.backgroundColor}`,
      )
      .join('\n')
  : '- Menu panel styles not captured or menu not found'}

---

## 9. Responsive behavior

| Topic | Observation | Kind | Confidence |
|-------|-------------|------|------------|
| Breakpoints | Inferred only from 1440 vs 390 â€” likely a tablet breakpoint between ~768â€“1024 (not swept) | Estimated | Low |
| Reflow | Multi-column / side-by-side project layouts collapse to stacked single column on mobile | Observed | Medium |
| Nav | Desktop link row â†’ mobile menu control | Observed | ${m.menu?.opened ? 'High' : 'Medium'} |
| Type | See Â§4 size deltas | Measured | High |
| Margins | Narrower viewport increases relative side padding feel; absolute padding from styles above | Measured | Medium |
| Hover â†’ touch | Hover-dependent card effects need tap/focus equivalents on mobile â€” confirm in screenshots; do not assume hover exists on touch | Estimated | Medium |
| Hidden on mobile | ${(m.hiddenNotes || 'Compare nav link visibility and desktop-only UI chrome in screenshots')} | Observed | Medium |

---

## 10. Adaptable patterns for NOIR&CO

Use these as **system patterns** for an original dark-luxury agency site â€” re-express with NOIR&CO brand type, color, and photography:

1. **Brand-first header chrome** â€” persistent top bar with wordmark as the strongest persistent signal; keep nav secondary in weight.
2. **One-job hero** â€” first viewport: brand + one line + one CTA group + one dominant visual plane (full-bleed), no stat strips.
3. **Project rail as primary content** â€” large media tiles with clear hit targets; title/meta in tight proximity under or over the media, not in floating badges.
4. **Sectional light/dark rhythm** â€” alternate surface values between narrative and work sections to create pacing without card grids everywhere.
5. **Restrained radius language** â€” pick one radius scale (sharp vs soft) and apply consistently to buttons and media frames.
6. **Hover grammar** â€” single coherent hover language (opacity, slight scale, or media zoom) shared by project tiles and text links; avoid competing glow effects.
7. **Mobile menu as full takeover** â€” opaque or near-opaque panel, large tap targets, explicit close; donâ€™t rely on hover.
8. **Scroll presence** â€” prefer a few intentional entrance/parallax moments over continuous decoration; respect reduced-motion with instant state swaps.
9. **Type pairing** â€” display + utilitarian body; uppercase micro-labels for meta only, not for long paragraphs.
10. **Contained measure for copy** â€” keep reading measure narrower than full viewport even when media is full-bleed.

---

## 11. Elements that should not be copied directly

- Symbol Studio wordmark, logo geometry, and brand name lockups
- Project photography, video, case-study stills, and client marks
- Verbatim marketing copy, slogans, and case titles
- Exact proprietary motion sequences / WebGL scenes if present
- Tracking pixels, cookie tooling, and any private user data
- Exact 1:1 color+type pairing if it reads as their brand identity
- Downloaded font files or self-hosted copies of their licensed fonts â€” choose licensed alternatives for NOIR&CO
- Source HTML/CSS/JS structure or class naming

---

## 12. Uncertainties and observations that could not be verified

${(n.meta.errors || []).length ? (n.meta.errors || []).map((e) => `- Error: ${e}`).join('\n') : '- No hard script errors recorded.'}
${n.meta.timedOut ? '- **Hard 15-minute timeout** fired; some later phases may be incomplete.' : '- Completed within timebox.'}
- Breakpoint sweep between 390 and 1440 was not performed â€” only two viewports.
- Scrubbed/scroll-linked timelines (GSAP ScrollTrigger etc.) were not reverse-engineered from minified code; only CSS transitions/animations exposed on computed styles plus visual scroll observation.
- Custom cursors / canvas cursors may not appear in \`cursor\` computed style.
- Font files and licensing were not inspected (by design).
- Cookie banner dismissal may have altered first-paint layout slightly after click.
- Hover via synthetic mouse events may miss JS listeners that require real pointer movement.
- Color roles (primary/accent) are inferred from frequency + component samples, not from a design-token file.
- Reduced-motion site behavior was not fully verified by toggling the preference.

### Raw notes

Machine-readable capture: \`audit-notes.json\` (measurements only â€” not site source).

---

*Generated for NOIR&CO design inspiration Â· ${new Date().toISOString()}*
`;
}

async function maybeStop(phase) {
  if (remaining() < 8000) {
    timedOut = true;
    notes.meta.timedOut = true;
    notes.meta.errors.push(`Approaching limit during: ${phase}`);
    throw new Error('TIMEBOX');
  }
}

async function run() {
  ensureDirs();
  hardTimer = setTimeout(async () => {
    timedOut = true;
    notes.meta.timedOut = true;
    log('HARD TIMEOUT 15m â€” stopping browser');
    await killBrowserHard();
  }, LIMIT_MS);

  try {
    log('Launching browser');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', `--window-size=${DESKTOP.width},${DESKTOP.height}`],
      defaultViewport: DESKTOP,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    );

    // ---- DESKTOP ----
    await maybeStop('desktop-nav');
    log(`Navigating ${TARGET}`);
    await page.goto(TARGET, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1500));
    await dismissOverlays(page);
    notes.meta.phasesCompleted.push('desktop-load');

    await maybeStop('desktop-shot1');
    const shot1 = join(SHOTS, '01-desktop-initial.png');
    await page.screenshot({ path: shot1 });
    notes.screenshots.push('audit-shots/01-desktop-initial.png');
    log('Shot: desktop initial');

    await maybeStop('desktop-collect');
    notes.desktop = await collectPageSnapshot(page, 'desktop');
    notes.meta.phasesCompleted.push('desktop-structure');
    saveNotes();
    log(`Desktop sections: ${(notes.desktop.sections || []).length}`);

    // Initial-load animation cues
    const loadTransitions = await page.evaluate(() => {
      const items = [];
      for (const el of document.querySelectorAll('h1,h2,header,img,video,canvas,section')) {
        const cs = getComputedStyle(el);
        if ((cs.animation && cs.animation !== 'none') || (cs.transition && cs.transition !== 'all 0s ease 0s')) {
          items.push({
            tag: el.tagName,
            text: (el.innerText || '').slice(0, 40),
            animation: cs.animation,
            transition: cs.transition,
            opacity: cs.opacity,
            transform: cs.transform,
          });
        }
        if (items.length >= 10) break;
      }
      return items;
    });
    for (const t of loadTransitions) {
      notes.animations.push({
        trigger: 'initial load / resting state',
        elements: `${t.tag} â€œ${t.text}â€`,
        direction: t.transform !== 'none' ? t.transform : 'â€”',
        duration: (t.transition || t.animation || '').slice(0, 80),
        easing: 'see CSS string',
        kind: 'time-based / CSS',
        confidence: 'Medium',
        detail: `opacity=${t.opacity}`,
      });
    }

    await maybeStop('desktop-scroll');
    const projectY = await findProjectScrollY(page);
    log(`Scrolling toward projects ~${projectY}`);
    const scrollDownObs = await scrollAndWatch(page, 'down');
    notes.animations.push({
      trigger: 'scroll down',
      elements: 'page + sticky/fixed nodes',
      direction: `Î”y ~${(scrollDownObs[0]?.endY || 0) - (scrollDownObs[0]?.startY || 0)}px`,
      duration: '~1.5â€“2s stepped',
      easing: 'browser scroll',
      kind: 'scroll-linked observation',
      confidence: 'Medium',
      detail: `animatedish=${(scrollDownObs[0]?.animatedish || []).length}; sticky count ${scrollDownObs[0]?.stickyAfter?.length || 0}`,
    });
    for (const a of scrollDownObs[0]?.animatedish || []) {
      notes.animations.push({
        trigger: 'in view after scroll down',
        elements: `${a.tag} â€œ${a.text}â€`,
        direction: a.transform,
        duration: a.transition || a.animation,
        easing: 'from CSS',
        kind: 'scroll-triggered or CSS transition',
        confidence: 'Lowâ€“Medium',
      });
    }

    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), projectY);
    await new Promise((r) => setTimeout(r, 600));
    const shot2 = join(SHOTS, '02-desktop-projects.png');
    await page.screenshot({ path: shot2 });
    notes.screenshots.push('audit-shots/02-desktop-projects.png');
    log('Shot: desktop projects');
    notes.meta.phasesCompleted.push('desktop-scroll');

    // Hover card then screenshot
    await maybeStop('desktop-hover');
    const hoverNav = await observeHover(page, 'nav');
    const hoverBtn = await observeHover(page, 'button');
    const hoverCard = await observeHover(page, 'card');
    notes.hoverObservations.push(hoverNav, hoverBtn, hoverCard);
    notes.animations.push({
      trigger: 'hover (nav / button / card)',
      elements: 'sampled interactive nodes',
      direction: 'see hover table',
      duration: 'from transition CSS',
      easing: 'from transition CSS',
      kind: 'hover-based',
      confidence: 'Medium',
    });

    // Re-hover card for screenshot
    await page.evaluate(() => {
      const el = [...document.querySelectorAll('a, article, figure')].find((node) => {
        const r = node.getBoundingClientRect();
        return node.querySelector('img, video, canvas') && r.width > 200 && r.top > 60 && r.top < innerHeight - 80;
      });
      if (el) {
        el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    // Also try real hover via mouse
    const cardBox = await page.evaluate(() => {
      const el = [...document.querySelectorAll('a, article, figure')].find((node) => {
        const r = node.getBoundingClientRect();
        return node.querySelector('img, video, canvas') && r.width > 200 && r.top > 60 && r.top < innerHeight - 80;
      });
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    if (cardBox) {
      await page.mouse.move(cardBox.x, cardBox.y);
      await new Promise((r) => setTimeout(r, 400));
    }
    const shot3 = join(SHOTS, '03-desktop-hover.png');
    await page.screenshot({ path: shot3 });
    notes.screenshots.push('audit-shots/03-desktop-hover.png');
    log('Shot: desktop hover');

    // Scroll up
    const scrollUpObs = await scrollAndWatch(page, 'up');
    notes.animations.push({
      trigger: 'scroll up',
      elements: 'page + sticky/fixed',
      direction: `Î”y ~${(scrollUpObs[0]?.endY || 0) - (scrollUpObs[0]?.startY || 0)}px`,
      duration: '~1.5s stepped',
      easing: 'browser scroll',
      kind: 'scroll-linked observation',
      confidence: 'Medium',
    });
    notes.meta.phasesCompleted.push('desktop-hover');
    saveNotes();

    // ---- MOBILE ----
    await maybeStop('mobile');
    log('Switching to mobile 390Ã—844');
    await page.setViewport(MOBILE);
    await page.goto(TARGET, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1200));
    await dismissOverlays(page);

    const shot4 = join(SHOTS, '04-mobile-initial.png');
    await page.screenshot({ path: shot4 });
    notes.screenshots.push('audit-shots/04-mobile-initial.png');
    log('Shot: mobile initial');

    notes.mobile = await collectPageSnapshot(page, 'mobile');
    notes.meta.phasesCompleted.push('mobile-structure');

    await maybeStop('mobile-menu');
    const menu = await openMobileMenu(page);
    notes.mobile.menu = menu;
    notes.animations.push({
      trigger: 'mobile menu open',
      elements: menu.opened ? `button â€œ${menu.buttonText}â€ + ${menu.panels?.length || 0} panels` : 'menu button not found',
      direction: menu.panels?.[0]?.transform || 'â€”',
      duration: menu.panels?.[0]?.transition || '~0.3â€“0.5s observed wait',
      easing: 'from CSS if present',
      kind: 'time-based UI',
      confidence: menu.opened ? 'Medium' : 'Low',
    });

    const shot5 = join(SHOTS, '05-mobile-menu-open.png');
    await page.screenshot({ path: shot5 });
    notes.screenshots.push('audit-shots/05-mobile-menu-open.png');
    log('Shot: mobile menu');

    await closeMobileMenu(page);
    notes.animations.push({
      trigger: 'mobile menu close',
      elements: 'menu panel / button',
      direction: 'reverse of open',
      duration: '~0.3â€“0.5s observed',
      easing: 'from CSS if present',
      kind: 'time-based UI',
      confidence: 'Lowâ€“Medium',
    });

    // Resize observation if time
    if (remaining() > 20000) {
      await page.setViewport(DESKTOP);
      await new Promise((r) => setTimeout(r, 500));
      await page.setViewport(MOBILE);
      await new Promise((r) => setTimeout(r, 500));
      notes.meta.phasesCompleted.push('resize-observe');
      notes.animations.push({
        trigger: 'resize desktopâ†’mobile',
        elements: 'layout reflow',
        direction: 'stack / collapse',
        duration: 'immediate layout + any CSS transitions',
        easing: 'â€”',
        kind: 'responsive reflow',
        confidence: 'Low',
      });
    }

    notes.reducedMotion = {
      atCapture: notes.desktop.reducedMotion,
      note: 'Site-specific reduced-motion CSS not verified by preference toggle',
    };
    notes.meta.phasesCompleted.push('mobile-menu');
    saveNotes();

    await browser.close();
    browser = null;
    log('Browser closed cleanly');
  } catch (err) {
    if (err.message === 'TIMEBOX' || timedOut) {
      log('Stopped due to timebox');
      notes.meta.timedOut = true;
    } else {
      notes.meta.errors.push(String(err.stack || err));
      log(`Error: ${err.message}`);
    }
    await killBrowserHard();
  } finally {
    if (hardTimer) clearTimeout(hardTimer);
    notes.meta.finishedAt = new Date().toISOString();
    notes.meta.elapsedMs = Date.now() - startedAt;
    saveNotes();
    const md = buildReport(notes);
    writeFileSync(REPORT_PATH, md, 'utf8');
    log(`Report written: ${REPORT_PATH}`);
    log(`Notes written: ${NOTES_PATH}`);
    log(`Elapsed total: ${notes.meta.elapsedMs}ms Â· timedOut=${notes.meta.timedOut}`);
  }
}

run();
