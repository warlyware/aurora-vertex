import { BirdEyeIcon } from "@/icons/bird-eye-icon";
import { DexscreenerIcon } from "@/icons/dex-screener-icon";
import { SolscanIcon } from "@/icons/solscan-icon";
import {
  getBirdEyeTokenUrl,
  getDexscreeenerTokenUrl,
  getSolscanTokenUrl,
} from "@/utils/urls";

export const LiquidityPoolTableTokenLinks = ({
  address,
}: {
  address: string;
}) => {
  return (
    <>
      <div className="flex">
        {!!address && (
          <>
            <a
              href={getSolscanTokenUrl(address)}
              target="_blank"
              rel="noreferrer noopener"
              className="mr-4 underline"
            >
              <SolscanIcon />
            </a>
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
          </>
        )}
      </div>
    </>
  );
};
