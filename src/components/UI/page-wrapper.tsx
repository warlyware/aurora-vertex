export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full justify-items-center min-h-screen px-6 -mt-16">
      {children}
    </div>
  );
};
