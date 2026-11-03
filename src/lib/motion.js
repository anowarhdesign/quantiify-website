// Media-query helpers. Call them from effects/handlers only (never during render: they need a browser).
export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => matchMedia('(hover:hover) and (pointer:fine)').matches;
