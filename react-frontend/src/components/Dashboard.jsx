import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bankingApi } from '../api/bankingApi';

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  // 🔐 Check auth + fetch data
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      navigate("/", { replace: true });
      return;
    }

    setToken(storedToken);
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await bankingApi.getAllAccounts();
      setAccounts(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  // 🔓 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🔄 Loading UI
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  // ❌ Error UI
  if (error)
    return (
      <div className="text-center text-red-500 py-12 text-lg font-medium">
        {error}
      </div>
    );

  return (
    <div className="p-6">

      {/* 🔷 Header */}
      <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
        <h1 className="text-3xl font-bold">🏦 Dashboard</h1>

        <div className="flex gap-3">
          <Link
            to="/create"
            className="bg-white text-indigo-600 font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            + Create Account
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-5 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🧾 Account List */}
      {accounts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl shadow">
          <p className="text-gray-500 text-lg">
            No accounts found 🚫
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Create your first account to get started
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div
              key={account.accountNumber}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {account.holderName}
              </h3>

              <p className="text-3xl font-bold text-green-600 mb-2">
                ₹{account.openingBalance}
              </p>

              <p className="text-sm text-gray-500 mb-4">
                {account.accountNumber} • {account.email}
              </p>

              <div className="flex gap-2 flex-wrap">
                <Link
                  to={`/account/${account.accountNumber}`}
                  className="bg-gray-800 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-900"
                >
                  View
                </Link>

                <Link
                  to="/deposit"
                  className="bg-indigo-600 text-white px-3 py-1 rounded-md text-xs hover:bg-indigo-700"
                >
                  Deposit
                </Link>

                <Link
                  to="/withdraw"
                  className="bg-orange-500 text-white px-3 py-1 rounded-md text-xs hover:bg-orange-600"
                >
                  Withdraw
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;