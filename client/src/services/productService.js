const API_URL = 'http://localhost:5000/api';

const mapProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    id: p._id || p.id,
  };
};

/**
 * Fetch products from the backend with optional filters.
 * @param {Object} filters - Filter criteria (category, search, minPrice, maxPrice, sizes, colors, sort).
 * @returns {Promise<Array>} List of products.
 */
export const fetchProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        queryParams.append(key, val);
      }
    });

    const res = await fetch(`${API_URL}/products?${queryParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.map(mapProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Fetch a single product by its ID.
 * @param {string} id - Product ID.
 * @returns {Promise<Object|null>} Product details.
 */
export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    const data = await res.json();
    return mapProduct(data);
  } catch (error) {
    console.error(`Error fetching product by ID ${id}:`, error);
    return null;
  }
};

/**
 * Fetch related products of a given product.
 * @param {string} category - Product category.
 * @param {string} excludeId - Current product ID to exclude.
 * @returns {Promise<Array>} List of related products.
 */
export const fetchRelatedProducts = async (category, excludeId) => {
  try {
    const products = await fetchProducts({ category });
    return products.filter((p) => p.id !== excludeId).slice(0, 4);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
};
