import { useEffect, useState } from 'react';

// Returns `value`, but only after it has stopped changing for `delay` milliseconds.
// Every new keystroke restarts the timer, so the API is called once, after the user stops typing.
export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // Cleanup: if `value` changes again before the timer fires, cancel the old timer.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
