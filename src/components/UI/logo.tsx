import Image from "next/image";

export const Logo = ({ width = 500, height = 500 }) => {
  return (
    <Image
      src="/images/logo.png"
      alt="logo"
      width={width}
      height={height}
      className="rounded-full border-4 border-green-500"
    />
  );
};
