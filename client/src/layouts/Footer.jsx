import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LOGO = 'https://res.cloudinary.com/doei459zd/image/upload/v1701136032/Bracelet/logo_njdryd.webp';

const QUICK_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Bracelets', path: '/category/bracelet' },
  { name: 'Fashion Jewerly', path: '/category/fashion-jewelry' },
  { name: 'Log in', path: '/' },
  { name: 'Sign up', path: '/' },
];

const PART_OF_US = [
  { name: 'About us', path: '/' },
  { name: 'Legal', path: '/' },
];

const LinkColumn = ({ heading, items }) => (
  <div className="flex w-full flex-col gap-[11px] sm:w-[200px]">
    <h3 className="font-display text-[16px] font-medium leading-[18px] tracking-[0.18px] text-white">
      {heading}
    </h3>
    <ul className="flex flex-col gap-[11px]">
      {items.map(({ name, path }) => (
        <li key={name}>
          <Link
            to={path}
            className="text-[15px] leading-[21px] text-white/70 transition-colors hover:text-white focus-visible:outline-white"
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const ContactRow = ({ icon, children }) => (
  <li className="flex items-center gap-[10px]">
    <span className="shrink-0 text-white">{icon}</span>
    <span className="break-words text-[15px] leading-[21px] text-white/70">{children}</span>
  </li>
);

const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer className="rounded-t-[20px] bg-black px-[20px] py-[32px] sm:px-[35px] sm:py-[48px]">
      <div className="flex flex-col gap-[34px]">
        <div className="flex flex-col justify-between gap-[24px] border-b border-white/[0.37] pb-[32px] sm:pb-[50px] lg:flex-row lg:items-start lg:gap-8">
          <div className="flex flex-col gap-[13px]">
            <h2 className="text-[26px] leading-[32px] tracking-[-0.384px] text-white sm:text-[30px] sm:leading-[34px]">
              Newsletter
            </h2>
            <p className="text-[15px] leading-[21px] text-white">
              Sunbscribe and get 10% OFF your first order
            </p>
          </div>

          {/* Side by side needs ~470px, so the pair stacks until sm */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full flex-col gap-[15px] sm:flex-row sm:items-center sm:gap-[17px] lg:w-[470px]"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              aria-label="Your email"
              className="sol-input h-[60px] w-full rounded-pill border-0 bg-white/[0.16] px-[20px] text-[15px] font-medium text-white outline-none placeholder:text-white/60 focus-visible:outline-white sm:flex-1 lg:w-[259px] lg:flex-none"
            />
            <button
              type="submit"
              className="h-[60px] w-full shrink-0 rounded-pill bg-sol-red px-10 text-[15px] font-medium text-white transition-colors hover:bg-sol-red-dark focus-visible:outline-white sm:w-auto lg:w-[194px]"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="flex flex-col justify-between gap-[32px] border-b border-white/[0.37] pb-[30px] lg:flex-row lg:items-start lg:gap-10">
          <img
            src={LOGO}
            alt="Sol Bracelets"
            className="h-[96px] w-[74px] shrink-0 object-contain sm:h-[123px] sm:w-[95px]"
          />

          <div className="flex flex-wrap gap-x-[40px] gap-y-[32px] sm:gap-x-[66px] lg:gap-y-10">
            <LinkColumn heading="Quick links" items={QUICK_LINKS} />
            <LinkColumn heading="Be a part of us" items={PART_OF_US} />

            <div className="flex w-full flex-col gap-[11px] sm:w-[200px]">
              <h3 className="font-display text-[16px] font-medium leading-[18px] tracking-[0.18px] text-white">
                Get in touch
              </h3>
              <ul className="flex flex-col gap-[11px]">
                <ContactRow
                  icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="2.25" y="4.5" width="19.5" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="m3 6 9 6 9-6" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  }
                >
                  Solbracelet@gmail.com
                </ContactRow>
                <ContactRow
                  icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2.25 5.25c0 8 6.5 14.5 14.5 14.5l2.5-3-4-2.5-2 2a13 13 0 0 1-5.5-5.5l2-2-2.5-4-3 2.5Z"
                        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  }
                >
                  8324554305
                </ContactRow>
                <ContactRow
                  icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 21.5s7.5-6 7.5-11a7.5 7.5 0 0 0-15 0c0 5 7.5 11 7.5 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      <circle cx="12" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  }
                >
                  Houston, TX 77040
                </ContactRow>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-[15px] leading-[21px] text-white/70">
          &copy;2025. Sol Bracelets. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
