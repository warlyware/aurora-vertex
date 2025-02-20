'use client'
import classNames from "classnames";

export default function WsContentWrapper(props: { children: React.ReactNode, className?: string }) {
  return (
    <div className={classNames("mt-12", props.className)}>
      {props.children}
    </div>
  )
}