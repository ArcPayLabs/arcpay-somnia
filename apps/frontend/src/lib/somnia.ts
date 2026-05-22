import { BrowserProvider, Contract, JsonRpcProvider, formatEther, id, keccak256, parseEther, toUtf8Bytes, type Eip1193Provider } from "ethers";
import deployment from "../../../../deployments/somnia-testnet.json";

export const SOMNIA_CHAIN_ID = 50312;
export const SOMNIA_CHAIN_ID_HEX = "0xc488";
export const SOMNIA_RPC_URL = "https://dream-rpc.somnia.network";
export const SOMNIA_EXPLORER_URL = "https://somnia-testnet.socialscan.io";
const deployedContracts = deployment.contracts as Record<string, string>;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const CONTRACTS = {
  AgentRegistry: deployedContracts.AgentRegistry,
  TreasuryPolicy: deployedContracts.TreasuryPolicy,
  AgentTreasury: deployedContracts.AgentTreasury,
  AgentOrderBook: deployedContracts.AgentOrderBook,
  OperatorControls: deployedContracts.OperatorControls ?? ZERO_ADDRESS,
  SomniaAgentRiskOracle: deployedContracts.SomniaAgentRiskOracle ?? ZERO_ADDRESS,
} as const;

export const DEPTH_CONTRACTS_READY =
  CONTRACTS.OperatorControls !== ZERO_ADDRESS && CONTRACTS.SomniaAgentRiskOracle !== ZERO_ADDRESS;

export const AGENT_REGISTRY_ABI = [
  "function registerAgent(bytes32 agentId,string name,string endpoint,string capabilities,uint256 priceWei)",
  "function updateAgent(bytes32 agentId,string endpoint,string capabilities,uint256 priceWei,bool active)",
  "function agents(bytes32 agentId) view returns (address owner,string name,string endpoint,string capabilities,uint256 priceWei,bool active,uint256 createdAt,uint256 updatedAt)",
  "function getOwnerAgents(address owner) view returns (bytes32[])",
  "event AgentRegistered(bytes32 indexed agentId,address indexed owner,string name,uint256 priceWei)",
] as const;

export const TREASURY_POLICY_ABI = [
  "function setPolicy(uint256 hourlyLimitWei,uint256 dailyLimitWei,uint256 weeklyLimitWei,uint256 approvalThresholdWei,uint8 allowedStartHourUtc,uint8 allowedEndHourUtc,bool emergencyPaused,bool allowlistEnabled)",
  "function setAgentAllowed(bytes32 agentId,bool allowed)",
  "function approveSpend(bytes32 orderId,bool approved)",
  "function policies(address operator) view returns (uint256 hourlyLimitWei,uint256 dailyLimitWei,uint256 weeklyLimitWei,uint256 approvalThresholdWei,uint8 allowedStartHourUtc,uint8 allowedEndHourUtc,bool emergencyPaused,bool allowlistEnabled)",
  "function allowedAgents(address operator,bytes32 agentId) view returns (bool)",
] as const;

export const LEGACY_TREASURY_POLICY_ABI = [
  "function setPolicy(uint256 hourlyLimitWei,uint256 dailyLimitWei,uint256 approvalThresholdWei,bool emergencyPaused,bool allowlistEnabled)",
  "function setAgentAllowed(bytes32 agentId,bool allowed)",
  "function policies(address operator) view returns (uint256 hourlyLimitWei,uint256 dailyLimitWei,uint256 approvalThresholdWei,bool emergencyPaused,bool allowlistEnabled)",
  "function allowedAgents(address operator,bytes32 agentId) view returns (bool)",
] as const;

export const AGENT_ORDER_BOOK_ABI = [
  "function createOrder(bytes32 agentId,string requestUri) payable returns (bytes32 orderId)",
  "function acceptOrder(bytes32 orderId)",
  "function markProcessing(bytes32 orderId)",
  "function fulfillOrder(bytes32 orderId,string resultUri)",
  "function settleOrder(bytes32 orderId)",
  "function refundOrder(bytes32 orderId)",
  "function failOrder(bytes32 orderId,string reason)",
  "function orders(bytes32 orderId) view returns (bytes32 orderId,bytes32 agentId,address requester,address provider,uint256 amountWei,string requestUri,string resultUri,uint8 status,uint256 createdAt,uint256 updatedAt)",
  "event OrderCreated(bytes32 indexed orderId,bytes32 indexed agentId,address indexed requester,address provider,uint256 amountWei,string requestUri)",
] as const;

export const OPERATOR_CONTROLS_ABI = [
  "function createClaimCode(bytes32 claimHash,bytes32 agentId,string metadataUri,uint256 ttlSeconds)",
  "function redeemClaimCode(string code) returns (bytes32 claimHash,bytes32 agentId)",
  "function recordWebhookSuccess(bytes32 originHash)",
  "function recordWebhookFailure(bytes32 originHash)",
  "function resetWebhookCircuit(bytes32 originHash)",
  "function isWebhookOpen(bytes32 originHash) view returns (bool)",
] as const;

export const RISK_ORACLE_ABI = [
  "function requestRisk(bytes32 orderId,string prompt) payable returns (bytes32 requestId)",
  "function ownerFulfillForDemo(bytes32 requestId,uint256 score,string verdict,string evidenceUri)",
  "function results(bytes32 requestId) view returns (bytes32 orderId,address requester,uint256 score,string verdict,string evidenceUri,bool fulfilled,uint256 requestedAt,uint256 fulfilledAt)",
  "event RiskRequested(bytes32 indexed requestId,bytes32 indexed orderId,address indexed requester,string prompt)",
] as const;

export const ORDER_STATUS = ["Pending", "Accepted", "Processing", "Fulfilled", "Settled", "Refunded", "Failed"] as const;

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export function agentIdFromSlug(slug: string) {
  return id(slug.trim() || "agent");
}

export function hashText(value: string) {
  return keccak256(toUtf8Bytes(value.trim()));
}

export function toWei(value: string) {
  return parseEther(value || "0");
}

export function fromWei(value: bigint) {
  return formatEther(value);
}

export function shortAddress(value: string) {
  return value ? `${value.slice(0, 6)}...${value.slice(-4)}` : "";
}

export function txUrl(hash: string) {
  return `${SOMNIA_EXPLORER_URL}/tx/${hash}`;
}

export function addressUrl(address: string) {
  return `${SOMNIA_EXPLORER_URL}/address/${address}`;
}

export function publicProvider() {
  return new JsonRpcProvider(SOMNIA_RPC_URL, SOMNIA_CHAIN_ID);
}

export async function switchToSomnia() {
  if (!window.ethereum) throw new Error("Install an EVM wallet first.");
  try {
    await window.ethereum.request?.({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SOMNIA_CHAIN_ID_HEX }],
    });
  } catch {
    await window.ethereum.request?.({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: SOMNIA_CHAIN_ID_HEX,
        chainName: "Somnia Testnet",
        nativeCurrency: { name: "Somnia Testnet Token", symbol: "STT", decimals: 18 },
        rpcUrls: [SOMNIA_RPC_URL],
        blockExplorerUrls: [SOMNIA_EXPLORER_URL],
      }],
    });
  }
}

export async function signerProvider() {
  if (!window.ethereum) throw new Error("Install MetaMask, Rabby, or another EVM wallet.");
  await window.ethereum.request?.({ method: "eth_requestAccounts" });
  await switchToSomnia();
  const provider = new BrowserProvider(window.ethereum);
  return provider.getSigner();
}

export async function connectedAddress() {
  const signer = await signerProvider();
  return signer.getAddress();
}

export async function balances(address: string) {
  const provider = publicProvider();
  return fromWei(await provider.getBalance(address));
}

export async function registryContract() {
  const signer = await signerProvider();
  return new Contract(CONTRACTS.AgentRegistry, AGENT_REGISTRY_ABI, signer);
}

export async function policyContract() {
  const signer = await signerProvider();
  return new Contract(CONTRACTS.TreasuryPolicy, DEPTH_CONTRACTS_READY ? TREASURY_POLICY_ABI : LEGACY_TREASURY_POLICY_ABI, signer);
}

export async function orderBookContract() {
  const signer = await signerProvider();
  return new Contract(CONTRACTS.AgentOrderBook, AGENT_ORDER_BOOK_ABI, signer);
}

export async function operatorControlsContract() {
  const signer = await signerProvider();
  return new Contract(CONTRACTS.OperatorControls, OPERATOR_CONTROLS_ABI, signer);
}

export async function riskOracleContract() {
  const signer = await signerProvider();
  return new Contract(CONTRACTS.SomniaAgentRiskOracle, RISK_ORACLE_ABI, signer);
}

export type LocalRecord = {
  id: string;
  type: string;
  title: string;
  status: string;
  amount?: string;
  txHash?: string;
  createdAt: string;
};

export function readRecords(): LocalRecord[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(window.localStorage.getItem("arcpay-somnia-records") ?? "[]") as LocalRecord[];
}

export function writeRecord(record: Omit<LocalRecord, "createdAt">) {
  const next = [{ ...record, createdAt: new Date().toISOString() }, ...readRecords()].slice(0, 100);
  window.localStorage.setItem("arcpay-somnia-records", JSON.stringify(next));
}
