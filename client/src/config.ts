// Fallback to localhost if the environment variable is missing
export const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/+$/, "") : "http://localhost:4000";

console.log("Configured API_URL:", API_URL);
