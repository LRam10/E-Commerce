import React, { Fragment, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Hero from '../components/Home/Hero';
import ValueProps from '../components/Home/ValueProps';
import FeaturedCollection from '../components/Home/FeaturedCollection';
import ProductSpotlight from '../components/Home/ProductSpotlight';
import HandmadeStory from '../components/Home/HandmadeStory';
import { callAPI } from '../utils/utils';

export default function Home() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoItems'],
    queryFn: () => callAPI('/items', 'GET', {
      offset: 0,
      limit: 8,
    }),
    retry: 3,
  });

  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const items = data ?? [];
  const spotlight = items[spotlightIndex % (items.length || 1)];

  const step = (delta) => {
    if (!items.length) return;
    setSpotlightIndex((i) => (i + delta + items.length) % items.length);
  };

  return (
    <Fragment>
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-[15px] px-[12px] py-[15px] sm:gap-[17px] sm:px-[20px] sm:py-[17px]">
        <Hero />
        <ValueProps />
        <FeaturedCollection items={items} isLoading={isPending} error={error} />
        {spotlight && (
          <ProductSpotlight
            item={spotlight}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        )}
        <HandmadeStory />
      </main>
    </Fragment>
  );
}
