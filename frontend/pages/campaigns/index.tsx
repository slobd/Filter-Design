'use client'
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Image from 'next/image';
import moment from "moment";
import { Menu, Transition } from "@headlessui/react";
import {
  ChartBarIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from 'uuid';
import Sidebar from "../../components/Layout/Sidebar";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import DataTable, { Row, Col } from "../../components/common/DataTable";
import GalleryLightbox from "../../components/GalleryLightbox";
import Notification from "../../components/Notification";
import { APIService } from "../../api";
import { CampaignType, ColumnType, GalleryType } from '../../utils/types';
import { useAppContext } from '../../context/context';
import ConfirmModal from '../../components/modal/confirmModal';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const Signup: NextPage = () => {
  const router = useRouter();
  const { user, loginWithRedirect } = useAuth0();
  const { campaigns, getInitData, contextCampaignData, contextResetCampaignData } = useAppContext();
  const [galleries, setGalleries] = useState<GalleryType[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationContent, setNotificationContent] = useState("");

  const cols: ColumnType[] = [
    { id: "name", label: "Campaign Details" },
    { id: "status", label: "Type" },
    { id: "uses", label: "Filter Uses", align: "center" },
    { id: "actions", label: "Actions" },
  ];

  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    fetchGalleries();
  }, [campaigns]);

  const handleCopyCampaign = (row: CampaignType) => {
    let slug = uuidv4(); //crc.crc32(moment().valueOf().toString());
    APIService.campaign
      .create({
        ...row,
        name: `${row.name} - Copy`,
        slug: slug,
      })
      .then((res: any) => {
        setNotificationTitle("Duplication Success!");
        setNotificationContent("You have successfully duplicated a campaign")
        setShowNotification(true);
        getInitData();
      });
  };

  const handleShowGalleryLightbox = (i: any) => {
    setShowGallery(true);
    setStartIndex(i);
  };

  const deleteConfirmed = (value: any) => {
    setDeleteConfirmModal(false);
    if(value && deleteId) {
      APIService.campaign.delete({id: deleteId, email: user?.email}).then((res: any) => {
        if (res.data) {
          getInitData();
          setNotificationTitle("Delete Success!");
          setNotificationContent("You have successfully deleted a campaign")
          setShowNotification(true);
        }
      });
    }
    
  }

  const handleDeleteCampaign = (id: any) => {
    setDeleteId(id);
    setDeleteConfirmModal(true);
  };

  const handleCreateFilterCampaign = () => {
    contextResetCampaignData();
    let slug = uuidv4(); //crc.crc32(moment().valueOf().toString());
    APIService.filter.getAll().then((filterRes: any) => {
      const filter = filterRes.data?.filter((i: any) => i.author == '')?.[0];
      APIService.campaign
        .create({
          slug: slug,
          author: user?.email,
          filters: [
            {
              filter_design: filter?._id,
              button: {
                text: "Upload Photo",
                bgcolor: "#FFF",
                textcolor: "#000",
              },
              rnd: { x: 0, y: 0, w: 100, h: 100 },
            },
          ],
          placeholder_image: "uploads/default_placeholder_image.png",
          placeholder_story_image: "uploads/default_placeholder_image.png",
        })
        .then((res: any) => {
          if(res.data.slug) {
            router.push(`/creator/${res.data.slug}/basic`);
          }
        });
    });
  };

  const handleDeleteGallery = (id: any) => {
    APIService.gallery.delete({id: id, email: user?.email}).then((res: any) => {
      const { acknowledged, deletedCount } = res.data;
      if (acknowledged === true && deletedCount > 0) {
        fetchGalleries();
        setShowNotification(true);
      }
    });
  };

  const fetchGalleries = () => {
    APIService.gallery
      .getAll(user?.email)
      .then((res: any) => setGalleries(res.data));
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
                    <div className="absolute top-0 left-0 w-full h-full object-cover rounded-md overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${row?.placeholder_image}`}
                        width={row?.filters[0]?.filter_design?.type == 'square' ? 70 : 50}
                        height={70}
                        alt=""
                        loader={({ src, width }) => { return src + "?w=" + width }}
                      />
                    </div>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${row?.filters[0]?.filter_design?.image}`}
                      className="max-h-full relative z-10 rounded-md"
                      width={row?.filters[0]?.filter_design?.type == 'square' ? 70 : 50}
                      height={70}
                      alt=""
                      loader={({ src, width }) => { return src + "?w=" + width }}
                    />
                  </div>
                : null
              }
            </div>
            <div className="flex flex-col">
              <a
                href={`/creator/${row.slug}/filters`}
              >
                <span className="font-medium cursor-pointer hover:underline">{row.name}</span>
              </a>
              <span className="text-[0.8rem] text-gray-400">
                {row?.filters?.length}x Filters added | Created:{" "}
                {moment(row?.updatedAt).format("DD.MM.YYYY - hh:mma")}
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
            <a href={`/creator/${row.slug}/reporting`}>
              <Button color="white" size="sm">
                <ChartBarIcon className="w-4 mr-2" />
                Reports
              </Button>
            </a>
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
                {galleries.slice(0, 8).map((gallery: any, i) => (
                  <div className="relative group" key={gallery?._id}>
                    <button
                      className="p-[3px] z-10 absolute top-2 right-4 cursor-pointer opacity-0 transition group-hover:opacity-100 p-1.5 rounded bg-black"
                      onClick={() => handleDeleteGallery(gallery?._id)}
                    >
                      <TrashIcon className="w-4 text-white" />
                    </button>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${gallery?.path}`}
                      className="rounded-lg cursor-pointer"
                      onClick={() => handleShowGalleryLightbox(i)}
                      width={120}
                      height={gallery?.filter_design?.type == 'square' ? 120 : 213}
                      alt=""
                      loader={({ src, width }) => { return src + "?w=" + width }}
                    />
                    <div className='text-white text-[12px]'>{gallery?.updatedAt?.slice(0, 19).replace("T", " ")}</div>
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
        show={showNotification}
        onClose={() => setShowNotification(false)}
        type={notificationType}
        title={notificationTitle}
        content={notificationContent}
      />
      
      <GalleryLightbox
        show={showGallery}
        onClose={() => setShowGallery(false)}
        onDelete={handleDeleteGallery}
        start={startIndex}
        items={galleries}
      />
      <ConfirmModal
          open={deleteConfirmModal}
          setOpen={setDeleteConfirmModal}
          handler={deleteConfirmed}
          title={"Warning!"}
          description={"Do you confirm to delete this campaign."}
      />
    </div>    
  )
}

export default Signup
