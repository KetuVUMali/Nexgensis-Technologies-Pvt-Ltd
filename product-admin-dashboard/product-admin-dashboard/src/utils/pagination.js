// Pagination maths. Written by hand, no pagination library.

// skip tells the API how many products to jump over.
// page 1, limit 20 -> skip 0   |   page 2 -> skip 20   |   page 3 -> skip 40
export function getSkip(page, limit) {
  return (page - 1) * limit;
}

export function getTotalPages(total, limit) {
  return Math.max(1, Math.ceil(total / limit));
}

// Numbers for the "Showing 21–40 of 194" text.
export function getRange(page, limit, total) {
  const skip = getSkip(page, limit);
  const start = total === 0 ? 0 : skip + 1;
  const end = Math.min(skip + limit, total); // the last page can be shorter
  return { start, end };
}

// Page buttons to display. Long lists are shortened with "..." like: 1 ... 4 5 6 ... 20
export function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}
