import { CheckCircleIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";

export const CopyToClipboardButton = ({
  text,
}: {
  text: string;
} & React.HTMLAttributes<HTMLButtonElement>) => {
  const [textCopied, setTextCopied] = useState(false);

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(text);
    setTextCopied(true);
    setTimeout(() => {
      setTextCopied(false);
    }, 1000);
  }, [text]);

  return (
    <button onClick={handleCopyToClipboard} className="flex items-center">
      {textCopied ? (
        <CheckCircleIcon
          className="inline-block w-4 h-4 text-green-500"
          height={16}
          width={16}
        />
      ) : (
        <ClipboardIcon
          className="inline-block w-4 h-4"
          height={16}
          width={16}
        />
      )}
    </button>
  );
};
