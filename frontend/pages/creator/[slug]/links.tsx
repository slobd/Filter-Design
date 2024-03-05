import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import DataTable, { Col, Row } from "../../../components/common/DataTable";
import {
    ArrowUpCircleIcon,
    CircleStackIcon,
    LinkIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { getImageUrl } from "../../../utils";
import { campaignCategories } from "../../../utils/constants";
import { APIService } from "../../../api";
import CreatorLayout from "../../../components/Layout/Creator";

const Links: NextPage = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const [uniqueLinks, setUniqueLinks] = useState<any>([]);

    useEffect(() => {
        APIService.uniqueLink.getAll(query?.slug).then((res: any) => {
            setUniqueLinks([...res.data]);
        });
    }, []);

    const cols = [
        { id: "email", label: "E-Mail Address" },
        { id: "logo", label: "Image" },
        { id: "first_name", label: "First Name" },
        { id: "last_name", label: "Last Name" },
        { id: "company", label: "Company" },
        { id: "category", label: "Category" },
        { id: "blocked", label: "Block Upload" },
        { id: "link", label: "Unique Link for this Contact" },
        { id: "uses", label: "Uses" },
    ];

    const renderRow = (row: any) => {
        return (
            <Row>
                <Col>
                    <a href={`/contacts/${row.contact._id}`} className="underline">
                        {row.contact.email}
                    </a>
                </Col>
                <Col>
                    {row.contact.logo && (
                        <img
                            src={getImageUrl(row.contact.logo)}
                            className="w-10 h-10 object-cover rounded"
                        />
                    )}
                </Col>
                <Col>{row.contact.first_name}</Col>
                <Col>{row.contact.last_name}</Col>
                <Col>
                    <div className="flex items-center gap-2">
                        {row.contact.company_logo && (
                            <img
                                src={getImageUrl(row.contact.company_logo)}
                                className="w-10 h-10 object-cover rounded"
                            />
                        )}
                        <span>{row.contact.company_name}</span>
                    </div>
                </Col>
                <Col>
                    {row.campaign.category && (
                        <Badge color="primary">
                            {
                                campaignCategories.filter(
                                    (category) => category.value === row.campaign.category
                                )[0].label
                            }
                        </Badge>
                    )}
                </Col>
                <Col>checkbox</Col>
                <Col>
                    <div className="flex items-center gap-1">
                        <LinkIcon className="w-4" />
                        <a
                            href={`${window.location.origin}/${row.link}`}
                            className="underline"
                        >
                            {window.location.origin}/{row.link}
                        </a>
                    </div>
                </Col>
                <Col>{row.uses}</Col>
            </Row>
        );
    };

    return (
        <div className="w-full min-h-screen bg-white">
            <CreatorLayout />
            <div className="md:pl-80 h-16 pl-12 md:pl-6 pr-4 md:pr-6 border-b bg-white flex justify-between items-center gap-2">
                <h3 className="text-xl font-medium md:block hidden">
                    Unique Links to share with your Contacts
                </h3>
                <div className="flex items-center gap-2">
                    <Button color="dark" className="!px-2 md:!px-3">
                        <CircleStackIcon className="w-5" />
                        <span className="hidden md:inline-block ml-1">
                            Add Contacts from Database
                        </span>
                    </Button>
                    <Button color="dark" className="!px-2 md:!px-3">
                        <ArrowUpCircleIcon className="w-5" />
                        <span className="hidden md:inline-block ml-1">Import Contacts</span>
                    </Button>
                    <Button className="!px-2 md:!px-3">
                        <PlusIcon className="w-5" />
                        <span className="hidden md:inline-block ml-1">Add New Contact</span>
                    </Button>
                </div>
            </div>
            <div className="md:pl-80 p-6">
                <DataTable cols={cols} rows={uniqueLinks} renderRow={renderRow} />
            </div>
        </div>
    );
};

export default Links;
