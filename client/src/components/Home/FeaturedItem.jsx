import React, { Fragment } from 'react'
import ButtonFill from '../common/ButtonFill'

export default function FeaturedItem({img, product_title}) {
  return (
    <div className="px-[64px] py-[35px] flex items-center justify-between">
      <div className="flex flex-col w-[50%] gap-4">
        <p className="capitalize">Handcrafted</p>
        <h2 className="text-[48px] font-bold">{product_title}</h2>
        <p className="text-[14px] leading-relaxed">
          Each bracelet is meticulously crafted with love and care, using high-quality materials to ensure durability and style. Explore our collection and find the perfect bracelet to complement your unique style.
        </p>
        <div className="flex items-center justify-center gap-[24px]">
          <div className="w-[50%] h-[120px]">
            <h3 className="text-[20px] font-bold">Good Eneryg</h3>
            <p className="pt-[16px] text-[14px]">
            Our red threaded bracelets symbolize good energy and luck, bringing positivity to your life.
            </p>
          </div>
          <div className="w-[50%] h-[120px]">
            <h3 className="text-[20px] font-bold">Family owned</h3>
            <p className="pt-[16px] text-[14px]">
              As a family-owned business, we take pride in creating each bracelet from scratch.
            </p>
          </div>
        </div>
        <div className="block">
          <ButtonFill text={'Add to cart'}/>
        </div>
      </div>
      <div className="border-[#F4F4F4] h-[640px] w-[640px] flex items-center border-[1px] border-solid border-[#cecece] rounded">
      <img src={img} className="h-[540px] w-[540px] mx-auto rounded-[8px]"  />
      </div>
    </div>
  )
}
