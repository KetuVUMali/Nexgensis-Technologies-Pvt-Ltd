import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import ProductForm from '../components/ProductForm';
import useCategories from '../hooks/useCategories';
import usePageTitle from '../hooks/usePageTitle';
import { addProduct } from '../services/productService';
import { getErrorMessage } from '../utils/errorMessage';
import { setFlash } from '../utils/flash';
import { addLocalProduct } from '../utils/localChanges';
import { emptyProductValues, formValuesToPayload } from '../utils/productForm';

export default function AddProduct() {
  usePageTitle('Add product');
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading, error: categoriesError, reload } = useCategories();

  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');

  async function handleSubmit(values) {
    if (submitting) return; // ignore extra clicks while the request is running
    setSubmitting(true);
    setSaveError('');

    try {
      const payload = formValuesToPayload(values);
      await addProduct(payload); // DummyJSON answers "created", but does not store it
      const savedProduct = addLocalProduct(payload); // so we keep it in this browser
      setFlash(`"${savedProduct.title}" was added. DummyJSON does not store it, so it is saved in this browser only.`);
      navigate(`/products/${savedProduct.id}`);
    } catch (err) {
      setSaveError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <div className="mb-4" data-aos="fade-up">
        <Link to="/products" className="small text-decoration-none">
          <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>Back to products
        </Link>
        <h1 className="h3 mt-2 mb-1">Add product</h1>
        <p className="text-secondary mb-0">Fields marked with * are required.</p>
      </div>

      {categoriesLoading && <Loader text="Loading categories..." />}
      {!categoriesLoading && categoriesError && (
        <ErrorMessage title="Categories could not be loaded" message={categoriesError} onRetry={reload} />
      )}

      {!categoriesLoading && !categoriesError && (
        <div className="card">
          <div className="card-body p-3 p-sm-4">
            {saveError && <div className="alert alert-danger" role="alert">{saveError}</div>}
            <ProductForm
              initialValues={emptyProductValues}
              categories={categories}
              submitting={submitting}
              submitText="Add product"
              cancelTo="/products"
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
