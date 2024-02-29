import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import EmptyDrawer from "./EmptyDrawer";
import ImagePicker from "components/common/ImagePicker";
import Select from "components/common/Select";
import TextField from "components/common/TextField";
import API from "apis";
import { addContact, setTags } from "store/actions/Contact";

const AddContactDrawer = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const tags = useSelector((state) => state.contact.tags);
  const [info, setInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    linkedin: "",
    logo: "",
    companyName: "",
    companyLogo: "",
    tags: null,
  });

  const handleChange = (target, value) => {
    setInfo({ ...info, [target]: value });
  };

  const handleSave = () => {
    API.contact
      .create({
        email: info.email,
        first_name: info.firstName,
        last_name: info.lastName,
        position: info.position,
        linkedin: info.linkedin,
        logo: info.logo,
        company_name: info.companyName,
        company_logo: info.companyLogo,
        tags: info.tags && info.tags.map((tag) => tag.value),
        author: user.email,
      })
      .then((res) => {
        dispatch(addContact(res.data));
        setTimeout(() => {
          navigate("/contacts");
        }, 500);
        setOpen(!open);
      });
  };

  const handleCancel = () => {
    setTimeout(() => {
      navigate("/contacts");
    }, 500);
    setOpen(!open);
  };

  const getTagOptions = (tags) => {
    return tags.map((item) => {
      return { value: item._id, label: item.name };
    });
  };

  useEffect(() => {
    API.tag.getAll().then((res) => {
      dispatch(setTags(res.data));
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
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <TextField
        label="First Name"
        value={info.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
      />
      <TextField
        label="Last Name"
        value={info.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
      />
      <TextField
        label="Position"
        value={info.position}
        onChange={(e) => handleChange("position", e.target.value)}
      />
      <TextField
        label="Linkedin Profile"
        value={info.linkedin}
        onChange={(e) => handleChange("linkedin", e.target.value)}
      />
      <ImagePicker
        label="Logo"
        onChange={(e) => handleChange("logo", e.target.files[0])}
      />
      <TextField
        label="Company"
        value={info.companyName}
        onChange={(e) => handleChange("companyName", e.target.value)}
      />
      <ImagePicker
        label="Company Logo"
        onChange={(e) => handleChange("companyLogo", e.target.files[0])}
      />
      <Select
        label="Tags"
        value={info.tags}
        isMultiple={true}
        options={getTagOptions(tags)}
        onChange={(value) => handleChange("tags", value)}
      />
    </EmptyDrawer>
  );
};

export default AddContactDrawer;
