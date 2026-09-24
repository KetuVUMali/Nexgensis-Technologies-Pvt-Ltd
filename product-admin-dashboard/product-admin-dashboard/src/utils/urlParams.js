// The URL is the source of truth for page, limit, search, category and sort.
// URLs can be edited by hand (?page=abc), so every value is cleaned here before use.

export const PAGE_SIZES = [10, 20, 50];
export const DEFAULT_LIMIT = 10;
const MAX_PAGE = 10000; // protects against silly values like ?page=99999999999

// DummyJSON can sort by any field with sortBy + order, so sorting is done by the server.
export const SORT_OPTIONS = [
  { value: '', label: 'Default order' },
  { value: 'price-asc', label: 'Price: low to high', sortBy: 'price', order: 'asc' },
  { value: 'price-desc', label: 'Price: high to low', sortBy: 'price', order: 'desc' },
  { value: 'rating-asc', label: 'Rating: low to high', sortBy: 'rating', order: 'asc' },
  { value: 'rating-desc', label: 'Rating: high to low', sortBy: 'rating', order: 'desc' },
  { value: 'title-asc', label: 'Title: A to Z', sortBy: 'title', order: 'asc' },
  { value: 'title-desc', label: 'Title: Z to A', sortBy: 'title', order: 'desc' },
];

// Only whole numbers >= 1 are allowed. "abc", "-10", "2.5" all become page 1.
export function parsePage(value) {
  const text = value ?? '';
  if (!/^\d+$/.test(text)) return 1;
  const number = Number(text);
  if (number < 1 || number > MAX_PAGE) return 1;
  return number;
}

// Only 10, 20 or 50 are allowed. Anything else becomes 10.
export function parseLimit(value) {
  const number = Number(value);
  return PAGE_SIZES.includes(number) ? number : DEFAULT_LIMIT;
}

export function parseSort(value) {
  return SORT_OPTIONS.some((option) => option.value === value) ? value : '';
}

export function parseSearch(value) {
  return (value ?? '').trim().slice(0, 100);
}

// Category slugs look like "mens-shirts". Anything else is ignored.
export function parseCategory(value) {
  const slug = (value ?? '').trim().toLowerCase();
  return /^[a-z0-9-]{1,60}$/.test(slug) ? slug : '';
}

// Testing helper: ?delay=2000 makes DummyJSON answer slowly (max 5 seconds).
export function parseDelay(value) {
  const text = value ?? '';
  if (!/^\d+$/.test(text)) return 0;
  return Math.min(Number(text), 5000);
}

export function readProductParams(searchParams) {
  return {
    page: parsePage(searchParams.get('page')),
    limit: parseLimit(searchParams.get('limit')),
    search: parseSearch(searchParams.get('search')),
    category: parseCategory(searchParams.get('category')),
    sort: parseSort(searchParams.get('sort')),
    delay: parseDelay(searchParams.get('delay')),
  };
}

// "price-asc" -> { sortBy: 'price', order: 'asc' }
export function getSortParams(sort) {
  const option = SORT_OPTIONS.find((item) => item.value === sort);
  if (!option || !option.sortBy) return {};
  return { sortBy: option.sortBy, order: option.order };
}

// The dashboard uses this to show "continue where you left off".
const LAST_VIEW_KEY = 'lastProductsView';

export function saveLastView(queryString) {
  try {
    localStorage.setItem(LAST_VIEW_KEY, queryString);
  } catch {
    /* not important if this fails */
  }
}

export function getLastView() {
  try {
    return localStorage.getItem(LAST_VIEW_KEY);
  } catch {
    return null;
  }
}
