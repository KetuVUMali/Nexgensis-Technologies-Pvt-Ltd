// All product API calls live here. Pages call these functions and never use Axios directly.
// Functions that can be cancelled take an AbortSignal as the last argument.

import api from './api';

// limit + skip = pagination, sortBy + order = sorting, delay = testing helper.
function buildParams({ limit, skip, sortBy, order, delay }) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }
  if (delay) params.delay = delay;
  return params;
}

// GET /products?limit=10&skip=0
export async function getProducts(options, signal) {
  const response = await api.get('/products', { params: buildParams(options), signal });
  return response.data; // { products, total, skip, limit }
}

// GET /products/search?q=phone
export async function searchProducts({ q, ...options }, signal) {
  const response = await api.get('/products/search', { params: { q, ...buildParams(options) }, signal });
  return response.data;
}

// GET /products/category/smartphones
export async function getProductsByCategory(category, options, signal) {
  const response = await api.get(`/products/category/${encodeURIComponent(category)}`, {
    params: buildParams(options),
    signal,
  });
  return response.data;
}

// GET /products/categories
// Newer DummyJSON returns objects { slug, name, url }, older versions returned plain strings.
// Both are turned into { slug, name } so the rest of the app has one simple shape.
export async function getCategories(signal) {
  const response = await api.get('/products/categories', { signal });
  return response.data.map((item) =>
    typeof item === 'string'
      ? { slug: item, name: item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, ' ') }
      : { slug: item.slug, name: item.name }
  );
}

// GET /products/1
export async function getProductById(id, signal) {
  const response = await api.get(`/products/${id}`, { signal });
  return response.data;
}

// Every product, but only the few fields the dashboard needs (limit=0 means "all").
export async function getProductsSummary(signal) {
  const response = await api.get('/products', {
    params: { limit: 0, select: 'title,price,stock,rating,category' },
    signal,
  });
  return response.data;
}

// The three calls below are SIMULATED by DummyJSON: the answer looks like success,
// but nothing is stored on the server. See utils/localChanges.js.

// POST /products/add
export async function addProduct(productData) {
  const response = await api.post('/products/add', productData);
  return response.data;
}

// PUT /products/1
export async function updateProduct(id, productData) {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
}

// DELETE /products/1
export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
