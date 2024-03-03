import type { NextPage } from 'next';
import { useState } from "react";
import { useRouter } from 'next/router';
import EmptyDrawer from "./EmptyDrawer";
import TextField from "../common/TextField";
import { APIService } from "../../api";
// import { addTag } from "store/actions/Contact";

const AddTagDrawer: NextPage = ({ open, setOpen }: any) => {
  const router = useRouter();
  const [tag, setTag] = useState("");

  const handleSave = () => {
    // APIService.tag
    //   .create({ name: tag })
    //   .then((res: any) => {
    //     dispatch(addTag(res.data));
    //     setOpen(!open);
    //     setTimeout(() => {
    //       router.push("/contacts");
    //     }, 500);
    //   })
    //   .catch((error) => console.log(error));
  };

  const handleCancel = () => {
    setTimeout(() => {
      router.push("/contacts");
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
        onChange={(e: any) => setTag(e.target.value)}
      />
    </EmptyDrawer>
  );
};

export default AddTagDrawer;
