import { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { bankingApi } from '../api/bankingApi';

function TxForm() {
  const [searchParams] = useSearchParams();
  const accNo = searchParams.get('accNo') || '';

  const [formData, setFormData] = useState({ accNo, amount: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const isDeposit = location.pathname.includes('deposit');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.accNo || !formData.amount || parseFloat(formData.amount) <= 0) {
      setMessage('Enter valid account & amount (> 0)');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const data = {
        accNo: formData.accNo,
        amount: parseFloat(formData.amount)
      };

      const action = isDeposit ? bankingApi.deposit : bankingApi.withdraw;

      await action(data);

      setMessage(`✅ ${isDeposit ? 'Deposit' : 'Withdraw'} successful!`);
      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      setMessage(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-green-100 p-4">

      {/* 💳 Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">

        {/* 🔷 Title */}
        <h1 className={`text-3xl font-bold text-center mb-6 ${
          isDeposit ? 'text-green-600' : 'text-red-500'
        }`}>
          {isDeposit ? '💰 Deposit Funds' : '💸 Withdraw Funds'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Account Number */}
          <div>
            <label className="text-sm font-medium text-gray-600">Account Number</label>
            <input
              name="accNo"
              type="text"
              value={formData.accNo}
              onChange={handleChange}
              placeholder="Enter account number"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-gray-600">Amount (₹)</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="100.00"
              className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none ${
                isDeposit
                  ? 'focus:ring-2 focus:ring-green-500'
                  : 'focus:ring-2 focus:ring-red-500'
              }`}
              required
            />
          </div>

          {/* 🚀 Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              isDeposit
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {loading ? 'Processing...' : `${isDeposit ? 'Deposit' : 'Withdraw'} Now`}
          </button>

          {/* 📢 Message */}
          {message && (
            <div
              className={`text-center text-sm font-medium p-3 rounded-lg ${
                message.includes('successful')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {message}
            </div>
          )}

        </form>
      </div>
    </div>
  );
}

export default TxForm;