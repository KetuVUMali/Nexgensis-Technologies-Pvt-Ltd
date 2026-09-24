import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import NotFoundBlock from '../components/NotFoundBlock';
import ProductForm from '../components/ProductForm';
import useCategories from '../hooks/useCategories';
import usePageTitle from '../hooks/usePageTitle';
import useProduct from '../hooks/useProduct';
import { updateProduct } from '../services/productService';
import { getErrorMessage } from '../utils/errorMessage';
import { setFlash } from '../utils/flash';
import { editLocalProduct } from '../utils/localChanges';
import { formValuesToPayload, productToFormValues } from '../utils/productForm';

export default function EditProduct() {
  const { id } = useParams();
  usePageTitle('Edit product');
  const navigate = useNavigate();

  const { product, loading, error, notFound, reload } = useProduct(id);
  const { categories, loading: categoriesLoading, error: categoriesError, reload: reloadCategories } = useCategories();

  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');

  async function handleSubmit(values) {
    if (submitting) return;
    setSubmitting(true);
    setSaveError('');

    try {
      const payload = formValuesToPayload(values);
      // Products created in this browser do not exist on the server, so only real ones are sent.
      if (!product.isLocal) await updateProduct(product.id, payload); // simulated by DummyJSON
      editLocalProduct(product.id, payload); // remember the change so the app can show it
      setFlash(`"${payload.title}" was updated. DummyJSON does not store it, so it is saved in this browser only.`);
      navigate(`/products/${product.id}`);
    } catch (err) {
      setSaveError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  if (loading || categoriesLoading) return <Loader text="Loading product..." />;
  if (notFound) {
    return <NotFoundBlock title="Product not found" message={`There is no product with the id "${id}".`} />;
  }
  if (error) return <ErrorMessage title="Product could not be loaded" message={error} onRetry={reload} />;
  if (categoriesError) return <ErrorMessage title="Categories could not be loaded" message={categoriesError} onRetry={reloadCategories} />;

  return (
    <div className="form-page">
      <div className="mb-4" data-aos="fade-up">
        <Link to={`/products/${product.id}`} className="small text-decoration-none">
          <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>Back to product
        </Link>
        <h1 className="h3 mt-2 mb-1">Edit product</h1>
        <p className="text-secondary mb-0">Changing: {product.title}</p>
      </div>

      <div className="card">
        <div className="card-body p-3 p-sm-4">
          {saveError && <div className="alert alert-danger" role="alert">{saveError}</div>}
          <ProductForm
            initialValues={productToFormValues(product)}
            categories={categories}
            submitting={submitting}
            submitText="Save changes"
            cancelTo={`/products/${product.id}`}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
