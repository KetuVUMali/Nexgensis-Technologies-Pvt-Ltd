import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

// Only logged-in users may pass. Everyone else is sent to /login.
// We remember where they wanted to go (state.from) so login can send them back.
export function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

// The login page is for logged-out users. A logged-in user goes to the dashboard instead.
export function PublicRoute({ children }) {
  if (isLoggedIn()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
