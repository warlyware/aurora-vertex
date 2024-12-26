import { RPC_ENDPOINT } from "@/constants";

export const PriorityLevel = {
  NONE: "NONE",
  Min: "Min",
  Low: "Low",
  Medium: "Medium",
  High: "High",
  VeryHigh: "VeryHigh",
  UnsafeMax: "UnsafeMax",
};

export async function getPriorityFeeEstimate() {
  const request = {
    jsonrpc: "2.0",
    id: "helius-example",
    method: "getPriorityFeeEstimate",
    params: [
      {
        accountKeys: ["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],
        options: {
          recommended: true,
        },
      },
    ],
  };

  const response = await fetch(RPC_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  const data = await response.json();

  let feeEstimate;

  if (!data.result?.priorityFeeEstimate) {
    throw new Error("Failed to get priority fee estimate");
  }

  if (typeof data.result.priorityFeeEstimate === "string") {
    feeEstimate = parseInt(data.result.priorityFeeEstimate);
  } else {
    feeEstimate = data.result.priorityFeeEstimate;
  }

  const estimateFromHelius = Math.ceil(feeEstimate);

  return estimateFromHelius;
}
