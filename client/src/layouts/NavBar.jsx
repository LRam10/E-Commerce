import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useOutsideClick } from '../CustomHooks/useClickOutside';
import { useUser } from '../store/useUser';
import { useAuthUser } from '../CustomHooks/useAuthUser';
import { useAppStore } from '../store/useAppStore';
import { userCartStore, selectCartCount } from '../store/userCartStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import UserOptions from '../components/helpers/UserOptions';

const LOGO = 'https://res.cloudinary.com/doei459zd/image/upload/v1701136032/Bracelet/logo_njdryd.webp';

const SearchIcon = ({ className = 'h-6 w-6' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function NavBar({ categories }) {
  const setSideBar = useAppStore((state) => state.setSideBar);
  const { logOut } = useUser();
  //Badge counts units, so bumping a line's quantity moves it too
  const cartCount = userCartStore(selectCartCount);
  const saveCart = userCartStore((state) => state.saveCart);
  const clearCart = userCartStore((state) => state.clearCart);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const outerRef = useRef();
  const drawerRef = useRef();
  const { pathname } = useLocation();
  useOutsideClick(() => setMoreOpen(false), outerRef);

  const queryClient = useQueryClient();
  const { data: user } = useAuthUser();
  const { mutate: logOutMutation } = useMutation({
    mutationFn: async () => {
      //Order matters, the cart POST is cookie-authenticated so it has to land before logout
      await saveCart();
      clearCart();
      userCartStore.persist.clearStorage();
      await logOut();
    },
    //Drop the cached user so the nav flips back to Sign In, no refetch needed
    onSuccess: () => queryClient.setQueryData(['user'], null),
  });

  const setAutModal = useAppStore((state) => state.setModal);

  //Original destinations: Home routes, About is label-only, Collections opens the categories menu
  const list = [
    { name: 'Home', path: '/' },
    { name: 'About' },
    { name: 'Collections', subNavigation: categories },
  ];

  //Route changes should never leave the drawer hanging over the new page
  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  //Escape closes whichever menu is open, and an open drawer owns the scroll
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      setMobileOpen(false);
      setMoreOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.focus();
    return () => { document.body.style.overflow = previous; };
  }, [mobileOpen]);

  const closeDrawer = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="flex h-[40px] items-center justify-center bg-[#f6be00] sm:h-[48px]">
        <span className="text-[12px] font-bold uppercase leading-[28px] text-white sm:text-[14px]">
          Under maintenance!
        </span>
      </div>

      <nav className="border border-sol-stroke-light bg-white px-[15px] pt-[5px]">
        <div className="flex h-[56px] items-center justify-between gap-[10px] sm:h-[60px]">
          <div className="flex items-center gap-[6px]">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="-ml-[6px] flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-sol-ink transition-colors hover:bg-sol-page md:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <Link to="/" className="shrink-0" aria-label="Sol Bracelets, home">
              <img
                src={LOGO}
                alt="Sol Bracelets"
                className="h-[44px] w-[44px] object-contain sm:h-[57px] sm:w-[57px]"
              />
            </Link>
          </div>

          <ul className="hidden items-center gap-[24px] pt-[15px] md:flex" ref={outerRef}>
            {list.map((item, index) => (
              <li key={index} className="relative flex h-[45px] justify-center">
                {item.subNavigation ? (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setMoreOpen((o) => !o); }}
                      aria-expanded={moreOpen}
                      aria-haspopup="true"
                      className="flex items-center gap-2 pb-[24px] text-[15px] font-medium text-sol-ink"
                    >
                      {item.name}
                      <svg
                        className={`h-3 w-3 transition-transform duration-200 ${moreOpen ? '' : '-rotate-90'}`}
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path stroke="currentColor" d="m1 1 4 4 4-4" />
                      </svg>
                    </button>
                    {moreOpen && item.subNavigation?.length ? (
                      <ul className="absolute right-0 top-[45px] z-50 min-w-[180px] rounded-card border border-sol-stroke-light bg-white py-2 text-[15px] shadow-sm">
                        {item.subNavigation.map((nav) => (
                          <li key={nav._id}>
                            <Link
                              to={`/category/${nav.category_name}`}
                              className="block px-4 py-2 capitalize text-sol-ink transition-colors hover:bg-sol-cream"
                            >
                              {nav.category_name.replace('-', ' ')}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                ) : item.path ? (
                  <Link
                    to={item.path}
                    aria-current={pathname === item.path ? 'page' : undefined}
                    className={`flex items-center pb-[24px] text-[15px] font-medium text-sol-ink ${
                      pathname === item.path ? 'border-b border-sol-stroke' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="flex cursor-pointer items-center pb-[24px] text-[15px] font-medium text-sol-ink">
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-[12px] sm:gap-[16px]">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="hidden h-[42.8px] w-[200px] items-center justify-between gap-[10px] rounded-full border border-sol-stroke-light px-[15px] py-[9px] md:flex lg:w-[282px]"
            >
              <SearchIcon className="h-6 w-6 shrink-0 text-sol-ink" />
              <input
                type="text"
                placeholder="Search"
                aria-label="Search"
                className="sol-input w-full border-0 bg-transparent p-0 text-right text-[15px] font-medium text-sol-gray outline-none placeholder:text-sol-gray"
              />
            </form>

            {user ? (
              <UserOptions user={user} onLogout={() => logOutMutation()} />
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); setAutModal(true); }}
                aria-label="Sign in"
                className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-sol-ink transition-colors hover:bg-sol-page"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 0c-3.9 0-7 2.5-7 5.5V20h14v-2.5c0-3-3.1-5.5-7-5.5Z" />
                </svg>
              </button>
            )}

            <button
              onClick={() => setSideBar(true)}
              className="relative flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-sol-ink transition-colors hover:bg-sol-page"
              aria-label={cartCount > 0 ? `Open cart, ${cartCount} items` : 'Open cart'}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  d="M8 8V6a4 4 0 1 1 8 0v2m-9.5 0h11l1 12.5a1 1 0 0 1-1 1.5H5.5a1 1 0 0 1-1-1.5L5.5 8Z" />
              </svg>
              {cartCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute right-[2px] top-[2px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-sol-red px-[3px] text-[9px] font-semibold leading-none text-sol-page"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu: kept mounted so the slide in and slide out both animate,
          `invisible` keeps its links out of the tab order while closed. */}
      <div
        className={`fixed inset-0 z-[90] transition-[visibility] duration-300 md:hidden ${
          mobileOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          onClick={closeDrawer}
          aria-hidden="true"
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          id="mobile-menu"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          tabIndex={-1}
          className={`absolute inset-y-0 left-0 flex w-[86%] max-w-[320px] flex-col bg-white shadow-2xl outline-none transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-[56px] shrink-0 items-center justify-between border-b border-sol-stroke-light px-[17px]">
            <span className="text-[15px] font-medium text-sol-ink">Menu</span>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close menu"
              className="-mr-[8px] flex h-[40px] w-[40px] items-center justify-center rounded-full text-sol-ink transition-colors hover:bg-sol-page"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-[25px] overflow-y-auto p-[17px]">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex h-[48px] items-center gap-[10px] rounded-pill border border-sol-stroke-light px-[15px]"
            >
              <SearchIcon className="h-5 w-5 shrink-0 text-sol-ink" />
              <input
                type="text"
                placeholder="Search"
                aria-label="Search"
                className="sol-input w-full border-0 bg-transparent p-0 text-[15px] font-medium text-sol-gray outline-none placeholder:text-sol-gray"
              />
            </form>

            <ul className="flex flex-col">
              {list.map((item, index) => (
                <li key={index} className="border-b border-sol-stroke-light">
                  {item.subNavigation ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMobileMoreOpen((o) => !o)}
                        aria-expanded={mobileMoreOpen}
                        className="flex w-full items-center justify-between py-[14px] text-[17px] font-medium text-sol-ink"
                      >
                        {item.name}
                        <svg
                          className={`h-3 w-3 transition-transform duration-200 ${mobileMoreOpen ? '' : '-rotate-90'}`}
                          aria-hidden="true"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path stroke="currentColor" d="m1 1 4 4 4-4" />
                        </svg>
                      </button>
                      {mobileMoreOpen && item.subNavigation?.length ? (
                        <ul className="flex flex-col pb-[14px] pl-[14px]">
                          {item.subNavigation.map((nav) => (
                            <li key={nav._id}>
                              <Link
                                to={`/category/${nav.category_name}`}
                                onClick={closeDrawer}
                                className="block py-[10px] text-[15px] capitalize text-sol-gray transition-colors hover:text-sol-ink"
                              >
                                {nav.category_name.replace('-', ' ')}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  ) : item.path ? (
                    <Link
                      to={item.path}
                      onClick={closeDrawer}
                      aria-current={pathname === item.path ? 'page' : undefined}
                      className={`block py-[14px] text-[17px] font-medium text-sol-ink ${
                        pathname === item.path ? 'text-sol-red' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="block py-[14px] text-[17px] font-medium text-sol-ink">
                      {item.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {user ? (
              <Link
                to="/orders"
                onClick={closeDrawer}
                className="flex h-[52px] items-center justify-center rounded-pill border border-sol-stroke text-[15px] font-medium text-black transition-colors hover:bg-sol-cream"
              >
                My orders
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => { closeDrawer(); setAutModal(true); }}
                className="flex h-[52px] items-center justify-center rounded-pill bg-sol-red text-[15px] font-medium text-white transition-colors hover:bg-sol-red-dark focus-visible:outline-sol-ink"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
