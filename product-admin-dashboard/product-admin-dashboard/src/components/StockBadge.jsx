import { LOW_STOCK_LIMIT } from '../utils/format';

// Colour-coded stock: red = none, yellow = running low, green = fine.
export default function StockBadge({ stock }) {
  const count = Number(stock) || 0;

  if (count === 0) {
    return <span className="badge rounded-pill bg-danger-subtle text-danger-emphasis">Out of stock</span>;
  }
  if (count < LOW_STOCK_LIMIT) {
    return <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis">{count} left</span>;
  }
  return <span className="badge rounded-pill bg-success-subtle text-success-emphasis">{count} in stock</span>;
}
