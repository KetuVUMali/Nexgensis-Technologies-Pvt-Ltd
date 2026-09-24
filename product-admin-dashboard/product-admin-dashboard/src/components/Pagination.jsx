import { getPageNumbers } from '../utils/pagination';

// Hand-made pagination: Previous, page numbers, Next.
// It only tells the page which number was clicked. The page updates the URL.
export default function Pagination({ page, totalPages, onPageChange }) {
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <nav aria-label="Product pages">
      <ul className="pagination pagination-sm justify-content-center flex-wrap mb-0">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button type="button" className="page-link" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
            <i className="bi bi-chevron-left me-1" aria-hidden="true"></i>Previous
          </button>
        </li>

        {/* Small phones: there is no room for many buttons, so show "2 / 10" instead. */}
        <li className="page-item disabled d-sm-none">
          <span className="page-link">{page} / {totalPages}</span>
        </li>

        {pageNumbers.map((number, index) =>
          number === '...' ? (
            <li key={`dots-${index}`} className="page-item disabled d-none d-sm-block">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={number} className={`page-item d-none d-sm-block ${number === page ? 'active' : ''}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => onPageChange(number)}
                aria-current={number === page ? 'page' : undefined}
                aria-label={`Page ${number}`}
              >
                {number}
              </button>
            </li>
          )
        )}

        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button type="button" className="page-link" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
            Next<i className="bi bi-chevron-right ms-1" aria-hidden="true"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
}
