// Fallback to localhost if the environment variable is missing
export const API_URL = API_BASE_URL ? API_BASE_URL.replace(/\/+$/, "") : "http://localhost:4000";

console.log("Configured API_URL:", API_URL);
