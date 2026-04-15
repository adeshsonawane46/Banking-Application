// 🔐 Auth Utilities

const TOKEN_KEY = "token";

// Save token
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check auth
export const isAuthenticated = () => {
  const token = getToken();
  return token !== null && token !== undefined && token !== "";
};