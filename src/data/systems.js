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
      "Public product and market pages, server-rendered so they load fast and search engines can index them.",
  },
  {
    id: "trading",
    tier: "surfaces",
    name: "Web trading terminal",
    tech: "React, TradingView, WebSockets",
    detail:
      "The busiest surface: live prices drawn on TradingView charts, open all through market hours.",
  },
  {
    id: "kyc",
    tier: "surfaces",
    name: "Account opening",
    tech: "React 19",
    detail:
      "The onboarding flow new customers go through. Built as a static React app, separate from the Next.js stack.",
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
      "Its own frontend service, embedded in both the website and the trading app instead of being built twice.",
  },
  {
    id: "data",
    tier: "shared",
    name: "Market data layer",
    tech: "REST and WebSockets",
    detail:
      "Historical bars over REST and live prices over WebSockets, feeding every chart. Its biggest fix is the case study further down.",
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
      "Grafana dashboards watched through market hours, with pre-market checks before the open.",
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
    body: "Large upgrades go out in stages through pre-production, and releases can be rolled back instantly.",
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
