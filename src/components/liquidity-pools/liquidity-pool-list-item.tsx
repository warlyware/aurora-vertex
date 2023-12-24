import { LiquidtyPoolListSubItem } from "@/components/liquidity-pools/liquidity-pool-list-sub-item";
import { TokenLinks } from "@/components/tokens/token-links";
import { SOL_TOKEN_ADDRESS } from "@/constants";
import { RaydiumLiquidityPool } from "@/types/raydium";
import { getAbbreviatedAddress } from "@/utils";
import { isSol } from "@/utils/solana";

export const LiquidtyPoolListItem = ({
  pool,
}: {
  pool: RaydiumLiquidityPool;
}) => {
  return (
    <div key={pool.id} className="mb-4 border rounded-lg p-4">
      <LiquidtyPoolListSubItem address={pool.baseMint} label="baseMint" />
      <LiquidtyPoolListSubItem address={pool.quoteMint} label="quoteMint" />
      <LiquidtyPoolListSubItem address={pool.openOrders} label="openOrders" />
      <LiquidtyPoolListSubItem
        address={pool.targetOrders}
        label="targetOrders"
      />
      <LiquidtyPoolListSubItem address={pool.baseVault} label="baseVault" />
      <LiquidtyPoolListSubItem address={pool.quoteVault} label="quoteVault" />
      <LiquidtyPoolListSubItem
        address={pool.withdrawQueue}
        label="withdrawQueue"
      />
      <LiquidtyPoolListSubItem address={pool.lpVault} label="lpVault" />
      <LiquidtyPoolListSubItem
        address={pool.marketProgramId}
        label="marketProgramId"
      />
      <LiquidtyPoolListSubItem address={pool.marketId} label="marketId" />
      <LiquidtyPoolListSubItem
        address={pool.marketAuthority}
        label="marketAuthority"
      />
      <LiquidtyPoolListSubItem address={pool.programId} label="programId" />
      <LiquidtyPoolListSubItem
        address={pool.marketBaseVault}
        label="marketBaseVault"
      />
      <LiquidtyPoolListSubItem
        address={pool.marketQuoteVault}
        label="marketQuoteVault"
      />
      <LiquidtyPoolListSubItem address={pool.marketBids} label="marketBids" />
      <LiquidtyPoolListSubItem address={pool.marketAsks} label="marketAsks" />
      <LiquidtyPoolListSubItem
        address={pool.marketEventQueue}
        label="marketEventQueue"
      />
      {!!pool.lookupTableAccount && (
        <LiquidtyPoolListSubItem
          address={pool.lookupTableAccount}
          label="lookupTableAccount"
        />
      )}
      <div className="flex w-full  justify-around">
        <div className="flex space-x-2">
          <div>baseDecimals</div>
          <div>{pool.baseDecimals}</div>
        </div>
        <div className="flex space-x-2">
          <div>quoteDecimals</div>
          <div>{pool.quoteDecimals}</div>
        </div>
        <div className="flex space-x-2">
          <div>lpDecimals</div>
          <div>{pool.lpDecimals}</div>
        </div>
      </div>
    </div>
  );
};
