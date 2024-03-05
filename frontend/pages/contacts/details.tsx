import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { APIService } from "../../api";
import { getImageUrl } from "../../utils";
import { ContactType } from "../../utils/types";

const ContactDetail: NextPage = () => {
  const router = useRouter();
  const {pathname, query} = router;
  const [contact, setContact] = useState<ContactType>();

  useEffect(() => {
    APIService.contact.get(query?.id).then((res: any) => {
      setContact({ ...res.data });
    });
  }, []);

  const handleDelete = () => {
    APIService.contact.delete(query?.id).then(() => {
      router.push("/contacts");
    });
  };

  return (
    <div>
      <Sidebar />
      <div className="w-full md:pl-72">
        <div className="w-full p-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex items-center gap-2 pl-12 md:pl-0">
              <span className="text-2xl font-medium">Contact Details</span>
            </div>
            <div className="self-end md:self-auto">
              <Button color="danger" onClick={handleDelete}>
                Delete Contact
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="col-span-1 flex flex-col gap-5">
              <div className="bg-white shadow-lg false rounded-2xl p-6 border">
                <ul className="grid gap-3">
                  <li className="grid grid-cols-2 gap-5">
                    <span className="text-gray-500">E-Mail Address</span>
                    <span>{contact?.email}</span>
                  </li>
                  <li className="grid grid-cols-2 gap-5">
                    <span className="text-gray-500">First Name</span>
                    <span>{contact?.first_name}</span>
                  </li>
                  <li className="grid grid-cols-2 gap-5">
                    <span className="text-gray-500">Last Name</span>
                    <span>{contact?.last_name}</span>
                  </li>
                  <li className="grid grid-cols-2 gap-5">
                    <span className="text-gray-500">Position</span>
                    <span>{contact?.position}</span>
                  </li>
                  <li className="grid grid-cols-2 gap-5">
                    <span className="text-gray-500">Company Name</span>
                    <span>{contact?.company_name}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white shadow-lg false rounded-2xl p-6 border">
                <h4 className="text-lg font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {contact?.tags?.map((tag: any) => (
                    <Badge color="primary" key={tag?._id}>
                      {tag?.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col gap-5">
              <div className="bg-white shadow-lg false rounded-2xl p-6 border">
                <h4 className="text-lg font-medium mb-2">Visuals</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 flex flex-col items-center gap-3">
                    {contact?.company_logo && (
                      <img
                        src={getImageUrl(contact?.company_logo)}
                        className="w-full rounded-lg"
                      />
                    )}
                    <span>Company Logo</span>
                  </div>
                  <div className="col-span-1 flex flex-col items-center gap-3">
                    {contact?.company_logo && (
                      <img
                        src={getImageUrl(contact?.company_logo)}
                        className="w-full rounded-lg"
                      />
                    )}
                    <span>Square Image</span>
                  </div>
                  <div className="col-span-1 flex flex-col items-center gap-3">
                    {contact?.company_logo && (
                      <img
                        src={getImageUrl(contact?.company_logo)}
                        className="w-full rounded-lg"
                      />
                    )}
                    <span>Story Image</span>
                  </div>
                  <div className="col-span-1 flex flex-col items-center gap-3">
                    {contact?.company_logo && (
                      <img
                        src={getImageUrl(contact?.company_logo)}
                        className="w-full rounded-lg"
                      />
                    )}
                    <span>Square Video</span>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-lg false rounded-2xl p-6 border">
                <h4 className="text-lg font-medium mb-2">Campaigns</h4>
                <div className="flex flex-wrap gap-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
