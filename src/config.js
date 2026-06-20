export const getApiBase = () => {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  
  if (import.meta.env.DEV) {
    return 'http://localhost:8080/api';
  }
  
  // In production, use relative path so Vercel rewrites it to Render,
  // making cookies first-party and avoiding third-party cookie blocking.
  // Exception: SSE connections in useAdminNotifications might need absolute URL
  // if Vercel serverless proxy times out long-lived connections. But Vercel
  // does support Server-Sent Events with correct headers, so we can try relative.
  // Actually, Vercel has a 10-second timeout for serverless functions on the hobby tier,
  // which breaks SSE. So for SSE, we might need the absolute URL.
  // We will return the absolute URL if requested, else relative.
  return '/api';
};

export const getAbsoluteApiBase = () => {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  return 'https://gymj-10.onrender.com/api';
};
