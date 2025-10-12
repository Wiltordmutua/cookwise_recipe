interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  disabled = false,
  size = "md"
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const handleClick = (newRating: number) => {
    if (!readonly && !disabled && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly || disabled}
          className={`${sizeClasses[size]} ${
            readonly || disabled ? "cursor-default" : "cursor-pointer hover:scale-110"
          } transition-transform`}
        >
          <svg
            className={`w-full h-full ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
