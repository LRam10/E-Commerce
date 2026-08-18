import { useState } from 'react';
import FeaturedItem from '../components/Home/FeaturedItem';
import Cart from '../components/pages/Cart';
import PreviewList from '../components/Home/PreviewList';
import Hero from '../components/Home/Hero';
import React, { Fragment} from 'react'
import { useQuery } from '@tanstack/react-query';
import { callAPI } from '../utils/utils';
export default function Home() {
  const [sideBar, setSideBar] = useState(false);
  const { isPending, error, data} = useQuery({
    queryKey:['repoItems'],
    queryFn:()=> callAPI('/items','GET', {
      offset:0,
      limit:4
    }),
    retry:3,
  })
  return (
    <Fragment>
      <Hero />
      {sideBar && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
          <button onClick={()=> setSideBar(false)} className="text-white text-2xl font-bold">
            Close
          </button>
          <Cart sideBar={sideBar} setSideBar={setSideBar} />
        </div>
      )}
      <FeaturedItem
      product_title={'Lucky Elephant'} 
      img={'https://res.cloudinary.com/doei459zd/image/upload/v1575554850/Bracelet/i38e3nhs5wj2wzsexuky.jpg'}/>
      <div className="px-[64px] py-[35px] flex flex-col gap-4">
      <h2 className="text-[48px] font-bold capitalize">Trending now</h2>
      <div className="grid grid-cols-4 gap-4">
        <PreviewList items={data} isLoading={isPending} error={error} />
      </div>
      </div>
    </Fragment>
  )
}
