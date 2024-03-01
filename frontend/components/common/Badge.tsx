import type { NextPage } from 'next';

export type BadgeProps = {
  color?: string | "success" | "default";
  children: React.ReactNode;
}
const Badge: NextPage<BadgeProps> = ({ color, children }: any) => {
  const colorStyles: any = {
    success: "bg-green-500/10 text-green-400 border border-green-600/20",
    warning: "bg-yellow-400/10 text-yellow-500 border border-yellow-600/20",
    default: "bg-gray-400/10 text-gray-400 border border-gray-500/10",
    danger: "bg-red-400/10 text-red-400 border border-red-600/10",
    primary: "bg-indigo-200 text-indigo-500 border border-indigo-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-gray-400 capitalize ${colorStyles[color]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
