import React, { Fragment, useRef } from "react";
import { useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Button from "components/common/Button";
import { ClipboardDocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";
import copy from "copy-to-clipboard";

const EmbedCodeModal = ({ open, setOpen }) => {
  const { slug } = useParams();
  const cancelButtonRef = useRef(null);
  const shareLink = `${window.location.origin}/campaign/${slug}`;
  const code = `<iframe src="${shareLink}" frameborder="0">
</iframe>`;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[200]"
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <Dialog.Title
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900 mb-4"
                >
                  Embed Code
                </Dialog.Title>
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
                <div className="flow-root">
                  <div className="w-full relative overflow-x-auto">
                    <SyntaxHighlighter
                      language="javascript"
                      style={a11yDark}
                      className="!m-0"
                    >
                      {code}
                    </SyntaxHighlighter>
                    <Button
                      className="absolute bottom-3 right-3 !px-1"
                      color="white"
                      size="sm"
                      onClick={() => copy(code)}
                    >
                      <ClipboardDocumentIcon className="w-5" />
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EmbedCodeModal;
