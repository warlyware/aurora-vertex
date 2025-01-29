export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center h-full w-full min-h-screen px-6 pt-24">
      {/* <div className="pt-16 w-full h-full"></div> */}
      {children}
    </div>
  );
};
