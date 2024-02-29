import React, { Fragment } from "react";
import Col from "./Col";
import Row from "./Row";

const DataTable = ({ cols, rows, renderRow }) => {
  return (
    <div className="overflow-x-auto md:overflow-visible">
      <table className="w-full min-w-max">
        <thead>
          <Row className="border-b-2">
            {cols.map((col) => (
              <Col
                className={`font-regular ${
                  col.align === `center` ? `text-center` : `text-left`
                }`}
                key={col.id}
              >
                {col.label}
              </Col>
            ))}
          </Row>
        </thead>
        <tbody>
          {rows && rows.length > 0 ? (
            <>
              {rows.map((row, i) => (
                <Fragment key={i}>{renderRow(row)}</Fragment>
              ))}
            </>
          ) : (
            <tr>
              <td colSpan={cols.length} align="center" className="py-5">
                No records
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
export { Row, Col };
