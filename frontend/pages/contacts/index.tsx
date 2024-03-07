import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { parse } from "papaparse";
import DataTable, { Col, Row } from "../../components/common/DataTable";
import Sidebar from "../../components/Layout/Sidebar";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import AddContactDrawer from "../../components/drawers/AddContactDrawer";
import AddTagDrawer from "../../components/drawers/AddTagDrawer";
import { APIService } from "../../api";
import moment from "moment";
import { getImageUrl } from "../../utils";
import { ArrowUpCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ContactType, TagType } from "../../utils/types";

const Contacts: NextPage = () => {
  const fileRef = useRef<any>();
  const { user } = useAuth0();
  const [isOpenAddContactDrawer, setIsOpenAddContactDrawer] = useState(false);
  const [isOpenAddTagDrawer, setIsOpenAddTagDrawer] = useState(false);
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);

  useEffect(() => {
    setIsOpenAddTagDrawer(location.search.includes("add_tag"));
    setIsOpenAddContactDrawer(location.search.includes("add_contact"));

    fetchContacts();
  }, []);

  const fetchContacts = () => {
    APIService.contact.getAll(user?.email).then((res: any) => {
      setContacts(res.data);
    });
  };

  const handleImportContacts = (e: any) => {
    parse(e.target.files[0], {
      complete: (res) => {
        let _contacts = [];
        const data = res.data;
        data.shift();
        data.map((row: any) => {
          _contacts.push({
            email: row[0],
            first_name: row[1],
            last_name: row[2],
            position: row[3],
            linkedin: row[4],
            logo: row[5],
            company_name: row[6],
            company_logo: row[7],
            tags: row[8].split(",").map((tag: any) => tag.trim()),
            author: user?.email,
          });
        });
        APIService.contact.bulkImport(contacts).then(async (res: any) => {
          setTags(res.data.tags);
          setContacts(res.data.contacts);
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  };

  const cols = [
    { id: "email", label: "E-Mail Address" },
    { id: "logo", label: "Image" },
    { id: "first_name", label: "First Name" },
    { id: "last_name", label: "Last Name" },
    { id: "company", label: "Company" },
    { id: "campaigns", label: "Campaigns" },
    { id: "created_at", label: "Date Added" },
    { id: "tags", label: "Tags" },
  ];

  const renderRow = (row: any) => {
    return (
      <Row>
        <Col>
          <a href={`/contacts/${row._id}`} className="underline">
            {row.email}
          </a>
        </Col>
        <Col>
          {row.logo && (
            <Image
              src={getImageUrl(row.logo)}
              loader={({ src, width }) => { return src + "?w=" + width }}
              className="w-10 h-10 object-cover rounded"
              quality={50}
              width={35}
              height={35}
            />
          )}
        </Col>
        <Col>{row.first_name}</Col>
        <Col>{row.last_name}</Col>
        <Col>
          <div className="flex items-center gap-2">
            {row.company_logo && (
              <Image
                src={getImageUrl(row.company_logo)}
                className="w-10 h-10 object-cover rounded"
                loader={({ src, width }) => { return src + "?w=" + width }}
                quality={50}
                width={35}
                height={35}
              />
            )}
            <span>{row.company_name}</span>
          </div>
        </Col>
        <Col>{moment(row.createdAt).format("DD.MM.YYYY - hh:mma")}</Col>
        <Col>
          <div className="flex flex-wrap gap-1">
            {row.tags.map((tag: any, i: number) => (
              <Badge color="primary" key={i}>
                {tag.name}
              </Badge>
            ))}
          </div>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="w-full md:pl-72">
          <div className="w-full p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-2xl mb-5 md:mb-0 pl-12 md:pl-0">
                <span className="font-medium">Contacts</span>
              </div>
              <div className="flex items-center self-end md:self-auto gap-2">
                <Button
                  className="!px-2 md:!px-3"
                  color="dark"
                  onClick={() => fileRef.current.click()}
                >
                  <ArrowUpCircleIcon className="w-5 text-white" />
                  <span className="ml-1.5">Import Contacts</span>
                </Button>
                <input
                  type="file"
                  className="hidden"
                  ref={fileRef}
                  accept=".csv"
                  onChange={handleImportContacts}
                />
                <Button
                  className="!px-2 md:!px-3"
                  onClick={() => setIsOpenAddContactDrawer(true)}
                >
                  <PlusIcon className="w-5 text-white" />
                  <span className="ml-1.5">Add New Contact</span>
                </Button>
              </div>
            </div>

            <DataTable cols={cols} rows={contacts} renderRow={renderRow} />
          </div>
        </div>
      </div>

      <AddContactDrawer
        open={isOpenAddContactDrawer}
        setOpen={setIsOpenAddContactDrawer}
        contacts={contacts}
        setContacts={setContacts}
        tags={tags}
        setTags={setTags}
      />

      <AddTagDrawer 
        open={isOpenAddTagDrawer} 
        setOpen={setIsOpenAddTagDrawer}
        tags={tags}
        setTags={setTags}
      />
    </>
  );
};

export default Contacts;
