import { FormInputWithLabel } from "../UI/forms/form-input-with-label";
import { PrimaryButton } from "../UI/buttons/primary-button";
import { useFormik } from "formik";
import { FormSelectInputWithLabel } from "../UI/forms/form-select-input-with-label";
import { useQuery } from "@apollo/client";
import { GET_TRADERS } from "@/graphql/queries/get-traders";
import { getAbbreviatedAddress } from "@/utils";
import { BASE_URL } from "@/constants";
import axios from "axios";
import showToast from "@/utils/show-toast";
import { GET_TRADER_STRATEGY_UNIONS_BY_BOT_ID } from "@/graphql/queries/get-trader-strategy-unions-by-bot-id";
import { useState } from "react";

export type Trader = {
  id: string;
  name: string;
  wallet: {
    id: string;
    address: string;
  }
}

export type AuroraBot = {
  id: string;
  name: string;
  ejectWalletId: string;
}

export type TraderStrategyUnion = {
  id: string;
  traderId: string;
  tradeStrategyId: string;
  strategy: BotStrategy;
}


export type BotStrategy = {
  id: string;
  name?: string;
  maxBuyAmount?: number;
  stopLossPercentage?: number;
  takeProfitPercentage?: number;
  shouldCopyBuys: boolean;
  shouldCopySells: boolean;
  shouldEjectOnBuy: boolean;
  shouldEjectOnCurve: boolean;
  shouldSellOnCurve: boolean;
  traderId: string;
  priorityFee: number;
  createdAt: string;
  updatedAt: string;
}

export const BotStrategyForm = ({ bot, refetch }: { bot: AuroraBot, refetch: () => void }) => {
  const [existingStrategy, setExistingStrategy] = useState<BotStrategy | null>(null);

  const { data: traders } = useQuery(GET_TRADERS);

  const { handleSubmit, values, handleChange, setFieldValue, handleBlur, isSubmitting } = useFormik({
    initialValues: {
      maxBuyAmount: existingStrategy?.maxBuyAmount || 0,
      stopLossPercentage: existingStrategy?.stopLossPercentage || 0,
      takeProfitPercentage: existingStrategy?.takeProfitPercentage || 0,
      shouldCopyBuys: existingStrategy?.shouldCopyBuys || false,
      shouldCopySells: existingStrategy?.shouldCopySells || false,
      shouldEjectOnBuy: existingStrategy?.shouldEjectOnBuy || false,
      shouldEjectOnCurve: existingStrategy?.shouldEjectOnCurve || false,
      shouldSellOnCurve: existingStrategy?.shouldSellOnCurve || false,
      traderId: existingStrategy?.traderId || "",
      priorityFee: existingStrategy?.priorityFee || 0,
      name: existingStrategy?.name || "",
      botId: bot.id,
    },
    onSubmit: async (values) => {
      console.log(values);
      const { data } = await axios.post(`${BASE_URL}/api/add-strategy`, values);
      console.log(data);

      if (data.status === 200) {
        showToast({
          primaryMessage: "Strategy added successfully",
        });
      } else {
        showToast({
          primaryMessage: "Failed to add strategy",
        });
      }

      refetch();
      setExistingStrategy(null);
    },
  });

  useQuery<{
    traderStrategies: TraderStrategyUnion[];
  }>(GET_TRADER_STRATEGY_UNIONS_BY_BOT_ID, {
    variables: {
      botId: bot.id,
      skip: !bot.id,
    },
    onCompleted: ({ traderStrategies }) => {
      setExistingStrategy({
        ...traderStrategies[0]?.strategy,
        traderId: traderStrategies[0]?.traderId,
        shouldEjectOnCurve: traderStrategies[0]?.strategy?.shouldEjectOnCurve,
        shouldSellOnCurve: traderStrategies[0]?.strategy?.shouldSellOnCurve,
      });

      setFieldValue("traderId", traderStrategies[0]?.traderId);
      setFieldValue("maxBuyAmount", traderStrategies[0]?.strategy?.maxBuyAmount);
      setFieldValue("stopLossPercentage", traderStrategies[0]?.strategy?.stopLossPercentage);
      setFieldValue("takeProfitPercentage", traderStrategies[0]?.strategy?.takeProfitPercentage);
      setFieldValue("shouldCopyBuys", traderStrategies[0]?.strategy?.shouldCopyBuys);
      setFieldValue("shouldCopySells", traderStrategies[0]?.strategy?.shouldCopySells);
      setFieldValue("shouldEjectOnBuy", traderStrategies[0]?.strategy?.shouldEjectOnBuy);
      setFieldValue("priorityFee", traderStrategies[0]?.strategy?.priorityFee);
      setFieldValue("name", traderStrategies[0]?.strategy?.name);
      setFieldValue("shouldEjectOnCurve", traderStrategies[0]?.strategy?.shouldEjectOnCurve);
      setFieldValue("shouldSellOnCurve", traderStrategies[0]?.strategy?.shouldSellOnCurve);
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSelectInputWithLabel
        value={values.traderId}
        label="Trader"
        name="traderId"
        options={traders?.traders?.map((trader: Trader) => ({
          value: trader.id,
          label: `${trader.name} - ${getAbbreviatedAddress(trader.wallet.address, 10)}`
        })) || []}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="select target"
        hideLabel={false}
      />
      <FormInputWithLabel
        label="Max Buy Amount (SOL)"
        name="maxBuyAmount"
        type="number"
        value={values.maxBuyAmount}
        onChange={handleChange}
      />

      <FormInputWithLabel
        label="Stop Loss (%)"
        name="stopLossPercentage"
        type="number"
        value={values.stopLossPercentage}
        onChange={handleChange}
      />

      <FormInputWithLabel
        label="Take Profit (%)"
        name="takeProfitPercentage"
        type="number"
        value={values.takeProfitPercentage}
        onChange={handleChange}
      />

      <FormInputWithLabel
        label="Priority Fee"
        name="priorityFee"
        type="number"
        value={values.priorityFee}
        onChange={handleChange}
      />

      <div className="flex space-x-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={values.shouldCopyBuys}
            onChange={(e) => {
              setFieldValue("shouldCopyBuys", e.target.checked);
            }}
            className="h-4 w-4 rounded border-gray-700 bg-sky-950 text-blue-600"
          />
          <label className="ml-2 block text-sm text-gray-200">
            Copy Buys
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={values.shouldCopySells}
            onChange={(e) => {
              setFieldValue("shouldCopySells", e.target.checked);
            }}
            className="h-4 w-4 rounded border-gray-700 bg-sky-950 text-blue-600"
            disabled={values.shouldEjectOnBuy}
          />
          <label className="ml-2 block text-sm text-gray-200">
            Copy Sells
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={values.shouldEjectOnBuy}
            onChange={(e) => {
              setFieldValue("shouldEjectOnBuy", e.target.checked);
            }}
            className="h-4 w-4 rounded border-gray-700 bg-sky-950 text-blue-600"
            disabled={values.shouldEjectOnCurve}
          />
          <label className="ml-2 block text-sm text-gray-200">
            Eject On Buy
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={values.shouldEjectOnCurve}
            onChange={(e) => {
              setFieldValue("shouldEjectOnCurve", e.target.checked);
            }}
            className="h-4 w-4 rounded border-gray-700 bg-sky-950 text-blue-600"
            disabled={values.shouldEjectOnBuy}
          />
          <label className="ml-2 block text-sm text-gray-200">
            Eject On Curve
          </label>
        </div>
      </div>

      <PrimaryButton
        disabled={isSubmitting}
        type="submit"
      >
        save strategy settings
      </PrimaryButton>
    </form>
  );
};