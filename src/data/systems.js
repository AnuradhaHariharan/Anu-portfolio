// A simplified, high-level view of the frontend platform I work on at
// Rupeezy, drawn only from what's on my resume.

export const tiers = [
  { id: "surfaces", label: "Product surfaces" },
  { id: "shared", label: "Shared frontend layer" },
  { id: "platform", label: "Delivery and operations" },
];

export const nodes = [
  {
    id: "website",
    tier: "surfaces",
    name: "Marketing website",
    tech: "Next.js, SSR and ISR",
    detail:
      "Mutual fund, IPO, F&O and Stock SIP pages, brokerage calculators, market heatmaps and NSE pre-open data. Server-rendered so pages are fast and indexable.",
  },
  {
    id: "trading",
    tier: "surfaces",
    name: "Web trading terminal",
    tech: "React, TradingView, WebSockets",
    detail:
      "Used by 6,000–10,000 traders a day. Charting engine upgraded from v26 to v32 across 7 staged releases with zero disruption.",
  },
  {
    id: "kyc",
    tier: "surfaces",
    name: "Account opening",
    tech: "React 19",
    detail:
      "A 13-step onboarding flow migrated from Angular 11, with PAN and KRA auto-fill, selfie, e-sign and resume-from-last-step.",
  },
  {
    id: "library",
    tier: "shared",
    name: "Shared components",
    tech: "Reusable React components",
    detail: "Reusable components shared by the website and the web trading app instead of being rebuilt for each.",
  },
  {
    id: "finai",
    tier: "shared",
    name: "FinAI micro-frontend",
    tech: "Separate frontend service",
    detail:
      "The interface for Rupeezy's in-house AI model, built as its own frontend microservice and embedded in the website and the trading app.",
  },
  {
    id: "data",
    tier: "shared",
    name: "Market data layer",
    tech: "REST and WebSockets",
    detail:
      "Moving to server-native intraday bars cut chart load from about 1.6s to 0.15s and replaced about 40 sequential requests with one.",
  },
  {
    id: "eks",
    tier: "platform",
    name: "Container pipeline",
    tech: "CodeBuild, ECR, EKS, ALB, nginx",
    detail:
      "Next.js apps are built in CodeBuild, stored in ECR and deployed to EKS behind an Application Load Balancer and nginx, with separate staging and production builds.",
  },
  {
    id: "static",
    tier: "platform",
    name: "Static hosting",
    tech: "S3, CloudFront, Route 53",
    detail: "Static apps, including account opening, are served from S3 through CloudFront, with instant-rollback releases.",
  },
  {
    id: "observe",
    tier: "platform",
    name: "Monitoring",
    tech: "Grafana",
    detail:
      "Pre-market checks and Grafana dashboards during market hours, root-causing production issues and shipping hotfixes.",
  },
];

export const edges = [
  ["website", "library"],
  ["trading", "library"],
  ["website", "finai"],
  ["trading", "finai"],
  ["trading", "data"],
  ["website", "eks"],
  ["trading", "eks"],
  ["kyc", "static"],
  ["trading", "observe"],
];

export const principles = [
  {
    title: "Ship in small, reversible steps",
    body: "Seven staged pre-production releases for a six-version charting upgrade. Instant-rollback releases for onboarding.",
  },
  {
    title: "Measure before optimising",
    body: "Core Web Vitals, PageSpeed and Grafana before and after. Every performance claim on this page has a before and after number.",
  },
  {
    title: "Share components, not copies",
    body: "One component library behind several products, at Rupeezy and at Atomicwork, so quality compounds instead of drifting.",
  },
  {
    title: "Accessible by default",
    body: "Semantic HTML, keyboard paths and contrast are part of the definition of done, not a later audit.",
  },
];
