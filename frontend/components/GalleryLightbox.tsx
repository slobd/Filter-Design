import type { NextPage } from 'next';
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import Slider from "react-slick";
import moment from "moment";
import Image from 'next/image'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "./common/Button";
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon, ArrowDownTrayIcon, TrashIcon } from "@heroicons/react/24/outline";

export type GalleryLightboxProps = {
  show: boolean;
  onClose: () => void;
  items: any;
  onDelete: (id: any) => void;
  start?: number;
  imageHeight?: number;
};

const GalleryLightbox: NextPage<GalleryLightboxProps> = ({ show, onClose, items, onDelete, start, imageHeight }) => {
  const sliderRef = useRef<Slider>(null);
  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    initialSlide: start,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleDelete = (id: any) => {
    onDelete(id);
    onClose();
  };

  const handleDownload = (url: any) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], { type: "image/jpeg" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "image.jpg";
        link.click();
      }
    };
    xhr.send();
  };

  if (!show) {
    return null;
  }
  
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50">
      <div className="absolute z-10 bg-black opacity-[0.98] top-0 left-0 w-screen h-screen"></div>
      <div className="relative z-50 h-full flex items-center">
        <button
          onClick={onClose}
          className="!z-10 w-8 h-8 absolute bg-white top-5 md:top-10 right-5 top:right-10 cursor-pointer opacity-60 hover:opacity-100 transition rounded-sm p-1.5"
        >
          <XMarkIcon className='w-5'/>
        </button>
        <ArrowLeftIcon
          onClick={handlePrev}
          className="w-5 invert absolute opacity-60 hidden md:inline transition hover:opacity-100 w-12 top-1/2 left-8 -translate-y-1/2 cursor-pointer z-10"/
        >
        <ArrowRightIcon
          onClick={handleNext}
          className="w-5 invert absolute opacity-60 hidden md:inline transition hover:opacity-100 w-12 top-1/2 right-8 -translate-y-1/2 cursor-pointer z-10"/
        >
        <Slider {...settings} className="campaign-slick-slider w-full h-full p-10" ref={sliderRef}>
          {items.map((item: any) => (
            <div
              className="!flex flex-col justify-center items-center px-2 h-full"
              key={item._id}
            >
                <Image
                  src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${item.path}`}
                  loader={({ src, width }) => { return src + "?w=" + width }}
                  quality={50}
                  priority={true}
                  className="max-w-xs md:max-w-md mb-8 rounded-lg object-cover"
                  width={500} height={700}
                  alt=""
                />
              <div className="h-full">
                <Link
                  href={`/creator/${item.campaign.slug}`}
                >
                  <span className="text-white font-medium text-base mb-2 text-center">{item.campaign.name}</span>
                </Link>
                <p className="text-white mb-8">
                  Created at:{" "}
                  {moment(item.createdAt).format("DD.MM.YYYY - hh:mm a")}
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    className="w-32 gap-2"
                    onClick={() =>
                      handleDownload(
                        `${process.env.NEXT_PUBLIC_APP_API_URL}/${item.path}`
                      )
                    }
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 text-gray-black" />
                    <span>Download</span>
                  </Button>
                  <Button
                    className="w-32 gap-2"
                    color="danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    <TrashIcon className="h-5 w-5 text-gray-black" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default GalleryLightbox;
