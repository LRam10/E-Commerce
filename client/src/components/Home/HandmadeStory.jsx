import React from "react";
import { Link } from "react-router-dom";

const STORY_IMG =
  "https://res.cloudinary.com/doei459zd/image/upload/v1575554850/Bracelet/i38e3nhs5wj2wzsexuky.jpg";

const HandmadeStory = ({ img = STORY_IMG }) => {
  return (
    <section className="rounded-card bg-white p-[15px] lg:p-[25px]">
      <div className="flex flex-col gap-[15px] lg:flex-row">
        <div className="flex flex-1 flex-col justify-between gap-[40px] rounded-card bg-sol-cream px-[20px] py-[32px] sm:px-[25px] sm:py-[40px] lg:gap-20">
          <div className="flex flex-col gap-[24px] sm:gap-[30px]">
            <span className="flex h-[44px] w-[116px] items-center justify-center rounded-pill border border-sol-red text-[16px] font-medium text-sol-red sm:h-[51px] sm:w-[129px] sm:text-[18px]">
              Hand-made
            </span>
            {/* 50px leading reads as airy at 1440 but as broken spacing on a phone */}
            <p className="max-w-[802px] text-[17px] leading-[30px] tracking-[-0.5px] text-sol-red sm:text-[18px] sm:leading-[34px] lg:text-[21px] lg:leading-[50px] lg:tracking-[-1px]">
              Each bracelet takes around 30 to 40 minutes to braid. It takes patience to
              make sure we put value on every knot that goes into it. Each bracelet has a
              different story behind it, start creating yours!
            </p>
          </div>

          <Link
            to="/category/bracelet"
            className="flex h-[56px] w-full max-w-[410px] items-center justify-center rounded-pill border border-sol-stroke bg-sol-red text-[15px] font-medium text-white transition-colors hover:bg-sol-red-dark focus-visible:outline-sol-ink sm:h-[60px]"
          >
            Shop gems
          </Link>
        </div>

        <img
          src={img}
          alt="Artisan wearing a hand-made bracelet"
          className="h-[260px] w-full rounded-card object-cover sm:h-[360px] lg:h-[596px] lg:w-[481px] lg:shrink-0"
        />
      </div>
    </section>
  );
};

export default HandmadeStory;
