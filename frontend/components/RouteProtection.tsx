
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'typescript-cookie';

const ProtectedRoute = ({ children }: any) => {
    const router = useRouter();    

    useEffect(() => {
       let token = getCookie('token');
       if(!token) router.push('/login');
    }, []);

    return <>{children}</>;
};

export default ProtectedRoute;