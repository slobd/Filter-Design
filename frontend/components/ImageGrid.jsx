import React from "react";
import Card from "./Card";
import OverlayImage1 from "assets/images/overlay/1.png";
import OverlayImage2 from "assets/images/overlay/2.png";
import OverlayImage3 from "assets/images/overlay/3.png";

const ImageGrid = () => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold">Square Images</span>
            <span className="text-gray-400 ml-2">2</span>
          </div>
          <span className="flex px-1 bg-gray-300 text-white rounded text-xs leading-4">
            1080x1080px
          </span>
        </div>
        <div className="flex flex-col gap-5">
          <Card overlay={OverlayImage1} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold">Title Images</span>
            <span className="text-gray-400 ml-2">2</span>
          </div>
          <span className="flex px-1 bg-gray-300 text-white rounded text-xs leading-4">
            1080x1080px
          </span>
        </div>
        <Card overlay={OverlayImage2} dir="column" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold">Story Images</span>
            <span className="text-gray-400 ml-2">2</span>
          </div>
          <span className="flex px-1 bg-gray-300 text-white rounded text-xs leading-4">
            1080x1080px
          </span>
        </div>
        <Card overlay={OverlayImage3} />
      </div>
    </div>
  );
};

export default ImageGrid;
