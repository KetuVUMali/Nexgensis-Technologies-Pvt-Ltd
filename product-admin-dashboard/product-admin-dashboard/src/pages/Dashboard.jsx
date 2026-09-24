import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import useCategories from '../hooks/useCategories';
import usePageTitle from '../hooks/usePageTitle';
import { isCancel } from '../services/api';
import { getProductsSummary } from '../services/productService';
import { getUser } from '../utils/auth';
import { getErrorMessage } from '../utils/errorMessage';
import { formatCategory, LOW_STOCK_LIMIT } from '../utils/format';
import { getLastView, readProductParams, SORT_OPTIONS } from '../utils/urlParams';

// Describes the last list the user looked at, e.g. "Page 2, 20 per page, category Beauty".
function describeLastView(queryString) {
  const view = readProductParams(new URLSearchParams(queryString));
  const parts = [`page ${view.page}`, `${view.limit} per page`];
  if (view.search) parts.push(`search "${view.search}"`);
  else if (view.category) parts.push(`category ${formatCategory(view.category)}`);
  if (view.sort) parts.push(SORT_OPTIONS.find((option) => option.value === view.sort).label.toLowerCase());
  const text = parts.join(', ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function Dashboard() {
  usePageTitle('Dashboard');
  const user = getUser();
  const { categories } = useCategories();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSummary() {
      setLoading(true);
      setError('');
      try {
        const data = await getProductsSummary(controller.signal);
        if (controller.signal.aborted) return;
        setSummary(data);
        setLoading(false);
      } catch (err) {
        if (isCancel(err) || controller.signal.aborted) return;
        setError(getErrorMessage(err));
        setLoading(false);
      }
    }

    loadSummary();
    return () => controller.abort();
  }, [reloadKey]);

  // Numbers calculated from the real API data.
  const stats = useMemo(() => {
    if (!summary) return null;
    const products = summary.products;
    const lowStock = products.filter((product) => product.stock > 0 && product.stock < LOW_STOCK_LIMIT).length;
    const outOfStock = products.filter((product) => product.stock === 0).length;
    const ratingSum = products.reduce((sum, product) => sum + (product.rating || 0), 0);

    // How many products each category has.
    const counts = {};
    products.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    const topCategories = Object.keys(counts)
      .map((slug) => ({ slug, count: counts[slug] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      total: summary.total,
      lowStock,
      outOfStock,
      averageRating: products.length ? ratingSum / products.length : 0,
      topCategories,
    };
  }, [summary]);

  const lastView = getLastView();
  const maxCount = stats && stats.topCategories.length ? stats.topCategories[0].count : 1;

  const statCards = stats
    ? [
        { icon: 'bi-box-seam', tone: 'brand', label: 'Products in catalogue', value: stats.total },
        { icon: 'bi-grid', tone: 'info', label: 'Categories', value: categories.length || '–' },
        { icon: 'bi-exclamation-triangle', tone: 'warn', label: `Low stock (under ${LOW_STOCK_LIMIT})`, value: stats.lowStock, note: `${stats.outOfStock} out of stock` },
        { icon: 'bi-star-fill', tone: 'accent', label: 'Average rating', value: stats.averageRating.toFixed(1), note: 'out of 5' },
      ]
    : [];

  return (
    <div>
      <div className="mb-4" data-aos="fade-up">
        <h1 className="h3 mb-1">Welcome back{user && user.firstName ? `, ${user.firstName}` : ''}</h1>
        <p className="text-secondary mb-0">Here is what is in your catalogue right now.</p>
      </div>

      {loading && <Loader text="Loading dashboard..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={() => setReloadKey((key) => key + 1)} />}

      {!loading && !error && stats && (
        <>
          <div className="row g-3 mb-4">
            {statCards.map((card, index) => (
              <div key={card.label} className="col-12 col-sm-6 col-xl-3" data-aos="fade-up" data-aos-delay={index * 80}>
                <div className="card h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <span className={`stat-icon stat-icon-${card.tone}`}><i className={`bi ${card.icon}`} aria-hidden="true"></i></span>
                    <div>
                      <div className="stat-value brand-font">{card.value}</div>
                      <div className="small text-secondary">{card.label}</div>
                      {card.note && <div className="small text-secondary">{card.note}</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-7" data-aos="fade-up">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="h5 mb-3">Biggest categories</h2>
                  <ul className="list-unstyled mb-0">
                    {stats.topCategories.map((item) => (
                      <li key={item.slug} className="mb-3">
                        <Link to={`/products?category=${item.slug}`} className="category-row text-decoration-none">
                          <div className="d-flex justify-content-between small mb-1">
                            <span className="fw-medium">{formatCategory(item.slug)}</span>
                            <span className="text-secondary">{item.count} products</span>
                          </div>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${(item.count / maxCount) * 100}%` }}></div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5" data-aos="fade-up" data-aos-delay="80">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h2 className="h5 mb-3">Quick actions</h2>
                  <div className="d-grid gap-2">
                    <Link to="/products" className="btn btn-primary">
                      <i className="bi bi-box-seam me-2" aria-hidden="true"></i>Browse products
                    </Link>
                    <Link to="/products/add" className="btn btn-outline-secondary">
                      <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>Add a product
                    </Link>
                  </div>
                  {lastView && (
                    <div className="last-view mt-4">
                      <div className="small text-secondary mb-1">Where you left off</div>
                      <div className="mb-2">{describeLastView(lastView)}</div>
                      <Link to={`/products?${lastView}`}>Open that list</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
