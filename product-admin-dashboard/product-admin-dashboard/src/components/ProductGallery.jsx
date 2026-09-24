import { useState } from 'react';
import ProductImage from './ProductImage';

// Big picture + small thumbnails to switch between images.
export default function ProductGallery({ images, title }) {
  const [selected, setSelected] = useState(0);
  // If the images list gets shorter (edit), make sure the selected number still exists.
  const current = images[selected] || images[0];

  return (
    <div>
      <div className="gallery-main">
        <ProductImage src={current} alt={title} />
      </div>
      {images.length > 1 && (
        <div className="d-flex flex-wrap gap-2 mt-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={`gallery-thumb ${image === current ? 'active' : ''}`}
              onClick={() => setSelected(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={image === current}
            >
              <ProductImage src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
