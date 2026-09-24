import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import AddProduct from './pages/AddProduct';
import Dashboard from './pages/Dashboard';
import EditProduct from './pages/EditProduct';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';

export default function App() {
  return (
    <Routes>
      {/* Public: only for logged-out users */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* Protected: every page inside needs a token and gets the sidebar + top bar */}
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        {/* "add" is written before ":id" for clarity (React Router would pick it first anyway) */}
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/:id/edit" element={<EditProduct />} />
      </Route>

      {/* Anything else */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
