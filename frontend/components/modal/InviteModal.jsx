import React, { Fragment, useLayoutEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "components/common/Button";
import { XMarkIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

const statuses = {
  Completed: "text-green-400 bg-green-400/10",
  Error: "text-rose-400 bg-rose-400/10",
};
const people = [
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    status: "Completed",
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    status: "Completed",
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    status: "Error",
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    status: "Completed",
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    status: "Error",
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    status: "Error",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const InviteModal = ({ open, setOpen }) => {
  const cancelButtonRef = useRef(null);
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPeople.length > 0 && selectedPeople.length < people.length;
    setChecked(selectedPeople.length === people.length);
    setIndeterminate(isIndeterminate);
    // checkbox.current.indeterminate = isIndeterminate;
  }, [selectedPeople]);

  const toggleAll = () => {
    setSelectedPeople(checked || indeterminate ? [] : people);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  };

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <Dialog.Title
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900 mb-4"
                >
                  Invites
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
                <div className="flex justify-end items-center gap-2 mb-5">
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Search..."
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <MagnifyingGlassIcon className="w-5 opacity-50" />
                    </div>
                  </div>
                  <Button className="!px-2 md:!px-3">
                    <PlusIcon className="w-5 invert" />
                    <span className="hidden md:inline-block ml-1.5">
                      Send Invitation
                    </span>
                  </Button>
                </div>
                <div className="mt-8 flow-root">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <div className="relative">
                        <table className="min-w-full table-fixed divide-y divide-gray-300">
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="relative px-7 sm:w-12 sm:px-6"
                              >
                                <input
                                  type="checkbox"
                                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                  ref={checkbox}
                                  checked={checked}
                                  onChange={toggleAll}
                                />
                              </th>
                              <th
                                scope="col"
                                className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Email
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {people.map((person) => (
                              <tr
                                key={person.email}
                                className={
                                  selectedPeople.includes(person)
                                    ? "bg-gray-50"
                                    : undefined
                                }
                              >
                                <td className="relative px-7 sm:w-12 sm:px-6">
                                  {selectedPeople.includes(person) && (
                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                                  )}
                                  <input
                                    type="checkbox"
                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    value={person.email}
                                    checked={selectedPeople.includes(person)}
                                    onChange={(e) =>
                                      setSelectedPeople(
                                        e.target.checked
                                          ? [...selectedPeople, person]
                                          : selectedPeople.filter(
                                              (p) => p !== person
                                            )
                                      )
                                    }
                                  />
                                </td>
                                <td
                                  className={classNames(
                                    "whitespace-nowrap py-4 pr-3 text-sm font-medium",
                                    selectedPeople.includes(person)
                                      ? "text-indigo-600"
                                      : "text-gray-900"
                                  )}
                                >
                                  {person.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {person.email}
                                </td>
                                <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                                  <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                                    <time
                                      className="text-gray-400 sm:hidden"
                                      dateTime={person.dateTime}
                                    >
                                      {person.date}
                                    </time>
                                    <div
                                      className={classNames(
                                        statuses[person.status],
                                        "flex-none rounded-full p-1"
                                      )}
                                    >
                                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                    </div>
                                    <div className="hidden text-black sm:block">
                                      {person.status}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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

export default InviteModal;
