import { useEffect } from 'react';

// Sets the browser tab title, e.g. "Products | Product Admin".
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} | Product Admin`;
  }, [title]);
}
