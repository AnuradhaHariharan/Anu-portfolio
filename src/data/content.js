// Everything the site says lives here, so updating the portfolio
// means editing this file, not hunting through components.

const asset = (p) => `${process.env.PUBLIC_URL}${p}`;

export const profile = {
  name: "Anuradha Hariharan",
  role: "Frontend Engineer",
  location: "Bengaluru, India",
  experience: "2.5+ years",
  email: "anuradhahariharannov5@gmail.com",
  phone: "+91 89254 19205",
  linkedin: "https://www.linkedin.com/in/anuradhahariharan13/",
  github: "https://github.com/AnuradhaHariharan",
  resume: asset("/Anuradha_Hariharan_Resume.pdf"),
  photo: asset("/img/anuradha"),
};

// Before/after pairs drawn as bars. `lowerIsBetter` flips the bar maths.
// Headline results, each shown once. How they were achieved lives in
// Experience.
export const impact = [
  {
    id: "chart",
    beforeLabel: "~1.6s",
    afterLabel: "~0.15s",
    before: 1.6,
    after: 0.15,
    unit: "s",
    lowerIsBetter: true,
    summary: "1-hour chart load time cut from ~1.6s to ~0.15s",
    detail: "About 11x faster. Seconds charts went from ~40 sequential requests to one.",
    where: "Rupeezy",
  },
  {
    id: "conversion",
    beforeLabel: "1.8%",
    afterLabel: "2.08%",
    before: 1.8,
    after: 2.08,
    unit: "%",
    lowerIsBetter: false,
    summary: "Quarterly traffic-to-lead conversion up to 2.08% from a 1.8% baseline",
    detail: "Lead tracking and conversion work on the website.",
    where: "Rupeezy",
  },
  {
    id: "pagespeed",
    beforeLabel: "Baseline",
    afterLabel: "+35%",
    before: 100,
    after: 135,
    unit: "%",
    lowerIsBetter: false,
    summary: "Website performance score up 35%",
    detail: "Measured on PageSpeed Insights and GTmetrix.",
    where: "Fyle",
  },
  {
    id: "reviews",
    beforeLabel: "Baseline",
    afterLabel: "+25%",
    before: 100,
    after: 125,
    unit: "%",
    lowerIsBetter: false,
    summary: "Positive customer reviews up 25%",
    detail: "After the one-click account switching release.",
    where: "Fyle",
  },
];

export const jobs = [
  {
    id: "rupeezy",
    company: "Rupeezy",
    title: "Software Developer",
    start: "Mar 2026",
    end: "Present",
    focus: "Performance, reliability and real-time UI",
    context: "A fintech stock broker whose web trading terminal serves 6,000–10,000 traders a day.",
    points: [
      "Upgraded the TradingView charting engine from v26 to v32, six major versions behind. Fixed every breaking change while keeping existing workflows intact, and rolled it out in 7 staged pre-prod releases with zero disruption.",
      "Switched the trading terminal's charts to server-native intraday bars.",
      "Contributed to the KYC 2.0 revamp, migrating account opening from Angular 11 to React 19: a 13-step SEBI-compliant onboarding flow with PAN and KRA auto-fill, selfie and e-sign, and resume-from-last-step, aimed at lifting completion from 50% to 70%+.",
      "Implemented lead tracking and conversion improvements on the website.",
      "Working on the frontend for FinAI, Rupeezy's in-house AI model.",
      "Developed Next.js pages and tools for mutual funds, brokerage calculators, market heatmaps, NSE pre-open, Stock SIP, F&O and IPOs.",
      "Shipped and supported releases on AWS, and owned production reliability during market hours: pre-market checks, Grafana monitoring, root-causing production issues and shipping hotfixes.",
    ],
    stack: ["Next.js", "React 19", "TypeScript", "TradingView", "WebSockets", "AWS", "Grafana"],
  },
  {
    id: "atomicwork",
    company: "Atomicwork",
    title: "Frontend Developer",
    start: "Oct 2025",
    end: "Jan 2026",
    focus: "Product features and the component library",
    context: "A service management platform for IT and HR teams.",
    points: [
      "Owned end-to-end delivery of the Sandbox feature, a secure, interactive environment where prospects explore the product hands-on.",
      "Upgraded Next.js to the latest version with Turbopack to improve development speed and build performance.",
      "Contributed reusable components to the frontend component library and shipped feature enhancements and UI updates across the product.",
      "Managed frontend state with Zustand and server data fetching and caching with TanStack Query.",
    ],
    stack: ["Next.js", "Turbopack", "Zustand", "TanStack Query"],
  },
  {
    id: "projects-based",
    company: "Project-based roles",
    title: "Frontend Developer",
    start: "Aug 2024",
    end: "Sep 2025",
    focus: "Real-time logic and internal dashboards",
    context: "Contract frontend work, including the core of a ride-hailing platform.",
    points: [
      "Built a real-time fare engine with surge pricing, luxury tiers and location-based fees.",
      "Automated driver onboarding-to-offboarding workflows and built rider admin tools.",
      "Built a React internal platform with Chart.js visualisations for live monitoring of tasks, tickets, squad progress, member activity and operational metrics.",
      "Automated KYC using Dwolla payment authorisation and webhooks, delivering a 2-minute approval workflow (validated in the Dwolla sandbox).",
    ],
    stack: ["React", "Chart.js", "Webhooks"],
  },
  {
    id: "fyle",
    company: "Fyle",
    title: "Software Developer Intern",
    start: "May 2024",
    end: "Jul 2024",
    focus: "Web performance",
    context: "An expense management product for finance teams.",
    points: [
      "Improved website performance through CSS purging, lazy-loading below-the-fold content, Webpack tree-shaking and code-splitting, nginx caching and a Cloudflare CDN.",
      "Shipped one-click switching between multiple accounts, which brought back churned users.",
    ],
    stack: ["Webpack", "nginx", "Cloudflare"],
  },
];

export const skills = [
  { group: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "HTML", "CSS"] },
  {
    group: "Frameworks",
    items: ["React", "Next.js (App Router, SSR, ISR)", "TanStack Query", "Zustand", "Tailwind CSS", "Ant Design"],
  },
  { group: "Real-time and charts", items: ["WebSockets", "TradingView Charting Library", "Chart.js"] },
  {
    group: "Quality",
    items: ["Core Web Vitals", "Code-splitting and lazy loading", "Caching", "WCAG accessibility"],
  },
  {
    group: "Shipping",
    items: ["AWS (S3, CloudFront, EKS, ECR)", "Docker", "nginx", "Cloudflare", "CI/CD", "Grafana", "OpenTelemetry"],
  },
];

export const projects = [
  {
    name: "MemeDB",
    summary:
      "A searchable library of thousands of Tamil meme templates, organised by movie and actor, with trending feeds, in-browser editing, and server-rendered pages that search engines can index.",
    stack: ["Next.js", "Firebase", "SSR"],
    code: "",
    live: "",
  },
  {
    name: "TaskBuddy",
    summary: "A task manager with Google sign-in, filtering, and list and board views.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    code: "https://github.com/AnuradhaHariharan/task-manager",
    live: "https://task-manager-6432a.web.app/",
  },
  {
    name: "Analytics dashboard",
    summary: "Revenue, user activity and conversion metrics visualised with Chart.js.",
    stack: ["React", "Chart.js", "SCSS"],
    code: "https://github.com/AnuradhaHariharan/e-commerce_website",
    live: "https://anuradhahariharan.github.io/seller-app/",
  },
  {
    name: "Geo Mappy",
    summary: "Drop points on a world map and measure the route between them using great-circle distance.",
    stack: ["JavaScript", "ArcGIS", "Geometry"],
    code: "https://github.com/AnuradhaHariharan/arcgis-measurement-app",
    live: "https://anuradhahariharan.github.io/arcgis-measurement-app/",
  },
];

export const recommendations = [
  {
    name: "Aikansh Garg",
    role: "Software Engineer, Paylocity",
    worked: "Worked with Anuradha at Fyle",
    photo: asset("/img/aikansh"),
    quote:
      "She has an amazing ability to take on any challenge and learn quickly. Whether it was picking up new frameworks or diving into the latest technologies, she was always up for it. There were plenty of times when Anuradha was able to debug tricky issues on her own without needing much support, which was really impressive. She also played a key role in improving our frontend performance and ensuring the codebase stayed clean and efficient.",
  },
  {
    name: "Priya Chaudhary",
    role: "Graduate Engineer, ANZ",
    worked: "Worked with Anuradha at Fyle",
    photo: asset("/img/priya"),
    quote:
      "I've had the pleasure of working with Anuradha at Fyle, and her strong grasp of frontend technologies is truly commendable. She has an excellent ability to translate complex requirements into seamless user experiences. Beyond her technical expertise, Anuradha is a fantastic team player, always collaborative and supportive.",
  },
  {
    name: "Akash Milton Marimuthu",
    role: "Associate Product Manager, Sprinto",
    photo: asset("/img/akash"),
    quote:
      "Anuradha is a quick learner with a strong grasp of frontend fundamentals and a keen eye for detail. In the time I've known her, she's shown great initiative in exploring modern frontend frameworks and consistently brings clarity and structure to her code. She asks the right questions, collaborates well with others, and has a calm, thoughtful approach to solving UI challenges.",
  },
];

export const navLinks = [
  { id: "systems", label: "Systems" },
  { id: "experience", label: "Experience" },
  { id: "play", label: "Play" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];
