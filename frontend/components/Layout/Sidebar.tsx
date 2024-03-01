import type { NextPage } from 'next';
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Disclosure } from "@headlessui/react";
import { useRouter } from 'next/router';
import {
  ArrowUpCircleIcon,
  Bars3Icon,
  PowerIcon,
  SparklesIcon,
  Squares2X2Icon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Image from 'next/image';
import { useAppContext } from '../../context/context';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar: NextPage = () => {
  const router = useRouter();
  const { pathname, query } = router;
  const { campaigns } = useAppContext();
  const { user, logout } = useAuth0();
  // const navigate = useNavigate();
  // const { pathname, search } = useLocation();
  const [open, setOpen] = useState(false);
  const navigation = [
    {
      name: "My Filter Campaigns",
      href: "/campaigns",
      icon: Squares2X2Icon,
      current: true,
      count: campaigns.length,
    },
    {
      name: "Photo Gallery",
      href: "/gallery",
      icon: ArrowUpCircleIcon,
      current: true,
    },
    {
      name: "Contacts",
      icon: UsersIcon,
      current: false,
      href: "/contacts",
      children: [
        { name: "Contact List", href: "/contacts" },
        { name: "Add New Contact", href: "/contacts?add_contact" },
        { name: "Tags", href: "/contacts?add_tag" },
      ],
    },
    {
      name: "My Brand Settings",
      href: "/settings",
      icon: SparklesIcon,
      current: true,
    },
  ];

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-72 h-screen z-40 flex flex-shrink-0 flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 transition ${
          open ? `translate-x-0` : `-translate-x-full md:translate-x-0`
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between">
          <Image
            className="h-10 w-auto cursor-pointer"
            src="/assets/images/logo.png"
            alt="LIVEDABv2"
            width={100}
            height={100}
            onClick={() => router.push("/campaigns")}
          />
          <XMarkIcon
            className="w-6 md:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {!item.children ? (
                      <a
                        href={item.href}
                        className={classNames(
                          pathname.includes(item.href)
                            ? "bg-gray-50 text-indigo-600"
                            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-gray-700"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            pathname.includes(item.href)
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-indigo-600",
                            "h-6 w-6 shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ) : (
                      <Disclosure as="div">
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={classNames(
                                pathname.includes(item.href)
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                "group flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-medium cursor-pointer"
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  pathname.includes(item.href)
                                    ? "text-indigo-600"
                                    : "text-gray-400 group-hover:text-indigo-600",
                                  "h-6 w-6 shrink-0"
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                              <ChevronRightIcon
                                className={classNames(
                                  open
                                    ? "rotate-90 text-gray-500"
                                    : "text-gray-400",
                                  "ml-auto h-5 w-5 shrink-0"
                                )}
                                aria-hidden="true"
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel as="ul" className="mt-1">
                              {item.children.map((subItem) => (
                                <li key={subItem.name}>
                                  {/* 44px */}
                                  <Disclosure.Button
                                    as="a"
                                    href={subItem.href}
                                    className={classNames(
                                      `${pathname}${query}` === subItem.href
                                        ? "bg-gray-50 text-indigo-600"
                                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                      "block rounded-md py-2 pr-2 pl-9 text-sm font-medium leading-6 text-gray-700"
                                    )}
                                  >
                                    {subItem.name}
                                  </Disclosure.Button>
                                </li>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )}
                  </li>
                ))}
              </ul>
            </li>
            <li className="-mx-6 mt-auto">
              <a
                href="#"
                className="flex items-center justify-between gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
              >
                <div className="flex items-center gap-x-4">
                  <Image
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                    width={40}
                    height={40}
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">{user?.nickname}</span>
                </div>
                <button
                  className="w-8 h-8 flex items-center justify-center bg-transparent hover:bg-gray-50"
                  onClick={handleLogout}
                >
                  <PowerIcon className="w-5 text-gray-700 font-bold" />
                </button>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <Bars3Icon
        className="w-6 flex md:hidden absolute top-6 left-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      />
    </>
  );
};

export default Sidebar;
