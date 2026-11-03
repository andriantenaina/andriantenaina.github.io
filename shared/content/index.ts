import { en } from './en';
import { fr } from './fr';
import type { Content, Lang } from './types';

export * from './types';

export const profile = {
  name: 'Fanilo Andriantenaina',
  initials: 'FA',
  email: 'andriantenainafanilo@gmail.com',
  linkedin: 'https://www.linkedin.com/in/fanilo-andriantenaina',
  github: '',
  city: 'Antananarivo',
  country: 'MG',
  /** Set to the photo path in /public (e.g. '/photo.jpg') once a photo is added; empty shows the monogram. */
  photo: '',
  cv: { fr: '/cv-fanilo-andriantenaina-fr.pdf', en: '/cv-fanilo-andriantenaina-en.pdf' },
};

const contents: Record<Lang, Content> = { fr, en };

export function getContent(lang: Lang): Content {
  return contents[lang];
}

export function otherLang(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr';
}

/** Headline stack shown in marquees / clouds. */
export const headlineStack = [
  'Python',
  'SQL',
  'Apache Spark',
  'Apache Airflow',
  'Kafka',
  'Debezium',
  'StarRocks',
  'PostgreSQL',
  'MySQL',
  'Power BI',
  'Superset',
  'Elasticsearch',
  'Logstash',
  'Kibana',
  'Grafana',
  'Docker',
  'Kubernetes',
  'GitLab CI/CD',
  'Terraform',
  'dbt',
  'C# / .NET',
];
