import { BrowserProvider, Contract, JsonRpcProvider, formatEther, id, keccak256, parseEther, toUtf8Bytes, type Eip1193Provider } from "ethers";
import deployment from "../../../../deployments/somnia-testnet.json";

export const SOMNIA_CHAIN_ID = 50312;
export const SOMNIA_CHAIN_ID_HEX = "0xc488";
export const SOMNIA_RPC_URL = "https://dream-rpc.somnia.network";
export const SOMNIA_EXPLORER_URL = "https://somnia-testnet.socialscan.io";
const deployedContracts = deployment.contracts as Record<string, string>;
export const NATIVE_TOKEN = "0x0000000000000000000000000000000000000000";

export const CONTRACTS = {
  AgentRegistry: deployedContracts.AgentRegistry,
  TreasuryPolicy: deployedContracts.TreasuryPolicy,
  AgentTreasury: deployedContracts.AgentTreasury,
  AgentOrderBook: deployedContracts.AgentOrderBook,
  OperatorControls: deployedContracts.OperatorControls ?? NATIVE_TOKEN,
  SomniaAgentRiskOracle: deployedContracts.SomniaAgentRiskOracle ?? NATIVE_TOKEN,
  AgentSpendCardVault: deployedContracts.AgentSpendCardVault ?? NATIVE_TOKEN,
  SomniaPrivacyVault: deployedContracts.SomniaPrivacyVault ?? NATIVE_TOKEN,
} as const;

export const DEPTH_CONTRACTS_READY =
  CONTRACTS.OperatorControls !== NATIVE_TOKEN && CONTRACTS.SomniaAgentRiskOracle !== NATIVE_TOKEN;
export const SOMUSD_TOKEN_ADDRESS = (deployment as { somUsdToken?: string }).somUsdToken ?? "0x02b8316775057e2096471473663d51ceafbe3e3b";

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
  "function requestRisk(bytes32 orderId,string prompt) payable returns (uint256 requestId)",
  "function ownerFulfillForDemo(uint256 requestId,uint256 score,string verdict,string evidenceUri)",
  "function results(uint256 requestId) view returns (uint256 requestId,bytes32 orderId,address requester,uint256 score,string verdict,string evidenceUri,bool fulfilled,uint8 responseStatus,uint256 requestedAt,uint256 fulfilledAt)",
  "event RiskRequested(uint256 indexed requestId,bytes32 indexed orderId,address indexed requester,string prompt)",
] as const;

export const SPEND_CARD_VAULT_ABI = [
  "function createCard(bytes32 cardId,address agent,address token,uint256 limit,string label)",
  "function topUpCard(bytes32 cardId,uint256 amount)",
  "function setCardStatus(bytes32 cardId,bool active)",
  "function setCardLimit(bytes32 cardId,uint256 limit)",
  "function spendCard(bytes32 cardId,address recipient,uint256 amount,string memo)",
  "function cards(bytes32 cardId) view returns (address operator,address agent,address token,uint256 limit,uint256 balance,uint256 spent,bool active,string label,uint256 createdAt)",
] as const;

export const ERC20_ABI = [
  "function approve(address spender,uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
] as const;

export const PRIVACY_VAULT_ABI = [
  "function createNativeIntent(bytes32 commitment,string encryptedMemoUri) payable",
  "function createTokenIntent(bytes32 commitment,address token,uint256 amount,string encryptedMemoUri)",
  "function releaseIntent(bytes32 commitment,bytes32 nullifier,address recipient)",
  "function cancelIntent(bytes32 commitment)",
  "function intents(bytes32 commitment) view returns (address operator,address token,uint256 amount,string encryptedMemoUri,bool released,bool cancelled,uint256 createdAt)",
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

export function toUnits(value: string, decimals = 6) {
  const [whole, fraction = ""] = (value || "0").split(".");
  return BigInt(whole || "0") * (10n ** BigInt(decimals)) + BigInt((fraction.padEnd(decimals, "0").slice(0, decimals)) || "0");
}

export function fromUnits(value: bigint, decimals = 6) {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const fraction = (value % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
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

export async function spendCardVaultContract() {
  const signer = await signerProvider();
  return new Contract(CONTRACTS.AgentSpendCardVault, SPEND_CARD_VAULT_ABI, signer);
}

export async function erc20Contract(address = SOMUSD_TOKEN_ADDRESS) {
  const signer = await signerProvider();
  return new Contract(address, ERC20_ABI, signer);
}

export async function privacyVaultContract() {
  const signer = await signerProvider();
  return new Contract(CONTRACTS.SomniaPrivacyVault, PRIVACY_VAULT_ABI, signer);
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
  fetch("/api/records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  }).catch(() => undefined);
}
