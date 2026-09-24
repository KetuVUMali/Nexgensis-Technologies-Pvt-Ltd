import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import Rating from './Rating';
import StockBadge from './StockBadge';
import { formatCategory, formatPrice } from '../utils/format';

// Desktop view of the product list.
export default function ProductTable({ products, onDelete }) {
  return (
    <div className="table-responsive product-table">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Title</th>
            <th scope="col">Category</th>
            <th scope="col" className="text-end">Price</th>
            <th scope="col">Rating</th>
            <th scope="col">Stock</th>
            <th scope="col" className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <ProductImage src={product.thumbnail} alt={product.title} className="product-thumb" />
              </td>
              <td className="product-title-cell">
                <Link to={`/products/${product.id}`} className="product-title">
                  {product.title}
                </Link>
                {product.isLocal && (
                  <span className="badge text-bg-info ms-2" title="Created in this browser only">Added locally</span>
                )}
                {product.brand && <div className="small text-secondary">{product.brand}</div>}
              </td>
              <td>
                <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis fw-medium">
                  {formatCategory(product.category)}
                </span>
              </td>
              <td className="text-end fw-semibold">{formatPrice(product.price)}</td>
              <td>
                <Rating value={product.rating} />
              </td>
              <td>
                <StockBadge stock={product.stock} />
              </td>
              <td className="text-end text-nowrap">
                <Link to={`/products/${product.id}`} className="action-btn" title="View" aria-label={`View ${product.title}`}>
                  <i className="bi bi-eye" aria-hidden="true"></i>
                </Link>
                <Link to={`/products/${product.id}/edit`} className="action-btn" title="Edit" aria-label={`Edit ${product.title}`}>
                  <i className="bi bi-pencil-square" aria-hidden="true"></i>
                </Link>
                <button type="button" className="action-btn danger" title="Delete" aria-label={`Delete ${product.title}`} onClick={() => onDelete(product)}>
                  <i className="bi bi-trash3" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
