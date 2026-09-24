// Simple Bootstrap spinner with a text under it.
export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-box d-flex flex-column align-items-center justify-content-center text-secondary py-5" role="status">
      <div className="spinner-border text-primary" aria-hidden="true"></div>
      <span className="mt-3">{text}</span>
    </div>
  );
}
