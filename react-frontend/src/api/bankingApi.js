const API_BASE = 'http://localhost:8080';

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }
    
    if (response.headers.get('content-type')?.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export const bankingApi = {
  // Accounts
  createAccount: (data) => apiCall('/accounts/create', { method: 'POST', body: JSON.stringify(data) }),
  getAllAccounts: () => apiCall('/accounts/all'),
  getAccount: (accNo) => apiCall(`/accounts/${accNo}`),
  
  // Transactions
  deposit: (data) => apiCall('/transactions/deposit', { method: 'POST', body: JSON.stringify(data) }),
  withdraw: (data) => apiCall('/transactions/withdraw', { method: 'POST', body: JSON.stringify(data) }),
  transfer: (data) => apiCall('/transactions/transfer', { method: 'POST', body: JSON.stringify(data) }),
};

