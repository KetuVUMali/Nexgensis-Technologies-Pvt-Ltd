// Shown when a search or filter finds nothing. Children can be an action button.
export default function EmptyState({ icon = 'bi-inbox', title, message, children }) {
  return (
    <div className="empty-state text-center py-5 px-3">
      <div className="empty-icon mx-auto mb-3">
        <i className={`bi ${icon}`} aria-hidden="true"></i>
      </div>
      <h2 className="h5 mb-1">{title}</h2>
      {message && <p className="text-secondary mb-3">{message}</p>}
      {children}
    </div>
  );
}
