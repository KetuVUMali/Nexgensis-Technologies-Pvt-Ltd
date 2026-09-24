import { useEffect, useState } from 'react';
import { getCategories } from '../services/productService';
import { isCancel } from '../services/api';
import { getErrorMessage } from '../utils/errorMessage';

// Categories do not change while the app is open, so they are loaded once and kept here.
let cachedCategories = null;

export default function useCategories() {
  const [categories, setCategories] = useState(cachedCategories || []);
  const [loading, setLoading] = useState(!cachedCategories);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0); // changing this runs the effect again (Retry)

  useEffect(() => {
    if (cachedCategories) return; // already loaded earlier

    const controller = new AbortController();
    setLoading(true);
    setError('');

    getCategories(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        cachedCategories = data;
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        if (isCancel(err) || controller.signal.aborted) return;
        setError(getErrorMessage(err));
        setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  return { categories, loading, error, reload: () => setReloadKey((key) => key + 1) };
}
