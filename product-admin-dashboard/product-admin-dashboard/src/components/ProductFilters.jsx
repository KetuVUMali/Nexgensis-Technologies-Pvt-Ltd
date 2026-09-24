import { SORT_OPTIONS } from '../utils/urlParams';

// Search box + category dropdown + sort dropdown.
// It does not fetch anything. It only reports changes to the Products page.
export default function ProductFilters({
  searchText,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  categories,
  categoriesLoading,
  categoriesError,
  onRetryCategories,
  searchActive,
}) {
  return (
    <div className="row g-3">
      <div className="col-12 col-lg-5">
        <label htmlFor="product-search" className="form-label small text-secondary mb-1">Search</label>
        <div className="input-group">
          <span className="input-group-text" aria-hidden="true">
            <i className="bi bi-search"></i>
          </span>
          <input
            id="product-search"
            type="search"
            className="form-control"
            placeholder="Search by name, brand or keyword"
            value={searchText}
            maxLength={100}
            autoComplete="off"
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {searchText && (
            <button type="button" className="btn btn-outline-secondary" aria-label="Clear search" onClick={() => onSearchChange('')}>
              <i className="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-4">
        <label htmlFor="product-category" className="form-label small text-secondary mb-1">Category</label>
        {/* While searching, the dropdown is switched off and shows "All categories". */}
        <select
          id="product-category"
          className="form-select"
          value={searchActive ? '' : category}
          disabled={searchActive || categoriesLoading}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">{categoriesLoading ? 'Loading categories...' : 'All categories'}</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>{item.name}</option>
          ))}
        </select>
        {searchActive && (
          <div className="form-text">Category filter is paused while you search. The API cannot do both at once.</div>
        )}
        {categoriesError && (
          <div className="form-text text-danger">
            {categoriesError}{' '}
            <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={onRetryCategories}>Retry</button>
          </div>
        )}
      </div>

      <div className="col-12 col-sm-6 col-lg-3">
        <label htmlFor="product-sort" className="form-label small text-secondary mb-1">Sort by</label>
        <select id="product-sort" className="form-select" value={sort} onChange={(event) => onSortChange(event.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
