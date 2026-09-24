import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import Notice from '../components/Notice';
import NotFoundBlock from '../components/NotFoundBlock';
import ProductGallery from '../components/ProductGallery';
import Rating from '../components/Rating';
import ReviewList from '../components/ReviewList';
import StockBadge from '../components/StockBadge';
import useNotice from '../hooks/useNotice';
import usePageTitle from '../hooks/usePageTitle';
import useProduct from '../hooks/useProduct';
import { deleteProduct } from '../services/productService';
import { getErrorMessage } from '../utils/errorMessage';
import { formatCategory, formatPrice, getProductImages } from '../utils/format';
import { setFlash } from '../utils/flash';
import { deleteLocalProduct } from '../utils/localChanges';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error, notFound, reload } = useProduct(id);
  const [notice, setNotice] = useNotice();

  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  usePageTitle(product ? product.title : 'Product');

  async function handleConfirmDelete() {
    if (deleting) return;
    setDeleting(true);
    setDeleteError('');
    try {
      if (!product.isLocal) await deleteProduct(product.id); // simulated by DummyJSON
      deleteLocalProduct(product); // hide it in this browser
      setFlash(`"${product.title}" was deleted.`);
      navigate('/products');
    } catch (err) {
      setDeleteError(getErrorMessage(err));
      setDeleting(false);
    }
  }

  if (loading) return <Loader text="Loading product..." />;

  // A wrong id (like /products/999999) shows a clear "not found" page.
  if (notFound) {
    return <NotFoundBlock title="Product not found" message={`There is no product with the id "${id}".`} />;
  }
  if (error) return <ErrorMessage title="Product could not be loaded" message={error} onRetry={reload} />;

  const images = getProductImages(product);
  const details = [
    { label: 'SKU', value: product.sku },
    { label: 'Weight', value: product.weight ? `${product.weight} g` : '' },
    { label: 'Warranty', value: product.warrantyInformation },
    { label: 'Shipping', value: product.shippingInformation },
    { label: 'Returns', value: product.returnPolicy },
    { label: 'Minimum order', value: product.minimumOrderQuantity },
  ].filter((item) => item.value);

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-3" data-aos="fade-up">
        <Link to="/products" className="small text-decoration-none">
          <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>Back to products
        </Link>
      </nav>

      {notice && <Notice type={notice.type} text={notice.text} onClose={() => setNotice(null)} />}

      {product.isLocal && (
        <div className="alert alert-info" role="note">
          This product was created in this browser. It does not exist on the DummyJSON server.
        </div>
      )}

      <div className="card mb-4" data-aos="fade-up">
        <div className="card-body p-3 p-md-4">
          <div className="row g-4">
            <div className="col-12 col-md-5">
              <ProductGallery images={images} title={product.title} />
            </div>

            <div className="col-12 col-md-7">
              <div className="d-flex flex-wrap gap-2 mb-2">
                <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis fw-medium">{formatCategory(product.category)}</span>
                {product.brand && <span className="badge rounded-pill text-bg-light border">{product.brand}</span>}
              </div>

              <h1 className="h3 mb-2 product-heading">{product.title}</h1>

              <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                <Rating value={product.rating} />
                <StockBadge stock={product.stock} />
              </div>

              <div className="d-flex align-items-baseline gap-2 mb-3">
                <span className="price-big brand-font">{formatPrice(product.price)}</span>
                {product.discountPercentage > 0 && (
                  <span className="badge text-bg-warning">{Math.round(product.discountPercentage)}% off</span>
                )}
              </div>

              <p className="mb-4">{product.description}</p>

              {details.length > 0 && (
                <dl className="row detail-list mb-4">
                  {details.map((item) => (
                    <div key={item.label} className="col-12 col-sm-6 mb-2">
                      <dt className="small text-secondary fw-normal">{item.label}</dt>
                      <dd className="mb-0">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag) => (
                    <span key={tag} className="badge rounded-pill text-bg-light border fw-normal">#{tag}</span>
                  ))}
                </div>
              )}

              <div className="d-flex flex-wrap gap-2">
                <Link to={`/products/${product.id}/edit`} className="btn btn-primary">
                  <i className="bi bi-pencil-square me-2" aria-hidden="true"></i>Edit product
                </Link>
                <button type="button" className="btn btn-outline-danger" onClick={() => setShowDelete(true)}>
                  <i className="bi bi-trash3 me-2" aria-hidden="true"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" data-aos="fade-up">
        <div className="card-body p-3 p-md-4">
          <h2 className="h5 mb-3">Reviews {product.reviews && product.reviews.length > 0 && <span className="text-secondary fw-normal">({product.reviews.length})</span>}</h2>
          <ReviewList reviews={product.reviews} />
        </div>
      </div>

      <ConfirmModal
        show={showDelete}
        title="Delete product"
        loading={deleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDelete(false);
          setDeleteError('');
        }}
      >
        Are you sure you want to delete <strong>{product.title}</strong>? This cannot be undone.
      </ConfirmModal>
    </div>
  );
}
