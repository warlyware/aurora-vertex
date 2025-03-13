import { CheckCircleIcon } from "@heroicons/react/24/outline";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { BotStrategy, Trader } from "./bot-strategy-form";
import { getAbbreviatedAddress } from "@/utils";

export const BotStrategyInfo = ({ strategy, trader }: { strategy: BotStrategy | undefined, trader: Trader | undefined }) => {
  if (!strategy || !trader) {
    return null;
  }

  return (
    <>
      <div className="flex text-sm gap-x-4 mb-4">
        <span>TARGET</span>
        <a href={`https://gmgn.ai/sol/address/${trader.wallet.address}`} target="_blank">
          <span>{trader.name}</span> <span>({getAbbreviatedAddress(trader.wallet.address)})</span>
        </a>
      </div>
      <div className="text-xs flex justify-between gap-x-4 max-w-[300px]">
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-4">
            <span>Intended Trade Ratio</span>
            <span>{(strategy.intendedTradeRatio || 0) * 100}%</span>
          </div>
          <div className="flex gap-x-4">
            <span>Max Buy</span>
            <span>{strategy.maxBuyAmount || 0} SOL</span>
          </div>
          <div className="flex gap-x-4">
            <span>Stop Loss</span>
            <span>{strategy.stopLossPercentage || 0}%</span>
          </div>
          <div className="flex gap-x-4">
            <span>Take Profit</span>
            <span>{strategy.takeProfitPercentage || 0}%</span>
          </div>
          <div className="flex gap-x-4">
            <span>Priority Fee</span>
            <span>{strategy.priorityFee}</span>
          </div>
          <div className="flex gap-x-4">
            <span>Auto Sell</span>
            <span>{strategy.shouldAutoSell ? <CheckCircleIcon className="h-4 w-4" /> : <XMarkIcon className="h-4 w-4" />}</span>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-4">
            <span>Slippage</span>
            <span>{strategy.slippagePercentage || 0}%</span>
          </div>
          <div className="flex gap-x-4">
            <span>Copy Buys</span>
            <span>{strategy.shouldCopyBuys ? <CheckCircleIcon className="h-4 w-4" /> : <XMarkIcon className="h-4 w-4" />}</span>
          </div>
          <div className="flex gap-x-4">
            <span>Copy Sells</span>
            <span>{strategy.shouldCopySells ? <CheckCircleIcon className="h-4 w-4" /> : <XMarkIcon className="h-4 w-4" />}</span>
          </div>
          <div className="flex gap-x-4">
            <span>Eject On Buy</span>
            <span>{strategy.shouldEjectOnBuy ? <CheckCircleIcon className="h-4 w-4" /> : <XMarkIcon className="h-4 w-4" />}</span>
          </div>
          <div className="flex gap-x-4">
            <span>Eject On Curve</span>
            <span>{strategy.shouldEjectOnCurve ? <CheckCircleIcon className="h-4 w-4" /> : <XMarkIcon className="h-4 w-4" />}</span>
          </div>
          {strategy.shouldAutoSell && (
            <div className="flex gap-x-4">
              <span>Delay</span>
              <span>{strategy.autoSellDelayInMs || 0}ms</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};