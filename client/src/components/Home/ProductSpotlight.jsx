import React from "react";
import { Link } from "react-router-dom";
import { userCartStore } from "../../store/userCartStore";

const Arrow = ({ label, dark, flip, onClick }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`flex h-[44px] w-[44px] items-center justify-center rounded-[80px] border border-sol-stroke transition-colors sm:h-[50px] sm:w-[50px] ${
      dark ? "bg-black text-white hover:bg-neutral-800" : "bg-white text-black hover:bg-sol-cream"
    }`}
  >
    <svg viewBox="0 0 26 26" className={`h-[24px] w-[24px] sm:h-[26px] sm:w-[26px] ${flip ? "rotate-180" : ""}`} aria-hidden="true">
      <path d="M4 13h18M16 7l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

const ProductSpotlight = ({ item, onPrev, onNext }) => {
  const { addToCart } = userCartStore();
  const [dollars, cents] = Number(item?.price ?? 0).toFixed(2).split(".");

  return (
    <section className="flex flex-col items-stretch gap-[15px] rounded-card bg-white p-[15px] lg:flex-row lg:p-[25px]">
      <div className="relative flex w-full flex-1 items-center justify-center rounded-card bg-sol-blush px-[20px] pb-[92px] pt-[40px] sm:pb-[100px] sm:pt-[64px]">
        <img
          src={item?.img_url}
          alt={item?.name}
          className="max-h-[240px] max-w-full object-contain sm:max-h-[340px] lg:max-h-[420px]"
        />
        <div className="absolute bottom-[20px] left-1/2 flex -translate-x-1/2 gap-[9px] sm:bottom-[25px]">
          <Arrow label="Previous product" flip onClick={onPrev} />
          <Arrow label="Next product" dark onClick={onNext} />
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col justify-between gap-[40px] rounded-card bg-sol-red p-[20px] sm:p-[25px] lg:gap-16">
        <div className="flex flex-col gap-[28px] sm:gap-[38px]">
          <div className="flex flex-col items-start justify-between gap-[20px] sm:flex-row sm:gap-8">
            {/* Fluid from 28px up to the 45px Figma size */}
            <h2 className="max-w-full text-[clamp(1.75rem,1.2rem+2.4vw,2.8125rem)] leading-[120%] tracking-[-0.89px] text-white sm:max-w-[280px] lg:max-w-[234px]">
              {item?.name}
            </h2>
            <Link
              to="/category/bracelet"
              className="flex h-[50px] shrink-0 items-center gap-[15px] rounded-pill border border-white px-[15px] text-[15px] font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-white sm:h-[56px]"
            >
              More like this
              <svg viewBox="0 0 26 26" className="h-[26px] w-[26px]" aria-hidden="true">
                <path d="M4 13h18M16 7l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* 106px would blow past a 320px viewport, so the pair scales together */}
          <div className="flex items-start">
            <span className="text-[clamp(3.25rem,1.6rem+8.2vw,6.625rem)] leading-[1.12] tracking-[-1.78px] text-white">
              &#36;{dollars}
            </span>
            <span className="pt-2 text-[clamp(1.625rem,0.8rem+4.1vw,3.1875rem)] leading-[1.12] tracking-[-0.85px] text-white opacity-50">
              {cents}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-[15px] sm:flex-row">
          <button
            onClick={() => item && addToCart(item)}
            className="h-[56px] flex-1 rounded-pill border border-sol-stroke bg-white text-[15px] font-medium text-black transition-colors hover:bg-sol-cream focus-visible:outline-white sm:h-[60px]"
          >
            Add to cart
          </button>
          <Link
            to="/orders"
            className="flex h-[56px] flex-1 items-center justify-center rounded-pill border border-white bg-black text-[15px] font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-white sm:h-[60px]"
          >
            Buy now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductSpotlight;
