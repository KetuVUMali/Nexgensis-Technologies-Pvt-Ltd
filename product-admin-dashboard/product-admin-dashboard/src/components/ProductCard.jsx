import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import Rating from './Rating';
import StockBadge from './StockBadge';
import { formatCategory, formatPrice } from '../utils/format';

// Mobile / tablet view of ONE product.
export default function ProductCard({ product, onDelete }) {
  return (
    <div className="card product-card h-100">
      <div className="card-body">
        <div className="d-flex gap-3">
          <ProductImage src={product.thumbnail} alt={product.title} className="product-thumb product-thumb-lg" />
          <div className="min-w-0">
            <Link to={`/products/${product.id}`} className="product-title fw-semibold">
              {product.title}
            </Link>
            <div className="mt-1">
              <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis fw-medium">
                {formatCategory(product.category)}
              </span>
              {product.isLocal && <span className="badge text-bg-info ms-1">Added locally</span>}
            </div>
            <div className="fs-5 fw-bold mt-1 brand-font">{formatPrice(product.price)}</div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Rating value={product.rating} />
          <StockBadge stock={product.stock} />
        </div>
      </div>
      <div className="card-footer d-flex gap-2">
        <Link to={`/products/${product.id}`} className="btn btn-sm btn-outline-secondary flex-fill">
          <i className="bi bi-eye me-1" aria-hidden="true"></i>View
        </Link>
        <Link to={`/products/${product.id}/edit`} className="btn btn-sm btn-outline-secondary flex-fill">
          <i className="bi bi-pencil-square me-1" aria-hidden="true"></i>Edit
        </Link>
        <button type="button" className="btn btn-sm btn-outline-danger flex-fill" onClick={() => onDelete(product)}>
          <i className="bi bi-trash3 me-1" aria-hidden="true"></i>Delete
        </button>
      </div>
    </div>
  );
}
