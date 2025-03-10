import Image from "next/image";

export const Logo = ({ width = 200, height = 200 }) => {
  return (
    <Image
      src="/images/logo.png"
      alt="logo"
      width={width}
      height={height}
      className="rounded-full border-2 border-pink-600"
    />
  );
};
