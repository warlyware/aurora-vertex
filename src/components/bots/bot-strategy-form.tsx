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
  shouldAutoSell: boolean;
  autoSellDelayInMs?: number;
  shouldEjectOnCurve: boolean;
  shouldSellOnCurve: boolean;
  traderId: string;
  priorityFee: number;
  createdAt: string;
  updatedAt: string;
  slippagePercentage?: number;
  intendedTradeRatio?: number;
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
      shouldAutoSell: existingStrategy?.shouldAutoSell || false,
      autoSellDelayInMs: existingStrategy?.autoSellDelayInMs || 0,
      shouldEjectOnCurve: existingStrategy?.shouldEjectOnCurve || false,
      shouldSellOnCurve: existingStrategy?.shouldSellOnCurve || false,
      traderId: existingStrategy?.traderId || "",
      priorityFee: existingStrategy?.priorityFee || 0,
      name: existingStrategy?.name || "",
      botId: bot.id,
      slippagePercentage: existingStrategy?.slippagePercentage || 0,
      intendedTradeRatio: existingStrategy?.intendedTradeRatio || 0,
    },
    onSubmit: async (values) => {
      console.log(values);
      if (values.shouldEjectOnBuy) {
        values.shouldCopySells = false;
      }

      if (values.intendedTradeRatio > 1) {
        showToast({
          primaryMessage: "Intended trade ratio must be 1 or less",
        });
        return;
      }

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
        shouldAutoSell: traderStrategies[0]?.strategy?.shouldAutoSell,
        autoSellDelayInMs: traderStrategies[0]?.strategy?.autoSellDelayInMs,
      });

      setFieldValue("traderId", traderStrategies[0]?.traderId);
      setFieldValue("maxBuyAmount", traderStrategies[0]?.strategy?.maxBuyAmount);
      setFieldValue("stopLossPercentage", traderStrategies[0]?.strategy?.stopLossPercentage);
      setFieldValue("takeProfitPercentage", traderStrategies[0]?.strategy?.takeProfitPercentage);
      setFieldValue("shouldCopyBuys", traderStrategies[0]?.strategy?.shouldCopyBuys);
      setFieldValue("shouldCopySells", traderStrategies[0]?.strategy?.shouldCopySells);
      setFieldValue("shouldEjectOnBuy", traderStrategies[0]?.strategy?.shouldEjectOnBuy);
      setFieldValue("shouldAutoSell", traderStrategies[0]?.strategy?.shouldAutoSell);
      setFieldValue("autoSellDelayInMs", traderStrategies[0]?.strategy?.autoSellDelayInMs);
      setFieldValue("priorityFee", traderStrategies[0]?.strategy?.priorityFee);
      setFieldValue("name", traderStrategies[0]?.strategy?.name);
      setFieldValue("shouldEjectOnCurve", traderStrategies[0]?.strategy?.shouldEjectOnCurve);
      setFieldValue("shouldSellOnCurve", traderStrategies[0]?.strategy?.shouldSellOnCurve);
      setFieldValue("slippagePercentage", traderStrategies[0]?.strategy?.slippagePercentage);
      setFieldValue("intendedTradeRatio", traderStrategies[0]?.strategy?.intendedTradeRatio);
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
        max={1}
        label="Intended Trade Ratio"
        name="intendedTradeRatio"
        type="number"
        value={values.intendedTradeRatio}
        onChange={handleChange}
      />

      <FormInputWithLabel
        label="Max Buy Amount (SOL)"
        name="maxBuyAmount"
        type="number"
        value={values.maxBuyAmount}
        onChange={handleChange}
      />

      {/* <FormInputWithLabel
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
      /> */}

      {/* <FormInputWithLabel
        label="Priority Fee"
        name="priorityFee"
        type="number"
        value={values.priorityFee}
        onChange={handleChange}
      /> */}

      <FormInputWithLabel
        label="Slippage (%)"
        name="slippagePercentage"
        type="number"
        disabled
        value={values.slippagePercentage}
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
            disabled={values.shouldEjectOnBuy || values.shouldAutoSell}
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
              if (e.target.checked) {
                setFieldValue("shouldEjectOnCurve", false);
                setFieldValue("shouldCopySells", false);
                setFieldValue("shouldAutoSell", false);
              }
            }}
            className="h-4 w-4 rounded border-gray-700 bg-sky-950 text-blue-600"
            disabled={values.shouldEjectOnCurve || values.shouldAutoSell}
          />
          <label className="ml-2 block text-sm text-gray-200">
            Eject On Buy
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={values.shouldAutoSell}
            onChange={(e) => {
              setFieldValue("shouldAutoSell", e.target.checked);
              setFieldValue("shouldCopySells", false);
              setFieldValue("shouldEjectOnBuy", false);
            }}
            className="h-4 w-4 rounded border-gray-700 bg-sky-950 text-blue-600"
            disabled={values.shouldEjectOnCurve || values.shouldEjectOnBuy}
          />
          <label className="ml-2 block text-sm text-gray-200">
            Auto Sell
          </label>
        </div>

        {/* <div className="flex items-center">
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
        </div> */}
      </div>

      {values.shouldAutoSell && (
        <FormInputWithLabel
          label="Auto Sell Delay (ms)"
          name="autoSellDelayInMs"
          type="number"
          value={values.autoSellDelayInMs}
          onChange={handleChange}
        />
      )}

      <PrimaryButton
        disabled={isSubmitting}
        type="submit"
      >
        save strategy settings
      </PrimaryButton>
    </form>
  );
};