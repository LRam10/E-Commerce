import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { callAPI } from "../../utils/utils";
import { userCartStore, MAX_QTY } from "../../store/userCartStore";
import { useAppStore } from "../../store/useAppStore";
import ProductCard from "../Home/ProductCard";

// Storefront-level copy. The item schema carries no per-product spec fields, so
// these read the same for every bracelet until the API starts sending them.
const KEY_BENEFITS = [
  "Diameter 5.5 cm-9.5 cm approx.",
  "1.5mm in thickness",
  "Nylon",
  "Square braided",
];
const GOOD_FOR = "Perfect for those seeking protection and strenght";

const Stars = ({ rating = 0 }) => (
  <div className="flex items-center gap-[2px]" aria-label={`${rating} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={`h-4 w-4 ${i < Math.round(rating) ? "fill-black" : "fill-neutral-300"}`}
      >
        <path d="M8 1.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12l-4.2 2.2.8-4.7L1.2 6.2l4.7-.7z" />
      </svg>
    ))}
  </div>
);

const Check = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0 text-sol-gray">
    <path
      d="M4 10.5 8 14.5 16 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Skeleton = () => (
  <section className="flex animate-pulse flex-col gap-[15px] rounded-card bg-white p-[15px] lg:flex-row lg:p-[17px]">
    <div className="h-[320px] flex-1 rounded-panel bg-neutral-100 lg:h-[560px]" />
    <div className="flex flex-1 flex-col gap-[18px] rounded-panel border border-sol-stroke-light p-[20px] lg:p-[32px]">
      <div className="h-4 w-1/3 rounded bg-neutral-100" />
      <div className="h-10 w-3/4 rounded bg-neutral-100" />
      <div className="h-8 w-1/4 rounded bg-neutral-100" />
      <div className="h-20 w-full rounded bg-neutral-100" />
      <div className="mt-auto h-[60px] w-full rounded-pill bg-neutral-100" />
      <div className="h-[60px] w-full rounded-pill bg-neutral-100" />
    </div>
  </section>
);

const InfoItem = () => {
  const { name } = useParams();

  const {
    isPending,
    error,
    data: item,
  } = useQuery({
    queryKey: ["item", name],
    queryFn: () => callAPI(`/items/item/${encodeURIComponent(name)}`, "GET"),
  });

  // Ratings come from the same endpoint the review list uses, keyed by item id
  const { data: reviews } = useQuery({
    queryKey: ["reviews", item?._id],
    queryFn: () => callAPI(`/reviews/${item._id}`, "GET"),
    enabled: Boolean(item?._id),
  });

  // Same key as the collection page, so a visit here warms that cache too
  const { data: categoryItems } = useQuery({
    queryKey: ["categoryItems", item?.category],
    queryFn: () => callAPI(`/items/${item.category}`, "GET"),
    enabled: Boolean(item?.category),
  });

  const cartItems = userCartStore((state) => state.cartItems);
  const addToCart = userCartStore((state) => state.addToCart);
  const setSideBar = useAppStore((state) => state.setSideBar);

  const [qty, setQty] = useState(1);

  const onMinusItem = () => setQty((prev) => (prev === 1 ? prev : prev - 1));
  const onPlusItem = () => setQty((prev) => (prev === MAX_QTY ? prev : prev + 1));

  // The store owns the merge: an item already in the cart gets topped up
  const onAddToCart = () => {
    if (!item) return;
    addToCart(item, qty);
    setSideBar(true);
  };

  if (isPending) {
    return (
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-[15px] px-[12px] py-[15px] sm:gap-[17px] sm:px-[20px] sm:py-[17px]">
        <Skeleton />
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-[1440px] flex-col gap-[15px] px-[12px] py-[15px] sm:px-[20px] sm:py-[17px]">
        <section className="flex flex-1 flex-col items-center justify-center gap-[14px] rounded-card bg-white p-[40px] text-center">
          <h1 className="text-[24px] leading-[34px] tracking-[-0.384px] text-sol-ink">
            {error ? "We couldn't load this product" : "Product not found"}
          </h1>
          <p className="text-[15px] leading-[21px] text-sol-gray">
            {error ? "Please try again in a moment." : "It may have been renamed or removed."}
          </p>
          <Link
            to="/category"
            className="flex h-[56px] items-center justify-center rounded-pill border border-sol-stroke px-[25px] text-[15px] font-medium text-sol-ink transition-colors hover:bg-sol-cream"
          >
            Shop all bracelets
          </Link>
        </section>
      </main>
    );
  }

  const reviewCount = reviews?.length ?? 0;
  const averageRating = reviewCount
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewCount
    : 0;
  const [dollars, cents] = Number(item.price ?? 0).toFixed(2).split(".");
  const recommended = (categoryItems ?? [])
    .filter((candidate) => candidate._id !== item._id)
    .slice(0, 8);
  const inCartQty = Number(cartItems.find((cartItem) => cartItem._id === item._id)?.qty) || 0;

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-[15px] px-[12px] py-[15px] sm:gap-[17px] sm:px-[20px] sm:py-[17px]">
      <section className="flex flex-col gap-[15px] rounded-card bg-white p-[15px] lg:flex-row lg:p-[17px]">
        <div className="flex flex-1 items-center justify-center rounded-panel bg-white p-[24px] lg:p-[40px]">
          <img
            src={item.img_url}
            alt={item.name}
            className="max-h-[300px] max-w-full object-contain sm:max-h-[420px] lg:max-h-[520px]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-[22px] rounded-panel border border-sol-stroke-light p-[20px] lg:p-[32px]">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-[6px] text-[14px] leading-[19px]">
            <Link to="/" className="text-sol-ink hover:underline">Home</Link>
            <span className="text-sol-gray">-</span>
            <Link to={`/category/${item.category}`} className="capitalize text-sol-ink hover:underline">
              {item.category?.replace("-", " ")}
            </Link>
            <span className="text-sol-gray">-</span>
            <span className="text-sol-gray">{item.name}</span>
          </nav>

          <div className="flex flex-col gap-[10px]">
            <h1 className="text-[clamp(1.75rem,1.25rem+2.2vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.04em] text-sol-ink">
              {item.name}
            </h1>
            <div className="flex items-center gap-[10px]">
              <Stars rating={averageRating} />
              <span className="text-[13px] leading-[18px] text-sol-gray">
                {reviewCount > 0
                  ? `${reviewCount} ${reviewCount === 1 ? "Review" : "Reviews"}`
                  : "No reviews yet"}
              </span>
            </div>
          </div>

          <div className="flex items-start">
            <span className="text-[clamp(1.75rem,1.4rem+1.6vw,2.25rem)] leading-[1.1] tracking-[-0.03em] text-sol-ink">
              &#36;{dollars}.
            </span>
            <span className="pt-[4px] text-[15px] leading-[1.1] text-sol-ink">{cents}</span>
          </div>

          <p className="text-[15px] leading-[21px] text-sol-gray">{item.description}</p>

          <div className="flex flex-col gap-[10px]">
            <h2 className="text-[15px] font-medium leading-[21px] text-sol-ink">Key benefits</h2>
            <ul className="flex flex-col gap-[8px]">
              {KEY_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-[10px] text-[14px] leading-[21px] text-sol-gray">
                  <Check />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-[6px]">
            <h2 className="text-[15px] font-medium leading-[21px] text-sol-ink">Good for</h2>
            <p className="text-[14px] leading-[21px] text-sol-gray">{GOOD_FOR}</p>
          </div>

          <div className="flex items-center gap-[16px]">
            <span className="text-[14px] leading-[21px] text-sol-gray">Quantity</span>
            <div className="flex h-[44px] items-center gap-[4px] rounded-pill border border-sol-stroke px-[8px]">
              <button
                type="button"
                onClick={onMinusItem}
                aria-label="Decrease quantity"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[18px] leading-none text-sol-ink transition-colors hover:bg-sol-page disabled:text-sol-track"
                disabled={qty === 1}
              >
                &#8722;
              </button>
              <span aria-live="polite" className="min-w-[24px] text-center text-[15px] text-sol-ink">
                {qty}
              </span>
              <button
                type="button"
                onClick={onPlusItem}
                aria-label="Increase quantity"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[18px] leading-none text-sol-ink transition-colors hover:bg-sol-page disabled:text-sol-track"
                disabled={qty === MAX_QTY}
              >
                &#43;
              </button>
            </div>
            {inCartQty > 0 && (
              <button
                type="button"
                onClick={() => setSideBar(true)}
                className="text-[13px] leading-[18px] text-sol-gray underline underline-offset-2 transition-colors hover:text-sol-ink"
              >
                {inCartQty} already in cart
              </button>
            )}
          </div>

          <div className="flex flex-col gap-[12px]">
            <button
              type="button"
              onClick={onAddToCart}
              className="h-[56px] w-full rounded-pill border border-sol-stroke bg-white text-[15px] font-medium text-sol-ink transition-colors hover:bg-sol-cream sm:h-[60px]"
            >
              Add to cart
            </button>
            {/* Checkout is still disabled storewide, so Buy now stays off until it lands */}
            <button
              type="button"
              disabled
              title="Coming soon"
              className="h-[56px] w-full cursor-not-allowed rounded-pill border border-sol-stroke bg-gray-200 text-[15px] font-medium text-gray-500 sm:h-[60px]"
            >
              Buy now
            </button>
          </div>

          <div className="flex items-center gap-[10px] text-[13px] leading-[18px] text-sol-gray">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1.5 6.5h11v9h-11z" />
              <path d="M12.5 9.5h4l3 3v3h-7z" />
              <circle cx="6" cy="17" r="1.6" />
              <circle cx="16.5" cy="17" r="1.6" />
            </svg>
            Free US Delivery &amp; Easy Returns with our Performance Guarantee
          </div>
        </div>
      </section>

      {recommended.length > 0 && (
        <section className="flex flex-col gap-[20px] rounded-card bg-white p-[17px] sm:p-[25px]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[20px] leading-[28px] tracking-[-0.384px] text-sol-ink sm:text-[24px]">
              We can also recommend
            </h2>
            <Link
              to={`/category/${item.category}`}
              className="flex h-[44px] shrink-0 items-center gap-[10px] rounded-pill border border-sol-stroke px-[18px] text-[14px] font-medium text-sol-ink transition-colors hover:bg-sol-cream sm:h-[50px] sm:text-[15px]"
            >
              View all
              <svg viewBox="0 0 26 26" className="h-[20px] w-[20px]" aria-hidden="true">
                <path d="M4 13h18M16 7l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="-mx-[17px] flex snap-x snap-mandatory gap-[14px] overflow-x-auto px-[17px] pb-[6px] sm:-mx-[25px] sm:px-[25px]">
            {recommended.map((recommendation) => (
              <div
                key={recommendation._id}
                className="w-[260px] shrink-0 snap-start sm:w-[300px] lg:w-[330px]"
              >
                <ProductCard item={recommendation} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default InfoItem;
