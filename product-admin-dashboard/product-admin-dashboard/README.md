# Product Admin Dashboard

A small admin dashboard where a user logs in and manages products. It uses the free
[DummyJSON](https://dummyjson.com) API. Built as a frontend assignment.

- **Live demo:** 
- **Login:** username `emilys`, password `emilyspass`

> The original assignment asks for Next.js and Tailwind CSS. This version uses
> **React + Vite** and **Bootstrap** instead, as requested. Every other rule of the assignment is followed.

## Project overview

- **React 19 + Vite** (JavaScript) with **React Router** for pages.
- **Bootstrap 5.3** for layout and components, plus a small custom CSS file for the brand colours,
  sidebar and polish. Bootstrap Icons for icons and **AOS** for gentle entrance animations.
- **Axios** for every API call, through **one shared Axios file**.
- Fully responsive, with a **light / dark theme** that is remembered after a refresh.

## Features

| Area | What it does |
| --- | --- |
| Login | POST `/auth/login`, error message for wrong details, empty-field validation, one request even if clicked many times, token stored in localStorage |
| Protected routes | Product pages redirect to `/login` when there is no token. Logged-in users are redirected away from `/login`. Log out button in the top bar |
| Product list | Image, title, category, price, rating, stock. **Table on desktop, cards on phones and tablets** |
| Pagination | Hand-made. Uses `limit` and `skip`. Page numbers, Previous / Next, page size 10 / 20 / 50, text like "Showing 21–40 of 194" |
| Search | `/products/search?q=`. Waits 500 ms after typing stops. Resets to page 1 |
| Filter and sort | Category filter (`/products/categories`). Sort by price, rating or title (server side, `sortBy` and `order`) |
| URL state | `page`, `limit`, `search`, `category` and `sort` live in the URL. Refresh or share the link and you get the same result |
| Product details | `/products/:id` with image gallery, description, price, stock, reviews. Wrong id shows a "not found" page |
| Add, edit, delete | Form with validation, confirm popup before deleting, changes visible in the app (see "DummyJSON limitation") |
| States | Loader, "No products found" empty state, error message with a working **Retry** button |
| Dashboard | Totals and averages calculated from real API data, biggest categories, "where you left off" link |
| Theme | Light / dark switch (Bootstrap's `data-bs-theme`), saved in localStorage, applied before first paint |

## Tech stack

React, Vite, React Router DOM 6, Axios, Bootstrap 5.3, Bootstrap Icons, AOS, plain CSS.
Not used (on purpose): Next.js, Tailwind, React Query, SWR, Redux, table or pagination libraries.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
npm run preview    # test the production build locally
```

Node 18 or newer is recommended.

## Folder structure

```
src/
├── components/   Small reusable UI pieces (table, cards, pagination, modal, form, layout...)
├── pages/        One file per route (Login, Dashboard, Products, ProductDetails, Add/Edit, NotFound)
├── services/     ALL API code: api.js (shared Axios), authService.js, productService.js
├── hooks/        useDebounce, useProduct, useCategories, useNotice, usePageTitle
├── context/      ThemeContext (light / dark)
├── utils/        Helpers: URL parsing, pagination maths, validation, auth token, local changes
├── App.jsx       Routes
├── main.jsx      Starts React, Bootstrap CSS, AOS
└── index.css     Theme colours, sidebar, small custom styles
```

Pages never call Axios directly. They call functions from `services/`.

## Important technical decisions

1. **One shared Axios file** (`services/api.js`). It sets the base URL and a timeout, adds
   `Authorization: Bearer <token>` in a **request interceptor**, and in a **response interceptor**
   turns every error into a friendly message (`error.userMessage`) and logs the user out on a 401.
2. **Token in localStorage.** Simple, survives refresh. (A production app would prefer an httpOnly cookie.)
3. **URL is the source of truth.** The Products page reads everything from `useSearchParams`, and every
   change writes back to the URL. The page never keeps its own copy of page / limit / search / category / sort.
4. **Debounce.** `useDebounce` returns the typed text only after 500 ms without typing.
5. **Request cancellation.** See below.
6. **Server-side sorting and pagination.** DummyJSON supports `limit`, `skip`, `sortBy` and `order`, so the
   server does the work and only one page is downloaded at a time.
7. **Local changes for add / edit / delete.** See "DummyJSON limitation".

### Stale search responses

Every time the products effect runs it creates a new `AbortController` and passes its `signal` to Axios.
React runs the effect's cleanup function before the next run, and the cleanup calls `controller.abort()`.
So **when a new search starts, the previous request is cancelled and an older response cannot overwrite
newer results.** As a second safety net, the code checks `controller.signal.aborted` before saving any
result, and cancelled requests are not shown as errors.

To see it: add `&delay=2000` to the page URL (for example `/products?delay=2000`). The app passes it on to
DummyJSON, and in the browser's Network tab you can watch the older request being cancelled.

### Search + category decision

DummyJSON cannot search **and** filter by category in one request. This app chooses one clear rule:

> **Search wins.** While there is search text, the category dropdown is switched off and a note says so.
> When the search box is cleared, the category filter comes back.

Why: filtering the search results in the browser would only filter the 10–50 items of the current page,
which makes the numbers ("Showing 1–10 of 27") and the page count wrong. Downloading every result to filter
them would break the "load page by page" rule. The chosen rule never shows misleading numbers.
The category stays in the URL, so it is restored after the search is cleared.

### DummyJSON limitation: add, edit and delete are not really saved

DummyJSON answers "success" for POST, PUT and DELETE, but stores nothing. A refresh would bring back
the original data. To still **show the change in the app**, `utils/localChanges.js` keeps the changes in
localStorage and applies them on top of what the API returns:

- **Add:** the product gets a local id (1001 and up), and is shown at the top of page 1 with an "Added locally" badge.
- **Edit:** changed fields are remembered and merged into lists and the details page.
- **Delete:** the product is hidden everywhere.

The real API request is still sent (except for products created locally, which do not exist on the server).
A banner on the Products page lists the local changes and has a **Reset local changes** button.
The "Showing X–Y of Z" numbers always come from the API, so they do not change after a local add or delete.
Because sorting and category filtering are done by the server, an edited price or category does not change
where a product appears in a sorted or filtered list.

### Invalid URL values

`utils/urlParams.js` cleans every value:

| URL | Result |
| --- | --- |
| `?page=abc`, `?page=-10`, `?page=1.5`, `?page=` | page 1 |
| `?page=999` | the app loads it, sees that it is past the last page, and moves the URL to the **last real page** (one extra request, no loop) |
| `?limit=999`, `?limit=hello` | 10 (allowed sizes are 10, 20, 50) |
| `?sort=banana` | default order |
| `?category=banana` | removed from the URL once the categories have loaded |
| `/products/abc`, `/products/999999` | "Product not found" page |

### Double-click protection

Login, Add / Edit save and Delete all use the same pattern: `if (loading) return;`, then `setLoading(true)`,
and the button is `disabled` while the request runs. Rapid clicks or pressing Enter many times send one request.

## Where each assignment requirement lives

| Requirement | File |
| --- | --- |
| Login, wrong-details error, logout | `pages/Login.jsx`, `services/authService.js`, `components/Navbar.jsx` |
| Only logged-in users open product pages | `components/RouteGuards.jsx`, `App.jsx` |
| Table on desktop, cards on mobile | `components/ProductTable.jsx`, `components/ProductCard.jsx`, `pages/Products.jsx` |
| Pagination (limit + skip, sizes, "Showing X–Y of Z") | `utils/pagination.js`, `components/Pagination.jsx` |
| Debounced search, back to page 1 | `hooks/useDebounce.js`, `pages/Products.jsx` |
| Category filter and sorting | `components/ProductFilters.jsx`, `utils/urlParams.js` |
| Product details and not found | `pages/ProductDetails.jsx`, `hooks/useProduct.js` |
| Add / edit / delete + validation + confirm popup | `components/ProductForm.jsx`, `utils/validation.js`, `components/ConfirmModal.jsx` |
| Loading, empty, error + Retry | `Loader`, `EmptyState`, `ErrorMessage` components |
| One shared Axios file | `services/api.js` |
| Values in the URL | `pages/Products.jsx`, `utils/urlParams.js` |
| No React Query / SWR / table libs | `package.json` |

## Deployment

The app is a single-page app, so the host must send every URL to `index.html`. Both are already set up:

- **Vercel:** `vercel.json` (import the repo, framework preset "Vite", done)
- **Netlify:** `public/_redirects` (build command `npm run build`, publish directory `dist`)

## Short note

**Choices.** React Router + `useSearchParams` for URL state, a hand-made debounce hook and pagination,
Bootstrap for speed and consistency, and my own modal and mobile menu (React state + Bootstrap classes) so no
Bootstrap JavaScript is needed. Sorting and paging are done by the API to keep each request small.

**One problem and the fix.** While testing search with a slow API, an older response could arrive after a
newer one and replace the results. I fixed it by giving each request its own `AbortController`, cancelling
the previous request in the effect cleanup, and ignoring cancelled requests instead of showing them as errors.

<!-- TODO before submitting: rewrite the two short paragraphs above and the AI paragraph below in your own words, so they match how YOU built and tested this. -->

**Where AI helped.** AI was used to plan the folder structure, draft the first version of the components and
the README, and explain Axios and React Router patterns. I read and tested the code, and I can explain each
file. Bugs found while testing were fixed by hand.
