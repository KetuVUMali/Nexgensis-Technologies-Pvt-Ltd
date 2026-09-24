// Star + number, e.g. "★ 4.5". Products without a rating show "No rating".
export default function Rating({ value }) {
  if (!value) return <span className="text-secondary small">No rating</span>;
  return (
    <span className="rating" aria-label={`Rating ${Number(value).toFixed(1)} out of 5`}>
      <i className="bi bi-star-fill me-1" aria-hidden="true"></i>
      {Number(value).toFixed(1)}
    </span>
  );
}
