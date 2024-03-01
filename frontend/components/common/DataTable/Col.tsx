import type { NextPage } from 'next';
import { BasicPropType } from '../../../utils/types';

const Col: NextPage<BasicPropType> = ({ children, className }: any) => {
  return <td className={`text-xs py-2 px-3 ${className}`}>{children}</td>;
};

export default Col;
