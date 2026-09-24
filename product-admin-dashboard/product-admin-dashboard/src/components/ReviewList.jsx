import Rating from './Rating';
import { formatDate } from '../utils/format';

// Reviews come from the API. If there are none, we say so and do not invent any.
export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-secondary mb-0">This product has no reviews yet.</p>;
  }

  return (
    <ul className="list-unstyled mb-0">
      {reviews.map((review, index) => (
        <li key={`${review.reviewerEmail}-${index}`} className="review-item">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-1">
            <span className="fw-semibold">{review.reviewerName}</span>
            <span className="small text-secondary">{formatDate(review.date)}</span>
          </div>
          <Rating value={review.rating} />
          <p className="mb-0 mt-1">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}
