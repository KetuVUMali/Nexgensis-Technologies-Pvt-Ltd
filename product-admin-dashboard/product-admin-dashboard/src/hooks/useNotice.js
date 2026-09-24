import { useEffect, useState } from 'react';
import { takeFlash } from '../utils/flash';

// Holds a small message like { type: 'success', text: 'Product added' }.
// It also picks up a message left by the previous page and hides itself after 6 seconds.
export default function useNotice() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const text = takeFlash();
    if (text) setNotice({ type: 'success', text });
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  return [notice, setNotice];
}
