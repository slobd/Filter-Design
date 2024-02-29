import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {} from '../utils/types';
// import { getCookie } from 'typescript-cookie';

// if (typeof window !== "undefined") {
//     var token = getCookie('token');
// }

type ContextType = {
    isAuthenticated: boolean,
    contextLogin: () => void,
    contextLogout: () => void,
    loading: boolean,
    getInitData: () => void,    
    loadingHandle: (e:boolean) => void,
};

type Props = {
    children: ReactNode;
};

const contextDefaultValues: ContextType = {
    isAuthenticated: false,
    contextLogin: () => {},
    contextLogout: () => {},
    loading: true,
    getInitData: () => {},    
    loadingHandle: (e:boolean) => {},
};

const AppContext = createContext<ContextType>(contextDefaultValues);

export function ContextWrapper({ children } : Props) {
    const router = useRouter();   
    const [loading, setLoading] = useState(true); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // if(token) {
        //     getInitData();               
        // }
    }, []); 

    const getInitData = () => { 

    }    

    const loadingHandle = (e:boolean) => {
        setLoading(e);
    }

    const contextLogin = () => {
     
    };

    const contextLogout = () => {
     
    };

    const sharedState = {
        isAuthenticated,
        loading,
        getInitData,        
        loadingHandle,
        contextLogin,
        contextLogout,
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