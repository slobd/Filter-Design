import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { CampaignType, FilterType } from '../utils/types';
import { APIService } from '../api';

type ContextType = {
    campaigns: CampaignType[] | [],
    campaignData: CampaignType | null,
    contextCampaignData: (newCampaigns: CampaignType) => void,
    contextResetCampaignData: () => void,
    getInitData: () => void,
    loading: boolean,
    loadingHandle: (e:boolean) => void,
};

type Props = {
    children: ReactNode;
};

const campaignDefaultValue: CampaignType = {
  name: "",
  edge: 14,
  share_title: "",
  share_text: "",
  placeholder_image: "uploads/default_placeholder_image.png",
  placeholder_story_image: "uploads/default_placeholder_image.png",
  change_photo: "Change Photo",
  download_share: "Download and Share!",
  start_date: "",
  location: "",
  event_name: "event",
  imprint_link: "https://about.livedab.com/impressum/",
  data_privacy_link: "https://about.livedab.com/datenschutzbestimmungen/",
}

const contextDefaultValues: ContextType = {
    campaigns:[],
    campaignData: campaignDefaultValue,
    contextCampaignData: () => {},
    contextResetCampaignData: () => {},
    getInitData: () => {},
    loading: true,
    loadingHandle: (e: boolean) => {},
};

const AppContext = createContext<ContextType>(contextDefaultValues);

export function ContextWrapper({ children } : Props) {
    const { user, getAccessTokenSilently } = useAuth0();
    const [loading, setLoading] = useState(true); 
    const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
    const [campaignData, setCampaignData] = useState<CampaignType>(campaignDefaultValue);
    
    useEffect(() => {
      getInitData();
    }, [user]);

    const getInitData = () => {
      APIService.campaign
        .getAll(user?.email)
        .then((res: any) =>{
          if(res.data) setCampaigns(res.data);
      })
    }

    const loadingHandle = (e:boolean) => {
      setLoading(e);
    }

    const contextCampaignData = (newCampaign: CampaignType) => {
      setCampaignData(newCampaign);
    }

    const contextResetCampaignData = () => {
      setCampaignData(campaignDefaultValue);
    }

    const sharedState = {
        campaigns,
        campaignData,
        contextCampaignData,
        contextResetCampaignData,
        getInitData,
        loading,
        loadingHandle,
    };

  return (
    <AppContext.Provider value={sharedState}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}