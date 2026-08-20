import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

const CARD_WIDTH = "w-[260px] sm:w-[300px] lg:w-[370px]";

const SkeletonCard = () => (
  <div className={`${CARD_WIDTH} h-[420px] shrink-0 animate-pulse rounded-card border border-sol-stroke-light p-4 lg:h-[456px]`}>
    <div className="h-[260px] rounded-card bg-neutral-100 sm:h-[300px]" />
    <div className="mt-6 h-4 w-2/3 rounded bg-neutral-100" />
    <div className="mt-3 h-4 w-1/3 rounded bg-neutral-100" />
  </div>
);

const FeaturedCollection = ({ items, isLoading, error }) => {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(100);

  // The thumb has to reflect how much of the track is actually visible, which
  // changes with the card width at every breakpoint.
  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const visibleRatio = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setThumbWidth(Math.min(100, Math.max(12, visibleRatio * 100)));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, items, isLoading]);

  return (
    <section className="rounded-card bg-white py-[20px] pl-[17px] sm:py-[25px] sm:pl-[25px]">
      <div className="flex flex-col gap-[28px] sm:gap-[41px]">
        <div className="flex flex-col gap-[14px]">
          <div className="flex flex-col items-start justify-between gap-[14px] pr-[17px] sm:flex-row sm:items-center sm:pr-[25px]">
            <h2 className="text-[24px] leading-[34px] tracking-[-0.384px] text-sol-ink sm:text-[30px] sm:leading-[64px]">
              Featured collection
            </h2>
            <Link
              to="/category/bracelet"
              className="flex h-[50px] shrink-0 items-center gap-[15px] rounded-pill border border-sol-stroke px-[15px] text-[15px] font-medium text-black transition-colors hover:bg-sol-cream sm:h-[56px]"
            >
              View all
              <svg viewBox="0 0 26 26" className="h-[26px] w-[26px]" aria-hidden="true">
                <path d="M4 13h18M16 7l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {error ? (
            <p className="py-16 pr-[17px] text-center text-[15px] text-sol-gray sm:pr-[25px]">
              We couldn&apos;t load the collection right now.
            </p>
          ) : (
            <div
              ref={trackRef}
              onScroll={measure}
              tabIndex={0}
              role="region"
              aria-label="Featured collection, scrollable"
              className="flex snap-x snap-mandatory gap-[14px] overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {isLoading
                ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                : (items ?? []).map((item) => (
                    <div key={item._id} className={`${CARD_WIDTH} shrink-0 snap-start`}>
                      <ProductCard item={item} />
                    </div>
                  ))}
            </div>
          )}
        </div>

        <div className="mr-[17px] h-[2px] rounded-[4px] bg-sol-track sm:mr-[25px]">
          <div
            className="h-[2px] rounded-[4px] bg-sol-stroke transition-[margin,width] duration-150"
            style={{ width: `${thumbWidth}%`, marginLeft: `${progress * (100 - thumbWidth)}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
