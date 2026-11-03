import { getContent, headlineStack, profile, type Lang } from './content/index';

/** JSON-LD Person + WebSite graph for the home page. */
export function personJsonLd(lang: Lang, siteUrl: string) {
  const c = getContent(lang);
  const home = new URL(`/${lang}/`, siteUrl).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl.replace(/\/$/, '')}/#person`,
        name: profile.name,
        jobTitle: c.hero.role,
        description: c.meta.description,
        url: home,
        email: `mailto:${profile.email}`,
        image: profile.photo ? new URL(profile.photo, siteUrl).href : undefined,
        sameAs: [profile.linkedin, profile.github].filter(Boolean),
        address: { '@type': 'PostalAddress', addressLocality: profile.city, addressCountry: profile.country },
        worksFor: { '@type': 'Organization', name: 'Be ys Outsourcing Services Madagascar' },
        alumniOf: [
          { '@type': 'CollegeOrUniversity', name: "Université Côte d'Azur" },
          { '@type': 'CollegeOrUniversity', name: 'IT University Madagascar' },
        ],
        knowsLanguage: ['fr', 'en', 'mg'],
        knowsAbout: headlineStack,
      },
      {
        '@type': 'WebSite',
        name: profile.name,
        url: home,
        inLanguage: lang,
      },
    ],
  };
}

/** JSON-LD for a case-study page. */
export function caseStudyJsonLd(lang: Lang, slug: string, siteUrl: string) {
  const c = getContent(lang);
  const cs = c.caseStudies.find((x) => x.slug === slug)!;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: cs.title,
    abstract: cs.summary,
    inLanguage: lang,
    url: new URL(`/${lang}/projects/${slug}/`, siteUrl).href,
    keywords: cs.stack.join(', '),
    author: { '@id': `${siteUrl.replace(/\/$/, '')}/#person` },
  };
}
