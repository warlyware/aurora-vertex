"use client";
import Spinner from "@/components/UI/spinner";
import classNames from "classnames";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode | string;
  type?: "submit" | undefined;
  disabled?: boolean;
  isLoading?: boolean;
}

export const PrimaryButton = ({
  disabled,
  children,
  isLoading,
  ...props
}: Props) => {
  return (
    <button
      onClick={props?.onClick}
      disabled={disabled}
      className={classNames([
        "bg-green-500 hover:bg-green-600 text-gray-800 rounded-xl p-4 py-2 uppercase border border-green-500 hover:border-green-600 font-bold transition-colors duration-300 ease-in-out flex justify-center items-center",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        props.className,
      ])}
      type={props.type}
    >
      {isLoading ? <Spinner /> : <>{children}</>}
    </button>
  );
};
