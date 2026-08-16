import React from "react";
import {Link} from 'react-router-dom';
import ButtonFill from "../common/ButtonFill";
import ButtonOutline from "../common/ButtonOutline";
const Banner = () => {
  const backgoundUrl = 'https://res.cloudinary.com/doei459zd/image/upload/v1584471489/Category/hilicwsjqvlx1l9vn62g.jpg'
  return (
    <div className="bg-cover min-h-[900px] bg-blend-color flex justify-center items-center"
      style={{backgroundImage:`url(${backgoundUrl})`,backgroundColor:`#00000091`}} >
      
      <div className=" text-center flex flex-col gap-[24px]">
        <h1 className="text-[54px] text-white font-bold">
            Explore Lucky Threaded Bracelet
        </h1>
        <p className="text-[16px] font-bold text-white leading-4">
        Explore our collection of beautifully crafted threaded bracelets, designed to bring positive energy and good luck into your life.
        </p>
        <div className="flex items-center justify-center gap-3 text-white">
            <ButtonFill text={'Shop'} />
            <ButtonOutline text={'Learn More'} color={'#fff'}/>
        </div>
      </div>
    </div>
  );
};

export default Banner;
