export {}; // Makes this file a module (important for TypeScript)

declare global {
  interface Window {
    accessToken: string | null;
  }
}