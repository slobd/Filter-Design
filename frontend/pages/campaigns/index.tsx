'use client'
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from "react";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toast';


// const DynamicSocialLogin = dynamic(async () => await import('../../components/SocialLogin'), { ssr: false });

const Signup: NextPage = () => {
    const router = useRouter();
    const [agree, setAgree] = useState(false);
    const [show_password, setShowPassword] = useState(false);

  return (    
    <div className="container px-[20px] mx-auto font-strawford py-[45px]">
        <ToastContainer delay={4000} position='top-center'/>
        <div>Campaigns</div>
    </div>    
  )
}

export default Signup
