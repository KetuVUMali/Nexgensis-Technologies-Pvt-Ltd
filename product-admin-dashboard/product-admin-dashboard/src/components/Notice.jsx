// A small dismissible message, e.g. "Product deleted".
export default function Notice({ type = 'success', text, onClose }) {
  const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill';
  return (
    <div className={`alert alert-${type} alert-dismissible d-flex align-items-start gap-2`} role="status">
      <i className={`bi ${icon} mt-1`} aria-hidden="true"></i>
      <div className="pe-4">{text}</div>
      <button type="button" className="btn-close" aria-label="Close message" onClick={onClose}></button>
    </div>
  );
}
