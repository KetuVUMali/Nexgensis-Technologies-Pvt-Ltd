// A "flash message" is shown once on the NEXT page.
// Example: after adding a product we go to the details page and show "Product added".
// sessionStorage is used, so the message survives the page change (but not a new tab).

const FLASH_KEY = 'flashMessage';

export function setFlash(text) {
  try {
    sessionStorage.setItem(FLASH_KEY, text);
  } catch {
    /* the message is only a nice extra, ignore failures */
  }
}

// Reads the message and removes it, so it is only shown once.
export function takeFlash() {
  try {
    const text = sessionStorage.getItem(FLASH_KEY);
    if (text) sessionStorage.removeItem(FLASH_KEY);
    return text;
  } catch {
    return null;
  }
}
