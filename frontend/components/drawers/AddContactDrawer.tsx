import type { NextPage } from 'next';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useAuth0 } from "@auth0/auth0-react";
import EmptyDrawer from "./EmptyDrawer";
import ImagePicker from "../common/ImagePicker";
import Select from "../common/Select";
import TextField from "../common/TextField";
import { APIService } from "../../api";
import { ContactType, TagType } from '../../utils/types';

export type AddContactDrawerProps = {
  open: boolean;
  setOpen: (e: any) => void;
  contacts: ContactType[];
  setContacts: (e: any) => void;
  tags: TagType[];
  setTags: (e: any) => void;
}

const AddContactDrawer: NextPage<AddContactDrawerProps> = ({ open, setOpen, contacts, setContacts, tags, setTags }) => {
  const router = useRouter();
  const { user } = useAuth0();
  const [info, setInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    linkedin: "",
    logo: "",
    companyName: "",
    companyLogo: "",
    tags: [],
  });

  const handleChange = (target: any, value: any) => {
    setInfo({ ...info, [target]: value });
  };

  const handleSave = () => {
    APIService.contact
      .create({
        email: info.email,
        first_name: info.firstName,
        last_name: info.lastName,
        position: info.position,
        linkedin: info.linkedin,
        logo: info.logo,
        company_name: info.companyName,
        company_logo: info.companyLogo,
        tags: info.tags && info.tags.map((tag: any) => tag.value),
        author: user?.email,
      })
      .then((res: any) => {
        setContacts([
          ...contacts,
          res.data
        ]);
        setTimeout(() => {
          router.push("/contacts");
        }, 500);
        setOpen(!open);
      });
  };

  const handleCancel = () => {
    setTimeout(() => {
      router.push("/contacts");
    }, 500);
    setOpen(!open);
  };

  const getTagOptions = (tags: any) => {
    return tags.map((item: any) => {
      return { value: item._id, label: item.name };
    });
  };

  useEffect(() => {
    APIService.tag.getAll().then((res: any) => {
      setTags(res.data);
    });
  }, []);

  return (
    <EmptyDrawer
      open={open}
      setOpen={setOpen}
      title="Add Contact"
      onSave={handleSave}
      onCancel={handleCancel}
      size="sm"
    >
      <TextField
        label="Email"
        value={info.email}
        onChange={(e: any) => handleChange("email", e.target.value)}
      />
      <TextField
        label="First Name"
        value={info.firstName}
        onChange={(e: any) => handleChange("firstName", e.target.value)}
      />
      <TextField
        label="Last Name"
        value={info.lastName}
        onChange={(e: any) => handleChange("lastName", e.target.value)}
      />
      <TextField
        label="Position"
        value={info.position}
        onChange={(e: any) => handleChange("position", e.target.value)}
      />
      <TextField
        label="Linkedin Profile"
        value={info.linkedin}
        onChange={(e: any) => handleChange("linkedin", e.target.value)}
      />
      <ImagePicker
        label="Logo"
        onChange={(e: any) => handleChange("logo", e.target.files[0])}
      />
      <TextField
        label="Company"
        value={info.companyName}
        onChange={(e: any) => handleChange("companyName", e.target.value)}
      />
      <ImagePicker
        label="Company Logo"
        onChange={(e: any) => handleChange("companyLogo", e.target.files[0])}
      />
      <Select
        label="Tags"
        value={info.tags}
        isMultiple={true}
        options={getTagOptions(tags)}
        onChange={(value: any) => handleChange("tags", value)}
      />
    </EmptyDrawer>
  );
};

export default AddContactDrawer;
