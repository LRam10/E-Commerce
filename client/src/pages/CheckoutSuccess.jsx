import React, { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { callAPI } from '../utils/utils'
import { userCartStore } from '../store/userCartStore'
import { useUser } from '../store/useUser'

//Redirect-based methods (iDEAL, Bancontact, card 3DS) hand the buyer back before
//Stripe has finished settling, so `unpaid` on arrival is normal rather than a
//failure. The page waits it out on a backoff instead of calling the order dead.
const POLL_BASE_MS = 1500
const POLL_MAX_MS = 12000
//Eleven reads, ~95s of waiting, then the page stops guessing and says so
const MAX_POLLS = 10
const pollDelay = (attempt) => (attempt >= MAX_POLLS ? false : Math.min(POLL_BASE_MS * 2 ** attempt, POLL_MAX_MS))

const VERIFYING = 'verifying'
const PAID = 'paid'
const EXPIRED = 'expired'
const FAILED = 'failed'

//`payment_status` is the money, `status` is the session. Both have to agree before
//the buyer is told their order is placed
const derivePaymentState = (data) => {
  if (!data) return VERIFYING
  if (data.payment_status === 'paid' || data.payment_status === 'no_payment_required') return PAID
  if (data.status === 'expired') return EXPIRED
  if (data.payment_intent_status === 'canceled') return FAILED
  return VERIFYING
}

const formatAmount = (amount, currency) => {
  if (typeof amount !== 'number') return null
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
  }).format(amount / 100)
}

//Stripe ids are long and the buyer only ever reads one back to support, so the tail
//is the part worth showing large
const orderReference = (sessionId) => sessionId.slice(-12).toUpperCase()

const Shell = ({ children }) => (
  <main className="mx-auto flex min-h-[60vh] w-full max-w-[1440px] flex-col gap-[15px] px-[12px] py-[15px] sm:gap-[17px] sm:px-[20px] sm:py-[17px]">
    <section className="flex flex-1 items-center justify-center rounded-card bg-white p-[17px] sm:p-[25px]">
      {children}
    </section>
  </main>
)

const primaryAction = 'flex h-[56px] w-full max-w-[280px] items-center justify-center rounded-pill bg-sol-red text-[15px] font-medium text-white transition-colors hover:bg-sol-red-dark sm:h-[60px]'
const secondaryAction = 'flex h-[56px] w-full max-w-[280px] items-center justify-center rounded-pill border border-sol-stroke bg-white text-[15px] font-medium text-black transition-colors hover:bg-sol-cream sm:h-[60px]'

const SuccessMark = () => (
  <span className="flex h-[72px] w-[72px] animate-pop-in items-center justify-center rounded-full bg-sol-cream motion-reduce:animate-none sm:h-[88px] sm:w-[88px]">
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px]">
      <path
        d="M5 12.5l4.2 4.2L19 7"
        fill="none"
        stroke="#E90707"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="24"
        className="animate-draw-check motion-reduce:animate-none motion-reduce:[stroke-dashoffset:0]"
      />
    </svg>
  </span>
)

const Spinner = ({ className = 'h-[36px] w-[36px]' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`animate-spin ${className}`}>
    <circle cx="12" cy="12" r="9.5" fill="none" stroke="#ECECEC" strokeWidth="2.25" />
    <path d="M12 2.5a9.5 9.5 0 019.5 9.5" fill="none" stroke="#E90707" strokeWidth="2.25" strokeLinecap="round" />
  </svg>
)

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      //Clipboard is blocked outside a secure context, the reference is on screen anyway
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-pill border border-sol-stroke-light px-[12px] py-[4px] text-[13px] leading-[18px] text-sol-gray transition-colors hover:bg-sol-cream hover:text-sol-ink"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

const SummaryRow = ({ label, delay, children }) => (
  <div
    style={{ animationDelay: delay }}
    className="flex animate-fade-up flex-col gap-[4px] border-b border-sol-stroke-light py-[14px] last:border-b-0 motion-reduce:animate-none sm:flex-row sm:items-center sm:justify-between sm:gap-[16px]"
  >
    <dt className="text-[13px] leading-[18px] text-sol-gray">{label}</dt>
    <dd className="flex items-center gap-[10px] text-[15px] leading-[21px] text-sol-ink">{children}</dd>
  </div>
)

//Loading, verifying, expired, failed and "we can't tell" all render the same frame,
//only the mark, the copy and the actions change
const StatusPanel = ({ mark, eyebrow, title, message, children, actions }) => (
  <div className="flex w-full max-w-[560px] flex-col items-center gap-[24px] py-[48px] text-center sm:gap-[28px] sm:py-[72px]">
    {mark}
    {eyebrow && (
      <p className="animate-fade-up text-[15px] font-medium leading-[21px] tracking-[0.08em] text-sol-red motion-reduce:animate-none">
        {eyebrow}
      </p>
    )}
    <h1 className="animate-fade-up text-[28px] leading-[34px] tracking-[-0.384px] text-sol-ink motion-reduce:animate-none sm:text-[40px] sm:leading-[48px]" style={{ animationDelay: '60ms' }}>
      {title}
    </h1>
    <p className="animate-fade-up text-[15px] leading-[21px] text-sol-gray motion-reduce:animate-none" style={{ animationDelay: '120ms' }}>
      {message}
    </p>
    {children}
    {actions && (
      <div className="flex w-full animate-fade-up flex-col items-center gap-[12px] motion-reduce:animate-none sm:flex-row sm:justify-center" style={{ animationDelay: '320ms' }}>
        {actions}
      </div>
    )}
  </div>
)

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const clearCart = userCartStore((state) => state.clearCart)
  const saveCart = userCartStore((state) => state.saveCart)
  const isAuthenticated = useUser((state) => state.isAuthenticated)

  //Counts answered polls, so the backoff and the "we gave up" copy stay in step
  const [attempts, setAttempts] = useState(0)
  const clearedRef = useRef(false)

  const { data, error, isPending, isFetching, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['checkout-session', sessionId],
    queryFn: () => callAPI('/checkout/get-session-status', 'GET', { session_id: sessionId }),
    //Nothing to ask about without an id, and an empty one is a 400 from the validator
    enabled: Boolean(sessionId),
    //The whole point is the current answer, a cached one is never good enough here
    staleTime: 0,
    refetchInterval: (query) => {
      //A failed request is react-query's retry to own, the poll only paces 'still unpaid'
      if (query.state.status !== 'success') return false
      if (derivePaymentState(query.state.data) !== VERIFYING) return false
      return pollDelay(query.state.dataUpdateCount - 1)
    },
    //Buyers switch to their banking app mid-flow, the answer should be waiting for them
    refetchIntervalInBackground: true,
  })

  useEffect(() => {
    if (!dataUpdatedAt) return
    setAttempts((count) => count + 1)
  }, [dataUpdatedAt])

  const paymentState = derivePaymentState(data)
  const gaveUp = paymentState === VERIFYING && attempts > MAX_POLLS && !isFetching

  useEffect(() => {
    if (paymentState !== PAID || clearedRef.current) return
    clearedRef.current = true
    clearCart()
    //A signed-in cart also lives on the server, and a refresh would otherwise pull the
    //paid-for lines straight back in
    if (isAuthenticated) saveCart().catch(() => {})
  }, [paymentState, isAuthenticated, clearCart, saveCart])

  //No id means this page was reached outside the Stripe redirect, there is no order to show
  if (!sessionId) {
    return (
      <Shell>
        <StatusPanel
          title="We couldn't find that order"
          message="This page needs the link Stripe sends you back on. If you've just paid, your order is safe — check your orders or your email receipt."
          actions={
            <>
              <Link to="/orders" className={primaryAction}>View your orders</Link>
              <Link to="/category" className={secondaryAction}>Keep shopping</Link>
            </>
          }
        />
      </Shell>
    )
  }

  //Never say the payment failed when it was only the status read that failed
  if (error) {
    return (
      <Shell>
        <StatusPanel
          eyebrow="Status unavailable"
          title="We couldn't confirm your order"
          message="Your payment may still have gone through — please don't pay again. Try once more, or check your orders in a minute."
          actions={
            <>
              <button type="button" onClick={() => { setAttempts(0); refetch() }} disabled={isFetching} className={`${primaryAction} disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500`}>
                {isFetching ? 'Checking…' : 'Try again'}
              </button>
              <Link to="/orders" className={secondaryAction}>View your orders</Link>
            </>
          }
        />
      </Shell>
    )
  }

  if (paymentState === EXPIRED) {
    return (
      <Shell>
        <StatusPanel
          eyebrow="Checkout expired"
          title="This checkout timed out"
          message="You haven't been charged. Your bracelets are still waiting — start the order again whenever you're ready."
          actions={
            <>
              <Link to="/checkout" className={primaryAction}>Try checkout again</Link>
              <Link to="/category" className={secondaryAction}>Keep shopping</Link>
            </>
          }
        />
      </Shell>
    )
  }

  if (paymentState === FAILED) {
    return (
      <Shell>
        <StatusPanel
          eyebrow="Payment not completed"
          title="Your payment didn't go through"
          message="No charge was made. This usually means the payment was cancelled or declined by your bank — you can try again with the same or another method."
          actions={
            <>
              <Link to="/checkout" className={primaryAction}>Try again</Link>
              <Link to="/category" className={secondaryAction}>Keep shopping</Link>
            </>
          }
        />
      </Shell>
    )
  }

  //Waited out the full backoff and the payment is still settling. Common for bank
  //redirect methods, so the copy reassures rather than alarms
  if (gaveUp) {
    return (
      <Shell>
        <StatusPanel
          mark={<Spinner className="h-[44px] w-[44px] opacity-60" />}
          eyebrow="Still processing"
          title="Your payment is taking a little longer"
          message="Some payment methods take a few minutes to settle. You'll get an email as soon as it clears — there's no need to pay again."
          actions={
            <>
              <button type="button" onClick={() => { setAttempts(0); refetch() }} disabled={isFetching} className={`${primaryAction} disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500`}>
                {isFetching ? 'Checking…' : 'Check again'}
              </button>
              <Link to="/orders" className={secondaryAction}>View your orders</Link>
            </>
          }
        />
      </Shell>
    )
  }

  if (isPending || paymentState === VERIFYING) {
    return (
      <Shell>
        <div role="status" aria-live="polite" className="contents">
          <StatusPanel
            mark={<Spinner className="h-[44px] w-[44px]" />}
            title={isPending ? 'Checking your payment' : 'Verifying your payment'}
            message="Hold on a moment while we confirm this with your bank. Please don't close this page or pay again."
          />
        </div>
      </Shell>
    )
  }

  const amount = formatAmount(data.amount_total, data.currency)

  return (
    <Shell>
      <div aria-live="polite" className="contents">
        <StatusPanel
          mark={<SuccessMark />}
          eyebrow="Payment successful"
          title="Your order is confirmed"
          message={data.customer_email
            ? `Thank you. A receipt and order details are on their way to ${data.customer_email}.`
            : 'Thank you. A receipt and your order details are on their way by email.'}
          actions={
            <>
              <Link to="/orders" className={primaryAction}>View your orders</Link>
              <Link to="/category" className={secondaryAction}>Keep shopping</Link>
            </>
          }
        >
          <dl className="w-full animate-fade-up rounded-card bg-sol-page px-[17px] py-[6px] text-left motion-reduce:animate-none sm:px-[25px]" style={{ animationDelay: '180ms' }}>
            {amount && (
              <SummaryRow label="Amount paid" delay="200ms">
                <span className="font-medium">{amount}</span>
              </SummaryRow>
            )}
            <SummaryRow label="Order reference" delay="240ms">
              <span className="font-mono text-[14px] tracking-[0.04em]">{orderReference(sessionId)}</span>
              <CopyButton value={sessionId} />
            </SummaryRow>
            <SummaryRow label="What happens next" delay="280ms">
              <span className="text-sol-gray sm:text-right">We're packing your order now. You'll get a shipping confirmation by email.</span>
            </SummaryRow>
          </dl>
        </StatusPanel>
      </div>
    </Shell>
  )
}

export default CheckoutSuccess
