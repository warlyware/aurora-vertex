import { SolanaTxNotificationType } from "@/types/helius"
import { useState } from "react";
import { SolanaTxNotificationDetailInstruction } from "./SolanaTxNotificationDetailInstruction";
import JSONPretty from "react-json-pretty";

export const SolanaTxNotificationDetailsExtended = (props: {
  message: SolanaTxNotificationType
}) => {
  const [showRawTxInstructions, setShowRawTxInstructions] = useState(false);
  const [showRawInnerInstructions, setShowRawInnerInstructions] = useState(false);
  const [showRawLogMessages, setShowRawLogMessages] = useState(false);
  const [showRawPreTokenBalances, setShowRawPreTokenBalances] = useState(false);
  const [showRawFee, setShowRawFee] = useState(false);
  const [showRawStatus, setShowRawStatus] = useState(false);
  const [showRawErr, setShowRawErr] = useState(false);

  const { message } = props;
  const result = message?.payload?.params?.result;

  return (
    <div className="flex">
      <div className="flex flex-col gap-y-2 w-52 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showRawTxInstructions}
            onChange={() => setShowRawTxInstructions((prev) => !prev)}
          />
          <label>Instructions</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showRawInnerInstructions}
            onChange={() => setShowRawInnerInstructions((prev) => !prev)}
          />
          <label>Inner Instructions</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showRawLogMessages}
            onChange={() => setShowRawLogMessages((prev) => !prev)}
          />
          <label>Log Messages</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showRawPreTokenBalances}
            onChange={() => setShowRawPreTokenBalances((prev) => !prev)}
          />
          <label>Pre Token Balances</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showRawFee}
            onChange={() => setShowRawFee((prev) => !prev)}
          />
          <label>Fee</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showRawStatus}
            onChange={() => setShowRawStatus((prev) => !prev)}
          />
          <label>Status</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showRawErr}
            onChange={() => setShowRawErr((prev) => !prev)}
          />
          <label>Err</label>
        </div>
      </div>

      <div className="text-xs text-gray-400 px-4 flex flex-col gap-y-2 max-h-[60vh] overflow-y-auto w-full">
        {!!result?.transaction?.transaction?.message?.instructions &&
          showRawTxInstructions &&
          result?.transaction?.transaction?.message?.instructions?.map((instruction, index) => (
            <SolanaTxNotificationDetailInstruction instruction={instruction} key={index} />
          ))}


        {/* raw inner instructions */}
        {!!result?.transaction?.meta?.innerInstructions &&
          showRawInnerInstructions &&
          result?.transaction?.meta?.innerInstructions?.map((innerInstruction, index) => (
            <div key={index} className="flex flex-col gap-y-2">
              <div className="text-xs text-gray-400">Inner Instruction {index}</div>
              {!!innerInstruction?.instructions && innerInstruction?.instructions?.map((instruction, index) => (
                <JSONPretty key={index} data={instruction} />
              ))}
            </div>
          ))}

        {/* raw log messages */}
        {!!result?.transaction?.meta?.logMessages &&
          showRawLogMessages &&
          result?.transaction?.meta?.logMessages?.map((logMessage, index) => (
            <div key={index} className="text-xs text-gray-400">{logMessage}</div>
          ))}

        {/* raw pre token balances */}
        {!!result?.transaction?.meta?.preTokenBalances &&
          showRawPreTokenBalances &&
          result?.transaction?.meta?.preTokenBalances?.map((preTokenBalance, index) => (
            <JSONPretty key={index} data={preTokenBalance} />
          ))}

        {/* raw fee */}
        {!!result?.transaction?.meta?.fee &&
          showRawFee &&
          (
            <JSONPretty data={result.transaction.meta.fee} />
          )}

        {/* raw status */}
        {!!result?.transaction?.meta?.status &&
          showRawStatus &&
          (
            <JSONPretty data={result.transaction.meta.status} />
          )}

        {/* raw err */}
        {!!result?.transaction?.meta?.err && (
          <JSONPretty data={result.transaction.meta.err} />
        )}
      </div>
    </div>
  );
}