# Interview preparation

Short answers you can say in your own words. Read the matching file before you answer.

1. **Why React + Vite?** Vite starts fast and builds a plain single-page app. The assignment wanted React; Next.js features (server rendering) are not needed for an admin dashboard behind a login.
2. **Why Bootstrap?** Ready grid, table, form, modal and alert styles, so I spend time on logic. A small `index.css` adds the brand colours.
3. **Why Axios?** The assignment requires it. It also gives interceptors and easy request cancellation. (`services/api.js`)
4. **How does the interceptor work?** A request interceptor runs before every request and adds the `Authorization` header from localStorage. A response interceptor runs on every error, creates a friendly message and logs out on 401.
5. **Where is the token stored?** localStorage (`utils/auth.js`). Simple and survives refresh. Production would use an httpOnly cookie.
6. **How do protected routes work?** `ProtectedRoute` checks `isLoggedIn()`. If false it returns `<Navigate to="/login">` and remembers the wanted page so login can send the user back. (`components/RouteGuards.jsx`)
7. **How is `skip` calculated?** `skip = (page - 1) * limit`. Page 3 with limit 20 gives skip 40. (`utils/pagination.js`)
8. **How does debounce work?** `useDebounce` starts a 500 ms timer whenever the value changes. If the value changes again the cleanup clears the old timer. Only the last value gets through.
9. **Why cancel old search requests?** A slow old request could finish after a newer one and overwrite it. Each effect run has an `AbortController`; the cleanup aborts the previous request.
10. **How are query params handled?** `useSearchParams` reads them, `readProductParams` cleans them, `updateQuery` writes them back and keeps the other params.
11. **Why reset to page 1 when search changes?** Page 5 of the old results may not exist in the new results.
12. **How does category filtering work?** The category dropdown puts `category=slug` in the URL. With no search text, the app calls `/products/category/:slug`.
13. **Why not send search and category together?** The API has no endpoint that does both. I let search win and switch the category dropdown off, so numbers are never misleading.
14. **How does sorting work?** The sort value in the URL (`price-desc`) is turned into `sortBy=price&order=desc`, and DummyJSON sorts before paging.
15. **How does CRUD work with DummyJSON?** The app calls POST / PUT / DELETE, then also stores the change in localStorage (`utils/localChanges.js`) and applies it on top of API data.
16. **Why are CRUD changes not permanent?** DummyJSON only simulates them. The server never stores anything.
17. **Invalid page values?** `parsePage` only accepts whole numbers of 1 or more. A page past the end is moved to the last page after the API tells us the total.
18. **Double submission?** `if (loading) return;` at the start, `setLoading(true)`, and `disabled={loading}` on the button.
19. **How does dark mode work?** `ThemeContext` sets `data-bs-theme="dark"` on `<html>`. Bootstrap 5.3 restyles its components, and my CSS variables change too. The choice is saved in localStorage and set before React loads (a tiny script in `index.html`).
20. **How is mobile handled?** Bootstrap classes: the table has `d-none d-lg-block`, the cards have `d-lg-none`. The sidebar slides in with a menu button below 992 px.
21. **How is AOS started?** `AOS.init()` once in `main.jsx`, with `once: true`. Elements only need `data-aos="fade-up"`.
22. **Loading / error / empty?** Each fetch has `loading`, `error` and data state. The page shows `Loader`, `ErrorMessage` (with Retry, which changes `reloadKey` and reruns the effect) or `EmptyState`.
23. **What would you improve for production?** httpOnly cookie auth with refresh tokens, a real backend for CRUD, tests, TypeScript, server-side rendering only if SEO was needed, proper focus trapping in the modal.

## Small live changes you might be asked to make

- Change the debounce time: `pages/Products.jsx`, `useDebounce(searchText, 500)`.
- Add a page size (for example 5): `PAGE_SIZES` in `utils/urlParams.js`.
- Change the low stock limit: `LOW_STOCK_LIMIT` in `utils/format.js`.
- Add a "brand" column: `components/ProductTable.jsx` (header and cell) and `ProductCard.jsx`.
- Change the brand colour: `--brand` in `src/index.css` (both themes).
- Make the title validation stricter: `utils/validation.js`.
