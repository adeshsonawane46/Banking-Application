const API_BASE = 'http://localhost:8080';

// 🔧 Common API handler
const apiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options, // 🔥 options first
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: 'Bearer ' + token }), // 🔐 token
        ...(options.headers || {}) // 🔥 merge safely
      },
    });

    // ❌ Handle error
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    // ✅ Handle JSON response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    // fallback
    return await response.text();

  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// ================= API METHODS =================

export const bankingApi = {

  // 🏦 ACCOUNTS

  createAccount: (data) =>
    apiCall('/accounts/create', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getAllAccounts: () =>
    apiCall('/accounts/all'),

  getAccount: (accNo) =>
    apiCall(`/accounts/${accNo}`),

  // 💸 TRANSACTIONS

  deposit: (data) =>
    apiCall('/transactions/deposit', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  withdraw: (data) =>
    apiCall('/transactions/withdraw', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  transfer: (data) =>
    apiCall('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

};