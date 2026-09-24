import { useEffect } from 'react';

// A confirmation popup built with Bootstrap modal CSS classes.
// It is controlled by React (show / hide), so we do not need Bootstrap's JavaScript.
export default function ConfirmModal({
  show,
  title,
  children,
  confirmText = 'Delete',
  loading = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!show) return;

    // Escape closes the popup (unless a request is running).
    function handleKeyDown(event) {
      if (event.key === 'Escape' && !loading) onCancel();
    }
    document.addEventListener('keydown', handleKeyDown);

    // Stop the page behind the popup from scrolling.
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = oldOverflow;
    };
  }, [show, loading, onCancel]);

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onMouseDown={(event) => {
          // A click on the dark area (not on the box) closes the popup.
          if (event.target === event.currentTarget && !loading) onCancel();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body p-4 pb-3">
              <div className="d-flex gap-3">
                <span className="modal-icon" aria-hidden="true"><i className="bi bi-trash3"></i></span>
                <div className="flex-grow-1 min-w-0">
                  <h2 className="modal-title h5 mb-2" id="confirm-modal-title">{title}</h2>
                  <div className="modal-text">{children}</div>
                  {error && (
                    <div className="alert alert-danger mt-3 mb-0" role="alert">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-2 px-4 pb-4">
              {/* autoFocus on Cancel: the safe choice is focused first for a destructive action */}
              <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={loading} autoFocus>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Deleting...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
