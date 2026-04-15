import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const AuthGuard = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
};

export default AuthGuard;

