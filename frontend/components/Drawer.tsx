import { NextPage } from 'next';
import { useState } from "react";
import Image from 'next/image'
import Tab from "./common/Tab";
import TextField from "./common/TextField";
import ToggleSwitch from "./common/ToggleSwitch";
import Button from "./common/Button";
import ColorPicker from "./common/ColorPicker";
import DropdownButton from "./common/DropdownButton";
// import PlaceholderImage from "assets/images/placeholder.jpg";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Drawer: NextPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(1);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#FFF");
  const [lightMode, setLightMode] = useState(true);
  const [photoGallery, setPhotoGallery] = useState(true);
  const [passwordProtected, setPasswordProtected] = useState(true);
  const items = [
    { id: 1, name: "General" },
    { id: 2, name: "Advanced" },
    { id: 3, name: "Texts" },
  ];

  return (
    <>
      <Button
        color="white"
        className="flex md:hidden absolute top-20 left-4 !px-2 z-10"
        onClick={() => setOpen(!open)}
      >
        <Image src="/assets/images/icons/setting.svg" width={35} height={35} className="w-5" alt="" />
      </Button>
      <div
        className={`transition fixed z-20 left-0 top-0 w-full max-w-[320px] md:max-w-[400px] flex h-screen flex-col divide-y divide-gray-200 bg-white border-r ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-1 flex-col overflow-y-auto py-4 pt-20">
          <div className="px-4 sm:px-6">
            <div className="flex items-start justify-between">
              <h2 className="text-base font-semibold leading-6 text-gray-900">
                Settings
              </h2>
              <button
                type="button"
                className="flex md:hidden relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setOpen(false)}
              >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Close panel</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="relative mt-2 flex-1 px-4 sm:px-6">
            <div className="h-12 border-b border-b-gray-200 mb-5">
              <Tab
                items={items}
                active={selectedTab}
                onClick={(item: any) => setSelectedTab(item.id)}
              />
            </div>
            <TextField
              label="Campaign Name"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
            <ToggleSwitch
              label="Light Mode"
              checked={lightMode}
              onChange={() => setLightMode}
            />
            <ColorPicker label="Main Color" value={color} onChange={setColor} />
            <div className="mb-2">
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                Placeholder Image
              </label>
              <div className="flex">
                <div className="grid grid-cols-3 gap-2">
                  {/* <Image
                    src={PlaceholderImage}
                    className="w-12 h-12 rounded object-cover"
                    alt=""
                  />
                  <Image
                    src={PlaceholderImage}
                    className="w-12 h-12 rounded object-cover"
                    alt=""
                  />
                  <Image
                    src={PlaceholderImage}
                    className="w-12 h-12 rounded object-cover"
                    alt=""
                  />
                  <Image
                    src={PlaceholderImage}
                    className="w-12 h-12 rounded object-cover"
                    alt=""
                  />
                  <Image
                    src={PlaceholderImage}
                    className="w-12 h-12 rounded object-cover"
                    alt=""
                  />
                  <Image
                    src={PlaceholderImage}
                    className="w-12 h-12 rounded object-cover"
                    alt=""
                  /> */}
                </div>
              </div>
            </div>
            <ToggleSwitch
              label="Photo Gallery"
              checked={photoGallery}
              onChange={() => setPhotoGallery}
            />
            <ToggleSwitch
              label="Password Protected"
              checked={passwordProtected}
              onChange={() => setPasswordProtected}
            />
            <DropdownButton label="Language" />
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Share Options
              </label>
              <div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="twitter"
                      aria-describedby="twitter-description"
                      name="twitter"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="twitter"
                      className="font-medium text-gray-900"
                    >
                      Twitter
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="linkedin"
                      aria-describedby="linkedin-description"
                      name="linkedin"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="linkedin"
                      className="font-medium text-gray-900"
                    >
                      Linkedin
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="whatsapp"
                      aria-describedby="whatsapp-description"
                      name="whatsapp"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="whatsapp"
                      className="font-medium text-gray-900"
                    >
                      WhatsApp
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="facebook"
                      aria-describedby="facebook-description"
                      name="facebook"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="facebook"
                      className="font-medium text-gray-900"
                    >
                      Facebook
                    </label>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="download"
                      aria-describedby="download-description"
                      name="download"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="download"
                      className="font-medium text-gray-900"
                    >
                      Download
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 justify-end px-4 py-4">
          <button
            type="button"
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default Drawer;
