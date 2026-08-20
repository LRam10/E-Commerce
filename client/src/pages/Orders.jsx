import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { callAPI } from '../utils/utils'
import { useUser } from '../store/useUser'
import OrdersHistory from '../components/Order/Orders'

export default function Orders() {
  const access_token = useUser((state) => state.access_token);
  const { isPending, error, data } = useQuery({
    queryKey: ['orders', { access_token: access_token }],
    queryFn: () => callAPI('/orders', 'GET', null, 'json', null, {
      'x-auth-token': access_token
    }),
    retry: 2,
    enabled: !!access_token,
  })

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[1440px] flex-col gap-[15px] px-[12px] py-[15px] sm:gap-[17px] sm:px-[20px] sm:py-[17px]">
      <section className="rounded-card bg-white p-[17px] sm:p-[25px]">
        <h1 className="text-[24px] leading-[34px] tracking-[-0.384px] text-sol-ink sm:text-[30px] sm:leading-[64px]">Your Orders</h1>

        {!access_token && (
          <p className="py-16 text-center text-[15px] leading-[21px] text-sol-gray">
            Please sign in to see your orders.
          </p>
        )}
        {access_token && isPending && (
          <p className="py-16 text-center text-[15px] leading-[21px] text-sol-gray">Loading&hellip;</p>
        )}
        {access_token && error && (
          <p className="py-16 text-center text-[15px] leading-[21px] text-sol-red">
            We couldn&apos;t load your orders right now. Please try again.
          </p>
        )}
        {access_token && !isPending && !error && (
          data.length === 0
            ? (
              <p className="py-16 text-center text-[15px] leading-[21px] text-sol-gray">
                You haven&apos;t placed any orders yet.
              </p>
            )
            : <OrdersHistory orders={data} />
        )}
      </section>
    </main>
  )
}
