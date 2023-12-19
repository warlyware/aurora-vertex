export default function CenterContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full min-h-screen justify-center items-center">
      {children}
    </div>
  );
}
