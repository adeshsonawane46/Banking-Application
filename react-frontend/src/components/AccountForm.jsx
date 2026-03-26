import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bankingApi } from '../api/bankingApi';

function AccountForm() {
  const [formData, setFormData] = useState({ name: '', email: '', balance: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.balance || parseFloat(formData.balance) < 0) {
      setMessage('Please enter valid details (balance ≥ 0)');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      await bankingApi.createAccount({
        name: formData.name,
        email: formData.email,
        balance: parseFloat(formData.balance)
      });

      setMessage('✅ Account created successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-indigo-100 p-4">
      
      {/* 💳 Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">

        {/* 🔷 Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🏦 Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-600">Holder Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Balance */}
          <div>
            <label className="text-sm font-medium text-gray-600">Opening Balance (₹)</label>
            <input
              name="balance"
              type="number"
              step="0.01"
              min="0"
              value={formData.balance}
              onChange={handleChange}
              placeholder="1000.00"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* 🚀 Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          {/* 📢 Message */}
          {message && (
            <div
              className={`text-center text-sm font-medium p-3 rounded-lg ${
                message.includes('success')
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

export default AccountForm;