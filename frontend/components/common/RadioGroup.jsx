import React from "react";

const RadioGroup = ({
  name,
  label,
  value,
  onChange,
  className,
  wrapperClassName,
  options,
  ...props
}) => {
  return (
    <div className={`mb-2 ${wrapperClassName}`} {...props}>
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
          {label}
        </label>
      )}
      <div>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={option.value}
              name="notification-method"
              type="radio"
              checked={option.value === value}
              onChange={() => onChange(option)}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label
              htmlFor={option.value}
              className="ml-3 block text-sm font-medium leading-6 text-gray-900"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
