import React from 'react';

export const NETWORKS = {
  1: {
    name: "Ethereum",
    symbol: "ETH",
    logo: (className) => (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#627EEA"/>
        <path d="M16.498 4v8.87l7.497 3.35L16.498 4z" fill="#FFF" fillOpacity=".602"/>
        <path d="M16.498 4L9 16.22l7.498-3.35V4z" fill="#FFF"/>
        <path d="M16.498 21.968v5.516L24 17.528l-7.502 4.44z" fill="#FFF" fillOpacity=".602"/>
        <path d="M16.498 27.484v-5.516L9 17.528l7.498 9.956z" fill="#FFF"/>
        <path d="M16.498 20.81l7.497-4.44-7.497-3.352v7.792z" fill="#FFF" fillOpacity=".2"/>
        <path d="M9 16.37l7.498 4.44v-7.792L9 16.37z" fill="#FFF" fillOpacity=".602"/>
      </svg>
    )
  },
  11155111: {
    name: "Sepolia",
    symbol: "ETH",
    logo: (className) => (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#F0F2F5"/>
        <path d="M16.498 4v8.87l7.497 3.35L16.498 4z" fill="#627EEA" fillOpacity=".602"/>
        <path d="M16.498 4L9 16.22l7.498-3.35V4z" fill="#627EEA"/>
        <path d="M16.498 21.968v5.516L24 17.528l-7.502 4.44z" fill="#627EEA" fillOpacity=".602"/>
        <path d="M16.498 27.484v-5.516L9 17.528l7.498 9.956z" fill="#627EEA"/>
        <path d="M16.498 20.81l7.497-4.44-7.497-3.352v7.792z" fill="#627EEA" fillOpacity=".2"/>
        <path d="M9 16.37l7.498 4.44v-7.792L9 16.37z" fill="#627EEA" fillOpacity=".602"/>
      </svg>
    )
  }
};

export const getNetworkInfo = (chainId) => {
  return NETWORKS[chainId] || {
    name: "Unknown Network",
    symbol: "???",
    logo: (className) => (
      <div className={`${className} bg-elevated rounded-full flex items-center justify-center text-[10px] font-bold text-text-muted border border-border`}>
        ?
      </div>
    )
  };
};
