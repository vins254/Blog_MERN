// Fallback to localhost if the environment variable is missing
// Fallback to the current hostname if the environment variable is missing
const fallbackUrl = `http://${window.location.hostname}:4000`;
export const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/+$/, "") : fallbackUrl;

console.log("Configured API_URL:", API_URL);
