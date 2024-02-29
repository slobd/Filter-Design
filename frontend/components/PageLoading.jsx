import React from "react";
import Image from 'next/image'
import BeatLoader from "react-spinners/BeatLoader";
import Logo from "assets/images/logo.png";

const PageLoading = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
      <Image src={Logo} className="w-16" alt="Livedab | v2" />
      <BeatLoader
        color={"#4F46E5"}
        loading={true}
        size={16}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default PageLoading;
