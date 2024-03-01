import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, CSSProperties } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Image from 'next/image'
import FadeLoader from "react-spinners/FadeLoader";
import { useAppContext } from '../context/context';

import Footer from "../components/Layout/Footer";
import Button from "../components/common/Button";

const items = [
  {
    id: 1,
    title: "Meet Me At Filter for Events",
    link: "",
    image: "/assets/images/cases/1.png",
  },
  {
    id: 2,
    title: "Hear me Speak Filter for Events",
    link: "",
    image: "/assets/images/cases/2.png",
  },
  {
    id: 3,
    title: "Fan Filter for Sports & Entertainment",
    link: "",
    image: "/assets/images/cases/3.png",
  },
  {
    id: 4,
    title: "Linkedin Filter for Companies",
    link: "",
    image: "/assets/images/cases/4.png",
  },
];

const Home: NextPage = () => {
  const router = useRouter();
  const { loginWithRedirect } = useAuth0();

  const {loading, loadingHandle} = useAppContext();

  const handleCreateFilterCampaign = () => {
    console.log("handleCreateFilterCampaign");
  };

  useEffect(() => {
    loadingHandle(false);
  }, []); 

  const override: CSSProperties = {
    display: "block",
    top: "50vh",
    margin: "0 auto",
    zIndex: 20,
    height: "0px",
  };

  return (
    <div className="container mx-auto font-strawford">
      <FadeLoader
        color={"#36d7b7"}
        loading={loading}
        cssOverride={override}
        width={5}
        radius={2}
        aria-label="Loading FadeLoader"
        data-testid="loader"
      />
      <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image
                src="/assets/images/logo.png"
                height={40}
                width={40}
                alt="Logo"
              />
            </a>
          </div>
          <div className="flex flex-1 justify-end">
            <span
              className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
              onClick={() => loginWithRedirect()}
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </span>
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-4xl py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Our filter marketing solutions help create branded and shareable
              content for events, sports clubs and businesses.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join Bits & Pretzels, SPOBIS, Liverpool FC, Audi, Telekom, 1. FC
              Nürnberg, BayWa or REWE and start your LIVEDAB Filter campaign
              today.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-[1000px] px-6 lg:px-8">
          <ul
            role="list"
            className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {items.map((item) => (
              <li
                key={item.id}
                className="relative bg-white shadow-xl overflow-hidden rounded-xl"
              >
                <Image
                  src={item.image}
                  width={400}
                  height={400}
                  className="pointer-events-none object-cover group-hover:opacity-75"
                  alt=""
                />
                <div className="flex flex-col items-center gap-2 py-4 px-5">
                  <p className="pointer-events-noneblock text-lg leading-5 font-medium text-gray-900 text-center">
                    {item.title}
                  </p>
                  <Button
                    color="primary"
                    className="w-40"
                    onClick={handleCreateFilterCampaign}
                  >
                    Start for free
                  </Button>
                  <p className="pointer-events-none block text-sm font-medium text-gray-400">
                    See Demo Examples
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-10 md:mb-16">
            WHO IS USING LIVEDAB ALREADY?
          </h2>
          <div className="-mx-6 grid grid-cols-2 gap-0.5 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3">
            <div className="bg-gray-400/5 p-8 sm:p-10">
              <Image
                className="max-h-12 w-full object-contain"
                src="/assets/images/logos/1.jpeg"
                alt="Transistor"
                width={158}
                height={48}
              />
            </div>
            <div className="bg-gray-400/5 p-6 sm:p-10">
              <Image
                className="max-h-12 w-full object-contain"
                src="/assets/images/logos/2.jpeg"
                alt="Reform"
                width={158}
                height={48}
              />
            </div>
            <div className="bg-gray-400/5 p-6 sm:p-10">
              <Image
                className="max-h-12 w-full object-contain"
                src="/assets/images/logos/3.png"
                alt="Tuple"
                width={158}
                height={48}
              />
            </div>
            <div className="bg-gray-400/5 p-6 sm:p-10">
              <Image
                className="max-h-12 w-full object-contain"
                src="/assets/images/logos/4.png"
                alt="Laravel"
                width={158}
                height={48}
              />
            </div>
            <div className="bg-gray-400/5 p-6 sm:p-10">
              <Image
                className="max-h-12 w-full object-contain"
                src="/assets/images/logos/5.jpeg"
                alt="SavvyCal"
                width={158}
                height={48}
              />
            </div>
            <div className="bg-gray-400/5 p-6 sm:p-10">
              <Image
                className="max-h-12 w-full object-contain"
                src="/assets/images/logos/6.png"
                alt="Statamic"
                width={158}
                height={48}
              />
            </div>
            <div className="bg-gray-400/5 p-6 sm:p-10">
              <Image
                className="max-h-12 w-full object-contain"
                src="/assets/images/logos/7.jpeg"
                alt="Statamic"
                width={158}
                height={48}
              />
            </div>
            <div className="bg-gray-400/5 p-6 sm:p-10">
              <Image
                className="max-h-12 w-full object-contain"
                src="/assets/images/logos/8.jpeg"
                alt="Statamic"
                width={158}
                height={48}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </div>
  )
}

export default Home;
