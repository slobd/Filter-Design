import type { NextPage } from 'next';
import Image from 'next/image'
import Button from "../common/Button";

const Footer: NextPage = () => {  
  return (
    <div className="flex flex-col items-center bg-white px-5 py-10 gap-4 border-t relative z-50">
      <Image
        src="assets/images/logo.png"
        width={40}
        height={40}
        alt="Logo"
      />
      <Button color="white">
        <span className="text-[0.8rem]">Software by LIVEDAB.COM</span>
      </Button>
      <nav
        className="-mb-6 flex justify-center space-x-8"
        aria-label="Footer"
      >
        <div className="pb-6 text-center">
          <a
            href="#"
            className="text-xs leading-5 text-gray-600 hover:text-gray-900"
          >
            Imprint
          </a>
        </div>
        <div className="pb-6 text-center">
          <a
            href="#"
            className="text-xs leading-5 text-gray-600 hover:text-gray-900"
          >
            Data Privacy
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Footer;
