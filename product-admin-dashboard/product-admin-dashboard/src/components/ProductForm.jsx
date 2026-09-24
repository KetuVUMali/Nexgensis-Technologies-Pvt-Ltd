import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateProductForm } from '../utils/validation';

// One form used by both "Add product" and "Edit product".
// initialValues fills the fields, onSubmit receives the checked values.
export default function ProductForm({ initialValues, categories, submitting, submitText, cancelTo, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    // Remove the red error as soon as the user starts fixing that field.
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return; // ignore extra clicks while a request is running

    const foundErrors = validateProductForm(values);
    setErrors(foundErrors);

    const firstBadField = Object.keys(foundErrors)[0];
    if (firstBadField) {
      // Move the cursor to the first wrong field so the user sees what to fix.
      const element = document.getElementById(`field-${firstBadField}`);
      if (element) element.focus();
      return;
    }
    onSubmit(values);
  }

  // Small helper so each field does not repeat the same three attributes.
  function fieldClass(name) {
    return `form-control ${errors[name] ? 'is-invalid' : ''}`;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="field-title" className="form-label">Title <span className="text-danger">*</span></label>
          <input id="field-title" name="title" type="text" className={fieldClass('title')} value={values.title} onChange={handleChange} maxLength={120} />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>

        <div className="col-12">
          <label htmlFor="field-description" className="form-label">Description <span className="text-danger">*</span></label>
          <textarea id="field-description" name="description" rows="4" className={fieldClass('description')} value={values.description} onChange={handleChange} maxLength={1100} />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        <div className="col-12 col-sm-6">
          <label htmlFor="field-price" className="form-label">Price (USD) <span className="text-danger">*</span></label>
          <input id="field-price" name="price" type="number" step="0.01" min="0" inputMode="decimal" className={fieldClass('price')} value={values.price} onChange={handleChange} />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        </div>

        <div className="col-12 col-sm-6">
          <label htmlFor="field-stock" className="form-label">Stock <span className="text-danger">*</span></label>
          <input id="field-stock" name="stock" type="number" step="1" min="0" inputMode="numeric" className={fieldClass('stock')} value={values.stock} onChange={handleChange} />
          {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
        </div>

        <div className="col-12 col-sm-6">
          <label htmlFor="field-category" className="form-label">Category <span className="text-danger">*</span></label>
          <select id="field-category" name="category" className={`form-select ${errors.category ? 'is-invalid' : ''}`} value={values.category} onChange={handleChange}>
            <option value="">Choose a category</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>{item.name}</option>
            ))}
          </select>
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>

        <div className="col-12 col-sm-6">
          <label htmlFor="field-brand" className="form-label">Brand</label>
          <input id="field-brand" name="brand" type="text" className={fieldClass('brand')} value={values.brand} onChange={handleChange} />
          {errors.brand && <div className="invalid-feedback">{errors.brand}</div>}
        </div>

        <div className="col-12">
          <label htmlFor="field-thumbnail" className="form-label">Image link</label>
          <input id="field-thumbnail" name="thumbnail" type="url" className={fieldClass('thumbnail')} value={values.thumbnail} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
          {errors.thumbnail ? (
            <div className="invalid-feedback">{errors.thumbnail}</div>
          ) : (
            <div className="form-text">Optional. Leave it empty to show a placeholder picture.</div>
          )}
        </div>
      </div>

      <div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2 mt-4">
        <Link to={cancelTo} className="btn btn-outline-secondary">Cancel</Link>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Saving...
            </>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
}
