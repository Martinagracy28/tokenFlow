import { BrowserProvider, formatUnits, parseUnits } from "ethers";
export { formatUnits, parseUnits };

export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new BrowserProvider(window.ethereum);
  }
  return null;
};

export const getSigner = async () => {
  const provider = getProvider();
  if (provider) {
    return await provider.getSigner();
  }
  return null;
};

export const formatTokenAmount = (amount, decimals = 18) => {
  const formatted = formatUnits(amount, decimals);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(Number(formatted));
};

export const parseTokenAmount = (amount, decimals = 18) => {
  try {
    return parseUnits(amount || "0", decimals);
  } catch (error) {
    return BigInt(0);
  }
};

export const truncateAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
