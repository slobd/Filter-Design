import type { NextPage } from "next";
import { Datepicker } from "flowbite-react";
import moment from "moment";

export type DatePickerPropsType = {
  value: Date;
  onChange: (data: any) => void;
  label?: string;
  className?: string;
  wrapperClassName?: string;
  format?: string;
  align?: string;
  maxDate?: Date;
  minDate?: Date;
};

const DatePicker: NextPage<DatePickerPropsType> = ({
  value,
  onChange,
  label,
  className,
  wrapperClassName,
  format = "YYYY/MM/DD",
  align = "left",
  ...props
}) => {
  const customizeTheme = {
    root: {
      input: {
        field: {
          input: {
            base: "!bg-white !block !w-full !rounded-md !border-0 !py-1.5 !text-gray-900 !shadow-sm !ring-1 !ring-inset !ring-gray-300 placeholder:!text-gray-400 focus:!ring-2 focus:!ring-inset focus:!ring-indigo-600 !sm:text-sm !leading-6",
          },
        },
      },
    },
    popup: {
      root: {
        base: `absolute top-10 z-50 ${
          align === `left` ? `left-0` : `right-0`
        } block pt-2`,
      },
      footer: {
        button: {
          base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-indigo-300",
          today:
            "bg-indigo-700 text-white hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700",
        },
      },
    },
    views: {
      days: {
        items: {
          item: {
            selected: "bg-indigo-700 text-white hover:bg-indigo-600",
          },
        },
      },
      months: {
        items: {
          item: {
            selected: "bg-indigo-700 text-white hover:bg-indigo-600",
          },
        },
      },
      years: {
        items: {
          item: {
            selected: "bg-indigo-700 text-white hover:bg-indigo-600",
          },
        },
      },
      decades: {
        items: {
          item: {
            selected: "bg-indigo-700 text-white hover:bg-indigo-600",
          },
        },
      },
    },
  };

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
      <Datepicker
        icon={undefined}
        style={{ paddingLeft: '10px' }}
        className={`bg-red ${className}`}
        value={moment(value).format(format)}
        onSelectedDateChanged={onChange}
        theme={customizeTheme}
        {...props}
      />
    </div>
  );
};

export default DatePicker;
