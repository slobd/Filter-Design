import type { NextPage } from 'next';
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/router';
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
import { APIService } from '../../api';
import { useAppContext } from '../../context/context';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const CreatorLayout: NextPage = () => {
  const router = useRouter();
  const { pathname, query } = router;
  const { contextCampaignData } = useAppContext();

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
    const slug = query?.slug;
    APIService.campaign.getBySlug(slug).then((res: any) => {
      contextCampaignData({ ...res.data });
    });
  }, [query]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-72 h-screen z-[100] flex flex-shrink-0 flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 transition ${
          open ? `translate-x-0` : `-translate-x-full md:translate-x-0`
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between">
          <Image
            className="h-10 w-auto cursor-pointer"
            src="/assets/images/logo.png"
            alt="LIVEDABv2"
            onClick={() => router.push("/campaigns")}
            width={40}
            height={40}
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
                        onClick={() => router.push(`/creator/${query?.slug}/${item.href}`)}
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
    </>
  );
};

export default CreatorLayout;
