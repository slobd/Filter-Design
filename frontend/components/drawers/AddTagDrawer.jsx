import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import EmptyDrawer from "./EmptyDrawer";
import TextField from "components/common/TextField";
import API from "apis";
import { addTag } from "store/actions/Contact";

const AddTagDrawer = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tag, setTag] = useState("");
  const handleSave = () => {
    API.tag
      .create({ name: tag })
      .then((res) => {
        dispatch(addTag(res.data));
        setOpen(!open);
        setTimeout(() => {
          navigate("/contacts");
        }, 500);
      })
      .catch((error) => console.log(error));
  };

  const handleCancel = () => {
    setTimeout(() => {
      navigate("/contacts");
    }, 500);
    setOpen(!open);
  };

  return (
    <EmptyDrawer
      open={open}
      setOpen={setOpen}
      title="Add Tag"
      onSave={handleSave}
      onCancel={handleCancel}
      size="sm"
    >
      <TextField
        label="Name"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
    </EmptyDrawer>
  );
};

export default AddTagDrawer;
