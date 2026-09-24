// Turns any Axios error into a short message that is safe to show to the user.
// We never show the raw error object on screen.

export function getErrorMessage(error) {
  // The shared Axios file already added a friendly message.
  if (error && error.userMessage) return error.userMessage;

  // 1) The server answered, but with an error status (400, 404, 500...)
  if (error && error.response) {
    const { status, data } = error.response;
    // DummyJSON sends { message: "..." } for most client errors, e.g. "Invalid credentials".
    if (status < 500 && data && typeof data.message === 'string') return data.message;
    if (status === 401) return 'Your session has expired. Please log in again.';
    if (status === 404) return 'We could not find what you were looking for.';
    if (status >= 500) return 'The server had a problem. Please try again in a moment.';
    return `The request failed (error ${status}). Please try again.`;
  }

  // 2) The request was sent, but there was no answer
  if (error && (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT')) {
    return 'The request took too long. Please check your connection and try again.';
  }
  if (error && error.request) {
    return 'Cannot reach the server. Please check your internet connection.';
  }

  // 3) Anything else
  return 'Something went wrong. Please try again.';
}
