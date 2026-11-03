export type Lang = 'fr' | 'en';
export const LANGS: Lang[] = ['fr', 'en'];

export interface Stat {
  value: string;
  /** Numeric part animated by a counter; omitted for non-numeric values. */
  count?: number;
  label: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  /** What this component does in the platform (shown on hover/focus). */
  desc?: string;
  col: number;
  row: number;
}

export interface Diagram {
  nodes: DiagramNode[];
  edges: [string, string][];
  /** Nodes on the main (real-time / alerting) path; edges between two of them are drawn in the accent colour. */
  hot?: string[];
  cols: number;
  rows: number;
}

export interface CaseStudy {
  slug: string;
  title: string;
  /** Search result title (≤ 36 chars, " · Fanilo Andriantenaina" is appended) and description (≤ 155 chars). */
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  summary: string;
  highlights: string[];
  problem: string;
  role: string;
  approach: string[];
  results: string[];
  stack: string[];
  diagram: Diagram;
  diagramAlt: string;
}

export interface Job {
  title: string;
  org: string;
  place: string;
  period: string;
  type: string;
  points: string[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  note?: string;
}

export interface SkillGroup {
  name: string;
  items: { name: string; years?: number }[];
}

export interface GithubProject {
  name: string;
  description: string;
  url: string;
  stack: string[];
}

export interface Content {
  lang: Lang;
  meta: { title: string; description: string; ogAlt: string };
  nav: { work: string; about: string; skills: string; journey: string; contact: string };
  hero: {
    role: string;
    headline: string;
    /** Headline split for the animated version: prefix + rotating endings. */
    headlinePrefix: string;
    rotating: string[];
    /** Indexes into `stats` shown under the hero. */
    heroStats: number[];
    diagramHint: string;
    intro: string;
    availableLabel: string;
    available: string;
    basedIn: string;
    location: string;
    localTime: string;
    languages: string;
    ctaEmail: string;
  };
  briefTitle: string;
  stats: Stat[];
  work: { title: string; intro: string; readMore: string; back: string };
  labels: {
    problem: string;
    role: string;
    approach: string;
    architecture: string;
    results: string;
    stack: string;
    nextCase: string;
  };
  caseStudies: CaseStudy[];
  about: {
    title: string;
    story: string[];
    strengths: { title: string; text: string }[];
    lookingTitle: string;
    looking: string[];
    timezoneTitle: string;
    timezone: string;
    languagesTitle: string;
    languages: { name: string; level: string }[];
  };
  skills: { title: string; intro: string; yearsLabel: (n: number) => string; groups: SkillGroup[] };
  journey: { title: string; experienceTitle: string; educationTitle: string; jobs: Job[]; education: Education[] };
  otherProjects: { title: string; items: { title: string; org: string; text: string; stack: string[] }[] };
  labs: { title: string; intro: string; items: GithubProject[] };
  contact: {
    title: string;
    intro: string;
    name: string;
    email: string;
    company: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    or: string;
    formTitle: string;
    copy: string;
    copied: string;
    cvTitle: string;
    view: string;
    download: string;
    cvFr: string;
    cvEn: string;
  };
  ui: {
    otherLangLabel: string;
    theme: string;
    palette: string;
    menu: string;
    close: string;
    skip: string;
    otherVersion: string;
    classicVersion: string;
    versionHint: string;
    footer: string;
    colophon: string;
    updated: string;
    /** Labels of the pipeline stages shown next to the 3D scene. */
    stages: string[];
    stagesLabel: string;
  };
}
