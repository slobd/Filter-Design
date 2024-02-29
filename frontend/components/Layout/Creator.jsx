import React, { Fragment, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Bars3Icon,
  Cog8ToothIcon,
  ShareIcon,
  Square2StackIcon,
  LinkIcon,
  ChartPieIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from 'next/image'
import Logo from "/assets/images/logo.png";
import API from "apis";
import { setCampaign } from "store/actions/Campaign";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CreatorLayout = () => {
  const { slug: id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const navigation = [
    {
      name: "Campaign Details",
      href: `basic`,
      icon: InformationCircleIcon,
    },
    {
      name: "Filter Designs",
      href: `filters`,
      icon: Square2StackIcon,
    },
    {
      name: "Settings",
      href: `settings`,
      icon: Cog8ToothIcon,
      underline: true,
    },
    {
      name: "Share, Integrate, QR-Code",
      href: `share`,
      icon: ShareIcon,
    },
    {
      name: "Unique Links",
      href: `links`,
      icon: LinkIcon,
    },
    {
      name: "Reporting",
      href: `reporting`,
      icon: ChartPieIcon,
    },
  ];

  useEffect(() => {
    API.campaign.getBySlug(id).then((res) => {
      dispatch(setCampaign({ ...res.data }));
    });
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div
        className={`fixed top-0 left-0 w-72 h-screen z-[100] flex flex-shrink-0 flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 transition ${
          open ? `translate-x-0` : `-translate-x-full md:translate-x-0`
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between">
          <Image
            className="h-10 w-auto cursor-pointer"
            src={Logo}
            alt="LIVEDABv2"
            onClick={() => navigate("/campaigns")}
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
                  <Fragment key={item.name}>
                    <li>
                      <span
                        onClick={() => navigate(`/creator/${id}/${item.href}`)}
                        className={classNames(
                          pathname.includes(item.href)
                            ? "bg-gray-50 text-indigo-600"
                            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium cursor-pointer"
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
                        {item.count && (
                          <span
                            className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
                            aria-hidden="true"
                          >
                            {item.count}
                          </span>
                        )}
                      </span>
                    </li>
                    {item.underline && <hr className="!my-2.5" />}
                  </Fragment>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      <Bars3Icon
        onClick={() => setOpen(!open)}
        className="w-6 flex md:hidden absolute top-5 left-4 cursor-pointer"
      />
      <div className="w-full md:pl-72">
        <Outlet />
      </div>
    </div>
  );
};

export default CreatorLayout;
