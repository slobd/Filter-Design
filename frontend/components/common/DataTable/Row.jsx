import React from "react";

const Row = ({ children, className, onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`border-b ${onClick ? `cursor-pointer` : ``} ${className}`}
    >
      {children}
    </tr>
  );
};

export default Row;
