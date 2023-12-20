export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center h-full w-full min-h-screen px-6 -mt-16">
      {children}
    </div>
  );
};
