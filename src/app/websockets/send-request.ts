import WebSocket from "ws";

// Create a WebSocket connection
const ws = new WebSocket(
  "wss://atlas-mainnet.helius-rpc.com?api-key=<API_KEY>"
);

// Function to send a request to the WebSocket server
function sendRequest(ws: WebSocket) {
  const request = {
    jsonrpc: "2.0",
    id: 420,
    method: "transactionSubscribe",
    params: [
      {
        accountInclude: ["8uDncGPHZJtFnyCktVSbdWmgt7xAiHgwq8ZmxKaK5ZJ1"],
      },
      {
        commitment: "processed",
        encoding: "base64",
        transactionDetails: "full",
        showRewards: true,
        maxSupportedTransactionVersion: 0,
      },
    ],
  };
  ws.send(JSON.stringify(request));
}

// Define WebSocket event handlers

ws.on("open", function open() {
  console.log("WebSocket is open");
  sendRequest(ws); // Send a request once the WebSocket is open
});

ws.on("message", function incoming(data) {
  const messageStr = data.toString("utf8");
  try {
    const messageObj = JSON.parse(messageStr);
    console.log("Received:", messageObj);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
  }
});

ws.on("error", function error(err) {
  console.error("WebSocket error:", err);
});

ws.on("close", function close() {
  console.log("WebSocket is closed");
});
