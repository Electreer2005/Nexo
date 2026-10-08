export function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
export function profileKey(email) { return `nexo:profile:${encodeURIComponent(email.toLowerCase())}`; }
