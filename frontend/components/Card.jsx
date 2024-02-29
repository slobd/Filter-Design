import React, { useRef, useState, Suspense } from "react";
import Image from 'next/image'
import domtoimage from "dom-to-image";
import PlaceholderImage from "assets/images/placeholder.jpg";
import DownloadIcon from "assets/images/icons/download.svg";
import LinkedinIcon from "assets/images/icons/linkedin.svg";
import FacebookIcon from "assets/images/icons/facebook.svg";
import TwitterIcon from "assets/images/icons/twitter.svg";
import WhatsappIcon from "assets/images/icons/whatsapp.svg";
import UploadIcon from "assets/images/icons/upload.svg";
import CameraIcon from "assets/images/icons/camera.svg";
import ArrowIcon from "assets/images/icons/arrow.svg";

const Card = ({ dir = "row", overlay }) => {
  const domRef = useRef();
  const fileRef = useRef();
  const [image, setImage] = useState();
  const handleDownload = () => {
    !image
      ? alert("Please select an image")
      : domtoimage
          .toPng(domRef.current, { quality: 0.95 })
          .then(function (dataUrl) {
            var link = document.createElement("a");
            link.download = "image.png";
            link.href = dataUrl;
            link.click();
          });
  };

  const handleChangeImage = (e) => {
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
          <Suspense fallback={<div>Loading...</div>}>
            <Image
              src={image}
              className="w-full h-full object-cover absolute top-0 left-0"
              alt=""
            />
          </Suspense>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            <Image
              src={PlaceholderImage}
              className="w-full h-full object-cover absolute top-0 left-0"
              alt=""
            />
          </Suspense>
        )}
        <Suspense fallback={<div>Loading...</div>}>
          <Image src={overlay} className="relative z-10" alt=""/>
        </Suspense>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-3 text-gray-600 py-6">
        {image ? (
          <>
            <span className="text-[13px]">Download and Share!</span>
            <div className="flex gap-3">
              <Image
                src={LinkedinIcon}
                className="w-11 transition hover:opacity-60 cursor-pointer"
                alt=""
              />
              <Image
                src={FacebookIcon}
                className="w-11 transition hover:opacity-60 cursor-pointer"
                alt=""
              />
              <Image
                src={TwitterIcon}
                className="w-11 transition hover:opacity-60 cursor-pointer"
                alt=""
              />
              <Image
                src={WhatsappIcon}
                className="w-11 transition hover:opacity-60 cursor-pointer"
                alt=""
              />
              <button
                className="flex items-center gap-2 h-11 rounded shadow px-3 md:px-5 bg-white border border-gray-100 transition hover:opacity-60"
                onClick={handleDownload}
              >
                <Image src={DownloadIcon} className="w-5" alt=""/>
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
                <Image src={UploadIcon} className="w-5" alt=""/>
                <span className="text-black font-medium text-sm">Add Logo</span>
              </button>
              <button
                className="flex items-center gap-2 h-11 bg-white border border-gray-100 rounded shadow px-5 transition hover:opacity-60"
                onClick={() => fileRef.current.click()}
              >
                <Image src={CameraIcon} className="w-5" alt=""/>
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
              <Image src={CameraIcon} className="w-5" alt=""/>
              <span className="text-black font-medium text-lg">
                Add your Photo
              </span>
            </button>
            <Image
              src={ArrowIcon}
              className="absolute w-12 opacity-40 botom-0 left-0"
              style={{
                transform: "scaleY(-1) rotate(60deg) translate(-40px, 50px)",
              }}
              alt=""
            />
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
