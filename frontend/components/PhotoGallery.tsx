import { NextPage } from "next";
import { useRef, useState } from "react";
import Image from 'next/image'
import TextField from "./common/TextField";
import Button from "./common/Button";
import { CameraIcon } from "@heroicons/react/24/outline";
import { FaLinkedin } from "react-icons/fa";

const PhotoGallery: NextPage = () => {
  const [image, setImage] = useState<any>();
  const fileRef = useRef<any>();
  const items: any[] = [];

  const handleChange = (e: any) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div>
      <div className="mb-12 md:mb-20">
        {!image ? (
          <div className="flex flex-col items-center">
            <p className="text-sm text-center font-medium text-gray-600 mb-4">
              Do you want to be visible in public event gallery?
            </p>
            <button
              className="bg-white flex items-center justify-center gap-2.5 text-black shadow border border-gray-100 text-base rounded-md h-11 px-4 hover:opacity-60 transition"
              onClick={() => fileRef.current.click()}
            >
              <CameraIcon className="w-5"/>
              <span className="font-medium text-sm">Upload / Take Photo</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className={`w-full md:w-2/5 relative flex-shrink-0`}>
              <Image
                src={image}
                className="w-full h-full object-cover absolute top-0 left-0"
                alt=""
              />
              <Image src="/assets/images/overlay/1.png" className="relative z-10" alt="" width={35} height={35}/>
            </div>
            <div className="w-full md:w-3/5 p-5">
              <p className="text-xs mb-3">
                <span className="font-medium">Optional:</span> Add Details to
                your Image before you submit it
              </p>
              <div className="flex flex-col">
                <TextField placeholder="Full Name" className="h-9 !text-xs" />
                <div className="flex gap-2">
                  <TextField placeholder="Position" className="h-9 !text-xs" />
                  <TextField
                    placeholder="Company Name"
                    className="h-9 !text-xs"
                  />
                </div>
                <TextField
                  placeholder="Link to your Linkedin Profile"
                  className="h-9 !text-xs"
                />
                <div className="flex gap-2">
                  <Button color="primary" className="w-full !text-xs">
                    Submit to Photo Gallery
                  </Button>
                  <Button
                    color="white"
                    className="w-full !text-xs"
                    onClick={() => fileRef.current.click()}
                  >
                    Change Photo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={fileRef}
          onChange={handleChange}
          accept="image/*"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div className="flex flex-col gap-2" key={item.id}>
            <Image
              src={item.avatar}
              className="rounded-md shadow-lg cursor-pointer transition hover:opacity-80"
              alt=""
            />
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <span className="bg-white rounded px-2 py-1 font-medium text-xs shadow uppercase">
                  {item.name}
                </span>
                <a
                  href={item.profile}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center bg-white rounded px-1.5 shadow"
                >
                  <FaLinkedin className="text-lg"/>
                </a>
              </div>
              <span className="inline-block bg-white rounded px-2 py-1 font-regular text-xs shadow">
                {item.role} @ {item.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
