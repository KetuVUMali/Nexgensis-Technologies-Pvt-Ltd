import { Link } from 'react-router-dom';

// Used for the 404 page and for a product id that does not exist.
export default function NotFoundBlock({ code = '404', title, message }) {
  return (
    <div className="text-center py-5 px-3">
      <div className="not-found-code brand-font">{code}</div>
      <h1 className="h3 mb-2">{title}</h1>
      <p className="text-secondary mb-4">{message}</p>
      <Link to="/products" className="btn btn-primary">
        <i className="bi bi-arrow-left me-2" aria-hidden="true"></i>Back to products
      </Link>
    </div>
  );
}
