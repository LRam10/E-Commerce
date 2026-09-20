import React from "react";
import { userCartStore } from "../../store/userCartStore";
import { useAddedFeedback } from "../../CustomHooks/useAddedFeedback";

//Same path and timing as the success page's SuccessMark, at button scale. draw-check
//carries a 260ms delay in the config so the tick draws after the label has popped in.
const CheckMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
    <path
      d="M5 12.5l4.2 4.2L19 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="24"
      className="animate-draw-check motion-reduce:animate-none motion-reduce:[stroke-dashoffset:0]"
    />
  </svg>
);

/*
  The one add-to-cart control for product surfaces. Owns the store call and the
  "Added" feedback so no card has to. Classes are split three ways because Tailwind
  resolves a conflict like bg-white vs bg-black by stylesheet order, not by which
  class is listed last - so idle and added must never be present on the element at
  the same time.
    className       layout and anything shared by both states
    idleClassName   colours, and any hover-reveal, for the resting state
    addedClassName  colours for the feedback state - keep it visible if idle hides it
  The button stays enabled during feedback: a buyer who wants two clicks twice.
*/
const AddToCartButton = ({
  item,
  qty = 1,
  className = "",
  idleClassName = "",
  addedClassName = "",
  label = "Add to cart",
  addedLabel = "Added",
}) => {
  const addToCart = userCartStore((state) => state.addToCart);
  const { added, tick, trigger } = useAddedFeedback();

  const onClick = () => {
    if (!item) return;
    addToCart(item, qty);
    trigger();
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`${className} ${added ? addedClassName : idleClassName}`}
      >
        {added ? (
          <span
            key={tick}
            className="flex animate-pop-in items-center gap-[8px] motion-reduce:animate-none"
          >
            <CheckMark />
            {addedLabel}
          </span>
        ) : (
          label
        )}
      </button>
      {/* Screen readers do not see the colour change; this is their copy of it */}
      <span role="status" className="sr-only">
        {added && item ? `${item.name} added to cart` : ""}
      </span>
    </>
  );
};

export default AddToCartButton;
