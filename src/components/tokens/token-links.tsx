import { BirdEyeIcon } from "@/icons/bird-eye-icon";
import { DexscreenerIcon } from "@/icons/dex-screener-icon";
import { SolscanIcon } from "@/icons/solscan-icon";
import {
  getBirdEyeTokenUrl,
  getDexscreeenerTokenUrl,
  getJupiterSwapUrl,
  getOrcaSwapUrl,
  getRaydiumSwapUrl,
  getSolanaExplorerTokenUrl,
  getSolanaFmTokenUrl,
  getSolscanTokenUrl,
  getTwitterSearchUrl,
} from "@/utils/urls";

export const TokenLinks = ({
  address,
  symbol,
}: {
  address: string;
  symbol?: string;
}) => {
  return (
    <>
      <div className="flex flex-wrap mb-4">
        {!!address && (
          <>
            <a
              href={getBirdEyeTokenUrl(address)}
              target="_blank"
              rel="noreferrer noopener"
              className="mr-4 underline"
            >
              <BirdEyeIcon />
            </a>
            <a
              href={getDexscreeenerTokenUrl(address)}
              target="_blank"
              rel="noreferrer noopener"
              className="mr-4 underline"
            >
              <DexscreenerIcon />
            </a>
            <a
              href={getSolscanTokenUrl(address)}
              target="_blank"
              rel="noreferrer noopener"
              className="mr-4 underline"
            >
              <SolscanIcon />
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
            <a
              href={getTwitterSearchUrl(address)}
              target="_blank"
              rel="noreferrer noopener"
              className="mr-4 underline"
            >
              x
            </a>
            {!!symbol && (
              <a
                href={getTwitterSearchUrl(symbol)}
                target="_blank"
                rel="noreferrer noopener"
                className="mr-4 underline"
              >
                x (symbol)
              </a>
            )}
          </>
        )}
      </div>
      <div className="flex">
        <a
          href={getJupiterSwapUrl(address)}
          target="_blank"
          rel="noreferrer noopener"
          className="mr-4 underline"
        >
          jupiter
        </a>
        <a
          href={getRaydiumSwapUrl(address)}
          target="_blank"
          rel="noreferrer noopener"
          className="mr-4 underline"
        >
          raydium
        </a>
        <a
          href={getOrcaSwapUrl(address)}
          target="_blank"
          rel="noreferrer noopener"
          className="mr-4 underline"
        >
          orca
        </a>
      </div>
    </>
  );
};
