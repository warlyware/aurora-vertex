import { FormInputWithLabel } from "../UI/forms/form-input-with-label";
import { PrimaryButton } from "../UI/buttons/primary-button";
import { useFormik } from "formik";

export type AuroraBot = {
  id: string;
  name: string;
  ejectWalletId: string;

}

export type BotStrategy = {
  id: string;
  name?: string;
  maxBuyAmount?: number;
  stopLoss?: number;
  takeProfit?: number;
  enabled: boolean;
  shouldCopyBuys: boolean;
  shouldCopySells: boolean;
}

export const BotStrategyForm = ({ bot }: { bot: AuroraBot }) => {
  const { handleSubmit, values, handleChange, setFieldValue, isSubmitting } = useFormik({
    initialValues: {
      maxBuyAmount: 0,
      stopLoss: 0,
      takeProfit: 0,
      enabled: false,
      shouldCopyBuys: false,
      shouldCopySells: false,
      shouldEjectOnBuy: false,
      priorityFee: 0,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* todo add dropdown of target wallets from traders table */}

      <FormInputWithLabel
        label="Max Buy Amount"
        name="maxBuyAmount"
        type="number"
        value={values.maxBuyAmount}
        onChange={handleChange}
      />

      <FormInputWithLabel
        label="Stop Loss (%)"
        name="stopLoss"
        type="number"
        value={values.stopLoss}
        onChange={handleChange}
      />

      <FormInputWithLabel
        label="Take Profit (%)"
        name="takeProfit"
        type="number"
        value={values.takeProfit}
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
            checked={values.shouldEjectOnBuy}
            onChange={(e) => {
              setFieldValue("shouldEjectOnBuy", e.target.checked);
            }}
            className="h-4 w-4 rounded border-gray-700 bg-sky-950 text-blue-600"
          />
          <label className="ml-2 block text-sm text-gray-200">
            Eject On Buy
          </label>
        </div>

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
          />
          <label className="ml-2 block text-sm text-gray-200">
            Copy Sells
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={values.enabled}
            onChange={(e) => {
              setFieldValue("enabled", e.target.checked);
            }}
            className="h-4 w-4 rounded border-gray-700 bg-sky-950 text-blue-600"
          />
          <label className="ml-2 block text-sm text-gray-200">
            Enable Strategy
          </label>
        </div>
      </div>

      <PrimaryButton
        disabled={isSubmitting}
        type="submit"
      >
        Save Settings
      </PrimaryButton>
    </form>
  );
};