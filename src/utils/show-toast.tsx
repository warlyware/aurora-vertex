import toast from "react-hot-toast";

export type AppError = {
  code: string;
  message: string;
};

export type ToastLink = {
  url: string;
  title: string;
};

const showToast = ({
  primaryMessage,
  secondaryMessage,
  link,
  error,
}: {
  primaryMessage: string;
  secondaryMessage?: string;
  link?: ToastLink;
  error?: AppError;
}) => {
  if (primaryMessage === "WalletNotSelectedError") return;

  toast.custom(
    <div
      className="flex max-w-sm flex-col rounded-lg p-4 text-center text-xl mt-8"
      style={{
        color: "#f3f4f6",
        backgroundColor: "#000",
      }}
    >
      <div className="text-gray-200 font-bold">{primaryMessage}</div>
      {secondaryMessage && <div>{secondaryMessage}</div>}
      {link && (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {link.title}
        </a>
      )}
      {/* {error && (
        <div className="text-sm font-bold text-red-600">
          Error Code {error.code}
        </div>
      )} */}
    </div>
  );
};

export default showToast;
