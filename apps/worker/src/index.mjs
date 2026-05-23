import fs from "node:fs";
import path from "node:path";
import { Contract, JsonRpcProvider } from "ethers";

const root = process.env.ARCPAY_ROOT ?? path.resolve(process.cwd(), "../..");
const deployment = JSON.parse(fs.readFileSync(path.join(root, "deployments", "somnia-testnet.json"), "utf8"));
const rpcUrl = process.env.SOMNIA_RPC_URL ?? "https://dream-rpc.somnia.network";
const provider = new JsonRpcProvider(rpcUrl, deployment.chainId);

const orderAbi = [
  "event OrderCreated(bytes32 indexed orderId,bytes32 indexed agentId,address indexed requester,address provider,uint256 amountWei,string requestUri)",
  "event OrderStatusChanged(bytes32 indexed orderId,uint8 status)",
  "event OrderFulfilled(bytes32 indexed orderId,string resultUri)",
  "event OrderFailed(bytes32 indexed orderId,string reason)",
];
const cardAbi = [
  "event CardCreated(bytes32 indexed cardId,address indexed operator,address indexed agent,address token,uint256 limit,string label)",
  "event CardFunded(bytes32 indexed cardId,uint256 amount)",
  "event CardSpent(bytes32 indexed cardId,address indexed recipient,uint256 amount,string memo)",
  "event CardStatusUpdated(bytes32 indexed cardId,bool active)",
];
const operatorAbi = [
  "event ClaimCodeCreated(bytes32 indexed claimHash,address indexed operator,bytes32 indexed agentId,string metadataUri,uint256 expiresAt)",
  "event ClaimCodeRedeemed(bytes32 indexed claimHash,address indexed redeemer)",
  "event WebhookFailure(bytes32 indexed originHash,uint256 failureCount,uint256 openedUntil)",
  "event WebhookSuccess(bytes32 indexed originHash)",
];

const contracts = [
  ["orders", new Contract(deployment.contracts.AgentOrderBook, orderAbi, provider)],
  ["cards", new Contract(deployment.contracts.AgentSpendCardVault, cardAbi, provider)],
  ["operator", new Contract(deployment.contracts.OperatorControls, operatorAbi, provider)],
];

function logEvent(source, name, args) {
  const event = {
    source,
    name,
    args: Object.fromEntries(Object.entries(args).filter(([key]) => Number.isNaN(Number(key)))),
    at: new Date().toISOString(),
  };
  console.log(JSON.stringify(event));
}

for (const [source, contract] of contracts) {
  contract.on("*", (event) => {
    logEvent(source, event.fragment?.name ?? "Unknown", event.args ?? {});
  });
}

console.log(JSON.stringify({
  service: "arcpay-somnia-worker",
  network: deployment.network,
  rpcUrl,
  contracts: deployment.contracts,
  startedAt: new Date().toISOString(),
}));
