/**
 * Centralized API configuration.
 * All API calls should use API_URL from this file.
 */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("API URL:", API_URL);
