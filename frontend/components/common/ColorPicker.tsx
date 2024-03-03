import type { NextPage } from "next";
import { useState } from "react";
import { default as Picker } from "react-pick-color";
import OutsideClickHandler from "react-outside-click-handler";

export type ColorPickerProps = {
  label: string;
  value?: string;
  onChange: (e: any) => void;
};

const ColorPicker: NextPage<ColorPickerProps> = ({ label, value, onChange }) => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="mb-2">
      {label && (
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      )}
      <div className="relative mt-2">
        <div
          style={{ background: value }}
          className={`border-0 rounded shadow-sm w-8 h-8 cursor-pointer ${
            opened
              ? `ring-2 ring-inset ring-indigo-600`
              : `ring-1 ring-inset ring-gray-300`
          }`}
          onClick={() => setOpened(true)}
        />
        {opened && (
          <OutsideClickHandler onOutsideClick={() => setOpened(false)}>
            <div className="absolute z-10 mt-1">
              <Picker color={value} onChange={(color: any) => onChange(color.hex)} />
            </div>
          </OutsideClickHandler>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
