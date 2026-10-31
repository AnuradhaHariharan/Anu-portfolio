import React from "react";

// Each broken UI is drawn as an SVG mock-up (aria-hidden) plus a plain
// description, so the page itself never ships a real accessibility bug.

const Frame = ({ children }) => (
  <svg viewBox="0 0 320 140" className="mock" aria-hidden="true" focusable="false">
    <rect x="1" y="1" width="318" height="138" rx="12" fill="#ffffff" stroke="#d3d6e2" />
    {children}
  </svg>
);

const T = (props) => <text fontFamily="Atkinson Hyperlegible Next, sans-serif" {...props} />;

export const ROUNDS = [
  {
    id: "contrast",
    prompt: "This confirmation message is hard to read. What's the right fix?",
    description: "Light grey text, #a8aab3, on a white card. Contrast is 2.3 to 1.",
    visual: (
      <Frame>
        <T x="24" y="62" fontSize="20" fontWeight="700" fill="#a8aab3">Your order has shipped</T>
        <T x="24" y="92" fontSize="15" fill="#b9bbc3">Arriving Thursday, 4 Nov</T>
      </Frame>
    ),
    code: `.status { color: #a8aab3; } /* on #ffffff */`,
    options: [
      { id: "a", text: "Make the text bigger and keep the colour" },
      { id: "b", text: "Darken the text until contrast is at least 4.5:1" },
      { id: "c", text: "Add a check-mark icon next to it" },
      { id: "d", text: "Make the text italic so it stands out" },
    ],
    answer: "b",
    wcag: "1.4.3 Contrast (Minimum)",
    explain:
      "Body text needs a contrast ratio of at least 4.5:1 (3:1 for large text). Size helps, but #a8aab3 on white is 2.3:1 and still fails even at 24px.",
    fix: `.status { color: #464a5c; } /* 8.6:1 */`,
  },
  {
    id: "icon-button",
    prompt: "A screen reader announces this button as just “button”. Why, and what fixes it?",
    description: "A round button that only shows a trash-can icon. It has no text.",
    visual: (
      <Frame>
        <T x="24" y="52" fontSize="16" fontWeight="700" fill="#14151c">Draft: Q3 update</T>
        <T x="24" y="78" fontSize="13" fill="#464a5c">Edited 2 minutes ago</T>
        <circle cx="270" cy="70" r="22" fill="#eef0f6" stroke="#6f7388" />
        <path d="M261 61h18M265 61v-3h10v3M263 64l2 18h10l2-18" fill="none" stroke="#14151c" strokeWidth="2" strokeLinejoin="round" />
      </Frame>
    ),
    code: `<button onClick={remove}>\n  <TrashIcon />\n</button>`,
    options: [
      { id: "a", text: "Add a title attribute so a tooltip appears on hover" },
      { id: "b", text: "Colour the icon red so it looks dangerous" },
      { id: "c", text: "Give the button an accessible name, like aria-label=\"Delete draft\"" },
      { id: "d", text: "Make the icon larger" },
    ],
    answer: "c",
    wcag: "4.1.2 Name, Role, Value",
    explain:
      "An icon has no text for assistive tech to read. aria-label (or visually hidden text) gives the button a name. A title tooltip isn't reliable: touch and keyboard users rarely see it, and many screen readers ignore it.",
    fix: `<button onClick={remove} aria-label="Delete draft">\n  <TrashIcon aria-hidden="true" />\n</button>`,
  },
  {
    id: "placeholder",
    prompt: "People forget what this field was for once they start typing. What's missing?",
    description: "A text field whose only label is placeholder text, “Work email”, which disappears on typing.",
    visual: (
      <Frame>
        <rect x="24" y="40" width="272" height="44" rx="8" fill="#ffffff" stroke="#6f7388" />
        <T x="38" y="68" fontSize="15" fill="#14151c">anu@</T>
        <rect x="74" y="54" width="1.5" height="20" fill="#14151c" />
        <T x="24" y="112" fontSize="12" fill="#464a5c">(The placeholder “Work email” vanished.)</T>
      </Frame>
    ),
    code: `<input type="email" placeholder="Work email" />`,
    options: [
      { id: "a", text: "A visible label tied to the input with <label for>" },
      { id: "b", text: "A darker placeholder colour" },
      { id: "c", text: "An animation when the placeholder disappears" },
      { id: "d", text: "A bigger input" },
    ],
    answer: "a",
    wcag: "3.3.2 Labels or Instructions",
    explain:
      "Placeholders vanish as soon as you type and are often low contrast. A persistent <label> stays visible, is read by screen readers, and makes the label clickable.",
    fix: `<label for="email">Work email</label>\n<input id="email" type="email" />`,
  },
  {
    id: "div-button",
    prompt: "Keyboard users can't submit this form. What's the cause?",
    description: "A purple box that looks like a “Pay now” button but is a div with a click handler.",
    visual: (
      <Frame>
        <rect x="24" y="44" width="150" height="48" rx="24" fill="#4530d8" />
        <T x="99" y="74" fontSize="16" fontWeight="700" fill="#ffffff" textAnchor="middle">Pay now</T>
        <T x="196" y="74" fontSize="13" fill="#464a5c">Tab skips it</T>
      </Frame>
    ),
    code: `<div class="btn" onClick={pay}>Pay now</div>`,
    options: [
      { id: "a", text: "Add cursor: pointer" },
      { id: "b", text: "Add tabindex=\"0\" and stop there" },
      { id: "c", text: "Use a real <button>, which is focusable and works with Enter and Space" },
      { id: "d", text: "Add a hover effect" },
    ],
    answer: "c",
    wcag: "2.1.1 Keyboard",
    explain:
      "A div isn't focusable and doesn't respond to Enter or Space. tabindex alone makes it focusable but still doesn't make it a button. A native <button> gives you focus, keyboard activation and the right role for free.",
    fix: `<button type="submit" class="btn">Pay now</button>`,
  },
  {
    id: "colour-only",
    prompt: "This error is only shown with a red border. Who misses it, and what's the fix?",
    description: "An input with a red border and no error text.",
    visual: (
      <Frame>
        <T x="24" y="36" fontSize="13" fontWeight="700" fill="#14151c">Phone number</T>
        <rect x="24" y="46" width="272" height="44" rx="8" fill="#ffffff" stroke="#d92d20" strokeWidth="2" />
        <T x="38" y="74" fontSize="15" fill="#14151c">98765</T>
      </Frame>
    ),
    code: `input.invalid { border-color: red; }`,
    options: [
      { id: "a", text: "Use a brighter red" },
      { id: "b", text: "Add a text message like “Enter all 10 digits”, linked with aria-describedby" },
      { id: "c", text: "Shake the field" },
      { id: "d", text: "Turn the label red too" },
    ],
    answer: "b",
    wcag: "1.4.1 Use of Color",
    explain:
      "People with colour blindness and screen reader users can't rely on a red border. A written message, connected with aria-describedby and aria-invalid, tells everyone what's wrong and how to fix it.",
    fix: `<input aria-invalid="true" aria-describedby="phone-err" />\n<p id="phone-err">Enter all 10 digits.</p>`,
  },
  {
    id: "focus",
    prompt: "A designer said the focus outline “looked ugly”, so it was removed. What's the problem?",
    description: "A row of links with no visible indication of which one has keyboard focus.",
    visual: (
      <Frame>
        <T x="24" y="76" fontSize="16" fill="#14151c">Home</T>
        <T x="96" y="76" fontSize="16" fill="#14151c">Pricing</T>
        <T x="176" y="76" fontSize="16" fill="#14151c">Docs</T>
        <T x="236" y="76" fontSize="16" fill="#14151c">Login</T>
        <T x="24" y="112" fontSize="12" fill="#464a5c">Which one is focused? There's no way to tell.</T>
      </Frame>
    ),
    code: `*:focus { outline: none; }`,
    options: [
      { id: "a", text: "Nothing, mouse users don't need it" },
      { id: "b", text: "Keyboard users lose their place. Restore a visible style with :focus-visible" },
      { id: "c", text: "Only add focus styles to buttons" },
      { id: "d", text: "Use a 1px light grey outline" },
    ],
    answer: "b",
    wcag: "2.4.7 Focus Visible",
    explain:
      ":focus-visible shows the ring for keyboard users and hides it for mouse clicks, so it fits both needs. The ring also needs enough contrast to be seen.",
    fix: `:focus-visible {\n  outline: 3px solid var(--accent);\n  outline-offset: 3px;\n}`,
  },
  {
    id: "reflow",
    prompt: "On a phone, or when zoomed to 400%, this card makes the page scroll sideways. Best fix?",
    description: "A card with a fixed width of 600 pixels inside a 320 pixel wide screen.",
    visual: (
      <Frame>
        <rect x="24" y="30" width="110" height="80" rx="10" fill="#eef0f6" stroke="#6f7388" strokeDasharray="4 3" />
        <T x="34" y="54" fontSize="11" fill="#464a5c">320px screen</T>
        <rect x="40" y="62" width="260" height="38" rx="6" fill="#e2defc" stroke="#4530d8" />
        <T x="50" y="86" fontSize="12" fill="#14151c">width: 600px card overflows →</T>
      </Frame>
    ),
    code: `.card { width: 600px; }`,
    options: [
      { id: "a", text: "Hide the card on small screens" },
      { id: "b", text: "Add overflow-x: scroll to the page" },
      { id: "c", text: "Use a flexible width, like width: min(100%, 600px)" },
      { id: "d", text: "Scale the whole page down with zoom" },
    ],
    answer: "c",
    wcag: "1.4.10 Reflow",
    explain:
      "Content should fit a 320px-wide viewport without scrolling in two directions. A max-width or min() keeps the design at 600px on desktop and lets it shrink on small screens.",
    fix: `.card { width: min(100%, 600px); }`,
  },
  {
    id: "autoplay",
    prompt: "This testimonial carousel auto-advances every 3 seconds. What's needed?",
    description: "A carousel of quotes that moves on its own with no pause control.",
    visual: (
      <Frame>
        <rect x="24" y="28" width="272" height="66" rx="10" fill="#eef0f6" />
        <T x="40" y="58" fontSize="14" fill="#14151c">“Shipped the redesign in two…”</T>
        <circle cx="140" cy="112" r="4" fill="#4530d8" />
        <circle cx="156" cy="112" r="4" fill="#c9ccd8" />
        <circle cx="172" cy="112" r="4" fill="#c9ccd8" />
      </Frame>
    ),
    code: `setInterval(next, 3000);`,
    options: [
      { id: "a", text: "Slow it down to every 5 seconds" },
      { id: "b", text: "Add a fade transition" },
      { id: "c", text: "A pause button, or don't auto-advance at all" },
      { id: "d", text: "Pause it only on hover" },
    ],
    answer: "c",
    wcag: "2.2.2 Pause, Stop, Hide",
    explain:
      "Moving content that lasts more than 5 seconds needs a way to pause it. Pausing on hover doesn't help keyboard or touch users, and slow readers can't finish a quote before it moves.",
    fix: `<button aria-pressed={paused} onClick={toggle}>\n  {paused ? "Play" : "Pause"} slideshow\n</button>`,
  },
];
