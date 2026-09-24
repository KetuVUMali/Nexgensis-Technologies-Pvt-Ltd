import { useEffect, useState } from 'react';
import { PLACEHOLDER_IMAGE } from '../utils/format';

// <img> that falls back to a grey placeholder when there is no image or it fails to load.
export default function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  // A new src gets a fresh chance to load.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <img
      src={failed || !src ? PLACEHOLDER_IMAGE : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
