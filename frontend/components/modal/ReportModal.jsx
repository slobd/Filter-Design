import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import TextField from "components/common/TextField";
import { XMarkIcon } from "@heroicons/react/24/outline";

const stats = [
  { name: "Visits", stat: "71,897" },
  { name: "Filter Views", stat: "58.16%" },
  { name: "Filter Uses", stat: "24.57%" },
  { name: "Interactions", stat: "24.57%" },
  { name: "Conversion Rate", stat: "24.57%" },
  { name: "Engagement", stat: "24.57%" },
];

const ReportModal = ({ open, setOpen }) => {
  const cancelButtonRef = useRef(null);
  const [date, setDate] = useState("");

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl sm:p-6">
                <Dialog.Title
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900 mb-4"
                >
                  Reports
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
                <div>
                  <TextField
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <dl className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
                    {stats.map((item) => (
                      <div
                        key={item.name}
                        className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
                      >
                        <dt className="truncate text-sm font-medium text-gray-500">
                          {item.name}
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                          {item.stat}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ReportModal;
