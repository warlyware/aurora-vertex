import {
  getBirdEyeTokenUrl,
  getDexscreeenerTokenUrl,
  getSolanaExplorerTokenUrl,
  getSolanaFmTokenUrl,
  getSolscanTokenUrl,
} from "@/utils/urls";

export const TokenLinks = ({ address }: { address: string }) => {
  return (
    <div className="flex">
      {!!address && (
        <>
          <a
            href={getBirdEyeTokenUrl(address)}
            target="_blank"
            rel="noreferrer noopener"
            className="mr-4 underline"
          >
            birdeye
          </a>
          <a
            href={getDexscreeenerTokenUrl(address)}
            target="_blank"
            rel="noreferrer noopener"
            className="mr-4 underline"
          >
            dexscreener
          </a>
          <a
            href={getSolscanTokenUrl(address)}
            target="_blank"
            rel="noreferrer noopener"
            className="mr-4 underline"
          >
            solscan
          </a>
          <a
            href={getSolanaFmTokenUrl(address)}
            target="_blank"
            rel="noreferrer noopener"
            className="mr-4 underline"
          >
            solana fm
          </a>
          <a
            href={getSolanaExplorerTokenUrl(address)}
            target="_blank"
            rel="noreferrer noopener"
            className="mr-4 underline"
          >
            explorer
          </a>
        </>
      )}
    </div>
  );
};
