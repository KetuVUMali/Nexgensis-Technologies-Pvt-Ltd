# Commit plan

The assignment wants **regular commits, not one big commit**. Make each commit when that feature really
works, and spread them over your working days. Suggested order and the files each step touches:

| # | Commit message | Files |
| --- | --- | --- |
| 1 | Initial Vite React setup | `package.json`, `vite.config.js`, `index.html`, `.gitignore`, `public/favicon.svg`, `src/main.jsx` |
| 2 | Add Bootstrap, icons and project structure | `src/index.css` (base parts), folders |
| 3 | Add shared Axios instance and error helper | `services/api.js`, `utils/errorMessage.js` |
| 4 | Add login page and auth helpers | `pages/Login.jsx`, `services/authService.js`, `utils/auth.js`, `utils/validation.js` |
| 5 | Add protected routes and admin layout | `App.jsx`, `components/RouteGuards.jsx`, `AdminLayout`, `Sidebar`, `Navbar` |
| 6 | Add product list (table and cards) | `services/productService.js`, `ProductTable`, `ProductCard`, `ProductImage`, `Rating`, `StockBadge`, `pages/Products.jsx` |
| 7 | Add pagination and URL params | `utils/pagination.js`, `utils/urlParams.js`, `components/Pagination.jsx` |
| 8 | Add debounced search | `hooks/useDebounce.js`, search box in `ProductFilters` |
| 9 | Cancel stale requests with AbortController | the effect in `pages/Products.jsx` |
| 10 | Add category filter and sorting | `hooks/useCategories.js`, `ProductFilters` |
| 11 | Add product details page | `pages/ProductDetails.jsx`, `hooks/useProduct.js`, `ProductGallery`, `ReviewList`, `NotFoundBlock` |
| 12 | Add add and edit product forms | `ProductForm`, `pages/AddProduct.jsx`, `pages/EditProduct.jsx`, `utils/productForm.js` |
| 13 | Add delete confirmation and local changes | `ConfirmModal`, `utils/localChanges.js`, `LocalChangesBanner`, `utils/flash.js`, `Notice` |
| 14 | Add loading, error and empty states | `Loader`, `ErrorMessage`, `EmptyState` |
| 15 | Add dark and light theme | `context/ThemeContext.jsx`, `ThemeToggle`, theme CSS |
| 16 | Add dashboard | `pages/Dashboard.jsx` |
| 17 | Improve responsive design and add AOS | `index.css`, `data-aos` attributes |
| 18 | Add README and deployment files | `README.md`, `vercel.json`, `public/_redirects` |
| 19 | Final bug fixes | whatever you fix while testing |

```bash
git init
git add package.json vite.config.js index.html .gitignore public/favicon.svg src/main.jsx
git commit -m "Initial Vite React setup"
# ...repeat for each row
```

Note: the files in this project are already finished and import each other, so the app only runs once all the
pieces are present. The best way to learn it (and to get honest history) is to rebuild it in this order,
feature by feature, reading each file as you add it.
