import { getContent, headlineStack, profile, type Lang } from './content/index';

/**
 * When the content was last updated (shown to search engines as dateModified).
 * Google requires a full ISO 8601 date-time with time zone, not just a date.
 */
export const CONTENT_UPDATED = '2026-11-03T12:00:00+03:00';

const personId = (siteUrl: string) => `${siteUrl.replace(/\/$/, '')}/#person`;

/** Person entity, referenced from every page so search engines tie the whole site to one profile. */
function person(lang: Lang, siteUrl: string) {
  const c = getContent(lang);
  return {
    '@type': 'Person',
    '@id': personId(siteUrl),
    name: profile.name,
    givenName: 'Fanilo',
    familyName: 'Andriantenaina',
    jobTitle: c.hero.role,
    description: c.meta.description,
    url: new URL(`/${lang}/`, siteUrl).href,
    email: `mailto:${profile.email}`,
    image: profile.photo ? new URL(profile.photo, siteUrl).href : new URL(`/og-${lang}.png`, siteUrl).href,
    // Profiles that are the same person: helps Google merge them into one entity.
    sameAs: [profile.linkedin, profile.github].filter(Boolean),
    address: { '@type': 'PostalAddress', addressLocality: profile.city, addressCountry: profile.country },
    worksFor: { '@type': 'Organization', name: 'Be ys Outsourcing Services Madagascar' },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: "Université Côte d'Azur" },
      { '@type': 'CollegeOrUniversity', name: 'IT University Madagascar' },
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: c.hero.role,
      occupationLocation: { '@type': 'Country', name: 'Madagascar' },
      skills: headlineStack.join(', '),
    },
    knowsLanguage: ['fr', 'en', 'mg'],
    knowsAbout: headlineStack,
  };
}

/** JSON-LD for the home page: a ProfilePage (Google's type for personal profiles) about the Person. */
export function personJsonLd(lang: Lang, siteUrl: string) {
  const c = getContent(lang);
  const home = new URL(`/${lang}/`, siteUrl).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${home}#page`,
        url: home,
        name: c.meta.title,
        description: c.meta.description,
        inLanguage: lang,
        dateModified: CONTENT_UPDATED,
        mainEntity: { '@id': personId(siteUrl) },
      },
      person(lang, siteUrl),
      {
        '@type': 'WebSite',
        '@id': `${siteUrl.replace(/\/$/, '')}/#website`,
        name: profile.name,
        url: home,
        inLanguage: lang,
        publisher: { '@id': personId(siteUrl) },
      },
    ],
  };
}

/** JSON-LD for a case-study page: the project, its author, and a breadcrumb. */
export function caseStudyJsonLd(lang: Lang, slug: string, siteUrl: string) {
  const c = getContent(lang);
  const cs = c.caseStudies.find((x) => x.slug === slug)!;
  const url = new URL(`/${lang}/projects/${slug}/`, siteUrl).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        name: cs.title,
        abstract: cs.summary,
        inLanguage: lang,
        url,
        dateModified: CONTENT_UPDATED,
        keywords: cs.stack.join(', '),
        author: { '@id': personId(siteUrl) },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: profile.name, item: new URL(`/${lang}/`, siteUrl).href },
          { '@type': 'ListItem', position: 2, name: c.work.title, item: new URL(`/${lang}/#work`, siteUrl).href },
          { '@type': 'ListItem', position: 3, name: cs.title, item: url },
        ],
      },
      person(lang, siteUrl),
    ],
  };
}
