// Explains that add / edit / delete only exist in this browser (DummyJSON does not save them).
export default function LocalChangesBanner({ counts, onReset }) {
  if (counts.total === 0) return null;

  const parts = [];
  if (counts.added) parts.push(`${counts.added} added`);
  if (counts.edited) parts.push(`${counts.edited} edited`);
  if (counts.deleted) parts.push(`${counts.deleted} deleted`);

  return (
    <div className="alert alert-info d-flex flex-column flex-md-row align-items-md-center gap-2 mb-3" role="note">
      <i className="bi bi-info-circle-fill" aria-hidden="true"></i>
      <div className="flex-grow-1">
        <strong>Local changes: {parts.join(', ')}.</strong>{' '}
        DummyJSON pretends to save these but never stores them, so the app remembers them in this browser only.
        The counts below come from the API.
      </div>
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onReset}>
        <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true"></i>Reset local changes
      </button>
    </div>
  );
}
