import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {} from '../utils/types';
import { CampaignType } from '../utils/types';

type ContextType = {
    campaigns: CampaignType[] | [],
    contextCampaigns: (campaigns: CampaignType[]) => void,
    getInitData: () => void,
    loading: boolean,
    loadingHandle: (e:boolean) => void,
};

type Props = {
    children: ReactNode;
};

const contextDefaultValues: ContextType = {
    campaigns:[],
    getInitData: () => {},
    contextCampaigns: () => {},
    loading: true,
    loadingHandle: (e: boolean) => {},
};

const AppContext = createContext<ContextType>(contextDefaultValues);

export function ContextWrapper({ children } : Props) {
    const [loading, setLoading] = useState(true); 
    const [campaigns, setCampaigns] = useState<CampaignType[]>([]);

    useEffect(() => {
      getInitData();
    }, []);

    const getInitData = () => { 

    }

    const loadingHandle = (e:boolean) => {
      setLoading(e);
    }

    const contextCampaigns = (newCampaigns: CampaignType[]) => {
      setCampaigns(newCampaigns);
    }

    const sharedState = {
        campaigns,
        contextCampaigns,
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