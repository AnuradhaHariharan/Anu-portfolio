// Turns the page's text into shootable targets. Headings split into letters,
// everything else into words. Images, icons and form controls are whole targets.
// Nothing here needs undoing: "Rebuild" remounts the React tree.

const SKIP = "script, style, noscript, textarea, input, select, [data-destroy-ui], [data-inspector-ui]";
const LETTER_TAGS = /^H[1-3]$/;

export const POINTS = { letter: 10, word: 5, block: 25, image: 50 };

function wrap(text, kind) {
  const frag = document.createDocumentFragment();
  const parts = kind === "letter" ? Array.from(text) : text.split(/(\s+)/);
  parts.forEach((part) => {
    if (!part) return;
    if (/^\s+$/.test(part)) {
      frag.appendChild(document.createTextNode(part));
      return;
    }
    const span = document.createElement("span");
    span.className = "dx-t";
    span.dataset.dx = kind;
    span.textContent = part;
    frag.appendChild(span);
  });
  return frag;
}

export function splitPage(roots) {
  let count = 0;
  roots.forEach((root) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement;
        if (!p || p.closest(SKIP) || p.closest("svg") || p.classList.contains("dx-t")) return NodeFilter.FILTER_REJECT;
        if (p.closest(".sr-only")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      const kind = n.parentElement.closest("h1, h2, h3") && LETTER_TAGS.test(n.parentElement.closest("h1, h2, h3").tagName) ? "letter" : "word";
      const frag = wrap(n.nodeValue, kind);
      count += frag.querySelectorAll ? frag.childNodes.length : 0;
      n.parentNode.replaceChild(frag, n);
    });

    root.querySelectorAll("img, svg, input, textarea, .btn, .sys-node, .bars, .mock").forEach((el) => {
      if (el.closest(SKIP) && !el.matches("input, textarea")) return;
      if (el.closest(".dx-b") && el.closest(".dx-b") !== el) return;
      el.classList.add("dx-b");
      el.dataset.dx = el.matches("img, .mock") ? "image" : "block";
    });
  });
  const total = roots.reduce((n, r) => n + (r ? r.querySelectorAll(".dx-t, .dx-b").length : 0), 0);
  return total || count;
}

/** Find what a shot at (x, y) hits. */
export function targetAt(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el || el.closest("[data-destroy-ui]")) return null;
  const t = el.closest(".dx-t, .dx-b");
  if (!t || t.classList.contains("dx-dead")) return null;
  return t;
}
