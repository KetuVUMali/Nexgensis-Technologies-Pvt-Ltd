// Form validation. Each function returns an object like { title: "Title is required" }.
// An empty object means "no errors".

export function validateLogin({ username, password }) {
  const errors = {};
  if (!username.trim()) errors.username = 'Enter your username.';
  if (!password) errors.password = 'Enter your password.';
  return errors;
}

function isValidUrl(text) {
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateProductForm(values) {
  const errors = {};

  const title = values.title.trim();
  if (!title) errors.title = 'Title is required.';
  else if (title.length < 3) errors.title = 'Title must be at least 3 characters.';
  else if (title.length > 100) errors.title = 'Title must be 100 characters or fewer.';

  const description = values.description.trim();
  if (!description) errors.description = 'Description is required.';
  else if (description.length < 10) errors.description = 'Description must be at least 10 characters.';
  else if (description.length > 1000) errors.description = 'Description must be 1000 characters or fewer.';

  const priceText = String(values.price).trim();
  if (priceText === '') errors.price = 'Price is required.';
  else if (!Number.isFinite(Number(priceText))) errors.price = 'Price must be a number.';
  else if (Number(priceText) <= 0) errors.price = 'Price must be greater than 0.';
  else if (Number(priceText) > 1000000) errors.price = 'Price is too large.';

  if (!values.category) errors.category = 'Choose a category.';

  const stockText = String(values.stock).trim();
  if (stockText === '') errors.stock = 'Stock is required.';
  else if (!Number.isInteger(Number(stockText))) errors.stock = 'Stock must be a whole number.';
  else if (Number(stockText) < 0) errors.stock = 'Stock cannot be negative.';
  else if (Number(stockText) > 100000) errors.stock = 'Stock is too large.';

  if (values.brand.trim().length > 60) errors.brand = 'Brand must be 60 characters or fewer.';

  // The image is optional, but if it is filled in, it must be a real link.
  const thumbnail = values.thumbnail.trim();
  if (thumbnail && !isValidUrl(thumbnail)) {
    errors.thumbnail = 'Enter a full image link starting with http:// or https://';
  }

  return errors;
}
