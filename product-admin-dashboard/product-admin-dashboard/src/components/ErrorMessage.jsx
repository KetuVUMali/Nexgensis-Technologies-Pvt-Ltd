// Red alert with an optional Retry button. onRetry runs the failed request again.
export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center gap-3 mb-0" role="alert">
      <i className="bi bi-exclamation-triangle-fill fs-4" aria-hidden="true"></i>
      <div className="flex-grow-1">
        <div className="fw-semibold">{title}</div>
        <div>{message}</div>
      </div>
      {onRetry && (
        <button type="button" className="btn btn-outline-danger" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-2" aria-hidden="true"></i>Retry
        </button>
      )}
    </div>
  );
}
