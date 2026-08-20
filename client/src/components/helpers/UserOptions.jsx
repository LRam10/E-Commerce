import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOutsideClick } from '../../CustomHooks/useClickOutside';

const UserOptions = ({ user, onLogout }) => {
    const [showList, setShowlist] = useState(false);
    const wrapperRef = useRef(null);
    useOutsideClick(() => setShowlist(false), wrapperRef);

    return (
      // Hover alone never opens on touch, so the trigger is a real toggle button
      <div
        ref={wrapperRef}
        className="relative"
        onMouseEnter={() => setShowlist(true)}
        onMouseLeave={() => setShowlist(false)}
      >
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowlist((open) => !open); }}
          aria-expanded={showList}
          aria-haspopup="true"
          aria-label={`Account menu for ${user?.firstName ?? 'your account'}`}
          className="flex h-[40px] items-center gap-[6px] rounded-pill px-[8px] text-sol-ink transition-colors hover:bg-sol-page sm:border sm:border-sol-stroke-light sm:px-[12px]"
        >
          <svg className="h-6 w-6 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 11 14H9a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 10 19Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          {/* The greeting is the first thing to go, it is what overflows a 320px bar */}
          <span className="hidden max-w-[120px] truncate text-[15px] font-medium sm:block">
            Hello, {user && user.firstName}
          </span>
        </button>

        <ul
          className={`absolute right-0 top-[calc(100%+6px)] z-50 min-w-[170px] overflow-hidden rounded-card border border-sol-stroke-light bg-white py-1 text-[15px] shadow-sm ${
            showList ? 'block' : 'hidden'
          }`}
        >
          <li>
            <Link
              to="/orders"
              onClick={() => setShowlist(false)}
              className="block px-4 py-2 text-sol-ink transition-colors hover:bg-sol-cream"
            >
              My Orders
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={onLogout}
              className="block w-full px-4 py-2 text-left text-sol-ink transition-colors hover:bg-sol-cream"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    )
}

export default UserOptions;
