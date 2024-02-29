import type { NextPage } from 'next';
import React, { useEffect, useState, CSSProperties } from "react";

import { useAppContext } from '../context/context';
import FadeLoader from "react-spinners/FadeLoader";

const Home: NextPage = () => {

  const {loading, loadingHandle} = useAppContext();

  useEffect(() => {
    loadingHandle(false);
  }, []); 

  const override: CSSProperties = {
    display: "block",
    top: "50vh",
    margin: "0 auto",
    zIndex: 20,
    height: "0px",
  };

  return (
    <div className="container mx-auto font-strawford">
      <FadeLoader
        color={"#36d7b7"}
        loading={loading}
        cssOverride={override}
        width={5}
        radius={2}
        aria-label="Loading FadeLoader"
        data-testid="loader"
      />
      <div className={' mt-10 mx-auto' + " " + (loading && "opacity-[0.2]")}> 
        <div className='flex justify-center relative'>        
          <div className='z-10 absolute xl:top-[200px] lg:top-[150px] md:top-[500px] sm:top-[400px] top-[200px] '>                    
            <div className='mt-[204px] text-center'>
              <button className='bg-[#F61114] lg:h-[56px] h-[48px] leading-none rounded-[48px]  font-bold mobile-font-18 lg:text-[24px] px-[24px] py-[8px] text-[#FFF] text-center
                hover:-translate-y-0 duration-500 hover:scale-[110%]'>
                  Welcome to this page!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
