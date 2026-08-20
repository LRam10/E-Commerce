import React from "react";

const IconBadge = ({ children }) => (
  <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border border-sol-red text-sol-red sm:h-[70px] sm:w-[70px]">
    {children}
  </span>
);

const VALUES = [
  {
    title: "Family owned",
    body: "By purchasing from our family-owned business, you become a part of something greater — supporting local artisans and small businesses.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[25px] w-[25px]" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 9.5V20h14V9.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 20v-5h4v5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Unmatched craftsmanship",
    body: "Our family has honed the art of handcrafting threaded bracelets over generations, using traditional techniques passed down through the years.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[25px] w-[25px]" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Exceptional customer service",
    body: "We prioritize building genuine relationships with our customers. When you choose to buy a bracelet from us, you can expect personalized attention.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[25px] w-[25px]" aria-hidden="true">
        <path d="M4 13a8 8 0 0 1 16 0" strokeLinecap="round" />
        <rect x="2.5" y="13" width="4" height="6" rx="1.5" />
        <rect x="17.5" y="13" width="4" height="6" rx="1.5" />
        <path d="M20 19a3 3 0 0 1-3 3h-2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const ValueProps = () => {
  return (
    // Three columns only from lg, below that a 236px column cannot hold the copy
    <section className="grid grid-cols-1 gap-[17px] lg:grid-cols-3">
      {VALUES.map(({ title, body, icon }) => (
        <div
          key={title}
          className="flex flex-col items-center gap-[20px] rounded-card bg-white p-[24px] text-center sm:gap-[24px] sm:p-[30px]"
        >
          <IconBadge>{icon}</IconBadge>
          <div className="flex flex-col items-center gap-[10px]">
            {/* 50px leading is a single-line desktop value, it doubles the box once the title wraps */}
            <h3 className="text-[21px] leading-[28px] tracking-[-1px] text-black lg:leading-[50px]">
              {title}
            </h3>
            <p className="max-w-[281px] text-[14px] leading-[21px] text-sol-gray">{body}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ValueProps;
