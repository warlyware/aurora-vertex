import { WsHeader } from "./ws-header";

export default function WsPageWrapper(props: { children: React.ReactNode }) {
  return (
    <div className="flex w-full absolute top-0 left-0 right-0 bottom-0">
      <WsHeader />
      {props.children}
    </div>
  )
}