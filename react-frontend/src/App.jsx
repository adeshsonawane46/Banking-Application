import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AccountForm from './components/AccountForm';
import TxForm from './components/TxForm';
import TransferForm from './components/TransferForm';
import AccountDetail from './components/AccountDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

// 🔐 Protected Route
function ProtectedRoute({ children, token }) {
  return token ? children : <Navigate to="/" replace />;
}

// 🔷 Navbar
function Navbar({ token, setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between">
      <h1 className="font-bold text-xl">🏦 BankPro</h1>

      <div className="flex gap-4">
        {!token ? (
          <>
            <Link to="/">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/create">Create</NavLink>
            <NavLink to="/deposit">Deposit</NavLink>
            <NavLink to="/withdraw">Withdraw</NavLink>
            <NavLink to="/transfer">Transfer</NavLink>

            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

// 🔷 App
function App() {

  const [token, setToken] = useState(null);

  // 🔥 Sync token with localStorage (CRITICAL FIX)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <Router>
      <Navbar token={token} setToken={setToken} />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED */}
        <Route path="/dashboard" element={
          <ProtectedRoute token={token}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/create" element={
          <ProtectedRoute token={token}>
            <AccountForm />
          </ProtectedRoute>
        } />

        <Route path="/deposit" element={
          <ProtectedRoute token={token}>
            <TxForm />
          </ProtectedRoute>
        } />

        <Route path="/withdraw" element={
          <ProtectedRoute token={token}>
            <TxForm />
          </ProtectedRoute>
        } />

        <Route path="/transfer" element={
          <ProtectedRoute token={token}>
            <TransferForm />
          </ProtectedRoute>
        } />

        <Route path="/account/:accNo" element={
          <ProtectedRoute token={token}>
            <AccountDetail />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;