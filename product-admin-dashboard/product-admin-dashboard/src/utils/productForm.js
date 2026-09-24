// Converts between a product and the values of the product form.
// Form inputs always work with strings, so numbers are turned into text and back.

export const emptyProductValues = {
  title: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  brand: '',
  thumbnail: '',
};

// Product from the API -> text values for the form fields (used by Edit).
export function productToFormValues(product) {
  return {
    title: product.title || '',
    description: product.description || '',
    price: product.price === undefined || product.price === null ? '' : String(product.price),
    category: product.category || '',
    stock: product.stock === undefined || product.stock === null ? '' : String(product.stock),
    brand: product.brand || '',
    thumbnail: product.thumbnail || '',
  };
}

// Text values from the form -> the data sent to the API.
export function formValuesToPayload(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    price: Number(values.price),
    category: values.category,
    stock: Number(values.stock),
    brand: values.brand.trim(),
    thumbnail: values.thumbnail.trim(),
  };
}
