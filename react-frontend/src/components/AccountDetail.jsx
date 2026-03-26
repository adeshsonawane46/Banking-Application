import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bankingApi } from '../api/bankingApi';

function AccountDetail() {
  const { accNo } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccount();
  }, [accNo]);

  const fetchAccount = async () => {
    try {
      setLoading(true);
      const data = await bankingApi.getAccount(accNo);
      setAccount(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load account');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (parseFloat(depositAmount) <= 0) return;

    try {
      setMessage('');
      await bankingApi.deposit({ accNo, amount: parseFloat(depositAmount) });
      setMessage('✅ Deposit successful!');
      setDepositAmount('');
      fetchAccount();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (parseFloat(withdrawAmount) <= 0) return;

    try {
      setMessage('');
      await bankingApi.withdraw({ accNo, amount: parseFloat(withdrawAmount) });
      setMessage('✅ Withdraw successful!');
      setWithdrawAmount('');
      fetchAccount();
    } catch (err) {
      setMessage(err.message);
    }
  };

  // 🔄 Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Link to="/" className="bg-gray-700 text-white px-4 py-2 rounded">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-green-100 p-6">

      {/* 💳 Account Card */}
      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {account.holderName}
        </h1>

        <p className="text-4xl font-bold text-green-600 mb-3">
          ₹{account.openingBalance}
        </p>

        <p className="text-sm text-gray-500">
          {account.accountNumber} • {account.email}
        </p>
      </div>

      {/* 💸 Actions */}
      <div className="max-w-xl mx-auto grid md:grid-cols-2 gap-6 mb-6">

        {/* Deposit */}
        <form onSubmit={handleDeposit} className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-4">Deposit</h3>

          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Deposit
          </button>
        </form>

        {/* Withdraw */}
        <form onSubmit={handleWithdraw} className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-red-500 mb-4">Withdraw</h3>

          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-red-500 outline-none"
          />

          <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
            Withdraw
          </button>
        </form>

      </div>

      {/* 📢 Message */}
      {message && (
        <div className={`max-w-xl mx-auto text-center p-3 rounded-lg mb-6 ${
          message.includes('successful')
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-600'
        }`}>
          {message}
        </div>
      )}

      {/* 🔗 Actions */}
      <div className="flex justify-center gap-4">
        <Link to="/" className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
          Dashboard
        </Link>

        <Link
          to={`/transfer?fromAcc=${accNo}`}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Transfer
        </Link>
      </div>

    </div>
  );
}

export default AccountDetail;