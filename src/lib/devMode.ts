/**
 * True only when VITE_DEV_MODE=true is set in .env.local.
 * That file is gitignored (matched by *.local), so this is never
 * accidentally enabled in production or CI.
 */
export const DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";
