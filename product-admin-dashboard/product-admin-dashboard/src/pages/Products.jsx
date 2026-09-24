import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import LocalChangesBanner from '../components/LocalChangesBanner';
import Notice from '../components/Notice';
import Pagination from '../components/Pagination';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import ProductTable from '../components/ProductTable';
import useCategories from '../hooks/useCategories';
import useDebounce from '../hooks/useDebounce';
import useNotice from '../hooks/useNotice';
import usePageTitle from '../hooks/usePageTitle';
import { isCancel } from '../services/api';
import { deleteProduct, getProducts, getProductsByCategory, searchProducts } from '../services/productService';
import { getErrorMessage } from '../utils/errorMessage';
import {
  applyLocalChangesToList,
  countLocalChanges,
  deleteLocalProduct,
  getLocalAddedMatches,
  resetLocalChanges,
} from '../utils/localChanges';
import { getRange, getSkip, getTotalPages } from '../utils/pagination';
import { getSortParams, PAGE_SIZES, readProductParams, saveLastView } from '../utils/urlParams';

export default function Products() {
  usePageTitle('Products');

  // ---------- 1. The URL is the source of truth ----------
  // page, limit, search, category and sort are all read from the URL and cleaned
  // (so ?page=abc or ?limit=999 fall back to safe values).
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, limit, search, category, sort, delay } = readProductParams(searchParams);

  // Changes some URL values and keeps all the others (like "delay").
  // An empty value removes that key from the URL.
  function updateQuery(changes, options = {}) {
    const next = new URLSearchParams(searchParams);
    Object.keys(changes).forEach((key) => {
      const value = changes[key];
      if (value === '' || value === null || value === undefined) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next, { replace: Boolean(options.replace) });
  }

  // ---------- 2. State ----------
  const { categories, loading: categoriesLoading, error: categoriesError, reload: reloadCategories } = useCategories();

  const [apiProducts, setApiProducts] = useState([]); // exactly what the API returned
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0); // Retry button changes this to run the fetch again

  const [notice, setNotice] = useNotice();
  const [localVersion, setLocalVersion] = useState(0); // bump to re-read local changes
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // ---------- 3. Search box with debounce ----------
  // searchText is what is typed in the box. The URL only gets the value
  // 500 ms after the user stops typing, so the API is not called on every key press.
  const [searchText, setSearchText] = useState(search);
  const debouncedSearch = useDebounce(searchText, 500);
  const lastUrlSearch = useRef(search);

  useEffect(() => {
    const typed = debouncedSearch.trim();
    if (typed === search) return; // the URL already has this value
    lastUrlSearch.current = typed;
    // A new search always starts on page 1.
    updateQuery({ search: typed, page: 1 }, { replace: true });
  }, [debouncedSearch]);

  // If the URL search changes by itself (back button, "Clear filters"), copy it into the box.
  // Typing is skipped, because the box already shows what the user typed.
  useEffect(() => {
    if (search !== lastUrlSearch.current) setSearchText(search);
    lastUrlSearch.current = search;
  }, [search]);

  // ---------- 4. Load products ----------
  // Search and category cannot be combined by the API, so ONE of them is used:
  // search text wins. Without search, the category is used. Without both, all products.
  const searchActive = search !== '';

  useEffect(() => {
    // Every run of this effect gets its own AbortController. When the URL changes, React runs
    // the cleanup below, which cancels the old request. So an old (slow) response can never
    // replace the newer one.
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError('');

      const options = { limit, skip: getSkip(page, limit), delay, ...getSortParams(sort) };

      try {
        let data;
        if (search) {
          data = await searchProducts({ q: search, ...options }, controller.signal);
        } else if (category) {
          data = await getProductsByCategory(category, options, controller.signal);
        } else {
          data = await getProducts(options, controller.signal);
        }

        if (controller.signal.aborted) return; // a newer request has started, ignore this one

        // ?page=999 is too high: move to the last real page instead of showing an empty page.
        const lastPage = getTotalPages(data.total, limit);
        if (page > lastPage) {
          updateQuery({ page: lastPage }, { replace: true }); // this starts a new request
          return;
        }

        setApiProducts(data.products);
        setTotal(data.total);
        setLoading(false);
      } catch (err) {
        if (isCancel(err) || controller.signal.aborted) return; // cancelled on purpose, not an error
        setError(getErrorMessage(err));
        setLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, [page, limit, search, category, sort, delay, reloadKey]);

  // Remember the last list for the dashboard's "Where you left off".
  useEffect(() => {
    saveLastView(searchParams.toString());
  }, [searchParams]);

  // A category in the URL that does not exist (?category=banana) is removed once categories are loaded.
  useEffect(() => {
    if (categories.length === 0 || !category) return;
    if (!categories.some((item) => item.slug === category)) {
      updateQuery({ category: '', page: 1 }, { replace: true });
    }
  }, [categories, category]);

  // ---------- 5. What is shown ----------
  // API products + our local changes (see utils/localChanges.js).
  const localCounts = useMemo(() => countLocalChanges(), [localVersion]);
  const visibleProducts = useMemo(() => {
    const created = page === 1 ? getLocalAddedMatches({ search, category }) : [];
    return [...created, ...applyLocalChangesToList(apiProducts)];
  }, [apiProducts, page, search, category, localVersion]);

  const totalPages = getTotalPages(total, limit);
  const { start, end } = getRange(page, limit, total);
  const hasFilters = search !== '' || category !== '' || sort !== '';

  // ---------- 6. Handlers ----------
  // Every filter change goes back to page 1, because the old page number may not exist any more.
  function handleCategoryChange(value) {
    updateQuery({ category: value, page: 1 });
  }
  function handleSortChange(value) {
    updateQuery({ sort: value, page: 1 });
  }
  function handleLimitChange(value) {
    updateQuery({ limit: value, page: 1 });
  }
  function handlePageChange(newPage) {
    updateQuery({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function handleClearFilters() {
    updateQuery({ search: '', category: '', sort: '', page: 1 });
  }
  function handleResetLocalChanges() {
    resetLocalChanges();
    setLocalVersion((version) => version + 1);
    setNotice({ type: 'success', text: 'Local changes were removed. You are seeing the API data again.' });
  }

  async function handleConfirmDelete() {
    if (deleting || !productToDelete) return; // ignore double clicks
    setDeleting(true);
    setDeleteError('');
    try {
      // Products created here do not exist on the server, so there is nothing to delete there.
      if (!productToDelete.isLocal) await deleteProduct(productToDelete.id);
      deleteLocalProduct(productToDelete); // DummyJSON does not really delete, so we hide it locally
      setLocalVersion((version) => version + 1);
      setNotice({ type: 'success', text: `"${productToDelete.title}" was deleted.` });
      setProductToDelete(null);
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    }
    setDeleting(false);
  }

  function closeDeleteModal() {
    setProductToDelete(null);
    setDeleteError('');
  }

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4" data-aos="fade-up">
        <div>
          <h1 className="h3 mb-1">Products</h1>
          <p className="text-secondary mb-0">Search, filter and manage your catalogue.</p>
        </div>
        <Link to="/products/add" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>Add product
        </Link>
      </div>

      {notice && <Notice type={notice.type} text={notice.text} onClose={() => setNotice(null)} />}
      <LocalChangesBanner counts={localCounts} onReset={handleResetLocalChanges} />

      <div className="card mb-3">
        <div className="card-body">
          <ProductFilters
            searchText={searchText}
            onSearchChange={setSearchText}
            category={category}
            onCategoryChange={handleCategoryChange}
            sort={sort}
            onSortChange={handleSortChange}
            categories={categories}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
            onRetryCategories={reloadCategories}
            searchActive={searchActive}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="small text-secondary" aria-live="polite">
            {!loading && !error && (total > 0 ? `Showing ${start}–${end} of ${total}` : 'Showing 0 of 0')}
            {loading && 'Loading...'}
          </div>
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="page-size" className="small text-secondary mb-0">Per page</label>
            <select id="page-size" className="form-select form-select-sm w-auto" value={limit} onChange={(event) => handleLimitChange(event.target.value)}>
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="products-body">
          {loading && <Loader text="Loading products..." />}

          {!loading && error && (
            <div className="p-3">
              <ErrorMessage title="Products could not be loaded" message={error} onRetry={() => setReloadKey((key) => key + 1)} />
            </div>
          )}

          {!loading && !error && visibleProducts.length === 0 && (
            <EmptyState icon="bi-search" title="No products found" message="Try changing your search or filters.">
              {hasFilters && (
                <button type="button" className="btn btn-outline-secondary" onClick={handleClearFilters}>
                  Clear filters
                </button>
              )}
            </EmptyState>
          )}

          {!loading && !error && visibleProducts.length > 0 && (
            <>
              {/* Big screens: table */}
              <div className="d-none d-lg-block">
                <ProductTable products={visibleProducts} onDelete={setProductToDelete} />
              </div>
              {/* Phones and tablets: cards */}
              <div className="d-lg-none p-3">
                <div className="row g-3">
                  {visibleProducts.map((product) => (
                    <div key={product.id} className="col-12 col-sm-6">
                      <ProductCard product={product} onDelete={setProductToDelete} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {!loading && !error && total > 0 && (
          <div className="card-footer py-3">
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      <ConfirmModal
        show={Boolean(productToDelete)}
        title="Delete product"
        loading={deleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      >
        Are you sure you want to delete <strong>{productToDelete && productToDelete.title}</strong>? This cannot be undone.
      </ConfirmModal>
    </div>
  );
}
