import FeaturedItem from '../components/Home/FeaturedItem';
import PreviewList from '../components/Home/PreviewList';
import Hero from '../components/Home/Hero';
import React, { Fragment} from 'react'
import { useQuery } from '@tanstack/react-query';
export default function Home() {
  const { isPending, error, data} = useQuery({
    queryKey:['repoItems'],
    queryFn:()=>fetch('http://localhost:3000/items?offset=0&limit=4').then(res => res.json())
  })
  return (
    <Fragment>
      <Hero />
      <FeaturedItem
      product_title={'Lucky Elephant'} 
      img={'https://res.cloudinary.com/doei459zd/image/upload/v1575554850/Bracelet/i38e3nhs5wj2wzsexuky.jpg'}/>
      <div className="px-[64px] py-[35px] flex flex-col gap-4">
      <h2 className="text-[48px] font-bold capitalize">Trending now</h2>
      <div className="grid grid-cols-4 gap-4">
        <PreviewList items={data} isLoading={isPending} />
      </div>
      </div>
    </Fragment>
  )
}
