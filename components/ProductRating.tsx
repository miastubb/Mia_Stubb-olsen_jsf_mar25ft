interface ProductRatingProps {
  rating: number;
  reviewCount: number;
  className?: string;
}

export default function ProductRating({
  rating,
  reviewCount,
  className = "",
}: ProductRatingProps) {
  if (reviewCount === 0) {
    return <p className={`text-sm ${className}`}>No ratings yet</p>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span aria-hidden="true" className="text-amber-400">
        ★
      </span>
      <span className="text-sm font-medium">{rating.toFixed(1)} / 5</span>
    </div>
  );
}
