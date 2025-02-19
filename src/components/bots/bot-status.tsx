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
  profit: number;
}

export const BotStatus = (props: { status: BotStatus, className?: string }) => {
  return (
    <div className={`text-xs my-2 ${props.className}`}>
      <div className="flex space-x-2">
        <div>Est. Profit</div>
        <div>{props?.status?.profit?.toFixed(2) || 0}%</div>
      </div>
    </div>
  )
}