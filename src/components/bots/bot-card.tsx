import { CheckCircleIcon, EyeIcon, EyeSlashIcon, PowerIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import classNames from "classnames";
import { BotStatus } from "./bot-status";
import { getAbbreviatedAddress } from "@/utils";
import { FormInputWithLabel } from "../UI/forms/form-input-with-label";
import { useFormik } from "formik";
import { AURORA_VERTEX_API_URL } from "@/constants";
import axios from "axios";
import { PrimaryButton } from "../UI/buttons/primary-button";
import { useState } from "react";
import Spinner from "../UI/spinner";
import showToast from "@/utils/show-toast";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
type BotCardProps = {
  bot: {
    id: string;
    name: string;
    botWallet?: {
      wallet?: {
        keypair?: {
          publicKey: string;
        }
      }
    }
    buyRatio: number;
    priorityFeeInLamports: number;
    ejectWallet?: {
      address: string;
    }
  };
  botStatus: any;
  botLogs: any[];
  visibleBotLogs: any[];
  onToggleVisibility: (botId: string) => void;
  onBotAction: (botId: string) => void;
};

export function BotCard({
  bot,
  botStatus,
  onBotAction
}: BotCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      buyRatio: bot?.buyRatio,
      priorityFee: bot?.priorityFeeInLamports / LAMPORTS_PER_SOL,
      ejectWalletAddress: bot?.ejectWallet?.address,
    },
    onSubmit: async ({ priorityFee, buyRatio }) => {
      console.log(priorityFee, buyRatio);

      console.log('onSubmit');

      let data;

      try {
        const { data: responseData } = await axios.post(
          `${AURORA_VERTEX_API_URL}/update-bot-settings`,
          {
            botId: bot.id,
            priorityFee,
            buyRatio,
            ejectWalletAddress: formik.values.ejectWalletAddress,
            apiKey: process.env.NEXT_PUBLIC_AURORA_VERTEX_FRONTEND_API_KEY,
          });

        data = responseData;

        showToast({
          primaryMessage: "Bot settings updated",
        });
      } catch (error: any) {
        const errorMessage = error?.response?.data?.error;
        showToast({
          primaryMessage: "Error updating bot settings",
          secondaryMessage: errorMessage,
        });
      }
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full p-2 px-4 bg-sky-950 rounded-lg">
      <div className="flex flex-col">
        <div className="flex justify-between space-x-2 mb-2 items-center">
          <div className="flex">
            <div className="flex items-center">
              {botStatus?.isActive ? (
                <div className="bg-green-600 h-3 w-3 rounded-full shadow-inner" />
              ) : (
                <div className="bg-red-600 h-3 w-3 rounded-full shadow-inner" />
              )}
            </div>
            <div className="font-bold ml-2">{bot.name}</div>
          </div>
          <div className="flex space-x-2 items-center">
            {/* broke on refactor */}
            {/* <button
              className={classNames([
                "h-4 w-4",
                botLogs.some((log) => log.botId === bot.id) ? "" : "text-gray-500",
              ])}
              onClick={() => onToggleVisibility(bot.id)}
            >
              {visibleBotLogs.some((log) => log.botId === bot.id) ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeSlashIcon className="h-4 w-4" />
              )}
            </button> */}
            <button onClick={() => onBotAction(bot.id)}>
              <PowerIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <Link
          className="text-sm underline mb-4 w-fit"
          href={`/wallet/${bot?.botWallet?.wallet?.keypair?.publicKey}`}
        >
          {getAbbreviatedAddress(bot?.botWallet?.wallet?.keypair?.publicKey)}
        </Link>
      </div>
      <BotStatus status={botStatus} className="mb-4" />
      <hr className="mb-4" />
      <form onSubmit={formik.handleSubmit}>
        <div className="flex py-2 space-x-2">
          <FormInputWithLabel
            label="Priority Fee"
            name="priorityFee"
            type="number"
            value={formik.values.priorityFee}
            onChange={formik.handleChange}
          />
          <FormInputWithLabel
            label="Buy Ratio"
            name="buyRatio"
            type="number"
            value={formik.values.buyRatio}
            onChange={formik.handleChange}
          />
        </div>
        <div className="flex py-2 space-x-2 items-end justify-between">
          <FormInputWithLabel
            label="Eject Wallet"
            name="ejectWalletAddress"
            type="text"
            value={formik.values.ejectWalletAddress}
            onChange={formik.handleChange}
          />
          <button type="submit" className="mb-2">
            <CheckCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </form>
    </div>
  );
}