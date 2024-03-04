import { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import Button from "../../../components/common/Button";
import TextField from "../../../components/common/TextField";
import RadioGroup from "../../../components/common/RadioGroup";
import { campaignCategories } from "../../../utils/constants";
import { useAppContext } from "../../../context/context";
import { APIService } from "../../../api"
import CreatorLayout from '../../../components/Layout/Creator';

const CreatorBasic: NextPage = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const { user, loginWithRedirect } = useAuth0();
    const { campaignData, contextCampaignData } = useAppContext();
    const [campaignURL, setCampaignURL] = useState("");

    const handleChange = (target: any, value: any) => {
        if(target && value) {
            contextCampaignData({
                ...campaignData,
                [target]: value
            });
        }
    };

    const handleSave = () => {
        if (!user) {
            loginWithRedirect({
                appState: {
                returnTo: `/creator/${query?.slug}/basic`,
                },
            });
            return;
        }
        if(!campaignData) return;
        APIService.campaign
        .edit(campaignData)
        .then((res: any) => {
            contextCampaignData({ ...campaignData, ...res.data });
            router.push(`/creator/${query?.slug}/filters`);
        })
        .catch((err: any) => console.log(err));
    };

    useEffect(() => {
        setCampaignURL(`${window?.location.origin}/campaign/${query?.slug}`);
    }, [])
    
    return (
        <div className="w-full bg-gray-100 min-h-screen flex flex-row">
            <CreatorLayout />
            {/* <div className="md:w-[288px] md:min-w-[288px] min-h-screen"></div> */}
            <div className="w-[80%] md:pl-80 md:pr-5 md:max-w-3xl max-w-lg mx-auto py-5">
                <div className="bg-white shadow-xl rounded-md p-5">
                    <TextField
                        value={campaignData?.name ?? ""}
                        onChange={(e: any) => handleChange("name", e.target.value)}
                        label="Campaign Name"
                    />
                    <RadioGroup
                        value={campaignData?.category ?? ""}
                        onChange={(e: any) => handleChange("category", e.value)}
                        label="Category"
                        options={campaignCategories}
                    />
                    {campaignData?.category === "event" && (
                        <>
                        <TextField
                            label="Event Name"
                            value={campaignData?.event_name ?? ""}
                            onChange={(e: any) => handleChange("event_name", e.target.value)}
                        />
                        <TextField
                            label="Start Date"
                            value={campaignData?.start_date ?? ""}
                            onChange={(e: any) => handleChange("start_date", e.target.value)}
                        />
                        </>
                    )}
                    <TextField
                        label="Location"
                        value={campaignData?.location ?? ""}
                        onChange={(e: any) => handleChange("location", e.target.value)}
                    />
                    <TextField
                        label="Imprint Link"
                        value={campaignData?.imprint_link ?? ""}
                        onChange={(e: any) => handleChange("imprint_link", e.target.value)}
                    />
                    <TextField
                        label="Data Privacy"
                        value={campaignData?.data_privacy_link ?? ""}
                        onChange={(e: any) => handleChange("data_privacy_link", e.target.value)}
                    />
                    <TextField 
                        value={campaignURL} 
                        label="Campaign URL" 
                        readOnly 
                    />
                </div>
                <Button
                className="w-full mt-5 gap-2"
                color="success"
                onClick={handleSave}
                >
                <span>Next Step - Add Filter Designs</span>
                <ArrowLongRightIcon className="w-5" />
                </Button>
            </div>
        </div>
    );
};

export default CreatorBasic;
