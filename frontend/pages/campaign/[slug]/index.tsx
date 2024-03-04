import { NextPage } from "next";
import { Fragment, useEffect, useRef, useState, Suspense } from "react";
import { useRouter } from "next/router";
import domtoimage from "dom-to-image";
import { Font } from "@samuelmeuli/font-manager";
import dynamic from "next/dynamic";
import { Dialog, Transition } from "@headlessui/react";
import copy from "copy-to-clipboard";
import { dataURLtoFile } from "../../../utils";
import { APIService } from "../../../api";
import { CameraIcon } from '@heroicons/react/20/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import TextField from "../../../components/common/TextField";
import Button from "../../../components/common/Button";
// import Logo from "/assets/images/logo.png";
// import LinkedinIcon from "/assets/images/icons/linkedin.svg";
// import FacebookIcon from "/assets/images/icons/facebook.svg";
// import TwitterIcon from "/assets/images/icons/twitter-sm.svg";
// import WhatsappIcon from "/assets/images/icons/whatsapp.svg";
// import WhiteSaveIcon from "/assets/images/icons/save-white.svg";
// import WhiteDownloadIcon from "/assets/images/icons/download-white.svg";
import { filterDesignWidths } from "../../../utils/constants";
import { CampaignType, GalleryType, FilterType } from '../../../utils/types';

interface FilterCardProps {
    filter: FilterType;
    i: number;
}

const User: NextPage = () => {
    const router = useRouter();
    const { pathname, query } = router;
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
    const [carouselHeight, setCarouselHeight] = useState(0);
    const [filterloaded, setFilterloaded] = useState(0);
    const [timer, setTimer] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fileRef = useRef<any>();
    const filterTabRef = useRef<any>();
    const filterTabRef2 = useRef<any>();

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

    const handleDownload = (i: any) => {
        const dom = document.querySelector(`#card-${i}`);
        if (dom) {
            const { width, height } = dom.getBoundingClientRect();
            !image
                ? alert("Please select an image")
                : domtoimage
                    .toPng(dom, { quality: 0.95, width, height })
                    .then(function (dataUrl) {
                        var link = document.createElement("a");
                        link.download = "image.png";
                        link.href = dataUrl;
                        link.click();
                    });
        }

    };

    const handleClickUploadButton = (i: number) => {
        fileRef.current.click();
        setSelectedIndex(i);
    };

    const handleGenerate = () => {
        let clonedImage = [...image];
        clonedImage[selectedIndex] = fileRef.current.files[0];
        setImage([...clonedImage]);
        fileRef.current.value = "";
        setOpen(false);
        setPassed(true);
        changeCarouselHeight();
        setTimeout(() => {
            const dom = document.querySelector(`#card-${selectedIndex}`);
            if (dom) {
                const { width, height } = dom.getBoundingClientRect();
                domtoimage
                    .toPng(dom, {
                        quality: 0.95,
                        width,
                        height,
                    })
                    .then(function (dataUrl) {
                        APIService.gallery
                            .create({
                                campaign_id: campaign?._id,
                                image: dataURLtoFile(dataUrl, image[selectedIndex].name),
                            })
                            .then((res: any) => {
                                let clonedGallery = [...gallery];
                                clonedGallery[selectedIndex] = res.data.path;
                                setGallery([...clonedGallery]);
                            });
                    });
                changeCarouselHeight();
            }
        }, 1000);
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

    const changeCarouselHeight = () => {
        console.log("changeCarouselHeight")
        const _timer = setTimeout(() => {
            const currentItem = document.querySelector(`.campaign-preview-carousel .slide.selected .carousel-item`);
            if (currentItem) {
                setCarouselHeight(currentItem.clientHeight);
                setFilterloaded(prev => prev + 1);
            }
        }, 10);
        setTimer(_timer);
    }

    const imageLoaded = () => {
        if (filterloaded > 0 || timer) return;
        changeCarouselHeight();
    }

    const handleSlideChange = (index: any) => {
        changeCarouselHeight();
    };

    useEffect(() => {
        console.log("useEffect", campaign)
        if (carouselHeight < 500) return;
        const slideWrapper = document.querySelector<HTMLElement>(`.campaign-preview-carousel .slider-wrapper`);
        if (slideWrapper) {
            slideWrapper.style.height = carouselHeight + 'px';
        }
    }, [carouselHeight])

    useEffect(() => {
        console.log("useEffect", campaign)
        APIService.filter.getAll().then((filters: any[]) => {
            if (query?.slug && query?.slug !== undefined) {
                APIService.campaign.getBySlug(query?.slug).then((res: any) => {
                    setCampaign({ ...res.data });
                });
            }
        });
    }, [query?.slug]);

    useEffect(() => {
        console.log("useEffect", campaign)
        if (campaign?.filters) {
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
    }, [campaign, filterDesignWidths]);

    // useEffect(() => {
    //   const handleScroll = () => {
    //     if(!campaign?.active_slider_mode || campaign?.filters.length == 1){
    //       const element = filterTabRef.current;
    //       if (element) {
    //         const rect = element.getBoundingClientRect();
    //         console.log('Element position:1111111', rect);
    //         setGrayHeight((rect.top + rect.bottom) / 2)
    //       }
    //     } else {
    //       const element2 = filterTabRef2.current;
    //       if (element2) {
    //         const rect = element2.getBoundingClientRect();
    //         console.log('Element position:2222222', rect);
    //         setGrayHeight((rect.top + rect.bottom) / 2)
    //       }
    //     }
    //   };
    //   window.addEventListener('resize', handleScroll);
    //   return () => {
    //     window.removeEventListener('resize', handleScroll);
    //   };
    // }, [campaign])

    const FilterCard: NextPage<FilterCardProps> = ({ filter, i }) => {
        const [tab, setTab] = useState("download");
        return (
            <>
                <div
                    className={`relative items-center ${filterDesignWidths[filter.filter_design?.type ?? "square"]}`}
                    key={i}
                    style={{
                        maxWidth: filter.filter_design?.type == "square" ? 350 : 290
                    }}
                >
                    <div
                        className={`bg-white dark:bg-gray-700 shadow-lg overflow-hidden`}
                        style={{ borderRadius: campaign?.edge ?? 14 }}
                    >
                        <div className={`w-full relative flex-shrink-0 overflow-hidden`}>
                            {image[i] ? (
                                <img
                                    src={URL.createObjectURL(image[i])}
                                    className="object-cover absolute max-w-none"
                                    style={{
                                        width: `${filter?.rnd?.w}%`,
                                        height: `${filter?.rnd?.h}%`,
                                        left: `${filter?.rnd?.x}%`,
                                        top: `${filter?.rnd?.y}%`,
                                    }}
                                />
                            ) : (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${filter?.filter_design?.type == 'story' ? campaign?.placeholder_story_image : campaign?.placeholder_image}`}
                                    className="object-cover absolute max-w-none"
                                    style={{
                                        width: `${filter?.rnd?.w}%`,
                                        height: `${filter?.rnd?.h}%`,
                                        left: `${filter?.rnd?.x}%`,
                                        top: `${filter?.rnd?.y}%`,
                                    }}
                                />
                            )}
                            <img
                                src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${filter?.filter_design?.image}`}
                                className="relative z-10"
                                onLoad={imageLoaded}
                            />
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
                                            <img
                                                src="/assets/images/icons/linkedin.svg"
                                                className="!w-11 transition hover:opacity-60 cursor-pointer"
                                            />
                                        )}
                                        {campaign?.sharing_options?.facebook && (
                                            <img
                                                src="/assets/images/icons/facebook.svg"
                                                className="!w-11 transition hover:opacity-60 cursor-pointer"
                                            />
                                        )}
                                        {campaign?.sharing_options?.twitter && (
                                            <div className="w-11 h-11 bg-black flex items-center justify-center rounded-md transition hover:opacity-60 cursor-pointer">
                                                <img src="/assets/images/icons/twitter-sm.svg" className="!w-6 invert" />
                                            </div>
                                        )}
                                        {campaign?.sharing_options?.whatsapp && (
                                            <img
                                                src="/assets/images/icons/whatsapp.svg"
                                                className="!w-11 transition hover:opacity-60 cursor-pointer"
                                            />
                                        )}
                                    </div>
                                    {tab === "download" && campaign?.sharing_options?.download && (
                                        <button
                                            className="!bg-blue-900 max-w-full min-w-[232px] flex justify-center items-center gap-2 min-h-11 rounded shadow px-3 py-[6px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 transition hover:opacity-60"
                                            onClick={() => handleDownload(i)}
                                        >
                                            <img src="/assets/images/icons/download-white.svg" className="!w-5 text-white" />
                                            <span className="font-medium text-white break-all">
                                                {campaign?.download_image}
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
                                    style={{ background: filter?.button?.bgcolor ?? "#FFF" }}
                                >
                                    {filter?.button?.icon
                                        ? <img
                                            src={filter.button.icon}
                                            className="!w-5 invert"
                                            style={{ color: filter?.button?.textcolor ?? "#000" }}
                                        />
                                        : <CameraIcon
                                            className="!h-5 !w-5 text-gray-500"
                                            aria-hidden="true"
                                            style={{ color: filter?.button?.textcolor ?? "#000" }}
                                        />
                                    }
                                    <span
                                        className="text-gray-600 font-medium text-md break-all"
                                        style={{ color: filter?.button?.textcolor ?? "#000" }}
                                    >
                                        {image[i] ? "Upload new Photo" : filter?.button?.text}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-0 h-0 overflow-hidden">
                    <div
                        className={`w-max h-max relative overflow-hidden`}
                        id={`card-${i}`}
                    >
                        {image[i] && (
                            <img
                                src={URL.createObjectURL(image[i])}
                                className="object-cover absolute max-w-none"
                                style={{
                                    width: `${filter?.rnd?.w}%`,
                                    height: `${filter?.rnd?.h}%`,
                                    left: `${filter?.rnd?.x}%`,
                                    top: `${filter?.rnd?.y}%`,
                                }}
                            />
                        )}
                        <img
                            src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${filter?.filter_design?.image}`}
                            className="relative z-10"
                        />
                    </div>
                </div>
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
                    <img src="/assets/images/logo.png" className="w-10 h-10" />
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
            {/* {campaign?.title && (
                <div className="hidden">
                    <FontPicker
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONT_API_KEY ?? "AIzaSyAIFjmFcyJq3yyRyW96NdNvpllmd5ZJeCE"}
                        activeFontFamily={campaign?.title?.font_family ?? "Inter"}
                        // onChange={(font: any) => handleChangeTitle("font_family", font.family)}
                        onChange={(font: any) => {}}
                        pickerId={""}
                        families={[]}
                        categories={[]}
                        scripts={[]}
                        variants={[]}
                        filter={function (font: Font): boolean {
                            throw new Error("Function not implemented.");
                        }}
                        limit={0}
                        sort={"alphabet"}
                    />
                </div>
            )}
            {campaign?.description && (
                <div className="hidden">
                    <FontPicker
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONT_API_KEY ?? "AIzaSyAIFjmFcyJq3yyRyW96NdNvpllmd5ZJeCE"}
                        activeFontFamily={campaign?.description?.font_family ?? "Inter"}
                        // onChange={(font: any) => handleChangeTitle("font_family", font.family)}
                        onChange={(font: any) => {}}
                        pickerId={""}
                        families={[]}
                        categories={[]}
                        scripts={[]}
                        variants={[]}
                        filter={function (font: Font): boolean {
                            throw new Error("Function not implemented.");
                        }}
                        limit={0}
                        sort={"alphabet"}
                    />
                </div>
            )} */}
            <div className={`${campaign?.dark_mode ? `dark` : ``}`}>
                <div
                    className="dark:bg-gray-800 relative"
                    style={{
                        background:
                            campaign?.background?.type === "color"
                                ? campaign?.background?.value ?? "#FFF"
                                : `url(${process.env.NEXT_PUBLIC_APP_API_URL}/${campaign?.background?.value})`,
                    }}
                >
                    <div className="absolute top-0 left-0 right-0 bottom-0">
                        <div style={{ height: grayHeight }} />
                        <div
                            className="w-full bg-black opacity-5"
                            style={{ height: `calc(100% - ${grayHeight}px)` }}
                        />
                    </div>
                    <div className="py-10 px-5 md:px-20 flex flex-col items-center relative z-10">
                        {campaign?.logo && (
                            <img
                                src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${campaign?.logo}`}
                                style={{
                                    width: (campaign.logo_setting?.size ?? 80) * 1,
                                    borderRadius: (campaign.logo_setting?.radius ?? 0) * 1,
                                    marginTop: (campaign.logo_setting?.padding_top ?? 0) * 1,
                                    marginBottom: (campaign.logo_setting?.padding_bottom  ?? 20) * 1,
                                }}
                            />
                        )}
                        {campaign?.title && (
                            <h2
                                className="text-center dark:!text-white"
                                style={{
                                    fontFamily: campaign?.title?.font_family ?? "Inter",
                                    fontWeight: (campaign?.title?.font_weight ?? 700) * 1,
                                    fontSize: (campaign?.title?.font_size ?? 30) * 1,
                                    color: (campaign?.title?.color ?? "#000"),
                                    paddingTop: (campaign?.title?.padding_top ?? 0) * 1,
                                    paddingBottom: (campaign?.title?.padding_bottom ?? 20) * 1,
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
                                    fontFamily: campaign?.description?.font_family ?? "Inter",
                                    fontWeight: (campaign?.description?.font_weight ?? 400) * 1,
                                    fontSize: (campaign?.description?.font_size ?? 14) * 1,
                                    color: (campaign?.description?.color ?? "#000"),
                                    paddingTop: (campaign?.description?.padding_top ?? 0) * 1,
                                    paddingBottom: (campaign?.description?.padding_bottom ?? 20) * 1,
                                    letterSpacing: (campaign?.description?.letter_spacing ?? 0) * 1,
                                    lineHeight: `${campaign?.description?.line_height}px`,
                                }}
                            >
                                {campaign.description.text}
                            </p>
                        )}
                        <div className="relative flex flex-col items-center z-10 w-full">
                            {!campaign?.hide_size_buttons && visibileSizeButtons ?
                                <div className="flex gap-4">
                                    <Button
                                        className={`${!campaign?.active_slider_mode ? "!font-medium !bg-black" : "!font-light !bg-gray-500"} !min-w-[105px] rounded-full !cursor-auto`}
                                    // onClick={() => setStackedViewMode(true)}
                                    >
                                        Square Size
                                    </Button>
                                    <Button
                                        className={`${campaign?.active_slider_mode ? "!font-medium !bg-black" : "!font-light !bg-gray-500"} !min-w-[105px] rounded-full !cursor-auto`}
                                    // onClick={() => setStackedViewMode(false)}
                                    >
                                        Story Size
                                    </Button>
                                </div>
                                : null
                            }
                            {!campaign?.active_slider_mode && image.length || campaign?.filters?.length == 1 ?
                                <div
                                    className="z-10 md:fixed !ml-[680px] hidden md:inline-block !top-[504px] gap-1 bg-white dark:bg-gray-700 w-60 rounded-lg"
                                >
                                    {campaign?.share_title && (
                                        <h2 className="break-all w-full font-semibold text-lg p-3">
                                            {campaign.share_title}
                                        </h2>
                                    )}
                                    {campaign?.share_text && (
                                        <div className="w-full bg-white rounded-lg shadow-md px-3 pb-3">
                                            <span className="break-all mb-3 opacity-80 text-xs">{campaign.share_text}</span>
                                            <button
                                                className="cursor-pointer text-sm hover:opacity-80 transition px-2 py-1 mt-2 flex items-center text-white bg-gray-500 rounded"
                                                onClick={() => copy(campaign?.share_text ?? "")}
                                            >
                                                <img src="/assets/images/icons/save-white.svg" className="!w-4 dark:invert mr-2" />
                                                Copy Text
                                            </button>
                                        </div>
                                    )}
                                </div>
                                : null
                            }
                            {!campaign?.active_slider_mode || campaign?.filters?.length == 1 ?
                                <div className="items-center flex flex-col" ref={filterTabRef}>
                                    {campaign?.filters?.map((filter, i) => (
                                        <div key={i} className="pt-8 pb-12">
                                            <FilterCard filter={filter} i={i} />
                                        </div>
                                    ))}
                                    {image.length ?
                                        <div
                                            className="z-10 justify-content md:hidden m relative gap-1 bg-white dark:bg-gray-700 w-60 rounded-lg"
                                        >
                                            {campaign?.share_title && (
                                                <h2 className="break-all w-full font-semibold text-lg p-3">
                                                    {campaign.share_title}
                                                </h2>
                                            )}
                                            {campaign?.share_text && (
                                                <div className="w-full bg-white rounded-lg shadow-md px-3 pb-3">
                                                    <span className="break-all mb-3 opacity-80 text-xs">{campaign.share_text}</span>
                                                    <button
                                                        className="cursor-pointer text-sm hover:opacity-80 transition px-2 py-1 mt-2 flex items-center text-white bg-gray-500 rounded"
                                                        onClick={() => copy(campaign.share_text ?? "")}
                                                    >
                                                        <img src="/assets/images/icons/save-white.svg" className="!w-4 dark:invert mr-2" />
                                                        Copy Text
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
                                        transitionTime={0}
                                        stopOnHover={true}
                                        onChange={handleSlideChange}
                                        // dynamicHeight={true}
                                        renderArrowPrev={(onClickHandler, hasPrev, label) =>
                                            hasPrev &&
                                            <div className="absolute top-0 z-10 w-7 h-[85%] mt-10 mb-20 flex items-center justify-center">
                                                <div
                                                    className="bg-gray-300 rounded cursor-pointer w-6 h-20 flex flex-col justify-center items-center"
                                                    onClick={onClickHandler}
                                                >
                                                    <ChevronLeftIcon className="!h-7 !w-7 !text-gray-800" />
                                                </div>
                                            </div>
                                        }
                                        renderArrowNext={(onClickHandler, hasNext, label) =>
                                            hasNext &&
                                            <div className="absolute right-0 top-0 z-10 w-7 h-[85%] mt-10 mb-20 flex items-center justify-center">
                                                <div
                                                    className="bg-gray-300 rounded cursor-pointer w-6 h-20 flex flex-col justify-center items-center"
                                                    onClick={onClickHandler}
                                                >
                                                    <ChevronRightIcon className="!h-7 !w-7 !text-gray-800" />
                                                </div>
                                            </div>

                                        }
                                    >
                                        {campaign?.filters?.map((filter, i) => (
                                            <div key={i} className=" carousel-item pt-8 pb-12 flex justify-center">
                                                <FilterCard filter={filter} i={i} />
                                            </div>
                                        ))}
                                    </Carousel>
                                    {image.length ?
                                        <div
                                            className="z-10 sm:absolute relative gap-1 bg-white dark:bg-gray-700 w-60 rounded-lg bottom-10 sm:left-[445px] left-0 sm:mt-40 mt-20 ml-auto mr-auto"
                                        >
                                            {campaign?.share_title && (
                                                <h2 className="break-all w-full font-semibold text-lg p-3">
                                                    {campaign.share_title}
                                                </h2>
                                            )}
                                            {campaign?.share_text && (
                                                <div className="w-full bg-white rounded-lg shadow-md px-3 pb-3">
                                                    <span className="break-all mb-3 opacity-80 text-xs">{campaign.share_text}</span>
                                                    <button
                                                        className="cursor-pointer text-sm hover:opacity-80 transition px-2 py-1 mt-2 flex items-center text-white bg-gray-500 rounded"
                                                        onClick={() => copy(campaign?.share_text ?? "")}
                                                    >
                                                        <img src="/assets/images/icons/save-white.svg" className="!w-4 dark:invert mr-2" />
                                                        Copy Text
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        : null}
                                </div>
                            }
                        </div>
                    </div>
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
        </>
    );
};

export default User;
