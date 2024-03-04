import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import Sidebar from "../../components/Layout/Sidebar";
import Notification from "../../components/Notification";
import GalleryLightbox from "../../components/GalleryLightbox";
import { APIService} from "../../api";
import { useAppContext } from "../../context/context";
import { GalleryType } from "../../utils/types";

const Gallery: NextPage = () => {
  const { user } = useAuth0();
  const { campaigns, getInitData } = useAppContext();
  const [show, setShow] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [galleries, setGalleries] = useState<GalleryType[]>([])
  const [showGallery, setShowGallery] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>("all");

  useEffect(() => {
    APIService.campaign
      .getAll(user?.email)
      .then((res: any) => getInitData());
      APIService.gallery
      .getAll(user?.email)
      .then((res: any) => setGalleries(res.data));
      
  }, []);
  console.log("galleries", galleries);
  const getFilteredGalleries = (galleries: any[]) => {
    return galleries.filter((gallery: any) => {
      if (selectedCampaign !== "all") {
        return gallery.campaign_id === selectedCampaign;
      }
      return true;
    });
  };

  const handleShowGalleryLightbox = (i: any) => {
    setShowGallery(true);
    setStartIndex(i);
  };

  const handleDeleteGallery = (id: any) => {
    APIService.gallery.delete(id).then((res: any) => {
      const { acknowledged, deletedCount } = res.data;
      if (acknowledged === true && deletedCount > 0) {
        fetchGalleries();
        setShow(true);
      }
    });
  };

  const fetchGalleries = () => {
    APIService.gallery
      .getAll(user?.email)
      .then((res: any) => setGalleries(res.data));
  };

  return (
    <div>
      <Sidebar />
      <div className="w-full md:pl-72">
        <div className="w-full p-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex items-center gap-2 pl-12 md:pl-0">
              <span className="text-2xl font-medium">Photo Gallery</span>
              <span className="font-medium">
                ({getFilteredGalleries(galleries).length})
              </span>
            </div>
            <div className="self-end md:self-auto">
              <select
                className="h-9 flex justify-center gap-x-1.5 rounded-md text-sm font-semibold shadow-sm bg-white text-black border-gray-200 cursor-pointer box-border"
                value={selectedCampaign}
                onChange={(e: any) => setSelectedCampaign(e.target.value)}
              >
                <option value="all">All Campaigns</option>
                {campaigns.map((campaign) => (
                  <option key={campaign._id} value={campaign?._id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-5">
            {getFilteredGalleries(galleries).map((gallery, i) => (
              <div className="relative group" key={gallery._id}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${gallery.path}`}
                    className="rounded-lg shadow-center cursor-pointer"
                    onClick={() => handleShowGalleryLightbox(i)}
                    width={100}
                    height={100}
                    alt=""
                  />
                <button
                  className="absolute top-2 right-2 cursor-pointer opacity-0 transition group-hover:opacity-100 p-1.5 rounded bg-black"
                  onClick={() => handleDeleteGallery(gallery._id)}
                >
                  <TrashIcon className="w-5 text-white" />
                </button>
              </div>
            ))}
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
        items={getFilteredGalleries(galleries)}
      />
    </div>
  );
};

export default Gallery;
