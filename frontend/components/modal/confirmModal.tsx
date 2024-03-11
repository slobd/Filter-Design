import { NextPage } from 'next';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from '../common/Button'

export type ConfirmModalProps = {
    open: boolean;
    setOpen: (e: any) => void;
    title?: string;
    description?: string;
    handler?: (e: boolean) => void;
  };

const ConfirmModal: NextPage<ConfirmModalProps> = ({ open, setOpen, handler, title, description }: any) => {
    
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[200]"
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                                <Dialog.Title
                                    as="h2"
                                    className="font-bold leading-7 text-gray-900 mb-4"
                                >
                                    {title}
                                </Dialog.Title>
                                <Dialog.Title
                                    as="h3"
                                    className="text-base font-semibold leading-6 text-gray-900 mb-4"
                                >
                                    {description}
                                </Dialog.Title>
                                <div className="absolute right-0 top-0 pr-4 pt-4">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={() => handler(false)}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="flow-root">
                                    <div className='flex flex-row justify-end items-center gap-4'>
                                        <Button className="px-5" color="primary" onClick={() => handler(true)}> Ok </Button>
                                        <Button color="secondary" onClick={() => handler(false)}> Cancel </Button>
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

export default ConfirmModal;
