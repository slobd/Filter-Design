import { NextPage } from "next";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useAuth0 } from "@auth0/auth0-react";
import BeatLoader from "react-spinners/BeatLoader";
import copy from "copy-to-clipboard";
import Button from "../../../components/common/Button";
import ToggleSwitch from "../../../components/common/ToggleSwitch";
import { 
  EyeIcon,
  RocketLaunchIcon, 
  ArrowDownTrayIcon, 
  ArrowRightIcon, 
  AdjustmentsHorizontalIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { FaLinkedin, FaWhatsappSquare, FaFacebookSquare } from "react-icons/fa";
import { FaXTwitter  } from "react-icons/fa6";
import { FiSave } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import CreatorLayout from '../../../components/Layout/Creator';
import EmptyDrawer from "../../../components/drawers/EmptyDrawer";
import { APIService } from "../../../api";
import TextField from "../../../components/common/TextField";
import ColorPicker from "../../../components/common/ColorPicker";
import { useAppContext } from "../../../context/context";
import { FilterType, PlaceholderType } from '../../../utils/types';
import { filterDesignWidths} from '../../../utils/constants';
import { Font } from "@samuelmeuli/font-manager";
import Notification from '../../../components/Notification';

const FontPicker = dynamic(() => import('font-picker-react'), { ssr: false });

const Settings: NextPage = () => {
  const router = useRouter();
  const { pathname, query } = router;
  const { loginWithRedirect, user } = useAuth0();

  const { campaignData, contextCampaignData, getInitData } = useAppContext();

  const imageRef = useRef<any>();
  const imageRefForStory = useRef<any>();
  const bgImageRef = useRef<any>();
  const logoRef = useRef<any>();
  const [backgroundColor, setBackgroundColor] = useState("#FFF");
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openLogoPanel, setOpenLogoPanel] = useState(false);
  const [openTitlePanel, setOpenTitlePanel] = useState(false);
  const [openDownloadPanel, setOpenDownloadPanel] = useState(false);
  const [openDescriptionPanel, setOpenDescriptionPanel] = useState(false);
  const [password, setPassword] = useState("");
  const [edge, setEdge] = useState(14);
  const [logo, setLogo] = useState(campaignData?.logo);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlaceholderImage, setSelectedPlaceholderImage] = useState("");
  const [selectedPlaceholderImageForStory, setSelectedPlaceholderImageForStory] = useState("");
  const [settingOptions, setSettingOptions] = useState({
    showLogo: false,
    showTitle: false,
    showDescription: false,
    lightMode: false,
    hideSizeButtons: false,
    passwordProtected: false,
    enableEdge: true,
    downloadOptions: true,
    showGallery: false,
    activeSliderMode: false,
  });
  const [placeholders, setPlaceholders] = useState<PlaceholderType[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChangeLogo = (target: any, value: any) => {
    contextCampaignData({
      ...campaignData,
      logo_setting: { ...campaignData?.logo_setting, [target]: value }
    });
  };

  const handleChangeTitle = (target: any, value: any) => {
    contextCampaignData({
      ...campaignData,
      title: { 
        ...campaignData?.title, 
        [target]: value,
      }
    });
  };

  const handleChangeDescription = (target: any, value: any) => {
    contextCampaignData({
      ...campaignData,
      description: { 
        ...campaignData?.description, 
        [target]: value,
      }
    });
    const metaDescription = document.getElementById('metaDescription');
    // Set the meta description based on the content of description
    if(metaDescription) {
       metaDescription.setAttribute('content', value);
    }
  };

  const handleChangeDownloadImage = (target: any, value: any) => {
    contextCampaignData({
      ...campaignData,
      download_image: { 
        ...campaignData?.download_image, 
        [target]: value,
      }
    });
  };

  const handleChangeSharingOptions = (e: any) => {
    contextCampaignData({
      ...campaignData,
      sharing_options: { ...campaignData?.sharing_options, [e.target.name]: e.target.checked }
    });
  };

  const handleChangeSettingOption = (target: any, value: any) => {
    setSettingOptions({ ...settingOptions, [target]: value });
    contextCampaignData
    if(target == 'lightMode') {
      contextCampaignData({
        ...campaignData,
        title: {
          ...campaignData?.title,
          color: value ? "#FFF" : "#000"
        },
        description: {
          ...campaignData?.description,
          color: value ? "#6b7280" : "#000"
        },
        dark_mode: value
      })
    } else if(target == 'hideSizeButtons') {
      contextCampaignData({
        ...campaignData,
        hide_size_buttons: value
      })
    } else if(target == 'activeSliderMode') {
      contextCampaignData({
        ...campaignData,
        active_slider_mode: value
      })
    }
    if(target == 'showTitle' && value) {
      contextCampaignData({
        ...campaignData,
        title: {
          ...campaignData?.title,
          text: campaignData?.title?.text != ""
            ? campaignData?.title?.text
            : "Share your Photo with your Network and Friends"
        }
      })
    }
    if(target == 'showDescription' && value) {
      contextCampaignData({
        ...campaignData,
        description: {
          ...campaignData?.description,
          text: campaignData?.description?.text != "" 
            ? campaignData?.description?.text
            : "It’s easy! Just upload a photo and get a visual filter to share with your network and friends."
        }
      })
    }
  };

  const handleUploadPlaceholderImage = (e: any) => {
    APIService.placeholder.create({ image: e.target.files[0], type: 'square' })
      .then((res: any) => {
        setPlaceholders([
          ...placeholders,
          res.data
        ]);
        setSelectedPlaceholderImage(res.data.image);
      });
  };

  const handleUploadPlaceholderImageForStory = (e: any) => {
    APIService.placeholder.create({ image: e.target.files[0], type: 'story' })
    .then((res: any) => {
      setPlaceholders([
        ...placeholders,
        res.data
      ]);
      setSelectedPlaceholderImageForStory(res.data.image);
    });
  };

  const handleUploadBackgroundImage = (e: any) => {
    if (e.target.files[0]) {
      APIService.file.upload(e.target.files[0])
      .then((res: any) => {
        (contextCampaignData({
          ...campaignData,
          background: {
            type: "image",
            value: res.data.path.replace("\\", "/"),
          },
        }))
        bgImageRef.current.value = "";
      });
    }
  };

  const handleChangeBackgroundColor = (e: any) => {
    setBackgroundColor(e);
    contextCampaignData({
      ...campaignData,
      background: {
        type: "color",
        value: e,
      },
    })
  };

  const handleChangePlaceholderImage = (image: any) =>
    setSelectedPlaceholderImage(image);

  const handleChangePlaceholderImageForStory = (image: any) =>
    setSelectedPlaceholderImageForStory(image);

  const handleNext = () => {
    if (!user) {
      loginWithRedirect({
        appState: {
          returnTo: `/creator/${query?.slug}/basic`,
        },
      });
      return;
    }
    APIService.campaign
      .edit({
        ...campaignData,
        id: campaignData?._id,
        status: "published",
      })
      .then((res: any) => {
        getInitData();
      })
      .catch((err: any) => console.log(err));
  };

  const handlePreview = () => {
    if (!user) {
      loginWithRedirect({
        appState: {
          returnTo: `/creator/${query?.slug}/basic`,
        },
      });
      return;
    }
    APIService.campaign
      .edit({
        ...campaignData,
        id: campaignData?._id,
      })
      .then((res: any) => {
        getInitData();
        const newWindow = window.open(`/campaign/${res.data.slug}`, "_blank");
        if(newWindow) {
          setTimeout(() => {
            newWindow.opener = null;
          }, 0);
        }
      })
      .catch((err: any) => console.log(err));
  };

  useEffect(() => {
    document.body.style.overflow = openSidebar ? "hidden" : "auto";
  }, [openSidebar]);

  useEffect(() => {
    if (!settingOptions.showLogo) setLogo(null);
    contextCampaignData({
      ...campaignData,
      logo: settingOptions.showLogo && logo ? logo : null,
      dark_mode: settingOptions.lightMode,
      hide_size_buttons: settingOptions.hideSizeButtons,
      active_slider_mode: settingOptions.activeSliderMode,
      password: settingOptions.passwordProtected ? password : null,
      edge: settingOptions.enableEdge ? edge * 1 : 0,
      show_gallery: settingOptions.showGallery,
    })
  }
  , [ 
    logo,
    password,
    settingOptions,
    edge,
  ]);

  const getActiveSocial = (data: any) => {
    return (
      data.twitter ||
      data.linkedin ||
      data.whatsapp ||
      data.facebook ||
      data.download
    );
  };

  useEffect(() => {
    setSelectedPlaceholderImage("uploads/default_placeholder_image.png");
    setSelectedPlaceholderImageForStory("uploads/default_placeholder_image.png");
    if(!campaignData) return;
    APIService.placeholder.getAll().then((res: any) => {
      setPlaceholders(res.data);
    });
    APIService.campaign.getBySlug(query?.slug).then((res: any) => {
      if(res) {
        setSettingOptions({
          showLogo: !!res.data?.logo,
          showTitle: !!res.data?.title?.text,
          showDescription: !!res.data?.description?.text,
          activeSliderMode: !!res.data?.active_slider_mode,
          lightMode: !!res.data?.dark_mode,
          hideSizeButtons: !!res.data?.hide_size_buttons,
          passwordProtected: !!res.data?.password,
          downloadOptions: res.data?.sharing_options
            ? getActiveSocial(res.data?.sharing_options)
            : false,
          showGallery: !!res.data?.show_gallery,
          enableEdge: res.data?.edge != 0 ? true : false,
        });
        setEdge(res.data?.edge ?? 14);
        res.data?.logo && setLogo(res.data.logo);
        res.data?.password && setPassword(res.data?.password);
        res.data?.placeholder_image &&
        setSelectedPlaceholderImage(res.data?.placeholder_image);
        res.data?.placeholder_story_image &&
        setSelectedPlaceholderImageForStory(res.data?.placeholder_story_image);
        res.data?.background?.type === "color" &&
        setBackgroundColor(res.data?.background.value ?? "#FFF");
      }
    });
  }, [query?.slug]);

  const handleChangePhotoText = (text: any) => {
    contextCampaignData({
      ...campaignData,
      change_photo: text 
    });
  };

  // useEffect(() => {
  //   const loadFontPicker = async () => {
  //       const FontPicker = (await import('font-picker-react')).default;
  //       // Use FontPicker here
  //   };
  //   if (typeof window !== 'undefined') {
  //       loadFontPicker();
  //   }
  // }, []);

  return (
    <div className="w-full bg-gray-100 min-h-screen flex flex-row">
      <CreatorLayout />
      <div
        className={`h-screen z-20 fixed md:left-72 top-0 w-80 bg-white border-r flex-shrink-0 ${
          openSidebar ? `translate-x-0` : `-translate-x-full md:translate-x-0`
        } transition`}
      >
        <button
          className="w-10 h-10 flex md:hidden items-center justify-center bg-white shadow absolute top-20 right-0 translate-x-full rounded-r-lg"
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          <ArrowRightIcon className="w-5"/>
        </button>
        <div className="flex flex-col h-full py-5 overflow-y-auto">
          <h2 className="font-semibold text-lg mb-4 px-4">Settings</h2>
          <div>
            <ul
              role="list"
              className="divide-y divide-gray-100 border-y border-y-gray-100"
            >
              <li className="flex items-center justify-between px-4 py-1">
                <span>Show Logo</span>
                <div className="flex items-center gap-3">
                  {settingOptions.showLogo && (
                    <AdjustmentsHorizontalIcon 
                      className="w-7 brightness-0 opacity-80 cursor-pointer"
                      onClick={() => setOpenLogoPanel(true)}
                    />
                  )}
                  <ToggleSwitch
                    checked={settingOptions.showLogo}
                    onChange={(value: any) =>
                      handleChangeSettingOption("showLogo", value)
                    }
                  />
                </div>
              </li>
              <li className="flex items-center justify-between px-4 py-1">
                <span>Show Title</span>
                <div className="flex items-center gap-3">
                  {settingOptions.showTitle && (
                    <AdjustmentsHorizontalIcon 
                      className="w-7 brightness-0 opacity-80 cursor-pointer"
                      onClick={() => setOpenTitlePanel(true)}
                    />
                  )}
                  <ToggleSwitch
                    checked={settingOptions.showTitle}
                    onChange={(value) =>
                      handleChangeSettingOption("showTitle", value)
                    }
                  />
                </div>
              </li>
              <li className="flex items-center justify-between px-4 py-1">
                <span>Show Description</span>{" "}
                <div className="flex items-center gap-3">
                  {settingOptions.showDescription && (
                    <AdjustmentsHorizontalIcon 
                      className="w-7 brightness-0 opacity-80 cursor-pointer"
                      onClick={() => setOpenDescriptionPanel(true)}
                    />
                  )}
                  <ToggleSwitch
                    checked={settingOptions.showDescription}
                    onChange={(value) =>
                      handleChangeSettingOption("showDescription", value)
                    }
                  />
                </div>
              </li>
              <li className="flex items-center justify-between px-4 py-1">
                <span>Light/Dark Mode</span>
                <ToggleSwitch
                  checked={settingOptions.lightMode}
                  onChange={(value) =>
                    handleChangeSettingOption("lightMode", value)
                  }
                />
              </li>
              <li className="flex items-center justify-between px-4 py-1">
                <span>Hide Size Buttons</span>
                <ToggleSwitch
                  checked={settingOptions.hideSizeButtons}
                  onChange={(value) =>
                    handleChangeSettingOption("hideSizeButtons", value)
                  }
                />
              </li>
              <li className="flex items-center justify-between px-4 py-1">
                <span>Slider Mode</span>
                <ToggleSwitch
                  checked={settingOptions.activeSliderMode}
                  onChange={(value) =>
                    handleChangeSettingOption("activeSliderMode", value)
                  }
                />
              </li>
              <li className="px-4 py-1">
                <div className="flex items-center justify-between">
                  <span>Password Protected</span>
                  <ToggleSwitch
                    checked={settingOptions.passwordProtected}
                    onChange={(value) =>
                      handleChangeSettingOption("passwordProtected", value)
                    }
                  />
                </div>
                {settingOptions.passwordProtected && (
                  <div className="relative rounded-md shadow-sm mb-2">
                    <input
                      type={showPassword ? `text` : `password`}
                      className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <EyeIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                )}
              </li>
              <li className="px-4 py-1">
                <div className="flex items-center justify-between">
                  <span>Edge</span>
                  <ToggleSwitch
                    checked={settingOptions.enableEdge}
                    onChange={(value: any) =>
                      handleChangeSettingOption("enableEdge", value)
                    }
                  />
                </div>
                {settingOptions.enableEdge && (
                  <div className="relative rounded-md shadow-sm mb-2">
                    <input
                      type="number"
                      className="pl-3 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={edge}
                      onChange={(e) => setEdge(Number(e.target.value))}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-medium">
                      px
                    </div>
                  </div>
                )}
              </li>
              <li className="px-4 py-1">
                <div className="flex items-center justify-between">
                  <span>Sharing & Download Options</span>
                  <ToggleSwitch
                    checked={settingOptions.downloadOptions}
                    onChange={(value) =>
                      handleChangeSettingOption("downloadOptions", value)
                    }
                  />
                </div>
                {settingOptions.downloadOptions && (
                  <div className="mb-2">
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="twitter"
                          aria-describedby="twitter-description"
                          name="twitter"
                          type="checkbox"
                          checked={campaignData?.sharing_options?.twitter ?? false}
                          onChange={handleChangeSharingOptions}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <label
                        htmlFor="twitter"
                        className="ml-3 text-sm leading-6 flex items-center gap-1"
                      >
                        <div className="w-4 h-4 bg-black flex items-center justify-center rounded-[3px]">
                          <FaXTwitter className="text-white"/>
                        </div>
                        <span className="font-medium text-gray-900">
                          Twitter
                        </span>
                      </label>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="linkedin"
                          aria-describedby="linkedin-description"
                          name="linkedin"
                          checked={campaignData?.sharing_options?.linkedin ?? false}
                          onChange={handleChangeSharingOptions}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <label
                        htmlFor="linkedin"
                        className="ml-3 text-sm leading-6 flex items-center gap-1"
                      >
                        <FaLinkedin className="text-[#0077B5] text-lg"/>
                        <span className="font-medium text-gray-900">
                          Linkedin
                        </span>
                      </label>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="whatsapp"
                          aria-describedby="whatsapp-description"
                          name="whatsapp"
                          checked={campaignData?.sharing_options?.whatsapp ?? false}
                          onChange={handleChangeSharingOptions}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <label
                        htmlFor="whatsapp"
                        className="ml-3 text-sm leading-6 flex items-center gap-1"
                      >
                        <FaWhatsappSquare className="text-[#29A71A] text-lg"/>
                        <span className="font-medium text-gray-900">
                          WhatsApp
                        </span>
                      </label>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="facebook"
                          aria-describedby="facebook-description"
                          name="facebook"
                          checked={campaignData?.sharing_options?.facebook ?? false}
                          onChange={handleChangeSharingOptions}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <label
                        htmlFor="facebook"
                        className="ml-3 text-sm leading-6 flex items-center gap-1"
                      >
                        <FaFacebookSquare className="text-[#3A559F] text-lg" />
                        <span className="font-medium text-gray-900">
                          Facebook
                        </span>
                      </label>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="download"
                          aria-describedby="download-description"
                          name="download"
                          checked={campaignData?.sharing_options?.download ?? true}
                          onChange={handleChangeSharingOptions}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <label
                        htmlFor="download"
                        className="ml-3 text-sm leading-6 flex items-center gap-1"
                      >
                        <ArrowDownTrayIcon className="h-5 w-4 text-gray-black" />
                        <span className="font-medium text-gray-900">
                          Download
                        </span>
                      </label>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="email"
                          aria-describedby="email-description"
                          name="email"
                          checked={campaignData?.sharing_options?.email ?? false}
                          onChange={handleChangeSharingOptions}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <label
                        htmlFor="email"
                        className="ml-3 text-sm leading-6 flex items-center gap-1"
                      >
                        <AiOutlineMail className="h-5 w-4 text-md"/>
                        <span className="font-medium text-gray-900">Email</span>
                      </label>
                    </div>
                  </div>
                )}
              </li>
              <li className="px-4 py-1">
                <div className="flex items-center justify-between mb-2">
                  <span>Share Title</span>
                </div>
                <div className="relative rounded-md shadow-sm mb-2">
                  <textarea
                    className="pl-3 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={campaignData?.share_title ?? ""}
                    onChange={(e: any) => {
                      contextCampaignData({
                        ...campaignData,
                        share_title: e.target.value
                      })
                    }}
                  />
                </div>
              </li>
              <li className="px-4 py-1">
                <div className="flex items-center justify-between mb-2">
                  <span>Share Text</span>
                </div>
                <div className="relative rounded-md shadow-sm mb-2">
                  <textarea
                    className="pl-3 block min-h-[100px] w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={campaignData?.share_text ?? ""}
                    onChange={(e: any) => {
                      contextCampaignData({
                        ...campaignData,
                        share_text: e.target.value
                      })
                    }}
                  />
                </div>
              </li>
              <li className="px-4 py-1">
                <div className="flex items-center justify-between mb-2">
                  <span>Notification Title</span>
                </div>
                <div className="relative rounded-md shadow-sm mb-2">
                  <textarea
                    className="pl-3 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={campaignData?.notification_title ?? ""}
                    onChange={(e: any) => {
                      contextCampaignData({
                        ...campaignData,
                        notification_title: e.target.value
                      })
                    }}
                  />
                </div>
              </li>
              <li className="px-4 py-1">
                <div className="flex items-center justify-between mb-2">
                  <span>Notification Text</span>
                </div>
                <div className="relative rounded-md shadow-sm mb-2">
                  <textarea
                    className="pl-3 block min-h-[100px] w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={campaignData?.notification_text ?? ""}
                    onChange={(e: any) => {
                      contextCampaignData({
                        ...campaignData,
                        notification_text: e.target.value
                      })
                    }}
                  />
                </div>
              </li>
              <li className="flex items-center justify-between px-4 py-1">
                <span>Photo Gallery</span>
                <ToggleSwitch
                  checked={settingOptions.showGallery}
                  onChange={(value: any) =>
                    handleChangeSettingOption("showGallery", value)
                  }
                />
              </li>
              <li className="px-4 py-3">
                <span className="inline-block mb-3">
                  Select Placeholder Image
                </span>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {placeholders?.length 
                    ? placeholders?.filter(i => i.type == 'square').map((placeholder) => (
                      <React.Fragment key={placeholder._id}>
                        {placeholder.image && (
                          <div
                            className={`rounded object-cover cursor-pointer hover:opacity-50 transition border-2 w-12 h-12 ${
                              placeholder.image === selectedPlaceholderImage
                                ? `border-indigo-600`
                                : `border-transparent`
                            }`}
                            onClick={() =>
                              handleChangePlaceholderImage(placeholder.image)
                            }
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${placeholder.image}`}
                              loader={({ src, width }) => { return src + "?w=" + width }}
                              quality={50}
                              priority={true}
                              width={70}
                              height={70}
                            />
                          </div>
                          )}
                    </React.Fragment>))
                  : null
                }
                </div>
                <Button color="white" onClick={() => imageRef.current.click()}>
                  Upload Custom Image
                </Button>
                <input
                  type="file"
                  className="hidden"
                  ref={imageRef}
                  onChange={handleUploadPlaceholderImage}
                  accept="image/*"
                />
              </li>
              <li className="px-4 py-3">
                <span className="inline-block mb-3">
                  Select Placeholder Image For Story
                </span>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {placeholders?.length 
                    ? placeholders?.filter(i => i.type == 'story').map((placeholder) => (
                      <React.Fragment key={placeholder._id}>
                        {placeholder.image && (
                          <div
                            className={`rounded object-cover cursor-pointer hover:opacity-50 transition border-2 w-12 h-12 ${
                              placeholder.image === selectedPlaceholderImageForStory
                                ? `border-indigo-600`
                                : `border-transparent`
                            }`}
                            onClick={() =>
                              handleChangePlaceholderImageForStory(placeholder.image)
                            }
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${placeholder.image}`}
                              loader={({ src, width }) => { return src + "?w=" + width }}
                              quality={50}
                              priority={true}
                              width={70}
                              height={70}
                            />
                          </div>
                          
                        )}
                      </React.Fragment>))
                    : null
                  }
                </div>
                <Button color="white" onClick={() => imageRefForStory.current.click()}>
                  Upload Custom Image For Story
                </Button>
                <input
                  type="file"
                  className="hidden"
                  ref={imageRefForStory}
                  onChange={handleUploadPlaceholderImageForStory}
                  accept="image/*"
                />
              </li>
              <li className="px-4 py-3">
                <span className="inline-block mb-3">Background</span>
                <div>
                  <ColorPicker
                    value={backgroundColor}
                    onChange={(e) => handleChangeBackgroundColor(e)}
                  />
                  <Button
                    color="white"
                    onClick={() => bgImageRef.current.click()}
                  >
                    Upload Image
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    ref={bgImageRef}
                    onChange={handleUploadBackgroundImage}
                    accept="image/*"
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className={`w-full md:pl-80 ${campaignData?.dark_mode ? "dark" : ""} ${openSidebar && `overflow-hidden`}`}
      >
        <div className="md:pl-80 h-16 px-6 border-b bg-white flex justify-end items-center gap-2">
          <Button
            color="white"
            className="!px-2 flex md:hidden"
            onClick={handleNext}
          >
            <ArrowRightIcon className="text-black w-4" />
          </Button>
          <Button
            color="white"
            className="gap-1 !px-2 md:!px-3"
            onClick={handlePreview}
          >
            <EyeIcon className="w-5" />
            <span className="hidden md:inline">Preview Campaign</span>
          </Button>
          <Button
            color="success"
            className="gap-1 !px-2 md:!px-3"
            onClick={handleNext}
          >
            <RocketLaunchIcon className="w-5" />
            <span className="hidden md:inline">Save Campaign</span>
          </Button>
        </div>
        {loading ? (
          <div className="md:pl-80 w-full h-full flex items-center justify-center">
            <BeatLoader
              color={"#4F46E5"}
              loading={true}
              size={16}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <div
            className={`md:pl-80 min-h-full w-full overflow-auto py-10 pb-32 md:pb-10 flex flex-col items-center justify-start px-5 md:pr-5 ${campaignData?.dark_mode ? "!bg-gray-800" : ""}`}
            style={{
              background:
                campaignData?.background?.type === "color"
                  ? campaignData?.background?.value ?? "#FFF"
                  : `url(${process.env.NEXT_PUBLIC_APP_API_URL}/${campaignData?.background?.value})`,
            }}
          >
            <div
              className="w-full flex justify-center relative"
              style={{
                marginTop: (campaignData?.logo_setting?.padding_top ?? 0) * 1 ||  0,
                marginBottom: (campaignData?.logo_setting?.padding_bottom ?? 20) * 1 || 0,
              }}
            >
              <input
                type="file"
                className="hidden"
                ref={logoRef}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    APIService.campaign
                      .edit({
                        ...campaignData,
                        logo: e.target.files[0],
                      })
                      .then((res: any) => {
                        setLogo(res.data.logo);
                      });
                  }              
                }}
              />
              {settingOptions.showLogo && (
                <>
                  {campaignData?.logo ? (
                    <div
                      onClick={() => logoRef.current.click()}
                      className="cursor-pointer"
                      style={{
                        width: (campaignData?.logo_setting?.size ?? 80) * 1,
                        borderRadius: (campaignData?.logo_setting?.radius ?? 0) * 1,
                      }}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${campaignData?.logo}`}
                        loader={({ src, width }) => { return src + "?w=" + width }}
                        quality={50}
                        priority={true}
                        width={70}
                        height={70}
                      />
                    </div>
                    
                  ) : (
                    <>
                      <div className="w-full border-t-2 border-dashed h-0 absolute left-0 top-1/2"></div>
                      <span
                        className={`inline-block bg-gray-100 relative z-10 px-5 cursor-pointer text-gray-400 ${campaignData?.dark_mode ? "bg-gray-800 text-white" : ""}`}
                        onClick={() => logoRef.current.click()}
                      >
                        + Add Logo
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
            {settingOptions.showTitle && (
              <p
                className={`w-full max-w-[700px] bg-transparent border-none text-center py-0 outline-1 focus:outline-dashed hover:outline-dashed ${campaignData?.dark_mode ? "text-white" : ""}`}
                contentEditable
                suppressContentEditableWarning={true}
                onBlur={(e) => handleChangeTitle("text", e.target.innerText)}
                style={{
                  fontFamily: campaignData?.title?.font_family ?? "Inter",
                  fontWeight: (campaignData?.title?.font_weight ?? 700) * 1,
                  fontSize: (campaignData?.title?.font_size ?? 30) * 1,
                  color: (campaignData?.title?.color ?? "#000"),
                  paddingTop: (campaignData?.title?.padding_top ?? 0) * 1,
                  paddingBottom: (campaignData?.title?.padding_bottom ?? 20) * 1,
                  letterSpacing: (campaignData?.title?.letter_spacing ?? 0) * 1,
                  lineHeight: `${campaignData?.title?.line_height}px`,
                }}
              >
                {campaignData?.title?.text}
              </p>
            )}
            {settingOptions.showDescription && (
              <p
                className="w-full max-w-[700px] bg-transparent border-none text-center text-gray-500 py-0 dark:!text-gray-300 outline-1 focus:outline-dashed hover:outline-dashed"
                contentEditable
                suppressContentEditableWarning={true}
                onBlur={(e) =>
                  handleChangeDescription("text", e.target.innerText)
                }
                style={{
                  fontFamily: campaignData?.description?.font_family ?? "Inter",
                  fontWeight: (campaignData?.description?.font_weight ?? 400) * 1,
                  fontSize: (campaignData?.description?.font_size ?? 14) * 1,
                  color: (campaignData?.description?.color ?? "#000"),
                  paddingTop: (campaignData?.description?.padding_top ?? 0) * 1,
                  paddingBottom: (campaignData?.description?.padding_bottom ?? 20) * 1,
                  letterSpacing: (campaignData?.description?.letter_spacing ?? 0) * 1,
                  lineHeight: `${campaignData?.description?.line_height}px`,
                }}
              >
                {campaignData?.description?.text}
              </p>
            )}
            <div className="w-full h-full flex flex-col items-center justify-center gap-8 mb-[60px]">
              {campaignData?.filters?.map((filter: FilterType, index: number) => {
                return (
                  <div
                    className="relative flex flex-col items-center justify-center"
                    key={index}
                  >
                    <div
                      className={`w-full ${
                        filterDesignWidths[filter?.filter_design?.type ?? "square"]
                      } bg-white dark:bg-gray-700 shadow-lg ${campaignData?.dark_mode ? "bg-gray-700" : ""}`}
                      style={{ borderRadius: campaignData?.edge ?? 14  }}
                    >
                      <div
                        className="relative overflow-hidden"
                        style={{
                          borderTopLeftRadius:  campaignData?.edge ?? 14,
                          borderTopRightRadius:  campaignData?.edge ?? 14,
                        }}
                      >
                        
                        {filter?.filter_design?.type == 'square' && selectedPlaceholderImage && (
                          <div
                            className="absolute object-cover max-w-none"
                            style={{
                              width: `${filter?.rnd?.w}%`,
                              height: `${filter?.rnd?.h}%`,
                              left: `${filter?.rnd?.x}%`,
                              top: `${filter?.rnd?.y}%`,
                            }}
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${selectedPlaceholderImage}`}
                              loader={({ src, width }) => { return src + "?w=" + width }}
                              quality={50}
                              priority={true}
                              width={filter?.filter_design?.type == 'square' ? 350 : 290}
                              height={filter?.filter_design?.type == 'square' ? 450 : 350}
                            />
                          </div>
                          
                        )}
                        {filter?.filter_design?.type == 'story' && selectedPlaceholderImageForStory && (
                          <div
                            className="absolute object-cover max-w-none"
                            style={{
                              width: `${filter?.rnd?.w}%`,
                              height: `${filter?.rnd?.h}%`,
                              left: `${filter?.rnd?.x}%`,
                              top: `${filter?.rnd?.y}%`,
                            }}
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${selectedPlaceholderImageForStory}`}
                              loader={({ src, width }) => { return src + "?w=" + width }}
                              quality={50}
                              priority={true}
                              width={filter?.filter_design?.type == 'story' ? 290 : 350}
                              height={filter?.filter_design?.type == 'story' ? 450 : 350}
                            />
                          </div>
                        )}
                        {filter?.filter_design?.image && (
                          <div
                            className="relative z-10"
                            style={{
                              borderTopLeftRadius:  campaignData?.edge ?? 14,
                              borderTopRightRadius:  campaignData?.edge ?? 14,
                            }}
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${filter?.filter_design?.image}`}
                              loader={({ src, width }) => { return src + "?w=" + width }}
                              quality={50}
                              priority={true}
                              width={filter?.filter_design?.type == 'story' ? 290 : 350}
                              height={filter?.filter_design?.type == 'story' ? 450 : 350}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center p-4 pb-6 relative gap-2">
                        <p
                          contentEditable
                          className={`leading-8 border-none bg-transparent text-center text-gray-600 dark:text-white text-[13px] outline-1 focus:outline-dashed hover:outline-dashed px-3}`}
                          onBlur={(e) =>
                            contextCampaignData({
                              ...campaignData,
                              download_share: e.target.innerText,
                            })
                          }
                          suppressContentEditableWarning={true}
                        >
                          {campaignData?.download_share}
                        </p>
                        <div className="flex gap-3 mb-1">
                          {campaignData?.sharing_options?.linkedin && (
                            <FaLinkedin  className="text-[#0077B5] text-[50px] transition hover:opacity-70 cursor-pointer"/>
                          )}
                          {campaignData?.sharing_options?.facebook && (
                            <FaFacebookSquare className="text-[#3A559F] text-[50px] transition hover:opacity-70 cursor-pointer" />
                          )}
                          {campaignData?.sharing_options?.twitter && (
                            <FaXTwitter className="mt-[3px] text-white bg-black text-[44px] rounded-md transition hover:opacity-70 cursor-pointer"/>
                          )}
                          {campaignData?.sharing_options?.whatsapp && (
                            <FaWhatsappSquare className="text-[#29A71A] text-[50px] transition hover:opacity-70 cursor-pointer"/>
                          )}
                        </div>
                        {campaignData?.sharing_options?.download && (
                          <button 
                            className={`!bg-blue-900 max-w-full min-w-[232px] !flex !justify-center !items-center gap-2 min-h-11 rounded shadow !px-3 !py-[6px] border border-gray-100 transition hover:opacity-60 ${campaignData?.dark_mode ? "bg-gray-800 border-gray-800" : "border-gray-800"}`}
                            onClick={() => setOpenDownloadPanel(true)}
                            style={{
                              fontFamily: campaignData?.download_image?.font_family ?? "Inter",
                              fontWeight: (campaignData?.download_image?.font_weight ?? 400) * 1,
                              fontSize: (campaignData?.download_image?.font_size ?? 14) * 1,
                              color: (campaignData?.download_image?.color ?? "#FFF"),
                              paddingTop: (campaignData?.download_image?.padding_top ?? 0) * 1,
                              paddingBottom: (campaignData?.download_image?.padding_bottom ?? 20) * 1,
                              letterSpacing: (campaignData?.download_image?.letter_spacing ?? 0) * 1,
                              lineHeight: `${campaignData?.download_image?.line_height}px`,
                            }}
                          >
                            <ArrowDownTrayIcon className="w-5" />
                            <span
                              className="break-words"
                            >
                              {campaignData?.download_image?.text}
                            </span>
                          </button>
                        )}
                        {campaignData?.sharing_options?.email && (
                          <div className="flex items-center gap-2">
                            <TextField
                              placeholder="E-Mail Address"
                              className="text-center mt-2"
                            />
                            <Button>Send</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-full bg-white rounded-lg max-w-[350px]">
              {campaignData?.share_title && (
                <h2 className="break-words w-full font-semibold text-lg p-3">
                  {campaignData?.share_title}
                </h2>
              )}
              {campaignData?.share_text && (
                <div className="w-full bg-white rounded-lg shadow-md px-3 pb-3">
                <span className="break-words mb-3 opacity-80 text-xs">{campaignData?.share_text}</span>
                <button
                  className="text-sm hover:opacity-70 transition px-2 py-1 mt-2 flex items-center text-white bg-gray-500 rounded"
                  onClick={() => copy(campaignData?.share_text ?? "")}
                >
                  <FiSave className="text-xl mr-2"/>
                  Copy Text
                </button>
              </div>
              )}
            </div>
            {settingOptions.showGallery && <Button className="mt-5">Button</Button>}
          </div>
        )}
      </div>

      {/* logo setting panel */}
      <EmptyDrawer
        open={openLogoPanel}
        setOpen={setOpenLogoPanel}
        title="Logo Options"
      >
        <TextField
          type="number"
          value={campaignData?.logo_setting?.size}
          label="Size"
          onChange={(e: any) => handleChangeLogo("size", e.target.value)}
        />
        <TextField
          type="number"
          value={campaignData?.logo_setting?.radius}
          label="Radius"
          onChange={(e: any) => handleChangeLogo("radius", e.target.value)}
        />
        <p className="text-sm font-medium leading-6 border-t mt-4 pt-2">
          Padding
        </p>
        <div className="flex gap-3">
          <TextField
            type="number"
            value={campaignData?.logo_setting?.padding_top}
            label="Top"
            onChange={(e: any) => handleChangeLogo("padding_top", e.target.value)}
          />
          <TextField
            type="number"
            value={campaignData?.logo_setting?.padding_bottom}
            label="Bottom"
            onChange={(e: any) => handleChangeLogo("padding_bottom", e.target.value)}
          />
        </div>
      </EmptyDrawer>

      {/* title setting panel */}
      <EmptyDrawer
        open={openTitlePanel}
        setOpen={setOpenTitlePanel}
        title="Title Options"
      >
        {/* <div className="mb-2">
          <label className="inline-block font-medium text-sm mb-2">
            Font Family
          </label>
          {typeof window !== 'undefined' && 
            <FontPicker
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONT_API_KEY ?? "AIzaSyAIFjmFcyJq3yyRyW96NdNvpllmd5ZJeCE"}
              activeFontFamily={campaignData?.title?.font_family ?? "Inter"}
              onChange={(font: any) => handleChangeTitle("font_family", font.family)} 
              pickerId={""} 
              families={[]} 
              categories={[]} 
              scripts={[]} 
              variants={[]} 
              filter={function (font: Font): boolean {
                throw new Error("Function not implemented.");
              } } 
              limit={0}
              sort={"alphabet"}            
            />
          }
        </div> */}
        <div className="mb-2">
          <label className="block font-medium text-sm mb-2">Font Weight</label>
          <select
            value={campaignData?.title?.font_weight ?? 400}
            onChange={(e) => handleChangeTitle("font_weight", e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </select>
        </div>
        <TextField
          type="number"
          value={campaignData?.title?.font_size}
          label="Font Size"
          onChange={(e: any) => handleChangeTitle("font_size", e.target.value)}
        />
        <TextField
          type="number"
          value={campaignData?.title?.letter_spacing}
          label="Letter Spacing"
          onChange={(e: any) => handleChangeTitle("letter_spacing", e.target.value)}
        />
        <TextField
          type="number"
          value={campaignData?.title?.line_height}
          label="Line Height"
          onChange={(e: any) => handleChangeTitle("line_height", e.target.value)}
        />
        <ColorPicker
          value={campaignData?.title?.color ?? "#000"}
          label="Color"
          onChange={(e: any) => handleChangeTitle("color", e)}
        />
        <p className="text-sm font-medium leading-6 border-t mt-4 pt-2">
          Padding
        </p>
        <div className="flex gap-3">
          <TextField
            type="number"
            value={campaignData?.title?.padding_top}
            label="Top"
            onChange={(e: any) => handleChangeTitle("padding_top", e.target.value)}
          />
          <TextField
            type="number"
            value={campaignData?.title?.padding_bottom}
            label="Bottom"
            onChange={(e: any) =>
              handleChangeTitle("padding_bottom", e.target.value)
            }
          />
        </div>
      </EmptyDrawer>

      {/* description setting panel */}
      <EmptyDrawer
        open={openDescriptionPanel}
        setOpen={setOpenDescriptionPanel}
        title="Description Options"
      >
        {/* <div className="mb-2">
          <label className="inline-block font-medium text-sm mb-2">
            Font Family
          </label>
          {typeof window !== 'undefined' && 
            <FontPicker
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONT_API_KEY ?? "AIzaSyAIFjmFcyJq3yyRyW96NdNvpllmd5ZJeCE"}
              activeFontFamily={campaignData?.description?.font_family ?? "Inter"}
              onChange={(font: any) => handleChangeDescription("font_family", font.family)}pickerId={""} 
              families={[]} 
              categories={[]} 
              scripts={[]} 
              variants={[]} 
              filter={function (font: Font): boolean {
                throw new Error("Function not implemented.");
              } } 
              limit={0}
              sort={"alphabet"}
            />
          }
        </div> */}
        <div className="mb-2">
          <label className="block font-medium text-sm mb-2">Font Weight</label>
          <select
            value={campaignData?.description?.font_weight ?? 400}
            onChange={(e: any) =>
              handleChangeDescription("font_weight", e.target.value)
            }
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </select>
        </div>
        <TextField
          type="number"
          value={campaignData?.description?.font_size}
          label="Font Size"
          onChange={(e: any) => handleChangeDescription("font_size", e.target.value)}
        />
        <TextField
          type="number"
          value={campaignData?.description?.letter_spacing}
          label="Letter Spacing"
          onChange={(e: any) =>
            handleChangeDescription("letter_spacing", e.target.value)
          }
        />
        <TextField
          type="number"
          value={campaignData?.description?.line_height}
          label="Line Height"
          onChange={(e: any) =>
            handleChangeDescription("line_height", e.target.value)
          }
        />
        <ColorPicker
          value={campaignData?.description?.color ?? "#000"}
          label="Color"
          onChange={(e: any) => handleChangeDescription("color", e)}
        />
        <p className="text-sm font-medium leading-6 border-t mt-4 pt-2">
          Padding
        </p>
        <div className="flex gap-3">
          <TextField
            type="number"
            value={campaignData?.description?.padding_top}
            label="Top"
            onChange={(e: any) =>
              handleChangeDescription("padding_top", e.target.value)
            }
          />
          <TextField
            type="number"
            value={campaignData?.description?.padding_bottom}
            label="Bottom"
            onChange={(e: any) =>
              handleChangeDescription("padding_bottom", e.target.value)
            }
          />
        </div>
      </EmptyDrawer>
      {/* title setting panel */}
      <EmptyDrawer
        open={openTitlePanel}
        setOpen={setOpenTitlePanel}
        title="Title Options"
      >
        {/* <div className="mb-2">
          <label className="inline-block font-medium text-sm mb-2">
            Font Family
          </label>
          {typeof window !== 'undefined' && 
            <FontPicker
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONT_API_KEY ?? "AIzaSyAIFjmFcyJq3yyRyW96NdNvpllmd5ZJeCE"}
              activeFontFamily={campaignData?.title?.font_family ?? "Inter"}
              onChange={(font: any) => handleChangeTitle("font_family", font.family)} 
              pickerId={""} 
              families={[]} 
              categories={[]} 
              scripts={[]} 
              variants={[]} 
              filter={function (font: Font): boolean {
                throw new Error("Function not implemented.");
              } } 
              limit={0}
              sort={"alphabet"}            
            />
          }
        </div> */}
        <div className="mb-2">
          <label className="block font-medium text-sm mb-2">Font Weight</label>
          <select
            value={campaignData?.title?.font_weight ?? 400}
            onChange={(e) => handleChangeTitle("font_weight", e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </select>
        </div>
        <TextField
          type="number"
          value={campaignData?.title?.font_size}
          label="Font Size"
          onChange={(e: any) => handleChangeTitle("font_size", e.target.value)}
        />
        <TextField
          type="number"
          value={campaignData?.title?.letter_spacing}
          label="Letter Spacing"
          onChange={(e: any) => handleChangeTitle("letter_spacing", e.target.value)}
        />
        <TextField
          type="number"
          value={campaignData?.title?.line_height}
          label="Line Height"
          onChange={(e: any) => handleChangeTitle("line_height", e.target.value)}
        />
        <ColorPicker
          value={campaignData?.title?.color ?? "#000"}
          label="Color"
          onChange={(e: any) => handleChangeTitle("color", e)}
        />
        <p className="text-sm font-medium leading-6 border-t mt-4 pt-2">
          Padding
        </p>
        <div className="flex gap-3">
          <TextField
            type="number"
            value={campaignData?.title?.padding_top}
            label="Top"
            onChange={(e: any) => handleChangeTitle("padding_top", e.target.value)}
          />
          <TextField
            type="number"
            value={campaignData?.title?.padding_bottom}
            label="Bottom"
            onChange={(e: any) =>
              handleChangeTitle("padding_bottom", e.target.value)
            }
          />
        </div>
      </EmptyDrawer>

      {/* download setting panel */}
      <EmptyDrawer
        open={openDownloadPanel}
        setOpen={setOpenDownloadPanel}
        title="Download Image Options"
      >
        <TextField
          type="text"
          value={campaignData?.download_image?.text}
          label="Download Image Button Text"
          onChange={(e: any) => handleChangeDownloadImage("text", e.target.value)}
        />
        <TextField
          type="text"
          value={campaignData?.change_photo}
          label="Change Image Button Text"
          onChange={(e: any) => handleChangePhotoText(e.target.value)}
        />
        <div className="mb-2">
          <label className="block font-medium text-sm mb-2">Font Weight</label>
          <select
            value={campaignData?.download_image?.font_weight ?? 400}
            onChange={(e: any) =>
              handleChangeDownloadImage("font_weight", e.target.value)
            }
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </select>
        </div>
        <TextField
          type="number"
          value={campaignData?.download_image?.font_size}
          label="Font Size"
          onChange={(e: any) => handleChangeDownloadImage("font_size", e.target.value)}
        />
        <TextField
          type="number"
          value={campaignData?.download_image?.letter_spacing}
          label="Letter Spacing"
          onChange={(e: any) =>
            handleChangeDownloadImage("letter_spacing", e.target.value)
          }
        />
        <TextField
          type="number"
          value={campaignData?.download_image?.line_height}
          label="Line Height"
          onChange={(e: any) =>
            handleChangeDownloadImage("line_height", e.target.value)
          }
        />
        <ColorPicker
          value={campaignData?.download_image?.color ?? "#000"}
          label="Color"
          onChange={(e: any) => handleChangeDownloadImage("color", e)}
        />
        <p className="text-sm font-medium leading-6 border-t mt-4 pt-2">
          Padding
        </p>
        <div className="flex gap-3">
          <TextField
            type="number"
            value={campaignData?.download_image?.padding_top}
            label="Top"
            onChange={(e: any) =>
              handleChangeDownloadImage("padding_top", e.target.value)
            }
          />
          <TextField
            type="number"
            value={campaignData?.download_image?.padding_bottom}
            label="Bottom"
            onChange={(e: any) =>
              handleChangeDownloadImage("padding_bottom", e.target.value)
            }
          />
        </div>
      </EmptyDrawer>
    </div>
  );
};

export default Settings;
