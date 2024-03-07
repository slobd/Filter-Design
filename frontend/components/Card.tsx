import type { NextPage } from 'next';
import { useRef, useState } from "react";
import Image from 'next/image'
import domtoimage from "dom-to-image";
import { FaLinkedin, FaWhatsappSquare, FaFacebookSquare } from "react-icons/fa";
import { FaXTwitter  } from "react-icons/fa6";
import { ArrowDownTrayIcon, ArrowUpTrayIcon, CameraIcon, ArrowDownLeftIcon } from "@heroicons/react/24/outline";

export type CardProps = {
  dir?: string;
  overlay: string;
};

const Card: NextPage<CardProps> = ({ dir = "row", overlay }) => {
  const domRef = useRef<any>();
  const fileRef = useRef<any>();
  const [image, setImage] = useState<any>();
  const handleDownload = () => {
    !image
      ? alert("Please select an image")
      : domtoimage
          .toPng(domRef.current, { quality: 0.95 })
          .then(function (dataUrl: any) {
            var link = document.createElement("a");
            link.download = "image.png";
            link.href = dataUrl;
            link.click();
          });
  };

  const handleChangeImage = (e: any) => {
    if (e.target.files) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div
      className={`flex ${
        dir === `column` ? `flex-col` : `flex-col md:flex-row`
      } bg-white rounded-2xl shadow-lg overflow-hidden`}
    >
      <div
        className={`${
          dir === "column" ? `w-full` : `md:w-1/3`
        } relative flex-shrink-0`}
        ref={domRef}
      >
        {image ? (
            <Image
              src={image}
              className="w-full h-full object-cover absolute top-0 left-0"
              alt=""
            />
        ) : (
            <Image
              src="/assets/images/placeholder.jpg"
              className="w-full h-full object-cover absolute top-0 left-0"
              alt=""
            />
        )}
          <Image src={overlay} className="relative z-10" alt=""/>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-3 text-gray-600 py-6">
        {image ? (
          <>
            <span className="text-[13px]">Download and Share!</span>
            <div className="flex gap-3">
              <FaLinkedin className="text-[#0077B5] text-lg w-11 transition hover:opacity-60 cursor-pointer"/>
              <FaFacebookSquare className="text-[#3A559F] text-lg w-11 transition hover:opacity-60 cursor-pointer" />
              <FaXTwitter className="text-white w-11 transition hover:opacity-60 cursor-pointer"/>
              <FaWhatsappSquare className="text-[#29A71A] text-lg w-11 transition hover:opacity-60 cursor-pointer"/>
              <button
                className="flex items-center gap-2 h-11 rounded shadow px-3 md:px-5 bg-white border border-gray-100 transition hover:opacity-60"
                onClick={handleDownload}
              >
                <ArrowDownTrayIcon className="h-5 w-4 text-gray-black" />
                <span className="hidden md:flex font-medium text-sm text-black">
                  Download
                </span>
              </button>
            </div>
            <span className="text-[13px]">You want to personalize it?</span>
            <div className="flex items-center justify-center gap-4">
              <button
                className="flex items-center gap-2 h-11 bg-white border border-gray-100 rounded shadow px-5 transition hover:opacity-60"
                onClick={() => fileRef.current.click()}
              >
                <ArrowUpTrayIcon className="w-5"/>
                <span className="text-black font-medium text-sm">Add Logo</span>
              </button>
              <button
                className="flex items-center gap-2 h-11 bg-white border border-gray-100 rounded shadow px-5 transition hover:opacity-60"
                onClick={() => fileRef.current.click()}
              >
                <CameraIcon className="w-5"/>
                <span className="text-black font-medium text-sm">
                  Change Photo
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className="relative">
            <button
              className="flex items-center gap-2 h-14 bg-white border border-gray-100 rounded-lg shadow px-5 transition hover:opacity-60"
              onClick={() => fileRef.current.click()}
            >
              <CameraIcon className="w-5"/>
              <span className="text-black font-medium text-lg">
                Add your Photo
              </span>
            </button>
            <div style={{
                transform: "scaleY(-1) rotate(60deg) translate(-40px, 50px)",
              }}>
              <ArrowDownLeftIcon className="absolute w-12 opacity-40 botom-0 left-0"/>
            </div>
            
          </div>
        )}
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={handleChangeImage}
        />
      </div>
    </div>
  );
};

export default Card;
