// Reusable star component — used in form + display
const StarRating = ({ value, onChange, readonly = false, size = "md" }) => {
  const sizes = { sm: "text-sm", md: "text-xl", lg: "text-2xl" };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          className={`${sizes[size]} transition-transform ${
            !readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"
          }`}
        >
          <span className={star <= value ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

export default StarRating;