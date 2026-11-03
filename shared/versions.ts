import type { Lang } from './content/types';

/**
 * Both sites are deployed together: the classic ("pro") site at the root, the 3D site under /3d/.
 * The visitor's last choice is remembered and used only when they land on the bare root URL,
 * so shared links (/fr/, /3d/en/…) always open the version they point to.
 */
export type Version = 'classic' | '3d';

export const VERSION_BASE: Record<Version, string> = { classic: '/', '3d': '/3d/' };

export function versionHref(version: Version, lang: Lang): string {
  return `${VERSION_BASE[version]}${lang}/`;
}

export const VERSION_KEY = 'version';
