import { NextPage } from 'next'
import { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import TextField from "../../components/common/TextField";
import ColorPicker from "../../components/common/ColorPicker";
import ImagePicker from "../../components/common/ImagePicker";
import Select from "../../components/common/Select";
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';

const Settings: NextPage = () => {
  const [info, setInfo] = useState({
    companyName: "",
    streetNumber: "",
    postalCode: "",
    city: "",
    country: null,
    language: null,
    logo: null,
    primaryColor: "",
    secondaryColor: "",
    nickName: "",
    hashtag: "",
    website: "",
    instagram: "",
    linkedin: "",
  });
  const handleChange = (target: any, value: any) => setInfo({ ...info, [target]: value });

  return (
    <div>
      <Sidebar />
      <div className="w-full md:pl-72">
        <div className="w-full max-w-md px-5 mx-auto py-10">
          <TextField
            label="Company Name"
            value={info.companyName}
            onChange={(e: any) => handleChange("companyName", e.target.value)}
          />
          <TextField
            label="Street + Number"
            value={info.streetNumber}
            onChange={(e: any) => handleChange("streetNumber", e.target.value)}
          />
          <TextField
            label="Zip-Code"
            value={info.postalCode}
            onChange={(e: any) => handleChange("postalCode", e.target.value)}
          />
          <TextField
            label="City"
            value={info.city}
            onChange={(e: any) => handleChange("city", e.target.value)}
          />
          {/* <Select
            label="Country"
            value={ info.country }
            onChange={(e: any) => handleChange("country", e.target.value)}
          /> */}
          {/* <Select
            label="Language"
            value={ info.language }
            onChange={(e: any) => handleChange("language", e.target.value)}
          /> */}
          <ImagePicker
            label="Logo"
            value={info.logo}
            onChange={(e: any) => handleChange("logo", e.target.files[0])}
          />
          <ColorPicker
            label="Primary Color"
            value={info.primaryColor}
            onChange={(value: any) => handleChange("primaryColor", value)}
          />
          <ColorPicker
            label="Secondary Color"
            value={info.secondaryColor}
            onChange={(value: any) => handleChange("secondaryColor", value)}
          />
          <TextField
            label="Nickname / Short Name"
            value={info.nickName}
            onChange={(e: any) => handleChange("nickName", e.target.value)}
          />
          <TextField
            label="Hashtag"
            value={info.hashtag}
            onChange={(e: any) => handleChange("hashtag", e.target.value)}
          />
          <TextField
            label="Website Link"
            value={info.website}
            onChange={(e: any) => handleChange("website", e.target.value)}
          />
          <TextField
            label="@Instagram Name"
            value={info.instagram}
            onChange={(e: any) => handleChange("instagram", e.target.value)}
          />
          <TextField
            label="Linkedin Name"
            value={info.linkedin}
            onChange={(e: any) => handleChange("linkedin", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
