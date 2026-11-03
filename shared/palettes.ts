/** Palettes the visitor can switch between (see shared/styles/palettes.css). */
export const PALETTES = [
  { id: 'cobalt', label: 'Cobalt', swatch: ['#0b1120', '#4d86ff'] },
  { id: 'emerald', label: 'Émeraude', swatch: ['#0a0a0b', '#10b981'] },
  { id: 'violet', label: 'Violet', swatch: ['#0f0f14', '#8c70ff'] },
  { id: 'klein', label: 'Klein', swatch: ['#ffffff', '#1f3bff'] },
] as const;

export type PaletteId = (typeof PALETTES)[number]['id'];

/**
 * Inline <head> script: applies saved palette + theme before first paint (no flash).
 * Theme falls back to the device setting, palette to cobalt.
 */
export const themeBootScript = `(function(){var d=document.documentElement,t=null,p=null;try{t=localStorage.getItem('theme');p=localStorage.getItem('palette')}catch(e){}if(t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches)d.classList.add('dark');d.dataset.palette=p&&/^(cobalt|emerald|violet|klein)$/.test(p)?p:'cobalt'})();`;

/** Wires theme toggles ([data-theme-toggle]) and palette buttons ([data-palette-option]). */
export function initThemeControls() {
  const root = document.documentElement;
  const save = (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  };
  const notify = () => window.dispatchEvent(new CustomEvent('themechange'));

  const themeButtons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  const syncTheme = () => themeButtons.forEach((b) => b.setAttribute('aria-pressed', String(root.classList.contains('dark'))));
  syncTheme();
  themeButtons.forEach((b) =>
    b.addEventListener('click', () => {
      save('theme', root.classList.toggle('dark') ? 'dark' : 'light');
      syncTheme();
      notify();
    }),
  );

  const options = document.querySelectorAll<HTMLButtonElement>('[data-palette-option]');
  const syncPalette = () => options.forEach((o) => o.setAttribute('aria-pressed', String(o.dataset.paletteOption === root.dataset.palette)));
  syncPalette();
  options.forEach((o) =>
    o.addEventListener('click', () => {
      root.dataset.palette = o.dataset.paletteOption;
      save('palette', o.dataset.paletteOption!);
      syncPalette();
      notify();
    }),
  );

  // Remember which version (classic / 3D) the visitor picked; used by the root redirect.
  document.querySelectorAll<HTMLAnchorElement>('[data-version-switch]').forEach((a) =>
    a.addEventListener('click', () => save('version', a.dataset.versionSwitch!)),
  );

  // Palette popover (disclosure)
  for (const toggle of document.querySelectorAll<HTMLButtonElement>('[data-palette-toggle]')) {
    const panel = document.getElementById(toggle.getAttribute('aria-controls')!);
    if (!panel) continue;
    const set = (open: boolean) => {
      toggle.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    };
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      set(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target as Node)) set(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        set(false);
        toggle.focus();
      }
    });
  }
}
