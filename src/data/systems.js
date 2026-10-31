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
    detail: "Server-rendered product and market pages, so they load fast and search engines can index them.",
  },
  {
    id: "trading",
    tier: "surfaces",
    name: "Web trading terminal",
    tech: "React, TradingView, WebSockets",
    detail: "Real-time TradingView charts fed by the market data layer. Home of the charting engine upgrade.",
  },
  {
    id: "kyc",
    tier: "surfaces",
    name: "Account opening",
    tech: "React 19",
    detail: "The KYC 2.0 onboarding flow, built as a static app with instant-rollback releases.",
  },
  {
    id: "library",
    tier: "shared",
    name: "Shared components",
    tech: "Reusable React components",
    detail: "Components shared by the website and the web trading app instead of being rebuilt for each.",
  },
  {
    id: "finai",
    tier: "shared",
    name: "FinAI micro-frontend",
    tech: "Separate frontend service",
    detail: "Built as a separate frontend microservice and integrated into both the website and the trading web app.",
  },
  {
    id: "data",
    tier: "shared",
    name: "Market data layer",
    tech: "REST and WebSockets",
    detail: "Serves server-native intraday bars to the charts. The case study below replays that switch.",
  },
  {
    id: "eks",
    tier: "platform",
    name: "Container pipeline",
    tech: "CodeBuild, ECR, EKS, ALB, nginx",
    detail:
      "Containerised Next.js apps are built in CodeBuild, stored in ECR and deployed to EKS behind an Application Load Balancer and nginx, with environment-specific staging and prod builds.",
  },
  {
    id: "static",
    tier: "platform",
    name: "Static hosting",
    tech: "S3, CloudFront, Route 53",
    detail: "Static apps are served from S3 through CloudFront, with Route 53 DNS.",
  },
  {
    id: "observe",
    tier: "platform",
    name: "Monitoring",
    tech: "Grafana",
    detail: "Production dashboards watched through market hours.",
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
    body: "Big upgrades go out as staged pre-prod releases, and static apps ship with instant rollback.",
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
