// Small formatting helpers used by the table, cards and details page.

// Products with fewer than this many units left are shown as "low stock".
export const LOW_STOCK_LIMIT = 10;

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatPrice(price) {
  return priceFormatter.format(Number(price) || 0); // 99.99 -> "$99.99"
}

// "home-decoration" -> "Home Decoration"
export function formatCategory(slug) {
  if (!slug) return '';
  return String(slug)
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Grey picture shown when a product has no image or the image fails to load.
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">' +
      '<rect width="200" height="200" fill="#e3ebe8"/>' +
      '<path d="M50 140l36-46 28 34 20-24 36 36z" fill="#b5c7c2"/>' +
      '<circle cx="74" cy="72" r="14" fill="#b5c7c2"/></svg>'
  );

// Main image first, then the other images (no duplicates).
export function getProductImages(product) {
  const all = [product.thumbnail, ...(product.images || [])].filter(Boolean);
  return [...new Set(all)];
}
