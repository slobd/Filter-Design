'use client'
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ToastContainer, toast } from 'react-toast';
import moment from "moment";
import { Menu, Transition } from "@headlessui/react";
import {
  ChartBarIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import crc from "crc";
import Sidebar from "../../components/Layout/Sidebar";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import DataTable, { Row, Col } from "../../components/common/DataTable";
import GalleryLightbox from "../../components/GalleryLightbox";
import Notification from "../../components/Notification";
import API from "../../api";
import { CampaignType, ColumnType, galleryType } from '../../utils/types';
import { useAppContext } from '../../context/context';
// const DynamicSocialLogin = dynamic(async () => await import('../../components/SocialLogin'), { ssr: false });

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const Signup: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth0();
  const { campaigns } = useAppContext();
  const [galleries, setGalleries] = useState<galleryType[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [show, setShow] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const [imageHeight, setImageHeight] = useState(288);

  const cols: ColumnType[] = [
    { id: "name", label: "Campaign Details" },
    { id: "status", label: "Type" },
    { id: "uses", label: "Filter Uses", align: "center" },
    { id: "actions", label: "Actions" },
  ];

  const handleCopyCampaign = (row: CampaignType) => {
    // API.campaign
    //   .create({
    //     ...row,
    //     name: `${row.name} - Copy`,
    //   })
    //   .then((res) => {
    //     dispatch(addCampaign(res.data));
    //   });
  };

  const handleShowGalleryLightbox = (i: any) => {
    setShowGallery(true);
    setStartIndex(i);
  };

  useEffect(() => {
    // const handleResize = () => {
    //   const pageHeight = window.innerHeight;
    //   setImageHeight(`${pageHeight}`);
    // };

    // handleResize(); // Set initial image height on component mount
    // window.addEventListener('resize', handleResize); // Update image height on window resize

    // return () => {
    //   window.removeEventListener('resize', handleResize); // Clean up the event listener
    // };
  }, []);

  const handleDeleteCampaign = (id: any) => {
    // API.campaign.delete(id).then((res) => {
    //   if (res.data) {
    //     dispatch(deleteCampaign(id));
    //     setShow(true);
    //     fetchAll();
    //   }
    // });
  };

  const fetchAll = () => {
    // API.filter
    //   .getAll()
    //   .then((res) => dispatch(setFilterDesigns(res.data)));
    // API.campaign
    //   .getAll(user.email)
    //   .then((res) => dispatch(setCampaigns(res.data)));
    // fetchGalleries();
  }

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    fetchGalleries();
  }, [campaigns]);

  const handleCreateFilterCampaign = () => {
    // dispatch(setCampaign({
    //   name: "",
    //   category: "event",
    //   event_name: "",
    //   start_date: "",
    //   location: "",
    //   share_title: "",
    //   share_text: "",
    //   imprint_link: "",
    //   data_privacy_link: "",
    // }))
    let slug = crc.crc32(moment().valueOf().toString());
    // API.filter.getAll().then((filterRes) => {
    //   const filter = filterRes.data?.filter(i => i.author == '')?.[0];
    //   API.campaign
    //     .create({
    //       slug: slug,
    //       author: user.email,
    //       filters: [
    //         {
    //           filter_design: filter?._id,
    //           button: {
    //             text: "Upload Photo",
    //             bgcolor: "#FFF",
    //             textcolor: "#000",
    //           },
    //           rnd: { x: 0, y: 0, w: 100, h: 100 },
    //         },
    //       ],
    //       placeholder_image: "uploads/default_placeholder_image.png",
    //       placeholder_story_image: "uploads/default_placeholder_image.png",
    //     })
    //     .then((filterRes) => {
    //       navigate(`/creator/${filterRes.data.slug}/basic`);
    //       // API.uniqueLink
    //       //   .create({ campaign: filterRes.data._id })
    //       //   .then((res) => {
    //       //     // console.log(res);
    //       //   });
    //     });
    // });
  };

  const handleDeleteGallery = (id: any) => {
    // API.gallery.delete(id).then((res) => {
    //   const { acknowledged, deletedCount } = res.data;
    //   if (acknowledged === true && deletedCount > 0) {
    //     fetchGalleries();
    //     setShow(true);
    //   }
    // });
  };

  const fetchGalleries = () => {
    // setGalleries()
    // API.gallery
    //   .getAll(user.email)
    //   .then((res) => dispatch(setGalleries(res.data)));
  };

  const renderRow = (row: CampaignType) => {
    return (
      <Row>
        <Col>
          <div className="flex items-center gap-3 text-base">
            <div className="w-20 h-20 flex items-center justify-center">
              { row.filters?.[0] ? <div
                    className={`${
                      row.filters?.[0].filter_design?.type === `story`
                        ? `h-full`
                        : `max-h-full h-max`
                    } flex relative`}
                  >
                      <Image
                        src={`${process.env.REACT_APP_API_URL}/${row?.placeholder_image}`}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                      />
                      <Image
                        src={`${process.env.REACT_APP_API_URL}/${row?.filters[0]?.filter_design?.image}`}
                        className="max-h-full relative z-10 rounded-md"
                      />
                  </div>
                : null
              }
            </div>
            <div className="flex flex-col">
              <Link
                href={`/creator/${row.slug}/filters`}
              >
                <span className="font-medium cursor-pointer hover:underline">{row.name}</span>
              </Link>
              <span className="text-[0.8rem] text-gray-400">
                {row.filters.length}x Filters added | Created:{" "}
                {moment(row.updatedAt).format("DD.MM.YYYY - hh:mma")}
              </span>
            </div>
          </div>
        </Col>
        <Col>
          <Badge color={row.status === "public" ? "success" : "default"}>
            {row.status}
          </Badge>
        </Col>
        <Col>
          <p className="text-center font-medium">{row.uses}</p>
        </Col>
        <Col className="w-[250px]">
          <div className="flex gap-2">
            <a href={`/campaign/${row.slug}`} target="_blank" rel="noreferrer">
              <Button color="white" size="sm">
                <EyeIcon className="w-4 mr-2" />
                View
              </Button>
            </a>
            <Link href={`/creator/${row.slug}/reporting`}>
              <Button color="white" size="sm">
                <ChartBarIcon className="w-4 mr-2" />
                Reports
              </Button>
            </Link>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center items-center rounded-md bg-white w-[30px] h-[30px] shadow-sm hover:bg-gray-50 border">
                  <EllipsisHorizontalIcon className="w-4" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href={`/creator/${row.slug}/filters`}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "group flex items-center px-4 py-2 text-sm cursor-pointer"
                          )}
                        >
                          Edit
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <span
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "group flex items-center px-4 py-2 text-sm cursor-pointer"
                          )}
                          onClick={() => handleCopyCampaign(row)}
                        >
                          Duplicate
                        </span>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <span
                          onClick={() => handleDeleteCampaign(row._id)}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "group flex items-center px-4 py-2 text-sm cursor-pointer"
                          )}
                        >
                          Delete
                        </span>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </Col>
      </Row>
    );
  };

  return (    
    <div className="flex">
      <Sidebar />
      <div className="w-full md:pl-72">
        <div className="w-full flex">
          <div className="w-full p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-2xl mb-5 md:mb-0 pl-12 md:pl-0">
                <span className="font-medium">My Filter Campaigns</span>
              </div>
              <div className="flex items-center self-end md:self-auto gap-2">
                <Button
                  className="!px-2 md:!px-3"
                  onClick={handleCreateFilterCampaign}
                >
                  <PlusIcon className="w-6" />
                  <span className="ml-1.5">Create Filter Campaign</span>
                </Button>
              </div>
            </div>
            <DataTable cols={cols} rows={campaigns} renderRow={renderRow} />
          </div>
          <div className="flex-shrink-0 w-80 h-screen bg-black p-5">
            <div className="flex items-center justify-between font-medium text-base text-white mb-3">
              <span>Latest Photos</span>
              {galleries.length > 0 && (
                <Button onClick={() => router.push("/gallery")}>See All</Button>
              )}
            </div>
            <div className={`${galleries.length > 5 ? `-mx-2` : ``}`}>
              <div className="grid gap-4 grid-cols-2">
                {galleries.slice(0, 8).map((gallery, i) => (
                  <div className="relative group" key={gallery._id}>
                    <button
                      className="absolute top-2 right-2 cursor-pointer opacity-0 transition group-hover:opacity-100 p-1.5 rounded bg-black"
                      onClick={() => handleDeleteGallery(gallery._id)}
                    >
                      <TrashIcon className="w-5 text-white" />
                    </button>
                      <Image
                        src={`${process.env.REACT_APP_API_URL}/${gallery.path}`}
                        className="rounded-lg cursor-pointer"
                        onClick={() => handleShowGalleryLightbox(i)}
                      />
                  </div>
                ))}
              </div>
            </div>
            {galleries.length === 0 && (
              <span className="text-xs text-gray-500">
                No Photos uploaded yet
              </span>
            )}
          </div>
        </div>
      </div>

      <Notification
        show={show}
        onClose={() => setShow(false)}
        type="success"
        title="Successfully deleted!"
        content="Dummy content"
      />
      <GalleryLightbox
        show={showGallery}
        onClose={() => setShowGallery(false)}
        onDelete={handleDeleteGallery}
        start={startIndex}
        items={galleries}
        imageHeight={imageHeight}
      />
    </div>    
  )
}

export default Signup
