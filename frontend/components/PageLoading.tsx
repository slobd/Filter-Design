import { NextPage } from 'next';
import Image from 'next/image'
import BeatLoader from "react-spinners/BeatLoader";

const PageLoading: NextPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
      <Image src="/assets/images/logo.png" className="w-16" alt="Livedab | v2" width={40} height={40}/>
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
