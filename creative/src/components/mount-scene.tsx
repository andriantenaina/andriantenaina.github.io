import { createRoot } from 'react-dom/client';
import Scene from './Scene';

/** Mounts the WebGL scene; imported dynamically so phones never download React or three.js. */
export function mountScene(el: HTMLElement) {
  createRoot(el).render(<Scene />);
}
