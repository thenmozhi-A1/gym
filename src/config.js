export const getApiBase = () => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';
  }
  
  // In production, ALWAYS use relative path so Vercel rewrites it to Render,
  // making cookies first-party and avoiding third-party cookie blocking.
  return '/api';
};

export const getAbsoluteApiBase = () => {
  if (import.meta.env.VITE_API_BASE && import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE;
  }
  return 'https://gymj-10.onrender.com/api';
};
