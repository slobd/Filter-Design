import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useRef, useState, Suspense } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import BeatLoader from "react-spinners/BeatLoader";
import { Rnd } from "react-rnd";
import {
    Cog8ToothIcon,
    EyeIcon,
    RocketLaunchIcon,
    ArrowRightIcon,
    ArrowDownTrayIcon,
    TrashIcon,
    ViewfinderCircleIcon
} from "@heroicons/react/24/outline";
import { CameraIcon } from '@heroicons/react/20/solid';
import Button from "../../../components/common/Button";
import ColorPicker from "../../../components/common/ColorPicker";
import EmptyDrawer from "../../../components/drawers/EmptyDrawer";
import ImagePicker from "../../../components/common/ImagePicker";
import TextField from "../../../components/common/TextField";
import CreatorLayout from '../../../components/Layout/Creator';
import ToggleSwitch from "../../../components/common/ToggleSwitch";
import { useAppContext } from "../../../context/context";
import { FilterDesignType, ButtonType } from '../../../utils/types';
import { APIService } from "../../../api";
import { getFilterType } from "../../../utils";
import ConfirmModal from '../../../components/modal/confirmModal';
import Notification from "../../../components/Notification";

const tabs = [
    {
        id: "square",
        label: "Square",
        icon: "/assets/images/icons/square.svg",
        width: "max-w-[350px]",
    },
    {
        id: "story",
        label: "Story",
        icon: "/assets/images/icons/rectangle.svg",
        width: "max-w-[290px]",
    },
    {
        id: "custom",
        label: "Custom",
        icon: "/assets/images/icons/rectangle.svg",
        width: "max-w-[700px]",
    },
];

const style = {
    zIndex: 50,
    boxShadow: "0 0 0 9999em #00000090",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
};

const FilterDesigns: NextPage = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const filterRef = useRef<any>();
    const { user, loginWithRedirect } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [dimension, setDimension] = useState({
        width: 0,
        height: 0,
    });
    const { campaignData, contextCampaignData } = useAppContext();
    const [filterDesigns, setFilterDesigns] = useState<FilterDesignType[]>([])
    const [open, setOpen] = useState(false);
    const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
    const [openSidebar, setOpenSidebar] = useState(false);
    const [selectedFilterTab, setSelectedFilterTab] = useState("square");
    const [buttonStyle, setButtonStyle] = useState<ButtonType>();
    const [filterPosition, setFilterPosition] = useState(1);
    const [allowRedirect, setAllowRedirect] = useState(true);
    const [redirectURL, setRedirectURL] = useState("");
    const [userConfirmed, setUserConfirmed] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [isClicked, setIsClicked] = useState(false);


    const handleUpdateButtonStyle = (target: any, value: any) => {
        setButtonStyle({ ...buttonStyle, [target]: value });
    };

    const changeFilterPosition = (destination: any) => {
        let _filters = campaignData?.filters ?? [];
        if (destination == "" || !Number.isNaN(Number(destination)) && parseInt(destination) > 0 && parseInt(destination) <= _filters.length) {
            setFilterPosition(destination);
        }
    }

    const saveSettings = () => {
        setAllowRedirect(false);
        let _filters = campaignData?.filters ?? [];
        const cloneFilters = [..._filters];
        cloneFilters[selectedFilterIndex] = {
            ...cloneFilters[selectedFilterIndex],
            button: buttonStyle,
        };
        // change order of the filters
        if (filterPosition && filterPosition != selectedFilterIndex + 1) {
            let _currentFilter: any = cloneFilters.splice(selectedFilterIndex, 1)?.[0];
            cloneFilters.splice(filterPosition - 1, 0, _currentFilter);
        }

        _filters = cloneFilters;
        contextCampaignData({ ...campaignData, filters: _filters });
    }

    const handleUploadFilterDesign = (e: any) => {
        if (!e.target.files[0]) return;
        getFilterType(e.target.files[0], (type: any) => {
            if (e.target.files[0]) {
                APIService.filter
                    .create({
                        type,
                        campaign_id: campaignData?._id,
                        author: user?.email,
                        image: e.target.files[0],
                    })
                    .then((res: any) => {
                        fetchFilterDesigns();
                    });
            }
        });
    };

    const handleDeleteFilterDesign = (e: any, id: any) => {
        e.stopPropagation();
        APIService.filter.delete({ id: id, email: user?.email }).then((res: any) => {
            const { acknowledged, deletedCount } = res.data;
            if (acknowledged === true && deletedCount > 0) {
                fetchFilterDesigns();
                let _filters = campaignData?.filters ?? [];
                const cloneFilters = [..._filters];

                _filters = cloneFilters.map(item => {
                    let _item = { ...item };
                    if (item.filter_design?._id == id) {
                        _item = {
                            ..._item,
                            filter_design: filterDesigns.filter(item => item.image == "uploads/default_filterdesign.png")?.[0]
                        }
                    }
                    return _item;
                })
                contextCampaignData({ ...campaignData, filters: _filters });
                handleSave(null, { filters: _filters });
            }
        });
    };

    const handleSelectFilterDesign = (filterDesign: FilterDesignType) => {
        if (!campaignData?.filters?.length) return;
        let _filters = campaignData?.filters ?? [];
        const cloneFilters = [..._filters];
        cloneFilters[selectedFilterIndex] = {
            ...cloneFilters[selectedFilterIndex],
            filter_design: filterDesign,
        };
        _filters = cloneFilters;
        contextCampaignData({ ...campaignData, filters: _filters });
        setAllowRedirect(false);
    };

    const handleOpenSettingButtonModal = (style: any, i: any) => {
        setSelectedFilterIndex(i);
        setFilterPosition(i + 1);
        setOpen(true);
        setButtonStyle({ ...style });
    };

    const handleCreateNewFilter = () => {
        if (isClicked) return;
        setIsClicked(true);
        setTimeout(() => {
            setIsClicked(false)
        }, 1000)
        const filterDesign: FilterDesignType = filterDesigns?.filter(i => i.author == '')?.[0];
        if (filterDesign) {
            let _filters = campaignData?.filters ?? [];
            _filters.push({
                filter_design: filterDesign,
                button: { text: "Upload Photo", bgcolor: "#FFF", textcolor: "#000" },
                rnd: { x: 0, y: 0, w: 100, h: 100 },
            });
            contextCampaignData({ ...campaignData, filters: _filters })
        }
    };

    const handleCancelNewFilter = (index: any) => {
        setAllowRedirect(false);
        let _filters = [...(campaignData?.filters ?? [])];
        _filters.splice(index, 1);
        contextCampaignData({ ...campaignData, filters: _filters });
    }

    const handleToggleEditMode = (i: any) => {
        setEditMode(selectedFilterIndex === i ? !editMode : true);
        setSelectedFilterIndex(i);
    };

    const handleRnd = (x: any, y: any, w?: any, h?: any) => {
        setAllowRedirect(false);
        const _filters = [...(campaignData?.filters ?? [])];
        if (_filters?.length > 0) {
            const cloneFilters = [..._filters];
            const selectedFilter = cloneFilters[selectedFilterIndex];
            cloneFilters[selectedFilterIndex] = {
                ...selectedFilter,
                rnd: {
                    ...selectedFilter.rnd,
                    x: (parseFloat(x) / dimension.width) * 100,
                    y: (parseFloat(y) / dimension.height) * 100,
                    w: w ? (parseFloat(w) / dimension.width) * 100 : selectedFilter?.rnd?.w,
                    h: h
                        ? (parseFloat(h) / dimension.height) * 100
                        : selectedFilter?.rnd?.h,
                },
            };
            contextCampaignData({ ...campaignData, filters: cloneFilters })
        }
    };

    const handleSave = (callback: any, params = {}) => {
        setAllowRedirect(true);
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
                ...params,
            })
            .then((res: any) => {
                setShowNotification(true);
                contextCampaignData(res?.data);
                callback && callback(res);
            })
            .catch((err: any) => console.log(err));
    };

    const handlePublish = () => {
        handleSave(null, { status: "published" });
    };

    const handleNext = () => {
        handleSave(() => router.push(`/creator/${query?.slug}/settings`));
    };

    const handlePreview = () => {
        handleSave((res: any) => {
            const newWindow = window.open(`/campaign/${res.data.slug}`, "_blank");
            setTimeout(() => {
                if (newWindow) {
                    newWindow.opener = null;
                }
            }, 0);
        });
    };

    useEffect(() => {
        document.body.style.overflow = openSidebar ? "hidden" : "auto";
    }, [openSidebar]);

    useEffect(() => {
        if (campaignData?.filters?.length && filterDesigns?.length) {
            const filterDesignElement = document.querySelector<HTMLDivElement>(
                `#filter-design-${selectedFilterIndex}`
            );
            if (filterDesignElement) {
                setDimension({
                    ...dimension,
                    width: filterDesignElement.clientWidth,
                    height: filterDesignElement.clientHeight,
                });
            }
        }
    }, [selectedFilterIndex, filterDesigns]);

    useEffect(() => {
        fetchFilterDesigns();
        setLoading(false);
    }, [user?.email]);

    const fetchFilterDesigns = () => {
        if (user?.email) {
            APIService.filter.getAll(user?.email).then((res: any) => {
                setFilterDesigns(res.data);
            });
        }
    }

    const confirmed = async (value: any) => {
        setShowConfirmModal(false);
        if (value) {
            setUserConfirmed(true)
            router.push(redirectURL);
        }
    }

    useEffect(() => {
        const routeChangeStart = (url: any) => {
            setRedirectURL(url);
            setShowConfirmModal(true);
            router.events.emit('routeChangeError');
            throw 'Abort route change. Please ignore this error.';
        };

        if (allowRedirect || userConfirmed) {
            router.events.off('routeChangeStart', routeChangeStart);
        } else {
            router.events.on('routeChangeStart', routeChangeStart);
        }

        return () => {
            router.events.off('routeChangeStart', routeChangeStart);
        };
    }, [allowRedirect, userConfirmed]);

    return (
        <div className="w-full bg-gray-100 min-h-screen flex flex-row">
            <CreatorLayout />
            <div
                className={`fixed z-[80] top-0 left-0 md:left-72 w-80 h-screen bg-white border-r flex-shrink-0 ${openSidebar ? `translate-x-0` : `-translate-x-full md:translate-x-0`
                    } transition`}
            >
                <button
                    className="w-10 h-10 flex md:hidden items-center justify-center bg-white shadow absolute top-20 right-0 translate-x-full rounded-r-lg"
                    onClick={() => setOpenSidebar(!openSidebar)}
                >
                    <ArrowRightIcon className={`w-6 ${!openSidebar ? `rotate-0` : `rotate-180`} transition`} />
                </button>
                <div className="flex flex-col h-full p-4 bg-[#18191A] text-white">
                    <Button
                        className="w-full h-12 !text-lg mb-5 gap-2 !font-medium"
                        onClick={() => filterRef.current.click()}
                    >
                        <ArrowDownTrayIcon className="w-6" />
                        <span>Upload Filter Design</span>
                    </Button>
                    <input
                        type="file"
                        ref={filterRef}
                        onChange={handleUploadFilterDesign}
                        accept=".png,.gif,.svg"
                        className="hidden"
                    />
                    <div className="flex items-center justify-between px-4 py-1">
                        <span>Show Filter in Tabs</span>
                        <ToggleSwitch
                            checked={campaignData?.activate_filters ?? false}
                            onChange={(value) => handleSave(null, { activate_filters: value })}
                        />
                    </div>
                    <h2 className="text-base pb-[5px]">Select a Filter Template</h2>
                    <div className="h-12 mb-2">
                        <nav
                            className="flex rounded-[0.2rem] overflow-hidden"
                            aria-label="Tabs"
                        >
                            {tabs.map((tab) => (
                                <span
                                    key={tab.id}
                                    onClick={() => setSelectedFilterTab(tab.id)}
                                    className={`${selectedFilterTab === tab.id
                                        ? "text-black bg-white"
                                        : "text-white bg-gray-700"
                                        } w-full group inline-flex justify-center items-center gap-1 py-2 text-[0.8rem] cursor-pointer px-2 border-black border-r last:border-0`}
                                >
                                    <Image
                                        src={tab.icon}
                                        className={`w-4 ${selectedFilterTab === tab.id ? `` : `invert`}`}
                                        loader={({ src, width }) => { return src + "?w=" + width }}
                                        quality={50}
                                        width={15}
                                        height={15}
                                    />
                                    <span>{tab.label}</span>
                                </span>
                            ))}
                        </nav>
                    </div>
                    <div className="h-full overflow-y-auto">
                        <div
                            className={`grid ${selectedFilterTab === `story` ? `grid-cols-3` : ``
                                } ${selectedFilterTab === `square` ? `grid-cols-2` : ``} gap-2`}
                        >
                            {filterDesigns
                                .filter(
                                    (item) =>
                                        item.type === selectedFilterTab &&
                                        (item.author === user?.email || item.author === "")
                                )
                                .map((filterDesign) => (
                                    <div
                                        key={filterDesign._id}
                                        className="relative rounded overflow-hidden hover:opacity-50 transition cursor-pointer shadow-sm"
                                        onClick={() => handleSelectFilterDesign(filterDesign)}
                                    >
                                        {filterDesign.author && (
                                            <TrashIcon
                                                className="absolute z-20 w-5 h-5 top-2 right-2"
                                                onClick={(e) => handleDeleteFilterDesign(e, filterDesign._id)}
                                            />
                                        )}
                                        <img
                                            className="absolute top-0 left-0 object-cover overflow-hidden"
                                            src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${campaignData?.placeholder_image}`}
                                            style={{
                                                width: `${filterDesign?.type == 'square' ? 140 : 90}px`,
                                                height: `${filterDesign?.type == 'square' ? 130 : 150}px`,
                                            }}
                                        />
                                        {filterDesign.image && (
                                            <div className="relative z-10">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${filterDesign.image}`}
                                                    loader={({ src, width }) => { return src + "?w=" + width }}
                                                    quality={50}
                                                    priority={true}
                                                    width={filterDesign?.type == 'story' ? 290 : 350}
                                                    height={filterDesign?.type == 'story' ? 515 : 350}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={`w-full md:pl-80 ${openSidebar && `overflow-hidden`}`}>
                <div className="md:pl-80 h-16 px-6 border-b bg-white flex justify-end items-center gap-2">
                    <Button
                        color="white"
                        className="!px-2 flex md:hidden"
                        onClick={handlePreview}
                    >
                        <ArrowRightIcon className="w-5" />
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
                        onClick={handlePublish}
                    >
                        <RocketLaunchIcon className="w-5" />
                        <span className="hidden md:inline">Save Campaign</span>
                    </Button>
                    <Button
                        color="white"
                        className="gap-1 !px-2 md:!px-3"
                        onClick={handleNext}
                    >
                        <Cog8ToothIcon className="w-5" />
                        <span className="hidden md:inline">Settings</span>
                    </Button>
                </div>
                {loading ? (
                    <div className="md:pl-80 -mt-16 h-screen flex items-center justify-center">
                        <BeatLoader
                            color={"#4F46E5"}
                            loading={true}
                            size={16}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                ) : (
                    <div className="md:!pl-80 w-full flex flex-col items-center justify-center gap-8 py-10 mx-auto px-5 md:px-20">
                        {campaignData?.filters?.map((filter, i) => {
                            return (
                                <div
                                    className="relative flex md:flex-row flex-col items-center items-start"
                                    key={i}
                                >
                                    <div className="relative md:top-4 md:-left-[20px] md:flex-col flex justify-start items-center gap-2 mb-4">
                                        <button
                                            className="bg-white w-10 h-10 rounded p-2 border opacity-50 hover:opacity-100 transition "
                                            onClick={() => handleToggleEditMode(i)}
                                        >
                                            <ViewfinderCircleIcon />
                                        </button>
                                        <button
                                            className="bg-white w-10 h-10 rounded p-2 border opacity-50 hover:opacity-100 transition "
                                            onClick={() => handleCancelNewFilter(i)}
                                        >
                                            <TrashIcon />
                                        </button>
                                        <button
                                            className="bg-white w-10 h-10 rounded p-2 border opacity-50 hover:opacity-100 transition "
                                            onClick={() =>
                                                handleOpenSettingButtonModal(filter.button, i)
                                            }
                                        >
                                            <Cog8ToothIcon />
                                        </button>
                                    </div>
                                    <div
                                        onClick={() => setSelectedFilterIndex(i)}
                                        className={`p-auto m-auto cursor-pointer ${!editMode && selectedFilterIndex === i
                                            ? `hover:opacity-80`
                                            : ``
                                            } transition ${tabs.filter((item) => item.id === filter?.filter_design?.type)[0]?.width
                                            } bg-white shadow-lg ${selectedFilterIndex === i && `border-2 border-purple-600`
                                            }`}
                                        style={{ borderRadius: campaignData?.edge ?? 14 }}
                                    >
                                        <div
                                            className="relative overflow-hidden"
                                            style={{
                                                borderTopLeftRadius: campaignData?.edge ?? 14 - 3,
                                                borderTopRightRadius: campaignData?.edge ?? 14 - 3,
                                            }}
                                        >
                                            {editMode && selectedFilterIndex === i && (
                                                <Rnd
                                                    style={style}
                                                    size={{
                                                        width:
                                                            (dimension?.width * (filter?.rnd?.w ?? 100)) / 100,
                                                        height:
                                                            (dimension?.height * (filter?.rnd?.h ?? 100)) / 100,
                                                    }}
                                                    position={{
                                                        x: (dimension?.width * (filter?.rnd?.x ?? 0)) / 100,
                                                        y: (dimension?.height * (filter?.rnd?.y ?? 0)) / 100,
                                                    }}
                                                    onDrag={(e, d) => handleRnd(d.x, d.y)}
                                                    lockAspectRatio={true}
                                                    onResize={(e, d, ref, delta, position) => {
                                                        handleRnd(
                                                            position.x,
                                                            position.y,
                                                            ref.style.width,
                                                            ref.style.height
                                                        );
                                                    }}
                                                >
                                                    <span className="w-3 h-3 bg-white inline-block absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize" />
                                                    <span className="w-3 h-3 bg-white inline-block absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize	" />
                                                    <span className="w-3 h-3 bg-white inline-block absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize	" />
                                                    <span className="w-3 h-3 bg-white inline-block absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize" />
                                                </Rnd>
                                            )}
                                            {filter?.filter_design && (
                                                <div
                                                    className="relative z-10 pointer-events-none"
                                                    style={{
                                                        borderTopLeftRadius: campaignData.edge ?? 14 - 3,
                                                        borderTopRightRadius: campaignData.edge ?? 14 - 3,
                                                        width: filter?.filter_design?.type == 'story' ? "290px" : "350px",
                                                        height: filter?.filter_design?.type == 'story' ? "515px" : "350px"
                                                    }}
                                                >
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${filter?.filter_design?.image}`}
                                                        // id={`filter-design-${i}`}
                                                        loader={({ src, width }) => { return src + "?w=" + width }}
                                                        quality={50}
                                                        priority={true}
                                                        width={filter?.filter_design?.type == 'story' ? 290 : 350}
                                                        height={filter?.filter_design?.type == 'story' ? 515 : 350}
                                                    />
                                                </div>
                                            )}
                                            {/* <div
                                                className="absolute object-cover pointer-events-none max-w-none overflow-hidden"
                                                style={{
                                                    // width: `${filter?.rnd?.w}%`,
                                                    // height: `${filter?.rnd?.h}%`,
                                                    width: filter?.filter_design?.type == 'story' ? "515px" : "350px",
                                                    height: filter?.filter_design?.type == 'story' ? "515px" : "350px",
                                                    // left: `${filter?.rnd?.x}%`,
                                                    // top: `${filter?.rnd?.y}%`,
                                                }}
                                            > */}
                                            <img
                                                className="absolute object-cover pointer-events-none max-w-none overflow-hidden"
                                                id={`filter-design-${i}`}
                                                src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${filter?.filter_design?.type == 'story' ? campaignData?.placeholder_story_image : campaignData?.placeholder_image}`}
                                                style={{
                                                    width: `${filter?.rnd?.w}%`,
                                                    height: `${filter?.rnd?.h}%`,
                                                    left: `${filter?.rnd?.x}%`,
                                                    top: `${filter?.rnd?.y}%`,
                                                }}
                                            // loader={({ src, width }) => { return src + "?w=" + width }}
                                            // quality={50}
                                            // priority={true}
                                            // layout={'fill'}
                                            />
                                            {/* </div> */}
                                        </div>
                                        <div className="flex justify-center p-6">
                                            <div className="relative">
                                                <button
                                                    className="border border-gray-500 bg-white min-w-[232px] flex justify-center items-center gap-2 rounded shadow p-2 transition hover:opacity-60"
                                                    style={{ background: filter?.button?.bgcolor ?? "#FFF" }}
                                                // onClick={() =>  handleOpenSettingButtonModal(filter.button, i) }
                                                >
                                                    {filter?.button?.icon
                                                        ?
                                                        <div style={{ color: filter?.button?.textcolor ?? "#000" }}>
                                                            <Image
                                                                src={filter?.button?.icon}
                                                                loader={({ src, width }) => { return src + "?w=" + width }}
                                                                className="!w-5 invert"
                                                                quality={50}
                                                                width={15}
                                                                height={15}
                                                            />
                                                        </div>
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
                                                        {filter?.button?.text}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="w-full relative flex justify-center mt-3">
                            <div className="w-full border-t-2 border-dashed h-0 absolute left-0 top-1/2"></div>
                            <span
                                className="inline-block bg-gray-100 dark:bg-gray-800 relative z-10 px-5 cursor-pointer text-gray-400 dark:text-white"
                                onClick={handleCreateNewFilter}
                            >
                                + Add Filter Design
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <EmptyDrawer open={open} setOpen={setOpen} onSave={saveSettings} title="Filter Card Settings">
                <div>
                    <TextField
                        label="Position"
                        value={filterPosition}
                        onChange={(e: any) => changeFilterPosition(e.target.value)}
                    />
                    <TextField
                        label="Text on Button"
                        value={buttonStyle?.text}
                        onChange={(e: any) => handleUpdateButtonStyle("text", e.target.value)}
                    />
                    <ColorPicker
                        label="Background Color Button"
                        value={buttonStyle?.bgcolor ?? "#FFF"}
                        onChange={(value: any) => handleUpdateButtonStyle("bgcolor", value)}
                    />
                    <ColorPicker
                        label="Text Color Button"
                        value={buttonStyle?.textcolor ?? "#000"}
                        onChange={(value: any) => handleUpdateButtonStyle("textcolor", value)}
                    />
                    <ImagePicker
                        label="Select Icon on Button"
                        onChange={(e) =>
                            handleUpdateButtonStyle(
                                "icon",
                                URL.createObjectURL(e.target.files[0])
                            )
                        }
                    />
                </div>
            </EmptyDrawer>
            <ConfirmModal
                open={showConfirmModal}
                setOpen={setShowConfirmModal}
                handler={confirmed}
                title={"Warning!"}
                description={"Changes you made may not be saved."}
            />
            <Notification
                show={showNotification}
                onClose={() => setShowNotification(false)}
                type="success"
                title="Save Success!"
                content="You have successfully saved the content."
            />
        </div>
    );
};

export default FilterDesigns;
