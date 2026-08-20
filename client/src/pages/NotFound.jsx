import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound({
  code = '404',
  title = "We couldn't find that page",
  message = "The page you're looking for was moved, removed, or never existed.",
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[1440px] flex-col gap-[15px] px-[12px] py-[15px] sm:gap-[17px] sm:px-[20px] sm:py-[17px]">
      <section className="flex flex-1 items-center justify-center rounded-card bg-white p-[17px] sm:p-[25px]">
        <div className="flex max-w-[560px] flex-col items-center gap-[24px] py-[64px] text-center sm:gap-[32px] sm:py-[96px]">
          <p className="text-[15px] font-medium leading-[21px] tracking-[0.08em] text-sol-red">
            {code}
          </p>

          <h1 className="text-[28px] leading-[34px] tracking-[-0.384px] text-sol-ink sm:text-[40px] sm:leading-[48px]">
            {title}
          </h1>

          <p className="text-[15px] leading-[21px] text-sol-gray">
            {message}
          </p>

          <div className="flex w-full flex-col items-center gap-[12px] sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="flex h-[56px] w-full max-w-[280px] items-center justify-center rounded-pill bg-sol-red text-[15px] font-medium text-white transition-colors hover:bg-sol-red-dark sm:h-[60px]"
            >
              Back to home
            </Link>
            <Link
              to="/category"
              className="flex h-[56px] w-full max-w-[280px] items-center justify-center rounded-pill border border-sol-stroke bg-white text-[15px] font-medium text-black transition-colors hover:bg-sol-cream sm:h-[60px]"
            >
              Shop all bracelets
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
