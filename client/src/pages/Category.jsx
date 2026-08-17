import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { callAPI } from '../utils/utils'
import Card from '../components/common/Card'

export default function Category() {
  const { category } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: ['categoryItems', category],
    queryFn: () => callAPI(`/items/${category}`, 'GET'),
    retry: 3,
  })
  const title = category.replaceAll('-', ' ');
  return (
    <div className="px-[64px] py-[35px] flex flex-col gap-4">
      <h2 className="text-[48px] font-bold capitalize">{title}</h2>
      {isPending && <p className="text-slate-400">Loading&hellip;</p>}
      {error && (
        <p className="text-[#EB0E3C]">
          We couldn&apos;t load {title} right now. Please try again.
        </p>
      )}
      {!isPending && !error && (
        data.length === 0
          ? <p className="text-slate-400">Nothing in this collection yet.</p>
          : <div className="grid grid-cols-4 gap-4">
              {data.map(item => <Card key={item._id} item={item} />)}
            </div>
      )}
    </div>
  )
}
