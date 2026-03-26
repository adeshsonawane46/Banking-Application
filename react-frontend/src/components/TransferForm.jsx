import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bankingApi } from '../api/bankingApi';

function TransferForm() {
  const [formData, setFormData] = useState({ fromAcc: '', toAcc: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fromAcc || !formData.toAcc || !formData.amount || parseFloat(formData.amount) <= 0) {
      setMessage('Please enter valid details (amount > 0)');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      await bankingApi.transfer({
        fromAcc: formData.fromAcc,
        toAcc: formData.toAcc,
        amount: parseFloat(formData.amount)
      });

      setMessage('✅ Transfer successful!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage(err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
      
      {/* 💳 Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        
        {/* 🔷 Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          💸 Fund Transfer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* From Account */}
          <div>
            <label className="text-sm font-medium text-gray-600">From Account</label>
            <input
              name="fromAcc"
              type="text"
              value={formData.fromAcc}
              onChange={handleChange}
              placeholder="Enter sender account"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* To Account */}
          <div>
            <label className="text-sm font-medium text-gray-600">To Account</label>
            <input
              name="toAcc"
              type="text"
              value={formData.toAcc}
              onChange={handleChange}
              placeholder="Enter receiver account"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
              placeholder="500.00"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* 🚀 Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition flex justify-center items-center"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              'Transfer Funds'
            )}
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

export default TransferForm;