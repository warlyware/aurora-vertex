import classNames from "classnames";

export default function CenterContentWrapper({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={classNames([
        "flex flex-col h-full w-full min-h-screen justify-center items-center",
        className,
      ])}
    >
      {children}
    </div>
  );
}
