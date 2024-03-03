const TextField = ({
  type = "text",
  name,
  label,
  value,
  onChange,
  placeholder,
  className,
  wrapperClassName,
  ...props
}: any) => {
  return (
    <div className={`mb-2 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900 mb-2"
        >
          {label}
        </label>
      )}
      <div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`${className} block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
          placeholder={placeholder}
          {...props}
        />
      </div>
    </div>
  );
};

export default TextField;
