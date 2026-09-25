/**
 * Centralized API configuration.
 * All API calls should use API_URL from this file.
 */
const DEFAULT_API_URL = "http://localhost:4000";
export const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

console.log("API URL:", API_URL);
