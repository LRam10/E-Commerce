import React, { useState } from 'react'

const TextField = ({type,name, placeholder,onChange, formError}) => {
  const [isRevealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const error = formError && formError[name];

  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={name} className="sr-only capitalize">{name}</label>
      <div className="relative">
        <input
          id={name}
          type={isPassword && isRevealed ? 'text' : type}
          name={name}
          defaultValue={''}
          onChange={onChange}
          autoComplete="on"
          placeholder={placeholder}
          className={`h-[54px] w-full rounded-pill border bg-white text-[15px] leading-[21px] text-sol-ink transition-colors placeholder:text-sol-gray focus:outline-none focus:ring-1 ${
            isPassword ? 'pl-[24px] pr-[52px]' : 'px-[24px]'
          } ${
            error
              ? 'border-sol-red focus:ring-sol-red'
              : 'border-sol-stroke focus:ring-sol-ink'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={isRevealed ? 'Hide password' : 'Show password'}
            onClick={() => setRevealed((prev) => !prev)}
            className="absolute right-[20px] top-1/2 -translate-y-1/2 text-sol-gray transition-colors hover:text-sol-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
              <circle cx="12" cy="12" r="2.75" />
              {isRevealed && <path d="M4 20 20 4" />}
            </svg>
          </button>
        )}
      </div>
      {error ? <p className="px-[24px] text-[13px] leading-[18px] text-sol-red">{error}</p> : ''}
    </div>
  )
}

export default TextField
