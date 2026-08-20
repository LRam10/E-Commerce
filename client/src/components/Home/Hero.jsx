import React from "react";
import { Link } from "react-router-dom";

const HERO_IMG =
  "https://res.cloudinary.com/doei459zd/image/upload/v1584471489/Category/hilicwsjqvlx1l9vn62g.jpg";

const Hero = ({ img = HERO_IMG }) => {
  return (
    <section className="flex flex-col items-stretch gap-[15px] rounded-card bg-white p-[15px] lg:flex-row lg:p-[17px]">
      <div className="flex flex-1 items-center justify-center rounded-panel bg-sol-red px-[20px] py-[48px] sm:px-[32px] sm:py-[64px] lg:py-[80px]">
        <div className="flex max-w-[644px] flex-col items-center gap-[32px] text-center sm:gap-[44px] lg:gap-[57px]">
          {/* Fluid from 28px at 320 up to the 50px Figma size, reached at ~1010px */}
          <h1 className="max-w-[556px] text-[clamp(1.75rem,1.1rem+3.2vw,3.125rem)] leading-[1.16] tracking-[-0.05em] text-white">
            Threaded with love born with style and made for you
          </h1>

          <div className="flex w-full flex-col items-center gap-[32px] sm:gap-[44px] lg:gap-[57px]">
            <p className="max-w-[452px] text-[15px] leading-[21px] text-white">
              Unique, high-quality and hand-made bracelets for you.
            </p>
            <Link
              to="/category"
              className="flex h-[56px] w-full max-w-[392px] items-center justify-center rounded-pill border border-sol-stroke bg-white text-[15px] font-medium text-black transition-colors hover:bg-sol-cream focus-visible:outline-white sm:h-[60px]"
            >
              Shop All
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <img
          src={img}
          alt="Model wearing a hand-made threaded bracelet"
          className="h-full min-h-[260px] w-full rounded-panel object-cover sm:min-h-[380px] lg:min-h-[767px]"
        />
      </div>
    </section>
  );
};

export default Hero;
