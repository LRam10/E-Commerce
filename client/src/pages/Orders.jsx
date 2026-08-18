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
    <div className="px-[64px] py-[35px] flex flex-col gap-4 h-screen">
      <h2 className="text-[48px] font-bold">Your Orders</h2>
      {!access_token && (
        <p className="text-slate-400">Please sign in to see your orders.</p>
      )}
      {access_token && isPending && <p className="text-slate-400">Loading&hellip;</p>}
      {access_token && error && (
        <p className="text-[#EB0E3C]">
          We couldn&apos;t load your orders right now. Please try again.
        </p>
      )}
      {access_token && !isPending && !error && (
        data.length === 0
          ? <p className="text-slate-400">You haven&apos;t placed any orders yet.</p>
          : <OrdersHistory orders={data} />
      )}
    </div>
  )
}
