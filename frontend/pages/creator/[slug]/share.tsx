import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import domtoimage from "dom-to-image";
import copy from "copy-to-clipboard";
import Button from "../../../components/common/Button";
import TextField from "../../../components/common/TextField";
import EmbedCodeModal from "../../../components/modal/EmbedCodeModal";
import CreatorLayout from '../../../components/Layout/Creator';
import { validateEmail } from "../../../utils";
import { APIService } from "../../../api";

const Share: NextPage = () => {
    const router = useRouter();
    const { pathname, query } = router;
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [shareLink, setShareLink] = useState("");

    const handleDownloadQRCode = (type: any) => {
        const qrCodeElement = document.querySelector("#qr-code");
        if(qrCodeElement) {
            if (type === "png") {
                domtoimage
                    .toPng(qrCodeElement)
                    .then(function (dataUrl) {
                        var link = document.createElement("a");
                        link.download = `QR-Code.${type}`;
                        link.href = dataUrl;
                        link.click();
                    })
                    .catch(function (error) {
                        console.error("oops, something went wrong!", error);
                    });
            }
            if (type === "svg") {
                domtoimage
                    .toSvg(qrCodeElement)
                    .then(function (dataUrl) {
                        var link = document.createElement("a");
                        link.download = `QR-Code.${type}`;
                        link.href = dataUrl;
                        link.click();
                    })
                    .catch(function (error) {
                        console.error("oops, something went wrong!", error);
                    });
            }
        } else {
            console.error("QR code element not found");
        }
        
    };

    const handleInviteByEmail = () => {
        if (!validateEmail(email)) {
            alert("Please enter validate E-Mail Address");
            return;
        } 
        APIService.campaign
            .inviteByEmail({ email, link: shareLink })
            .then(() => {
                console.log("sent");
            })
            .catch((error: any) => console.log(error));
    };

    useEffect(() => {
        setShareLink(`${window.location.origin}/campaign/${query?.slug}`);
    }, [query?.slug])

    return (
        <div className="w-full">
            <CreatorLayout />
            <div className="md:pl-80 h-16 pl-12 md:pl-6 px-6 border-b bg-white flex justify-between items-center gap-2">
                <h3 className="text-xl font-medium">
                    Share this Campaign with your Audience
                </h3>
            </div>
            <div className="md:pl-80 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 p-5 md:p-10">
                <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center justify-center aspect-[1/1] bg-gray-200">
                        <Image src="/assets/images/share/link.svg" width={100} height={100} className="w-20 md:w-28" />
                    </div>
                    <div className="flex flex-1 flex-col space-y-2 p-4">
                        <h3 className="text-sm font-medium text-gray-900 text-center">
                            Share the Link of this Campaign
                        </h3>
                        <p className="line-clamp-3 text-sm text-gray-500 text-center">
                            Description text in three rows will be here. Description text in
                            three rows will be here. Description text in three rows will be
                            here. Description text in three rows will be here. Description
                            text in three rows will be here.
                        </p>
                        <TextField
                            className="w-full text-center"
                            value={shareLink}
                            readOnly
                        />
                        <Button color="pink" onClick={() => copy(shareLink)}>
                            Copy Link
                        </Button>
                    </div>
                </div>
                <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center justify-center aspect-[1/1] bg-gray-200">
                        <Image src="/assets/images/share/embed.svg" width={100} height={100} className="w-20 md:w-28" />
                    </div>
                    <div className="flex flex-1 flex-col space-y-2 p-4">
                        <h3 className="text-sm font-medium text-gray-900 text-center">
                            Integrate into your Website or App
                        </h3>
                        <p className="line-clamp-3 text-sm text-gray-500 text-center">
                            Description text in three rows will be here. Description text in
                            three rows will be here. Description text in three rows will be
                            here. Description text in three rows will be here. Description
                            text in three rows will be here.
                        </p>
                        <div className="h-9"></div>
                        <Button color="pink" onClick={() => setOpen(true)}>
                            See Integration Code
                        </Button>
                    </div>
                </div>
                <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center justify-center aspect-[1/1] bg-gray-200">
                        <Image src="/assets/images/share/qr.svg" width={100} height={100} className="w-20 md:w-28" />
                    </div>
                    <div className="flex flex-1 flex-col space-y-2 p-4">
                        <h3 className="text-sm font-medium text-gray-900 text-center">
                            Download QR-CODE of this Campaign
                        </h3>
                        <p className="line-clamp-3 text-sm text-gray-500 text-center">
                            Description text in three rows will be here. Description text in
                            three rows will be here. Description text in three rows will be
                            here. Description text in three rows will be here. Description
                            text in three rows will be here.
                        </p>
                        <Button color="white" onClick={() => handleDownloadQRCode("svg")}>
                            Download QR-CODE (svg)
                        </Button>
                        <Button color="pink" onClick={() => handleDownloadQRCode("png")}>
                            Download QR-CODE (png)
                        </Button>
                        <div className="flex w-0 h-0 overflow-hidden">
                            <div
                                className="w-[170px] h-[170px] bg-gray-100 p-5 rounded"
                                id="qr-code"
                            >
                                <QRCode value={shareLink} size={130} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center justify-center aspect-[1/1] bg-gray-200">
                        <Image src="/assets/images/share/email.svg" width={100} height={100} className="w-20 md:w-28" />
                    </div>
                    <div className="flex flex-1 flex-col space-y-2 p-4">
                        <h3 className="text-sm font-medium text-gray-900 text-center">
                            Send this Campaign to your Colleague
                        </h3>
                        <p className="line-clamp-3 text-sm text-gray-500 text-center">
                            Description text in three rows will be here. Description text in
                            three rows will be here. Description text in three rows will be
                            here. Description text in three rows will be here. Description
                            text in three rows will be here.
                        </p>
                        <TextField
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                            placeholder="E-Mail Address"
                            className="w-full text-center"
                        />
                        <Button color="pink" onClick={handleInviteByEmail}>
                            Send now
                        </Button>
                    </div>
                </div>
            </div>

            {/* <EmbedCodeModal open={open} setOpen={setOpen} /> */}
        </div>
    );
};

export default Share;
