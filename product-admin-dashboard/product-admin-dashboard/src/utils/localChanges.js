// DummyJSON only PRETENDS to add, edit and delete products: it answers "success"
// but never saves anything. To still show the change in the app, we remember
// every change in the browser (localStorage) and apply it on top of what the API returns.
//
//   added   -> products created in this browser (they get ids from 1001 up)
//   edited  -> { productId: { changed fields } } for products that came from the API
//   deleted -> products that should be hidden
//
// "Reset local changes" removes all of it and the app shows the API data again.

const STORAGE_KEY = 'productLocalChanges';
const FIRST_LOCAL_ID = 1001; // DummyJSON ids stop at 194, so there is no clash

function emptyChanges() {
  return { added: [], edited: {}, deleted: [] };
}

export function getLocalChanges() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return emptyChanges();
    return {
      added: Array.isArray(saved.added) ? saved.added : [],
      edited: saved.edited && typeof saved.edited === 'object' ? saved.edited : {},
      deleted: Array.isArray(saved.deleted) ? saved.deleted : [],
    };
  } catch {
    return emptyChanges(); // saved data was broken, start fresh
  }
}

function saveLocalChanges(changes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
  } catch {
    /* storage is full or blocked: the change only lasts until the page is refreshed */
  }
}

// ----- Add -----
export function addLocalProduct(data) {
  const changes = getLocalChanges();
  const lastId = changes.added.reduce((max, item) => Math.max(max, item.id), FIRST_LOCAL_ID - 1);
  const product = {
    ...data,
    id: lastId + 1,
    isLocal: true, // tells the UI this product does not exist on the server
    rating: null,
    reviews: [],
    images: [],
    tags: [],
  };
  changes.added.push(product);
  saveLocalChanges(changes);
  return product;
}

// ----- Edit -----
export function editLocalProduct(id, fields) {
  const productId = Number(id);
  const changes = getLocalChanges();
  const localIndex = changes.added.findIndex((item) => item.id === productId);

  if (localIndex !== -1) {
    // A product we created ourselves: change it directly.
    changes.added[localIndex] = { ...changes.added[localIndex], ...fields };
  } else {
    // A product from the API: remember only the changed fields.
    changes.edited[productId] = { ...changes.edited[productId], ...fields };
  }
  saveLocalChanges(changes);
}

// ----- Delete -----
export function deleteLocalProduct(product) {
  const changes = getLocalChanges();

  if (product.isLocal) {
    changes.added = changes.added.filter((item) => item.id !== product.id);
  } else {
    if (!changes.deleted.some((item) => item.id === product.id)) {
      changes.deleted.push({ id: product.id, title: product.title });
    }
    delete changes.edited[product.id];
  }
  saveLocalChanges(changes);
}

// ----- Reading -----
// Hide deleted products and merge edited fields into a list from the API.
export function applyLocalChangesToList(products) {
  const changes = getLocalChanges();
  const deletedIds = new Set(changes.deleted.map((item) => item.id));

  return products
    .filter((product) => !deletedIds.has(product.id))
    .map((product) => (changes.edited[product.id] ? { ...product, ...changes.edited[product.id] } : product));
}

// Same for one product. Returns null when the product was deleted locally.
export function applyLocalChangesToProduct(product) {
  const changes = getLocalChanges();
  if (changes.deleted.some((item) => item.id === product.id)) return null;
  return changes.edited[product.id] ? { ...product, ...changes.edited[product.id] } : product;
}

export function getLocalProduct(id) {
  const productId = Number(id);
  return getLocalChanges().added.find((item) => item.id === productId) || null;
}

export function isDeletedLocally(id) {
  const productId = Number(id);
  return getLocalChanges().deleted.some((item) => item.id === productId);
}

// Products we created that fit the current search or category.
// (Search wins over category, the same rule the Products page uses.)
export function getLocalAddedMatches({ search, category }) {
  const { added } = getLocalChanges();
  const text = search.toLowerCase();

  return added.filter((product) => {
    if (search) {
      const haystack = [product.title, product.description, product.brand, product.category].join(' ').toLowerCase();
      return haystack.includes(text);
    }
    if (category) return product.category === category;
    return true;
  });
}

export function countLocalChanges() {
  const changes = getLocalChanges();
  const added = changes.added.length;
  const edited = Object.keys(changes.edited).length;
  const deleted = changes.deleted.length;
  return { added, edited, deleted, total: added + edited + deleted };
}

export function resetLocalChanges() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
