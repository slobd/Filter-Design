import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from 'next/image'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ClipboardDocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";
import GalleryImage1 from "assets/images/gallery/1.jpeg";
import GalleryImage2 from "assets/images/gallery/2.jpeg";
import GalleryImage3 from "assets/images/gallery/3.jpeg";
import GalleryImage4 from "assets/images/gallery/4.jpeg";
import GalleryImage5 from "assets/images/gallery/5.jpeg";
import GalleryImage6 from "assets/images/gallery/6.jpeg";
import GalleryImage7 from "assets/images/gallery/7.jpeg";
import GalleryImage8 from "assets/images/gallery/8.jpeg";
import GalleryImage9 from "assets/images/gallery/9.jpeg";
import LinkedinIcon from "assets/images/icons/profile-link.svg";

const code = `function createStyleObject(classNames, style) {
  return classNames.reduce((styleObject, className) => {
    return {...styleObject, ...style[className]};
  }, {});
}

function createClassNameString(classNames) {
  return classNames.join(' ');
}

function createElement({ node, style, useInlineStyles, key }) {
  const { properties, type, tagName, value } = node;
  if (type === "text") {
    return value;
  } else if (tagName) {
    const TagName = tagName;
    const childrenCreator = createChildren(style, useInlineStyles);
    const props = (
      useInlineStyles
      ? { style: createStyleObject(properties.className, style) }
      : { className: createClassNameString(properties.className) }
    );
    const children = childrenCreator(node.children);
    return <TagName key={key} {...props}>{children}</TagName>;
  }
}`;

const PhotoGallery = ({ open, setOpen }) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const cancelButtonRef = useRef(null);
  const tabs = [
    { id: 1, label: "Photo Gallery" },
    { id: 2, label: "Settings" },
  ];

  const items = [
    {
      id: 1,
      avatar: GalleryImage1,
      name: "Joachin Meyer",
      profile: "https://linkedin.com",
      role: "CEO",
      location: "McDonalds Switzerland",
    },
    {
      id: 2,
      avatar: GalleryImage2,
      name: "Joachin Meyer",
      profile: "https://linkedin.com",
      role: "CEO",
      location: "McDonalds Switzerland",
    },
    {
      id: 3,
      avatar: GalleryImage3,
      name: "Joachin Meyer",
      profile: "https://linkedin.com",
      role: "CEO",
      location: "McDonalds Switzerland",
    },
    {
      id: 4,
      avatar: GalleryImage4,
      name: "Joachin Meyer",
      profile: "https://linkedin.com",
      role: "CEO",
      location: "McDonalds Switzerland",
    },
    {
      id: 5,
      avatar: GalleryImage5,
      name: "Joachin Meyer",
      profile: "https://linkedin.com",
      role: "CEO",
      location: "McDonalds Switzerland",
    },
    {
      id: 6,
      avatar: GalleryImage6,
      name: "Joachin Meyer",
      profile: "https://linkedin.com",
      role: "CEO",
      location: "McDonalds Switzerland",
    },
    {
      id: 7,
      avatar: GalleryImage7,
      name: "Joachin Meyer",
      profile: "https://linkedin.com",
      role: "CEO",
      location: "McDonalds Switzerland",
    },
    {
      id: 8,
      avatar: GalleryImage8,
      name: "Joachin Meyer",
      profile: "https://linkedin.com",
      role: "CEO",
      location: "McDonalds Switzerland",
    },
    {
      id: 9,
      avatar: GalleryImage9,
      name: "Joachin Meyer",
      profile: "https://linkedin.com",
      role: "CEO",
      location: "McDonalds Switzerland",
    },
  ];

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-screen h-screen sm:p-6 !overflow-auto">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <ul className="w-full flex justify-center gap-8 border-b border-b-gray-200 font-semibold text-base">
                  {tabs.map((tab) => {
                    const active = tab.id === selectedTab;
                    return (
                      <li
                        key={tab.id}
                        className={`flex items-center gap-3 px-2 py-3 cursor-pointer border-b-2 ${
                          active
                            ? `text-[#0097D8] border-b-[#0097D8]`
                            : `text-gray-500 border-b-transparent`
                        }`}
                        onClick={() => setSelectedTab(tab.id)}
                      >
                        <span>{tab.label}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="py-5">
                  {selectedTab === 1 && (
                    <div className="max-w-[700px] mx-auto">
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
                                  <Image src={LinkedinIcon} className="w-3" alt=""/>
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
                  )}
                  {selectedTab === 2 && (
                    <div className="max-w-[700px] mx-auto">
                      <div className="relative rounded-md shadow-sm mb-5">
                        <input
                          type="text"
                          className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          readOnly
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                          <ClipboardDocumentIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <SyntaxHighlighter language="javascript" style={a11yDark}>
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PhotoGallery;
