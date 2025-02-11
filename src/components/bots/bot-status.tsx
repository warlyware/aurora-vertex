type BotStatus = {
  isActive: boolean;
  tradesExecuted: number;
  errors: number;
  lastTradeTime: number;
  tradeHistory: {
    time: number;
    price: number;
    quantity: number;
  }[];
}

export const BotStatus = (props: { status: BotStatus, className?: string }) => {
  return (
    <div className={`flex flex-col gap-y-2 text-sm ${props.className}`}>
      <div className="flex space-x-2">
        <div className="font-bold">Session Trades Executed</div>
        <div>{props?.status?.tradesExecuted || 0}</div>
      </div>
      <div className="flex space-x-2">
        <div className="font-bold">Errors</div>
        <div>{props?.status?.errors || 0}</div>
      </div>
    </div>
  )
}