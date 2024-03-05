import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState, Suspense } from "react";
import DatePicker from "../../../components/common/DatePicker";
import { APIService } from "../../../api";
import moment from "moment";
import CreatorLayout from "../../../components/Layout/Creator";

const Reporting: NextPage = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const [report, setReport] = useState({
        views: 0,
        uses: 0,
        conversationRate: 0,
        downloads: 0,
        galleries: [],
    });
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
    });

    const handleChangeDateRange = (target: any, value: any) => {
        setDateRange({ ...dateRange, [target]: value });
    };

    useEffect(() => {
        APIService.campaign
            .getReport({
                slug: query?.slug,
                startDate:
                    moment(dateRange.startDate).format("YYYY-MM-DD") + " 00:00:00",
                endDate: moment(dateRange.endDate).format("YYYY-MM-DD") + " 23:59:59",
            })
            .then((res: any) => {
                setReport({ ...res.data });
            })
            .catch((error: any) => console.log(error));
    }, [dateRange, query?.slug]);

    return (
        <div className="w-full">
            <CreatorLayout />
            <div className="md:pl-80 h-16 pl-12 md:pl-6 pr-4 md:pr-6 border-b bg-white flex justify-between items-center gap-2">
                <h3 className="text-xl font-medium">Reporting</h3>
                <div className="flex items-center gap-2 md:gap-3">
                    <span className="hidden md:inline">Select Time Frame</span>
                    <DatePicker
                        wrapperClassName="!mb-0"
                        className="w-24 md:w-32"
                        value={dateRange.startDate}
                        onChange={(date: any) => handleChangeDateRange("startDate", date)}
                        align="right"
                        maxDate={dateRange.endDate}
                    />
                    <DatePicker
                        wrapperClassName="!mb-0"
                        className="w-24 md:w-32"
                        value={dateRange.endDate}
                        onChange={(date: any) => handleChangeDateRange("endDate", date)}
                        align="right"
                        minDate={dateRange.startDate}
                    />
                </div>
            </div>
            <div className="md:pl-80 p-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">
                            Views
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {report.views}
                        </dd>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">
                            Uses Rate
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {report.uses}
                        </dd>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">
                            Conversation Rate
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {Math.round((report.uses / report.views) * 100) || 0}%
                        </dd>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">
                            Downloads
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {report.downloads}
                        </dd>
                    </div>
                </dl>
                <div>
                    <h3 className="font-medium mb-5">Photo Gallery</h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {report.galleries.map((gallery: any, i) => (
                            <div className="relative group" key={gallery._id}>
                                <img
                                    src={`${process.env.NEXT_PUBLIC_APP_API_URL}/${gallery.path}`}
                                    className="rounded-lg cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>
                    {report.galleries.length === 0 && (
                        <span className="text-xs text-gray-500">
                            No Photos uploaded yet
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reporting;
