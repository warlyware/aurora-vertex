import { TokenLinks } from "@/components/tokens/token-links";
import { TokenPrice } from "@/components/tokens/token-price";
import { getAbbreviatedAddress } from "@/utils";

export const LiquidtyPoolListSubItem = ({
  label,
  address,
}: {
  label: string;
  address: string;
}) => {
  return (
    <div className="flex space-x-2 mb-4">
      <div className="flex flex-col pr-8">
        <div>{label}</div>
        {getAbbreviatedAddress(address)}
      </div>
      <div className="flex flex-col">
        <TokenLinks address={address} />
        <TokenPrice address={address} />
      </div>
    </div>
  );
};
