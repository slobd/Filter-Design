import { NextPage } from "next";
import { Fragment, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth0 } from "@auth0/auth0-react";
import domtoimage from "dom-to-image";
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { Font } from "@samuelmeuli/font-manager";
import dynamic from "next/dynamic";
import { Dialog, Transition } from "@headlessui/react";
import copy from "copy-to-clipboard";
import { ThreeDots } from 'react-loader-spinner'
import { dataURLtoFile } from "../../../utils";
import { APIService } from "../../../api";
import { CameraIcon } from '@heroicons/react/20/solid';
import { ArrowLeftIcon, ArrowRightIcon, } from '@heroicons/react/20/solid';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaLinkedin, FaWhatsappSquare, FaFacebookSquare } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiSave } from "react-icons/fi";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import TextField from "../../../components/common/TextField";
import Button from "../../../components/common/Button";
import Notification from "../../../components/Notification";
import { filterDesignWidths } from "../../../utils/constants";
import { CampaignType, GalleryType, FilterType } from '../../../utils/types';
import { useAppContext } from "../../../context/context";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
interface FilterCardProps {
    filter: FilterType;
    i: number;
}

const User: NextPage = () => {
    const { user } = useAuth0();
    const router = useRouter();
    const { pathname, query } = router;
    const { campaigns } = useAppContext();
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [passed, setPassed] = useState(false);
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [campaign, setCampaign] = useState<CampaignType>();
    const [image, setImage] = useState<any[]>([]);
    const [gallery, setGallery] = useState<GalleryType[]>([]);
    const [visibileSizeButtons, setVisibileSizeButtons] = useState(true);
    const [grayHeight, setGrayHeight] = useState(288);
    const [timer, setTimer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [stackedViewMode, setStackedViewMode] = useState(true);
    const [filters, setFilters] = useState<any>();
    const [activeCarouselIndex, setActiveCarouselIndex] = useState(0)
    const [showNotification, setShowNotification] = useState(false);
    const [showCopyTextNotification, setShowCopyTextNotification] = useState(false);
    const [showImageProcessCompletedNotification, setShowImageProcessCompletedNotification] = useState(false);
    const [showImageProcessingNotification, setShowImageProcessingNotification] = useState(false);
    const [uploaded, setUploaded] = useState(false);
 
    const fileRef = useRef<any>();
    const filterTabRef = useRef<any>();
    const filterTabRef2 = useRef<any>();

    // const imageUrl = useMemo(() => {
    //     if(selectedIndex !== null && image[selectedIndex]) {
    //         return URL.createObjectURL(image[selectedIndex])
    //     }
    // }, [image, selectedIndex]);

    const handleChangeImage = (e: any) => {
        if (campaign?.password && e.target.files) {
            passed ? handleConfirm() : setOpen(true);
        } else {
            handleGenerate();
        }
    };

    const handleSendEmail = (i: any) => {
        APIService.gallery.sendGalleryByEmail({
            email,
            gallery: `${process.env.NEXT_PUBLIC_APP_API_URL}/${gallery[i]}`,
        });
    };

    const buildPng = async (index: any) => {

        const dom = document.querySelector<HTMLElement>(`#card-${index}`);
        
        if(dom) {
            const { width, height } = dom.getBoundingClientRect();
            const options = { quality: 0.95, width, height };

            let dataUrl = '';
            const minDataLength = 100000;
            let i = 0;
            const maxAttempts = 10;
            console.log("dom", dom)
        
            while (dataUrl.length < minDataLength && i < maxAttempts) {
                dataUrl = await toPng(dom, options);
                console.log("dataUrl, length", dataUrl.length);
                i += 1;
            }
            return dataUrl;
        }
    };

    const handleDownload = async(i: any) => {
        if(!image) {
            alert("Please select an image")
        } else {
            const dataUrl = await buildPng(i);
            if(dataUrl) {
                var link = document.createElement("a");
                link.download = "image.png";
                link.href = dataUrl;
                link.click();
                setShowNotification(true);
            } else {
                console.log("image create failed");
            }
            
        }
    };

    const handleClickUploadButton = (i: number) => {
        fileRef.current.click();
        setSelectedIndex(i);
    };

    const handleGenerate = () => {
        console.log("selectedIndex", selectedIndex);
        console.log("fileRef.current.files[0];", fileRef.current.files[0])
        setUploaded(true);
        let clonedImage = [...image];
        clonedImage[selectedIndex] = fileRef.current.files[0];
        setImage([...clonedImage]);
        setOpen(false);
        setPassed(true);
        // setShowImageProcessingNotification(true)
        setTimeout(async() => {
            const dataUrl = await buildPng(selectedIndex);
            if(dataUrl) {
                const _filter_design_id = campaign?.filters?.[selectedIndex]?.filter_design?._id;
                APIService.gallery
                    .create({
                        campaign_id: campaign?._id,
                        filter_design_id: _filter_design_id,
                        author: user?.email,
                        image: dataURLtoFile(dataUrl, fileRef.current.files[0]?.name),
                    })
                    .then((res: any) => {
                        console.log(" gallery created", res.data.path);
                        // setShowImageProcessCompletedNotification(true);
                        let clonedGallery = [...gallery];
                        clonedGallery[selectedIndex] = res.data.path;
                        setGallery([...clonedGallery]);
                        setTimeout(() => {
                            setLoading(false);
                        }, 2000)
                    });
            } else {
                console.log("image creation failed")
            }
                
        }, 300);
        fileRef.current.value = "";
    };

    const handleConfirm = () => {
        APIService.campaign
            .confirmPassword({
                slug: query?.slug,
                password,
            })
            .then((res: any) => {
                if (res.data.status) {
                    setOpen(false);
                    handleGenerate();
                    setError(false);
                } else {
                    setError(true);
                }
            });
    };

    const handleCancel = () => {
        setOpen(false);
        fileRef.current.value = "";
    };

    const handleSlideChange = (index: any) => {
        setLoading(true);
        setActiveCarouselIndex(index);
        setTimeout(() => {
            setLoading(false);
        }, 100)
    };

    useEffect(() => {
        if (query?.slug && query?.slug !== undefined) {
            APIService.campaign.getBySlug(query?.slug).then((res: any) => {
                setCampaign({ ...res.data });
                setFilters(res.data.filters);
                if(res.data.activate_filters) {
                    setFilters(res.data.filters?.filter((i: any) => i?.filter_design.type == 'square'))
                }
            });
        }
    }, [query?.slug]);

    useEffect(() => {
        if(stackedViewMode) {
            setFilters(campaign?.filters?.filter((i: any) => i.filter_design.type == 'square'))
        } else {
            setFilters(campaign?.filters?.filter((i: any) => i.filter_design.type == 'story'))
        }
    }, [stackedViewMode])

    useEffect(() => {
        if (campaign?.filters) {
            setImage(campaign?.filters.map(i => null))
            const squareFilters = campaign?.filters.filter(i => i.filter_design?.type == 'square');
            const storyFilters = campaign?.filters.filter(i => i.filter_design?.type == 'story');
            if (squareFilters.length && storyFilters.length) {
                setVisibileSizeButtons(true);
            } else if (squareFilters.length) {
                setVisibileSizeButtons(false);
            } else if (storyFilters.length) {
                setVisibileSizeButtons(false);
            } else {
                setVisibileSizeButtons(false);
            }
            if (campaign?.filters.length <= 1) setVisibileSizeButtons(false);
        }
    }, [campaign]);

    useEffect(() => {
        if(!user?.email != undefined && campaigns.length > 0) {
            setTimeout(() => {
                setLoaded(true);
                setLoading(false);
            }, 2500)
        }
        
    }, [user?.email, campaigns])

    console.log("image;", image)

    const FilterCard: NextPage<FilterCardProps> = ({ filter, i }) => {
        const [tab, setTab] = useState("download");
        return (
            <>
                <div
                    className={`relative items-center ${filterDesignWidths[filter.filter_design?.type ?? "square"]}`}
                    key={i}
                    style={{  maxWidth: filter.filter_design?.type == "square" ? 350 : 290 }}
                >
                    <div
                        className={`bg-white dark:bg-gray-700 shadow-md overflow-hidden`}
                        style={{ borderRadius: campaign?.edge ?? 14 }}
                    >
                        <ThreeDots
                            visible={loading}
                            height="80"
                            width="80"
                            color="#E7E8EA"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass={`absolute top-[175px] ${filter?.filter_design?.type == 'story' ? 'left-[105px]' : 'left-[135px]'}`}
                        />
                        <div id={`card-${i}`} className={`${filter.filter_design?.type == "square" ? "w-[350px] h-[350px]": "w-[290px] h-[515px]"} ${!loading ? 'visible' : 'invisible'} relative flex-shrink-0 overflow-hidden`}>
                            {image[i] &&  image[i] !== undefined ? (
                                <img
                                    className="absolute object-cover pointer-events-none max-w-none overflow-hidden"
                                    src={URL.createObjectURL(image[i])}
                                    style={{
                                        width: `${filter?.rnd?.w}%`,
                                        height: `${filter?.rnd?.h}%`,
                                        left: `${filter?.rnd?.x}%`,
                                        top: `${filter?.rnd?.y}%`,
                                    }}
                                />
                            ) : (
                                campaign?.placeholder_story_image !== undefined && 
                                <img
                                    className="absolute object-cover pointer-events-none max-w-none overflow-hidden"
                                    src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${filter?.filter_design?.type == 'story' ? campaign?.placeholder_story_image : campaign?.placeholder_image}`}
                                    style={{
                                        width: `${filter?.rnd?.w}%`,
                                        height: `${filter?.rnd?.h}%`,
                                        left: `${filter?.rnd?.x}%`,
                                        top: `${filter?.rnd?.y}%`,
                                    }}
                                />
                            )}
                            <div className="absolute z-10">
                                { filter?.filter_design?.image && filter?.filter_design?.image !== undefined &&
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${filter?.filter_design?.image}`}
                                        width={filter?.filter_design?.type == 'story' ? 290 : 350}
                                        height={filter?.filter_design?.type == 'story' ? 515 : 350}
                                    />
                                }
                                
                            </div>
                        </div>

                        <div
                            className={`w-full flex flex-col items-center justify-center gap-3 text-gray-600 ${!image[i] ? `p-6` : `p-4 pb-6`
                                }`}
                        >
                            {image[i] ? (
                                <>
                                    <span className="text-[13px] dark:text-white">
                                        {campaign?.download_share}
                                    </span>
                                    <div className="flex gap-3">
                                        {campaign?.sharing_options?.linkedin && (
                                            <FaLinkedin className="text-[#0077B5] text-[50px] transition hover:opacity-70 cursor-pointer" />
                                        )}
                                        {campaign?.sharing_options?.facebook && (
                                            <FaFacebookSquare className="text-[#3A559F] text-[50px] transition hover:opacity-70 cursor-pointer" />
                                        )}
                                        {campaign?.sharing_options?.twitter && (
                                            <FaXTwitter className="mt-[3px] text-white bg-black text-[44px] rounded-md transition hover:opacity-70 cursor-pointer" />
                                        )}
                                        {campaign?.sharing_options?.whatsapp && (
                                            <FaWhatsappSquare className="text-[#29A71A] text-[50px] transition hover:opacity-70 cursor-pointer" />
                                        )}
                                    </div>
                                    {tab === "download" && campaign?.sharing_options?.download && (
                                        <button
                                            className="!bg-blue-900 max-w-full min-w-[232px] !flex !justify-center !items-center gap-2 min-h-11 rounded shadow !px-3 !py-[6px] border border-gray-100 transition hover:opacity-60"
                                            onClick={() => handleDownload(i)}
                                            style={{
                                                fontFamily: campaign?.download_image?.font_family ?? "inherit",
                                                fontWeight: (campaign?.download_image?.font_weight ?? 400) * 1,
                                                fontSize: (campaign?.download_image?.font_size ?? 14) * 1,
                                                color: (campaign?.download_image?.color ?? "#FFF"),
                                                paddingTop: (campaign?.download_image?.padding_top ?? 0) * 1,
                                                paddingBottom: (campaign?.download_image?.padding_bottom ?? 20) * 1,
                                                letterSpacing: (campaign?.download_image?.letter_spacing ?? 0) * 1,
                                                lineHeight: `${campaign?.download_image?.line_height}px`,
                                            }}
                                        >
                                            <ArrowDownTrayIcon className="!w-5" />
                                            <span className="break-all">
                                                {campaign?.download_image?.text}
                                            </span>
                                        </button>
                                    )}
                                    {tab === "email" && campaign?.sharing_options?.email && (
                                        <div className="flex items-center gap-2">
                                            <TextField
                                                placeholder="E-Mail Address"
                                                className="text-center"
                                                wrapperClassName="!mb-0"
                                                value={email}
                                                onChange={(e: any) => setEmail(e.target.value)}
                                            />
                                            <Button onClick={() => handleSendEmail(i)}>Send</Button>
                                        </div>
                                    )}
                                </>
                            ) : null}

                            <div className="relative">
                                <button
                                    className="!border !border-gray-500 bg-white max-w-full min-w-[232px] flex justify-center items-center gap-2 rounded shadow p-2 transition hover:opacity-60"
                                    onClick={() => handleClickUploadButton(i)}
                                    style={{
                                        background: filter?.button?.bgcolor ?? "#FFF",
                                        color: filter?.button?.textcolor ?? "#000"
                                    }}
                                >
                                    {filter?.button?.icon
                                        ?
                                        <div >
                                            <Image
                                                src={filter?.button?.icon}
                                                className="!w-5 invert"
                                                loader={({ src, width }) => { return src + "?w=" + width }}
                                                quality={50}
                                                width={15}
                                                height={15}
                                            />
                                        </div>

                                        : <CameraIcon
                                            className="!h-5 !w-5 text-gray-500"
                                            aria-hidden="true"
                                        />
                                    }
                                    <span
                                        className="text-gray-600 font-medium text-md break-all"
                                    >
                                        {image[i] ? campaign?.change_photo : filter?.button?.text}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="w-0 h-0 overflow-hidden" >
                    <div
                        className={`w-max h-max relative overflow-hidden invisible  ${loaded ? 'visible' : 'invisible'}`}
                    >
                        {image[i] && (
                            <div
                                className="object-cover absolute max-w-none"
                                style={{
                                    width: `${filter?.rnd?.w}%`,
                                    height: `${filter?.rnd?.h}%`,
                                    left: `${filter?.rnd?.x}%`,
                                    top: `${filter?.rnd?.y}%`,
                                }}
                            >
                                <Image
                                    src={URL.createObjectURL(image[i])}
                                    loader={({ src, width }) => { return src + "?w=" + width }}
                                    quality={50}
                                    priority={true}
                                    width={filter?.filter_design?.type == 'story' ? 290 : 350}
                                    height={filter?.filter_design?.type == 'story' ? 350 : 350}
                                />
                            </div>
                        )}
                        <Image
                            src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${filter?.filter_design?.image}`}
                            className="relative z-10"
                            loader={({ src, width }) => { return src + "?w=" + width }}
                            quality={50}
                            priority={true}
                            width={filter?.filter_design?.type == 'story' ? 290 : 350}
                            height={filter?.filter_design?.type == 'story' ? 350 : 350}
                        />
                    </div>
                </div> */}
            </>
        );
    };

    const CampaignFooter = ({ campaign }: any) => {
        return (
            <div className="flex flex-col items-center bg-white px-5 py-10 gap-4 border-t relative z-50">
                <a
                    href="http://www.livedab.de/"
                    className="text-xs leading-5 text-gray-600 hover:text-gray-900"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image src="/assets/images/logo.png" className="w-10 h-10" width={35} height={35} />
                </a>
                <a
                    href="http://www.livedab.de/"
                    className="pointer-cursor font-semibold border border-gray-200 px-3 py-1 rounded hover:opacity-80"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="text-[0.8rem]">Software by LIVEDAB.COM</span>
                </a>
                <nav
                    className="-mb-6 flex justify-center space-x-8"
                    aria-label="Footer"
                >
                    <div className="pb-6 text-center">
                        <a
                            href={campaign?.imprint_link}
                            className="text-xs leading-5 text-gray-600 hover:text-gray-900"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Imprint
                        </a>
                    </div>
                    <div className="pb-6 text-center">
                        <a
                            href={campaign?.data_privacy_link}
                            className="text-xs leading-5 text-gray-600 hover:text-gray-900"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Data Privacy
                        </a>
                    </div>
                </nav>
            </div>
        );
    };

    return (
        <>
            <div className={`${campaign?.dark_mode ? `dark` : ``}`}>
                <div
                    className={`relative ${campaign?.dark_mode ? "!bg-gray-800" : ""}`}
                    style={{
                        background:
                            campaign?.background?.type === "color"
                                ? campaign?.background?.value ?? "#FFF"
                                : `${campaign?.background?.value !== undefined ? 'url(' + process.env.NEXT_PUBLIC_APP_API_URL +'/' + campaign?.background?.value : ""}`,
                    }}
                >
                    <div className="absolute top-0 left-0 right-0 bottom-0">
                        <div style={{ height: grayHeight }} />
                        <div
                            className="w-full bg-[#F7FAFC]"
                            style={{ height: `calc(100% - ${grayHeight}px)` }}
                        />
                    </div>
                    <div className="py-10 px-5 md:px-20 flex flex-col items-center relative z-10">
                        {campaign?.logo && campaign?.logo !== undefined && (
                            <div
                                style={{
                                    width: (campaign.logo_setting?.size ?? 80) * 1,
                                    borderRadius: (campaign.logo_setting?.radius ?? 0) * 1,
                                    marginTop: (campaign.logo_setting?.padding_top ?? 0) * 1,
                                    marginBottom: (campaign.logo_setting?.padding_bottom ?? 20) * 1,
                                }}
                            >
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${campaign?.logo}`}
                                    loader={({ src, width }) => { return src + "?w=" + width }}
                                    quality={50}
                                    priority={true}
                                    width={70}
                                    height={70}
                                />
                            </div>
                        )}
                        {campaign?.title && (
                            <h2
                                className="text-center dark:!text-white"
                                style={{
                                    fontFamily: campaign?.title?.font_family ?? "inherit",
                                    fontWeight: (campaign?.title?.font_weight ?? 700) * 1,
                                    fontSize: (campaign?.title?.font_size ?? 30) * 1,
                                    color: (campaign?.title?.color ?? "#000"),
                                    paddingTop: (campaign?.title?.padding_top ?? 0) * 1,
                                    paddingBottom: (campaign?.title?.padding_bottom ?? 5) * 1,
                                    letterSpacing: (campaign?.title?.letter_spacing ?? 0) * 1,
                                    lineHeight: `${campaign?.title?.line_height}px`,
                                }}
                            >
                                {campaign.title.text}
                            </h2>
                        )}
                        {campaign?.description && (
                            <p
                                className="text-center text-gray-500 dark:!text-gray-300"
                                style={{
                                    fontFamily: campaign?.description?.font_family ?? "inherit",
                                    fontWeight: (campaign?.description?.font_weight ?? 400) * 1,
                                    fontSize: (campaign?.description?.font_size ?? 14) * 1,
                                    color: (campaign?.description?.color ?? "#000"),
                                    paddingTop: (campaign?.description?.padding_top ?? 0) * 1,
                                    paddingBottom: (campaign?.description?.padding_bottom ?? 0) * 1,
                                    letterSpacing: (campaign?.description?.letter_spacing ?? 0) * 1,
                                    lineHeight: `${campaign?.description?.line_height}px`,
                                }}
                            >
                                {campaign.description.text}
                            </p>
                        )}
                        <div className="relative flex flex-col items-center z-10 w-full mt-5">
                            {!campaign?.hide_size_buttons && visibileSizeButtons ?
                                loaded && <div className="flex flex-row items-center gap-4 pt-2.25 ">
                                    <Button
                                        className={`${stackedViewMode ? "!font-semibold !bg-gray-300" : "!font-light !bg-white"} !text-black !text-[0.775rem] !leading-[1rem] !min-w-[105px] !rounded-full !cursor-auto`}
                                    onClick={() => {
                                        campaign?.activate_filters && setStackedViewMode(true);
                                        campaign?.activate_filters && setActiveCarouselIndex(0);
                                    }}
                                    >
                                        {campaign?.square_text ?? "Square Size" }
                                    </Button>
                                    <Button
                                        className={`${!stackedViewMode ? "!font-semibold !bg-gray-300 " : "!font-light !bg-white"} !text-black !text-[0.775rem] !leading-[1rem] !min-w-[105px] !rounded-full !cursor-auto`}
                                    onClick={() => {
                                        campaign?.activate_filters && setStackedViewMode(false);
                                        campaign?.activate_filters && setActiveCarouselIndex(0);
                                    }}
                                    >
                                        {campaign?.story_text ?? "Story Size" }
                                    </Button>
                                </div>
                                : null
                            }
                            {!campaign?.active_slider_mode || filters?.length == 1 ?
                                <div className="items-center flex flex-col" ref={filterTabRef}>
                                    {filters?.map((filter: any, i: any) => (
                                        <div key={i} className="relative pt-8 pb-12">
                                            <FilterCard filter={filter} i={i} />
                                        </div>
                                    ))}
                                    {uploaded ?
                                        <div
                                            className="z-10 justify-content md:hidden m relative gap-1 bg-white dark:bg-gray-700 w-60 rounded-lg"
                                        >
                                            {campaign?.share_title && (
                                                <h2 className="break-words w-full font-semibold text-lg p-3 leading-snug ">
                                                    {campaign.share_title}
                                                </h2>
                                            )}
                                            {campaign?.share_text && (
                                                <div className="w-full bg-white rounded-lg shadow-md px-3 pb-3">
                                                    <span className="break-words mb-3 opacity-80 text-xs">{campaign.share_text}</span>
                                                    <button
                                                        className="cursor-pointer text-sm hover:opacity-80 transition px-2 py-1 mt-2 flex items-center text-white bg-gray-500 rounded"
                                                        onClick={() => {
                                                            copy(campaign.share_text ?? "");
                                                            setShowCopyTextNotification(true);
                                                        }}
                                                    >
                                                        <FiSave className="text-xl mr-2" />
                                                        { campaign?.copy_text ?? "Copy Text"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        : null}
                                </div>
                                : <div className="relative campaign-preview-carousel" ref={filterTabRef2}>
                                    <Carousel
                                        className="items-center max-w-[450px] campaign-carousel"
                                        autoPlay={false}
                                        showArrows={true}
                                        showThumbs={false}
                                        interval={undefined}
                                        selectedItem={activeCarouselIndex}
                                        stopOnHover={true}
                                        onChange={handleSlideChange}
                                        renderArrowPrev={(onClickHandler, hasPrev, label) =>
                                            hasPrev &&
                                            <div className="absolute md:left-0 left-20 top-0 z-10 w-8 h-[85%] mt-10 mb-20 flex items-center justify-center">
                                                <div
                                                    className="bg-white hover:bg-gray-300 shadow-md rounded-full cursor-pointer w-8 h-8 flex flex-col justify-center items-center"
                                                    onClick={onClickHandler}
                                                >
                                                    <ArrowLeftIcon className="!h-5 !w-5 !text-gray-800" />
                                                </div>
                                            </div>
                                        }
                                        renderArrowNext={(onClickHandler, hasNext, label) =>
                                            hasNext &&
                                            <div className="absolute md:right-0 right-20 top-0 z-10 w-8 h-[85%] mt-10 mb-20 flex items-center justify-center">
                                                <div
                                                    className="bg-white hover:bg-gray-300 shadow-md rounded-full cursor-pointer w-8 h-8 flex flex-col justify-center items-center"
                                                    onClick={onClickHandler}
                                                >
                                                    <ArrowRightIcon className="!h-5 !w-5 !text-gray-800" />
                                                </div>
                                            </div>
                                        }
                                    >
                                        {filters?.map((filter: any, i: any) => (
                                            <div key={i} className=" carousel-item pt-8 pb-12 flex justify-center">
                                                <FilterCard filter={filter} i={i} />
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                            }
                        </div>
                    </div>
                    {uploaded ?
                        <div
                            className={`${campaign?.active_slider_mode ? 'sm:absolute' : 'sm:fixed sm:visible invisible'} z-10 right-10 bottom-60 relative gap-1 bg-white w-60 rounded-lg bottom-10 sm:mt-40 mt-20 ml-auto mr-auto`}
                        >
                            {campaign?.share_title && (
                                <h2 className="break-words w-full font-semibold text-lg p-3 leading-snug ">
                                    {campaign.share_title}
                                </h2>
                            )}
                            {campaign?.share_text && (
                                <div className="w-full bg-white rounded-lg shadow-md px-3 pb-3">
                                    <span className="break-words mb-3 opacity-80 text-xs">{campaign.share_text}</span>
                                    <button
                                        className="cursor-pointer text-sm hover:opacity-80 transition px-2 py-1 mt-2 flex items-center text-white bg-gray-500 rounded"
                                        onClick={() => {
                                            copy(campaign.share_text ?? "");
                                            setShowCopyTextNotification(true);
                                        }}
                                    >
                                        <FiSave className="text-xl mr-2" />
                                        { campaign?.copy_text ?? "Copy Text"}
                                    </button>
                                </div>
                            )}
                        </div>
                        : null
                    }
                </div>
            </div>

            <input
                type="file"
                ref={fileRef}
                className="hidden"
                onChange={handleChangeImage}
            />
            <CampaignFooter campaign={campaign} />

            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <div>
                                        <TextField
                                            value={password}
                                            onChange={(e: any) => setPassword(e.target.value)}
                                            type="password"
                                            placeholder="Please enter the password to generate the design"
                                        />
                                        {error && (
                                            <p className="text-xs text-red-500">
                                                Incorrect password!
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-5 grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={handleConfirm}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            <Notification
                show={showNotification}
                onClose={() => setShowNotification(false)}
                type="success"
                title={campaign?.notification_title ?? ""}
                content={campaign?.notification_text ?? ""}
            />
            <Notification
                show={showCopyTextNotification}
                onClose={() => setShowCopyTextNotification(false)}
                type="success"
                title="Success!"
                content="You have successfully copied the text."
            />
            {/* <Notification
                show={showImageProcessingNotification}
                onClose={() => setShowImageProcessingNotification(false)}
                type="warning"
                title="Please wait some seconds."
                content="Your image is being processed in the background."
            /> */}
            {/* <Notification
                show={showImageProcessCompletedNotification}
                onClose={() => setShowImageProcessCompletedNotification(false)}
                type="success"
                title="Success!"
                content="Your image is processed successfully"
            /> */}
        </>
    );
};

export default User;
