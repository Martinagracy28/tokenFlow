import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function formatDateTime(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp * 1000));
}

export function getTimeRemaining(seconds) {
  if (seconds <= 0) return "00:00:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hours, minutes, secs]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
}

export function parseRevertReason(error) {
  if (error?.code === "ACTION_REJECTED")
    return "Transaction rejected in wallet";
  if (error?.code === "INSUFFICIENT_FUNDS") return "Insufficient ETH for gas";
  const message = error?.reason || error?.message || "";
  if (message.includes("user rejected action"))
    return "Transaction rejected in wallet";
  return message.slice(0, 100) || "Unknown transaction error";
}
