// Pure helpers that describe a DOM element the way DevTools and a
// screen reader would: size, box model, type, colour contrast, role, name.

const IMPLICIT_ROLES = {
  A: (el) => (el.hasAttribute("href") ? "link" : null),
  BUTTON: () => "button",
  NAV: () => "navigation",
  MAIN: () => "main",
  HEADER: (el) => (el.closest("main, article, section") ? null : "banner"),
  FOOTER: (el) => (el.closest("main, article, section") ? null : "contentinfo"),
  ASIDE: () => "complementary",
  FORM: () => "form",
  UL: () => "list",
  OL: () => "list",
  LI: () => "listitem",
  IMG: (el) => (el.getAttribute("alt") === "" ? "presentation" : "image"),
  P: () => "paragraph",
  BLOCKQUOTE: () => "blockquote",
  FIGURE: () => "figure",
  TEXTAREA: () => "textbox",
  SELECT: () => "combobox",
  DIALOG: () => "dialog",
  ARTICLE: () => "article",
  SECTION: (el) =>
    el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby") ? "region" : null,
  INPUT: (el) => {
    const t = (el.getAttribute("type") || "text").toLowerCase();
    if (t === "checkbox") return "checkbox";
    if (t === "radio") return "radio";
    if (t === "range") return "slider";
    if (t === "submit" || t === "button") return "button";
    return "textbox";
  },
};

export function roleOf(el) {
  const explicit = el.getAttribute("role");
  if (explicit) return explicit.split(" ")[0];
  const m = /^H([1-6])$/.exec(el.tagName);
  if (m) return `heading, level ${m[1]}`;
  const fn = IMPLICIT_ROLES[el.tagName];
  return (fn && fn(el)) || "generic";
}

const clean = (s, max = 60) => {
  const t = (s || "").replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
};

export function nameOf(el) {
  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) {
    const text = labelledby
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent || "")
      .join(" ");
    if (text.trim()) return clean(text);
  }
  const aria = el.getAttribute("aria-label");
  if (aria) return clean(aria);
  if (el.tagName === "IMG") return clean(el.getAttribute("alt") || "");
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) {
    const byFor = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    const wrap = el.closest("label");
    return clean((byFor || wrap)?.textContent || el.getAttribute("placeholder") || "");
  }
  return clean(el.textContent || "");
}

// ---------- Colour ----------
function parseColor(str) {
  const m = /rgba?\(([^)]+)\)/.exec(str || "");
  if (!m) return null;
  const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  const [r, g, b, a = 1] = parts;
  return { r, g, b, a };
}

const blend = (top, bottom) => ({
  r: top.r * top.a + bottom.r * (1 - top.a),
  g: top.g * top.a + bottom.g * (1 - top.a),
  b: top.b * top.a + bottom.b * (1 - top.a),
  a: 1,
});

function luminance({ r, g, b }) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(fg, bg) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Walk up until we find a solid background. Returns null if an image or gradient is in the way. */
function effectiveBackground(el) {
  const layers = [];
  let node = el;
  while (node && node.nodeType === 1) {
    const cs = getComputedStyle(node);
    if (cs.backgroundImage && cs.backgroundImage !== "none") return null;
    const c = parseColor(cs.backgroundColor);
    if (c && c.a > 0) {
      layers.push(c);
      if (c.a >= 1) break;
    }
    node = node.parentElement;
  }
  let base = { r: 255, g: 255, b: 255, a: 1 };
  for (let i = layers.length - 1; i >= 0; i -= 1) base = blend(layers[i], base);
  return base;
}

const toHex = ({ r, g, b }) =>
  `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

export function describe(el) {
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const px = (v) => parseFloat(v) || 0;
  const box = {
    margin: [px(cs.marginTop), px(cs.marginRight), px(cs.marginBottom), px(cs.marginLeft)],
    padding: [px(cs.paddingTop), px(cs.paddingRight), px(cs.paddingBottom), px(cs.paddingLeft)],
    border: [
      px(cs.borderTopWidth),
      px(cs.borderRightWidth),
      px(cs.borderBottomWidth),
      px(cs.borderLeftWidth),
    ],
  };

  const hasText = !!clean(el.textContent || "") && el.tagName !== "IMG";
  let contrast = null;
  if (hasText) {
    const bg = effectiveBackground(el);
    const fgRaw = parseColor(cs.color);
    if (bg && fgRaw) {
      const fg = fgRaw.a < 1 ? blend(fgRaw, bg) : fgRaw;
      const ratio = contrastRatio(fg, bg);
      const size = px(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      const large = size >= 24 || (bold && size >= 18.66);
      const needed = large ? 3 : 4.5;
      contrast = {
        ratio,
        needed,
        large,
        pass: ratio >= needed,
        fg: toHex(fg),
        bg: toHex(bg),
      };
    }
  }

  const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/)[0] : "";
  return {
    selector: `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ""}`,
    rect,
    box,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    font: hasText
      ? `${Math.round(px(cs.fontSize))}px ${cs.fontFamily.split(",")[0].replace(/["']/g, "")}`
      : null,
    contrast,
    role: roleOf(el),
    name: nameOf(el),
  };
}

const PREFERRED =
  "a, button, input, textarea, select, label, img, svg, h1, h2, h3, h4, p, li, blockquote, figcaption, summary, [role], [data-inspect]";

/** Pick the element worth describing from whatever the pointer landed on. */
export function pickTarget(node) {
  if (!node || node.nodeType !== 1) return null;
  if (node.closest("[data-inspector-ui]")) return null;
  const el = node.closest(PREFERRED) || node;
  if (el === document.body || el === document.documentElement || el.id === "root") return null;
  return el;
}

export function spokenSummary(d) {
  const parts = [d.role];
  if (d.name) parts.push(`"${d.name}"`);
  parts.push(`${d.width} by ${d.height} pixels`);
  if (d.contrast) {
    parts.push(
      `contrast ${d.contrast.ratio.toFixed(1)} to 1, ${d.contrast.pass ? "passes" : "fails"} AA`
    );
  }
  return parts.join(", ");
}
