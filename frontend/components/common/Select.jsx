import React from "react";
import ReactTailwindcssSelect from "react-tailwindcss-select";

const Select = ({ label, value, onChange, options, isMultiple, ...props }) => {
  return (
    <div className="mb-2">
      {label && (
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900 mb-2"
        >
          {label}
        </label>
      )}
      <ReactTailwindcssSelect
        value={value}
        onChange={onChange}
        options={options}
        isMultiple={isMultiple}
        primaryColor="#4f46e5"
        classNames={{
          menuButton: () =>
            "flex w-full bg-white min-h-[36px] rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
          menu: "w-full bg-white absolute z-10 -bottom-1 translate-y-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
          listItem: () =>
            "hover:text-indigo-600 hover:bg-indigo-200 cursor-pointer list-none transition rounded p-1",
          tagItemIconContainer: "flex items-center justify-center hover:bg-indigo-200 hover:text-indigo-600 cursor-pointer px-1",
        }}
        placeholder=""
        {...props}
      />
    </div>
  );
};

export default Select;
