import React from "react";

const Col = ({ children, className }) => {
  return <td className={`text-xs py-2 px-3 ${className}`}>{children}</td>;
};

export default Col;
