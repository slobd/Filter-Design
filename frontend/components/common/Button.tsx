import type { NextPage } from 'next';

export type ButtonProps = {
  children: React.ReactNode;
  color?: "primary" | "dark" | "white" | "transparent" | "success" | "danger" | "pink" | "secondary";
  size?: "lg" | "sm";
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

const Button: NextPage<ButtonProps> = ({
  children,
  color = "primary",
  size = "lg",
  onClick,
  className,
  style,
}: any) => {
  const colorStyles: any = {
    primary: "bg-indigo-600 text-white border-indigo-600",
    dark: "bg-black text-white",
    white: "bg-white text-black border",
    transparent: "bg-transparent text-black !shadow-none",
    success: "bg-green-600 text-white border-green-600",
    danger: "bg-red-600 text-white border-red-600",
    pink: "bg-[#D8279B] text-white border-[#D8279B]",
    secondary: "bg-gray-200 text-black border-gray-200"
  };
  
  return (
    <button
      style={style}
      onClick={onClick}
      className={`flex items-center justify-center rounded ${
        colorStyles[color]
      } px-3 ${
        size === "lg" ? "py-2" : "py-1"
      } text-sm font-semibold shadow-sm ${className} box-border transition hover:opacity-60`}
    >
      {children}
    </button>
  );
};

export default Button;
