import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { callAPI } from '../utils/utils'
import ProductCard from '../components/Home/ProductCard'

const SkeletonCard = () => (
  <div className="animate-pulse rounded-card border border-sol-stroke-light bg-white p-4">
    <div className="h-[260px] rounded-card bg-neutral-100 sm:h-[300px]" />
    <div className="mt-6 h-4 w-2/3 rounded bg-neutral-100" />
    <div className="mt-3 h-4 w-1/3 rounded bg-neutral-100" />
  </div>
)

export default function Category() {
  const { category } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: ['categoryItems', category],
    queryFn: () => callAPI(`/items/${category}`, 'GET'),
    retry: 3,
  })
  const title = category.replaceAll('-', ' ');

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[1440px] flex-col gap-[15px] px-[12px] py-[15px] sm:gap-[17px] sm:px-[20px] sm:py-[17px]">
      <section className="rounded-card bg-white p-[17px] sm:p-[25px]">
        <h1 className="text-[24px] capitalize leading-[34px] tracking-[-0.384px] text-sol-ink sm:text-[30px] sm:leading-[64px]">
          {title}
        </h1>

        {isPending && (
          <div className="grid grid-cols-1 gap-[14px] pt-[14px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && (
          <p className="py-16 text-center text-[15px] leading-[21px] text-sol-red">
            We couldn&apos;t load {title} right now. Please try again.
          </p>
        )}

        {!isPending && !error && (
          data.length === 0
            ? (
              <p className="py-16 text-center text-[15px] leading-[21px] text-sol-gray">
                Nothing in this collection yet.
              </p>
            )
            : (
              <div className="grid grid-cols-1 gap-[14px] pt-[14px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.map(item => <ProductCard key={item._id} item={item} />)}
              </div>
            )
        )}
      </section>
    </main>
  )
}
