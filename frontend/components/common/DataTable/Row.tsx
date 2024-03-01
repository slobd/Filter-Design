import type { NextPage } from 'next';
import { BasicPropType } from '../../../utils/types';
const Row: NextPage<BasicPropType> = ({ children, className, onClick }: any) => {
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
