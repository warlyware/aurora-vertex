import { LiquidtyPoolListItem } from "@/components/liquidity-pools/liquidity-pool-list-item";
import { TokenLinks } from "@/components/tokens/token-links";
import { RaydiumLiquidityPool } from "@/types/raydium";
import { getAbbreviatedAddress } from "@/utils";

export const LiquidityPoolList = ({
  pools,
}: {
  pools: RaydiumLiquidityPool[];
}) => {
  return (
    <div className="text-xl mb-8">
      {pools.slice(0, 10).map((pool: RaydiumLiquidityPool) => (
        <LiquidtyPoolListItem pool={pool} key={pool.id} />
      ))}
    </div>
  );
};
