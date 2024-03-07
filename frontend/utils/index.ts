import { sizeTypes } from "./constants";

export const getBase64 = (file: any, cb: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };
  
  export const dataURLtoFile = (dataurl: string, filename: string) => {
    var arr: any = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  
  export const getImageDimensionByURL = (url: any, cb: any) => {
    var img = new Image();
    img.onload = () => {
      cb(img.width, img.height);
    };
    img.src = url;
  };
  
  export const getImageUrl = (link: string) => {
    return link.startsWith("http")
      ? link
      : `${process.env.NEXT_PUBLIC_APP_API_URL}/${link}`;
  };
  
  export const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  export const getFilterIndexByFilterDesignId = (filter: any[], id: any) => {
    let index;
    filter.map((item, i) => {
      if (item?.filterDesign._id === id) index = i;
    });
    return index;
  };

  export const getFilterType = (file: any, cb: any) => {
    var img = new Image();
    let type;
    img.onload = () => {
        type = sizeTypes[`${img.width}x${img.height}`];
        cb(type || "custom");
    };
    img.src = URL.createObjectURL(file);
};
  