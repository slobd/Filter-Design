import type { NextPage } from 'next';
import { Fragment } from "react";
import Col from "./Col";
import Row from "./Row";
import { CampaignType, ColumnType } from '../../../utils/types';

export type DataTablePros = {
  cols: ColumnType[];
  rows: any[];
  renderRow: (row?: any, i?: number) => void;
}

const DataTable: NextPage<DataTablePros> = ({ cols, rows, renderRow }) => {
  return (
    <div className="overflow-x-auto md:overflow-visible">
      <table className="w-full min-w-max">
        <thead>
          <Row className="border-b-2">
            {cols?.map((col: ColumnType) => (
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
              {rows?.map((row: CampaignType, i: number) => (
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
