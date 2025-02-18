import { CheckCircleIcon } from "@heroicons/react/24/outline";

import { XMarkIcon } from "@heroicons/react/24/outline";

export const BotStrategyInfo = ({ strategy }: { strategy: any }) => {
  return (
    <div className="text-sm flex justify-between gap-x-4 max-w-[300px]">
      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-4">
          <span>Max Buy</span>
          <span>{strategy.maxBuyAmount} SOL</span>
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
      </div>
      <div className="flex flex-col gap-y-2">
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
      </div>
    </div>
  );
};