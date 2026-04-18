const API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  console.error(
    "REACT_APP_API_URL is not defined! API requests will likely fail with a SyntaxError (Unexpected token '<'). " +
    "Please check your .env file or Render environment variables."
  );
}

// Ensure the URL is absolute and doesn't have a trailing slash
export const API_URL = API_BASE_URL ? API_BASE_URL.replace(/\/+$/, "") : "";

console.log("Configured API_URL:", API_URL || "UNDEFINED (using relative paths)");
