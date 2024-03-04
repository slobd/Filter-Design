import { NextPage } from "next";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useAuth0 } from "@auth0/auth0-react";
import BeatLoader from "react-spinners/BeatLoader";
import copy from "copy-to-clipboard";
import Button from "../../../components/common/Button";
import ToggleSwitch from "../../../components/common/ToggleSwitch";
import { EyeIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
// import EmailIcon from "/assets/images/icons/email.png";
// import DownloadIcon from "/assets/images/icons/download.svg";
// import WhiteDownloadIcon from "/assets/images/icons/download-white.svg";
// import LinkedinIcon from "/assets/images/icons/linkedin.svg";
// import FacebookIcon from "/assets/images/icons/facebook.svg";
// import SmTwitterIcon from "/assets/images/icons/twitter-sm.svg";
// import WhatsappIcon from "/assets/images/icons/whatsapp.svg";
// import CameraIcon from "/assets/images/icons/camera.svg";
// import SettingIcon from "/assets/images/icons/setting-lines.svg";
// import WhiteSaveIcon from "/assets/images/icons/save-white.svg";
// import ArrowRightIcon from "/assets/images/icons/arrow-right.svg";
// import {
//   setCampaign,
//   addPlaceholder,
//   setPlaceholders,
//   setFilterDesigns,
//   setLoading,
// } from "store/actions/Campaign";
import CreatorLayout from '../../../components/Layout/Creator';
import EmptyDrawer from "../../../components/drawers/EmptyDrawer";
import { APIService } from "../../../api";
import TextField from "../../../components/common/TextField";
import ColorPicker from "../../../components/common/ColorPicker";
import { useAppContext } from "../../../context/context";
import { FilterType, FilterDesignType, LogoType, PlaceholderType, TextType, sharingOptionType } from '../../../utils/types';
import { textTypeDefaultValue, logoTypeDefaultValue, filterDesignWidths} from '../../../utils/constants';
import { Font } from "@samuelmeuli/font-manager";

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
  const [openDescriptionPanel, setOpenDescriptionPanel] = useState(false);
  const [password, setPassword] = useState("");
  const [edge, setEdge] = useState(0);
  const [shareTitle, setShareTitle] = useState("");
  const [shareText, setShareText] = useState("");
  const [logo, setLogo] = useState(campaignData?.logo);
  const [title, setTitle] = useState<TextType>(campaignData?.title
    ?? {
      ...textTypeDefaultValue,
      text: "Share your Photo with your Network and Friends",
    }
  );
  const [logoSetting, setLogoSetting] = useState<LogoType>(logoTypeDefaultValue);
  const [description, setDescription] = useState<TextType>(
    campaignData?.description
    ?? {
      ...textTypeDefaultValue,
      text: "It’s easy! Just upload a photo and get a visual filter to share with your network and friends.",
    }
  );
  const [showPassword, setShowPassword] = useState(false);
  const [sharingOptions, setSharingOptions] = useState<sharingOptionType>({
    twitter: false,
    linkedin: false,
    whatsapp: false,
    facebook: false,
    download: true,
    email: false,
  });
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
  const [filterDesigns, setFilterDesigns] = useState<FilterDesignType[]>([]); 
  const [loading, setLoading] = useState(false);

  const handleChangeLogo = (target: any, value: any) => {
    setLogoSetting({ ...logoSetting, [target]: value });
    contextCampaignData({
      ...campaignData,
      logo_setting: { ...campaignData?.logo_setting, [target]: value }
    });
  };

  const handleChangeTitle = (target: any, value: any) => {
    setTitle({ ...title, [target]: value });
    contextCampaignData({
      ...campaignData,
      title: { ...campaignData?.title, [target]: value }
    });
  };

  const handleChangeDescription = (target: any, value: any) => {
    setDescription({ ...description, [target]: value });
    contextCampaignData({
      ...campaignData,
      description: { ...campaignData?.description, [target]: value }
    });
    const metaDescription = document.getElementById('metaDescription');
    // Set the meta description based on the content of description
    if(metaDescription) {
       metaDescription.setAttribute('content', value);
    }
  };

  const handleChangeSharingOptions = (e: any) => {
    setSharingOptions({ ...sharingOptions, [e.target.name]: e.target.checked });
    contextCampaignData({
      ...campaignData,
      sharing_options: { ...campaignData?.sharing_options, [e.target.name]: e.target.checked }
    });
  };

  const handleChangeSettingOption = (target: any, value: any) => {
    setSettingOptions({ ...settingOptions, [target]: value });
    if(target == 'lightMode') {
      setDescription({
        ...description,
        color: "#6b7280",
      });
      setTitle({
        ...title,
        color: "#FFF"
      });

      contextCampaignData({
        ...campaignData,
        title: {
          ...campaignData?.title,
          color: "#FFF"
        },
        description: {
          ...campaignData?.description,
          color: "#6b7280"
        }
      })
    }
  };

  const handleUploadPlaceholderImage = (e: any) => {
    APIService.placeholder.create({ image: e.target.files[0], type: 'square' })
      .then((res: any) => {
        setPlaceholders(res.data);
        setSelectedPlaceholderImage(res.data.image);
      });
  };

  const handleUploadPlaceholderImageForStory = (e: any) => {
    APIService.placeholder.create({ image: e.target.files[0], type: 'story' })
    .then((res: any) => {
      setPlaceholders(res.data);
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
        contextCampaignData({ ...campaignData, ...res.data });
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
        contextCampaignData({ ...campaignData, ...res.data });
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
    if (!settingOptions.downloadOptions)
      setSharingOptions({
        twitter: false,
        linkedin: false,
        whatsapp: false,
        facebook: false,
        download: true,
        email: false,
      });
    if (!settingOptions.showLogo) setLogo(null || campaignData?.logo);
    contextCampaignData({
      ...campaignData,
      logo: settingOptions.showLogo && logo ? logo : null,
      title: settingOptions.showTitle
        ? {
            ...title,
            text:
              title?.text !== ""
                ? title?.text
                : "Share your Photo with your Network and Friends",
          }
        : {
            text: "",
            font_family: "Inter",
            font_weight: 700,
            font_size: 30,
            color: "#000",
            letter_spacing: 0,
            line_height: 45,
            padding_top: 0,
            padding_bottom: 0,
          },
      logo_setting: { ...campaignData?.logo_setting, ...logoSetting },
      description: settingOptions.showDescription
        ? {
            ...description,
            text:
              description?.text !== ""
                ? description?.text
                : "It’s easy! Just upload a photo and get a visual filter to share with your network and friends.",
          }
        : {
            text: "",
            font_family: "Inter",
            font_weight: 400,
            font_size: 14,
            color: "#000",
            letter_spacing: 0,
            line_height: 21,
            padding_top: 0,
            padding_bottom: 20,
          },
      dark_mode: settingOptions.lightMode,
      hide_size_buttons: settingOptions.hideSizeButtons,
      active_slider_mode: settingOptions.activeSliderMode,
      password: settingOptions.passwordProtected ? password : null,
      edge: settingOptions.enableEdge ? edge * 1 : 0,
      share_title: shareTitle,
      share_text: shareText,
      // sharing_options: settingOptions.downloadOptions
      //   ? { ...sharingOptions }
      //   : {
      //       twitter: false,
      //       linkedin: false,
      //       whatsapp: false,
      //       facebook: false,
      //       download: true,
      //       email: false,
      //     },
      show_gallery: settingOptions.showGallery,
      // placeholder_image: selectedPlaceholderImage,
      // placeholder_story_image: selectedPlaceholderImageForStory,
    })
  }, [ 
  //   logo,
  //   logoSetting,
  //   title,
  //   description,
  //   password,
    settingOptions,
  //   selectedPlaceholderImage,
  //   selectedPlaceholderImageForStory,
  //   sharingOptions,
  //   edge,
  //   shareTitle,
  //   shareText, 
  ]);

  const getActiveSocial = (data: any) => {
    return (
      data.twitter ||
      data.linkedin ||
      data.whatsapp ||
      data.linkedin ||
      data.download
    );
  };

  useEffect(() => {
    if(!campaignData) return;
    APIService.placeholder.getAll().then((res: any) => {
      getInitData();
      setPlaceholders(res.data);
      if (!campaignData?.placeholder_image) setSelectedPlaceholderImage("uploads/default_placeholder_image.png");
      if (!campaignData?.placeholder_story_image) setSelectedPlaceholderImageForStory("uploads/default_placeholder_image.png");
      
    });
    // setSettingOptions({
    //   ...settingOptions,
    //   showLogo: !!campaignData?.logo,
    //   // showTitle: campaignData?.title?.text !== "" ? true : false,
    //   // showDescription: campaignData?.description?.text !== "" ? true : false,
    //   activeSliderMode: !!campaignData?.active_slider_mode,
    //   lightMode: !!campaignData?.dark_mode,
    //   hideSizeButtons: !!campaignData?.hide_size_buttons,
    //   passwordProtected: campaignData?.password ? true : false,
    //   downloadOptions: campaignData?.sharing_options
    //     ? getActiveSocial(campaignData?.sharing_options)
    //     : false,
    //   showGallery: campaignData?.show_gallery ? true : false,
    //   enableEdge: campaignData?.edge !== 0,
    // });
    setEdge(campaignData?.edge ?? 14);
    setShareTitle(campaignData?.share_title ?? "");
    setShareText(campaignData?.share_text ?? "");
    campaignData?.logo && setLogo(campaignData.logo);
    setTitle({ ...campaignData?.title ?? textTypeDefaultValue});
    setLogoSetting({ ...campaignData?.logo_setting ?? logoTypeDefaultValue });
    setDescription({ ...campaignData?.description ?? textTypeDefaultValue });
    campaignData?.description && setDescription(campaignData?.description);
    campaignData?.password && setPassword(campaignData?.password);
    campaignData?.sharing_options &&
      setSharingOptions({ ...campaignData?.sharing_options });
      campaignData?.placeholder_image &&
      setSelectedPlaceholderImage(campaignData?.placeholder_image);
      campaignData?.placeholder_story_image &&
      setSelectedPlaceholderImageForStory(campaignData?.placeholder_story_image);
      campaignData?.background?.type === "color" &&
      setBackgroundColor(campaignData?.background.value ?? "#FFF");
  }, [campaignData]);

  const handleChangeText = (text: any) => {
    contextCampaignData({ change_photo: text });
  };

  useEffect(() => {
    APIService.filter.getAll(user?.email).then((res: any) => {
      setFilterDesigns(res.data);
    });
  }, []);

  useEffect(() => {
    const loadFontPicker = async () => {
        const FontPicker = (await import('font-picker-react')).default;
        // Use FontPicker here
    };
    if (typeof window !== 'undefined') {
        loadFontPicker();
    }
  }, []);

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
          <img
            src="/assets/images/icons/arrow-right.svg"
            className={`w-6 ${
              !openSidebar ? `rotate-0` : `rotate-180`
            } transition`}
          />
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
                    <img
                      src="/assets/images/icons/setting-lines.svg"
                      className="w-5 brightness-0 opacity-60 cursor-pointer"
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
                    <img
                      src="/assets/images/icons/setting-lines.svg"
                      className="w-5 brightness-0 opacity-60 cursor-pointer"
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
                    <img
                      src="/assets/images/icons/setting-lines.svg"
                      className="w-5 brightness-0 opacity-60 cursor-pointer"
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
                          checked={sharingOptions?.twitter ?? false}
                          onChange={handleChangeSharingOptions}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <label
                        htmlFor="twitter"
                        className="ml-3 text-sm leading-6 flex items-center gap-1"
                      >
                        <div className="w-4 h-4 bg-black flex items-center justify-center rounded-[3px]">
                          <img src="/assets/images/icons/twitter-sm.svg" className="w-2 invert" />
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
                          checked={sharingOptions.linkedin ?? false}
                          onChange={handleChangeSharingOptions}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <label
                        htmlFor="linkedin"
                        className="ml-3 text-sm leading-6 flex items-center gap-1"
                      >
                        <img src="/assets/images/icons/linkedin.svg" className="w-4" />
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
                          checked={sharingOptions.whatsapp ?? false}
                          onChange={handleChangeSharingOptions}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <label
                        htmlFor="whatsapp"
                        className="ml-3 text-sm leading-6 flex items-center gap-1"
                      >
                        <img src="/assets/images/icons/whatsapp.svg" className="w-4" />
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
                          checked={sharingOptions.facebook ?? false}
                          onChange={handleChangeSharingOptions}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <label
                        htmlFor="facebook"
                        className="ml-3 text-sm leading-6 flex items-center gap-1"
                      >
                        <img src="/assets/images/icons/facebook.svg" className="w-4" />
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
                          checked={sharingOptions.download ?? true}
                          onChange={handleChangeSharingOptions}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <label
                        htmlFor="download"
                        className="ml-3 text-sm leading-6 flex items-center gap-1"
                      >
                        <img src="/assets/images/icons/download.svg" className="w-4" />
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
                          checked={sharingOptions.email ?? false}
                          onChange={handleChangeSharingOptions}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <label
                        htmlFor="email"
                        className="ml-3 text-sm leading-6 flex items-center gap-1"
                      >
                        <img src="/assets/images/icons/email.png" className="w-4" />
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
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                  />
                </div>
              </li>
              <li className="px-4 py-1">
                <div className="flex items-center justify-between mb-2">
                  <span>Share Text</span>
                </div>
                <div className="relative rounded-md shadow-sm mb-2">
                  <textarea
                    className="pl-3 block min-h-[160px] w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={shareText}
                    onChange={(e) => setShareText(e.target.value)}
                  />
                </div>
              </li>
              <li className="flex items-center justify-between px-4 py-1">
                <span>Photo Gallery</span>
                <ToggleSwitch
                  checked={settingOptions.showGallery}
                  onChange={(value) =>
                    handleChangeSettingOption("showGallery", value)
                  }
                />
              </li>
              <li className="px-4 py-3">
                <span className="inline-block mb-3">
                  Select Placeholder Image
                </span>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {placeholders.filter(i => i.type == 'square').map((placeholder) => (
                    <React.Fragment key={placeholder._id}>
                      {placeholder.image && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${placeholder.image}`}
                          className={`rounded object-cover cursor-pointer hover:opacity-50 transition border-2 ${
                            placeholder.image === selectedPlaceholderImage
                              ? `border-indigo-600`
                              : `border-transparent`
                          }`}
                          onClick={() =>
                            handleChangePlaceholderImage(placeholder.image)
                          }
                        />
                      )}
                    </React.Fragment>
                  ))}
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
                  {placeholders.filter(i => i.type == 'story').map((placeholder) => (
                    <React.Fragment key={placeholder._id}>
                      {placeholder.image && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${placeholder.image}`}
                          className={`rounded object-cover cursor-pointer hover:opacity-50 transition border-2 ${
                            placeholder.image === selectedPlaceholderImage
                              ? `border-indigo-600`
                              : `border-transparent`
                          }`}
                          onClick={() =>
                            handleChangePlaceholderImageForStory(placeholder.image)
                          }
                        />
                      )}
                    </React.Fragment>
                  ))}
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
            <img src="/assets/images/icons/arrow-right.svg" className="w-5" />
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
            <span className="hidden md:inline">Save & Publish Campaign</span>
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
                        contextCampaignData({ ...campaignData, ...res.data });
                        setLogo(res.data.logo);
                      });
                  }              
                }}
              />
              {settingOptions.showLogo && (
                <>
                  {campaignData?.logo ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${campaignData?.logo}`}
                      className="cursor-pointer"
                      onClick={() => logoRef.current.click()}
                      style={{
                        width: (campaignData?.logo_setting?.size ?? 80) * 1,
                        borderRadius: (campaignData?.logo_setting?.radius ?? 0) * 1,
                      }}
                    />
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
                          <img
                            src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${selectedPlaceholderImage}`}
                            className="absolute object-cover max-w-none"
                            style={{
                              width: `${filter?.rnd?.w}%`,
                              height: `${filter?.rnd?.h}%`,
                              left: `${filter?.rnd?.x}%`,
                              top: `${filter?.rnd?.y}%`,
                            }}
                          />
                        )}
                        {filter?.filter_design?.type == 'story' && selectedPlaceholderImageForStory && (
                          <img
                            src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${selectedPlaceholderImageForStory}`}
                            className="absolute object-cover max-w-none"
                            style={{
                              width: `${filter?.rnd?.w}%`,
                              height: `${filter?.rnd?.h}%`,
                              left: `${filter?.rnd?.x}%`,
                              top: `${filter?.rnd?.y}%`,
                            }}
                          />
                        )}
                        {filter?.filter_design?.image && (
                          <img
                            src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${filter?.filter_design?.image}`}
                            className="relative z-10"
                            style={{
                              borderTopLeftRadius:  campaignData?.edge ?? 14,
                              borderTopRightRadius:  campaignData?.edge ?? 14,
                            }}
                          />
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
                          {sharingOptions.linkedin && (
                            <img
                              src="/assets/images/icons/linkedin.svg"
                              className="w-11 transition hover:opacity-60 cursor-pointer"
                            />
                          )}
                          {sharingOptions.facebook && (
                            <img
                              src="/assets/images/icons/facebook.svg"
                              className="w-11 transition hover:opacity-60 cursor-pointer"
                            />
                          )}
                          {sharingOptions.twitter && (
                            <div className="w-11 h-11 bg-black flex items-center justify-center rounded-md cursor-pointer transition hover:opacity-60">
                              <img src="/assets/images/icons/twitter-sm.svg" className="w-6 invert" />
                            </div>
                          )}
                          {sharingOptions.whatsapp && (
                            <img
                              src="/assets/images/icons/whatsapp.svg"
                              className="w-11 transition hover:opacity-60 cursor-pointer"
                            />
                          )}
                        </div>
                        {sharingOptions.download && (
                          <button className={`bg-blue-900 max-w-full min-w-[232px] flex justify-center items-center gap-2 min-h-11 rounded shadow px-3 py-[6px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 transition hover:opacity-60 ${campaignData?.dark_mode ? "bg-gray-800 border-gray-800" : ""}`}>
                            <img
                              src="/assets/images/icons/download-white.svg"
                              className="w-5"
                            />
                            <span
                              className="font-medium text-white break-all"
                              contentEditable
                              onBlur={(e) =>
                                contextCampaignData({
                                  ...campaignData,
                                  download_image: e.target.innerText,
                                })
                              }
                              suppressContentEditableWarning={true}
                            >
                              {campaignData?.download_image}
                            </span>
                          </button>
                        )}
                        {sharingOptions.email && (
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
              {shareTitle && (
                <h2 className="break-all w-full font-semibold text-lg p-3">
                  {shareTitle}
                </h2>
              )}
              {shareText && (
                <div className="w-full bg-white rounded-lg shadow-md px-3 pb-3">
                <span className="break-all mb-3 opacity-80 text-xs">{shareText}</span>
                <button
                  className="text-sm hover:opacity-70 transition px-2 py-1 mt-2 flex items-center text-white bg-gray-500 rounded"
                  onClick={() => copy(shareText)}
                >
                  <img 
                    src="/assets/images/icons/save-white.svg" 
                    // className={`!w-4 dark:invert mr-2 ${campaignData?.dark_mode ? "invert" : ""}`}
                    className={`!w-4 dark:invert mr-2`} 
                  />
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
          value={logoSetting.size}
          label="Size"
          onChange={(e: any) => handleChangeLogo("size", e.target.value)}
        />
        <TextField
          type="number"
          value={logoSetting.radius}
          label="Radius"
          onChange={(e: any) => handleChangeLogo("radius", e.target.value)}
        />
        <p className="text-sm font-medium leading-6 border-t mt-4 pt-2">
          Padding
        </p>
        <div className="flex gap-3">
          <TextField
            type="number"
            value={logoSetting.padding_top}
            label="Top"
            onChange={(e: any) => handleChangeLogo("padding_top", e.target.value)}
          />
          <TextField
            type="number"
            value={logoSetting.padding_bottom}
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
        <div className="mb-2">
          <label className="inline-block font-medium text-sm mb-2">
            Font Family
          </label>
          {typeof window !== 'undefined' && 
            <FontPicker
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONT_API_KEY ?? "AIzaSyAIFjmFcyJq3yyRyW96NdNvpllmd5ZJeCE"}
              activeFontFamily={title.font_family ?? "Inter"}
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
        </div>
        <div className="mb-2">
          <label className="block font-medium text-sm mb-2">Font Weight</label>
          <select
            value={title.font_weight ?? 400}
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
          value={title.font_size}
          label="Font Size"
          onChange={(e: any) => handleChangeTitle("font_size", e.target.value)}
        />
        <TextField
          type="number"
          value={title.letter_spacing}
          label="Letter Spacing"
          onChange={(e: any) => handleChangeTitle("letter_spacing", e.target.value)}
        />
        <TextField
          type="number"
          value={title.line_height}
          label="Line Height"
          onChange={(e: any) => handleChangeTitle("line_height", e.target.value)}
        />
        <ColorPicker
          value={title.color ?? "#000"}
          label="Color"
          onChange={(e: any) => handleChangeTitle("color", e)}
        />
        <p className="text-sm font-medium leading-6 border-t mt-4 pt-2">
          Padding
        </p>
        <div className="flex gap-3">
          <TextField
            type="number"
            value={title.padding_top}
            label="Top"
            onChange={(e: any) => handleChangeTitle("padding_top", e.target.value)}
          />
          <TextField
            type="number"
            value={title.padding_bottom}
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
        <div className="mb-2">
          <label className="inline-block font-medium text-sm mb-2">
            Font Family
          </label>
          {typeof window !== 'undefined' && 
            <FontPicker
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONT_API_KEY ?? "AIzaSyAIFjmFcyJq3yyRyW96NdNvpllmd5ZJeCE"}
              activeFontFamily={description.font_family ?? "Inter"}
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
        </div>
        <div className="mb-2">
          <label className="block font-medium text-sm mb-2">Font Weight</label>
          <select
            value={description.font_weight ?? 400}
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
          value={description.font_size}
          label="Font Size"
          onChange={(e: any) => handleChangeDescription("font_size", e.target.value)}
        />
        <TextField
          type="number"
          value={description.letter_spacing}
          label="Letter Spacing"
          onChange={(e: any) =>
            handleChangeDescription("letter_spacing", e.target.value)
          }
        />
        <TextField
          type="number"
          value={description.line_height}
          label="Line Height"
          onChange={(e: any) =>
            handleChangeDescription("line_height", e.target.value)
          }
        />
        <ColorPicker
          value={description.color ?? "#000"}
          label="Color"
          onChange={(e: any) => handleChangeDescription("color", e)}
        />
        <p className="text-sm font-medium leading-6 border-t mt-4 pt-2">
          Padding
        </p>
        <div className="flex gap-3">
          <TextField
            type="number"
            value={description.padding_top}
            label="Top"
            onChange={(e: any) =>
              handleChangeDescription("padding_top", e.target.value)
            }
          />
          <TextField
            type="number"
            value={description.padding_bottom}
            label="Bottom"
            onChange={(e: any) =>
              handleChangeDescription("padding_bottom", e.target.value)
            }
          />
        </div>
      </EmptyDrawer>
    </div>
  );
};

export default Settings;
