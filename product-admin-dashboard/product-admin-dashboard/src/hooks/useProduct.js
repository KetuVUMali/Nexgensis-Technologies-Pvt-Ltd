import { useEffect, useState } from 'react';
import { getProductById } from '../services/productService';
import { isCancel } from '../services/api';
import { getErrorMessage } from '../utils/errorMessage';
import { applyLocalChangesToProduct, getLocalProduct, isDeletedLocally } from '../utils/localChanges';

// Loads ONE product for the details page and the edit page.
// A wrong id (not a number, or unknown to the API) becomes notFound = true.

function isValidId(id) {
  return /^\d+$/.test(id) && Number(id) > 0 && Number(id) < 1000000000;
}

export default function useProduct(id) {
  const [state, setState] = useState({ product: null, loading: true, error: '', notFound: false });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setState({ product: null, loading: true, error: '', notFound: false });

      // Not a real id like "abc" or "-5": no need to ask the server.
      if (!isValidId(id)) {
        setState({ product: null, loading: false, error: '', notFound: true });
        return;
      }

      // Products created in this browser do not exist on the server.
      const localProduct = getLocalProduct(id);
      if (localProduct) {
        setState({ product: localProduct, loading: false, error: '', notFound: false });
        return;
      }

      if (isDeletedLocally(id)) {
        setState({ product: null, loading: false, error: '', notFound: true });
        return;
      }

      try {
        const data = await getProductById(id, controller.signal);
        if (controller.signal.aborted) return;
        const product = applyLocalChangesToProduct(data);
        setState({ product, loading: false, error: '', notFound: product === null });
      } catch (err) {
        if (isCancel(err) || controller.signal.aborted) return;
        const status = err.response && err.response.status;
        if (status === 404 || status === 400) {
          setState({ product: null, loading: false, error: '', notFound: true });
        } else {
          setState({ product: null, loading: false, error: getErrorMessage(err), notFound: false });
        }
      }
    }

    loadProduct();
    return () => controller.abort();
  }, [id, reloadKey]);

  return { ...state, reload: () => setReloadKey((key) => key + 1) };
}
