import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AccountForm from './components/AccountForm';
import TxForm from './components/TxForm';
import TransferForm from './components/TransferForm';
import AccountDetail from './components/AccountDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-green-50">

        {/* 🔷 NAVBAR */}
        <nav className="bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">

              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow">
                  🏦
                </div>
                <Link to="/" className="text-xl font-bold text-gray-800">
                  BankPro
                </Link>
              </div>

              {/* Links */}
              <div className="hidden md:flex items-center space-x-6">
                <NavLink 
                  to="/" 
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'
                    }`
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink 
                  to="/create" 
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'
                    }`
                  }
                >
                  Create
                </NavLink>

                <NavLink 
                  to="/deposit" 
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600'
                    }`
                  }
                >
                  Deposit
                </NavLink>

                <NavLink 
                  to="/withdraw" 
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive ? 'text-red-500 font-semibold' : 'text-gray-600 hover:text-red-500'
                    }`
                  }
                >
                  Withdraw
                </NavLink>

                <NavLink 
                  to="/transfer" 
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive ? 'text-purple-600 font-semibold' : 'text-gray-600 hover:text-purple-600'
                    }`
                  }
                >
                  Transfer
                </NavLink>
              </div>

            </div>
          </div>
        </nav>

        {/* 🔷 MAIN CONTENT */}
        <main className="max-w-7xl mx-auto py-8 px-4 lg:px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<AccountForm />} />
            <Route path="/deposit" element={<TxForm />} />
            <Route path="/withdraw" element={<TxForm />} />
            <Route path="/transfer" element={<TransferForm />} />
            <Route path="/account/:accNo" element={<AccountDetail />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;