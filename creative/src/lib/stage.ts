/** Pipeline stages, in the order the camera passes them. Shared by the 3D scene and the stage rail. */
export const STAGE_COUNT = 8;

/** Fraction of the scroll range the camera travels along the pipeline curve. */
export const CAMERA_RANGE = 0.9;

export function scrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
}

/** Index of the stage currently in front of the camera for a given scroll progress. */
export function stageIndex(progress: number): number {
  const u = progress * CAMERA_RANGE + 0.1;
  return Math.min(STAGE_COUNT - 1, Math.max(0, Math.round(u * (STAGE_COUNT - 1))));
}

/** Scene colours read from the active palette's CSS variables (shared/styles/palettes.css). */
export function sceneColors() {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  const dark = document.documentElement.classList.contains('dark');
  return {
    fg: v('--fg', '#e8ecf4'),
    // Inactive structure: a dimmed foreground so it reads in both schemes.
    muted: v('--muted', '#9aa8bf'),
    accent: v('--accent', '#4d86ff'),
    bg: v('--bg', dark ? '#0b1120' : '#f6f8fc'),
  };
}
