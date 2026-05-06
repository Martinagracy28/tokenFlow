import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Wallet,
  LogOut,
  Copy,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Shield,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { address, isConnected, connect, disconnect } =
    useWallet();
  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Staking", href: "/staking" },
    { name: "Vesting", href: "/vesting" },
  ];

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate a deterministic color from address for avatar
  const avatarColor = address
    ? `hsl(${parseInt(address.slice(2, 8), 16) % 360}, 70%, 60%)`
    : "#6C63FF";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
        scrolled
          ? "bg-background/70 backdrop-blur-2xl border-white/5 py-3"
          : "bg-transparent border-transparent py-2",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-accent blur-[12px] opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tighter">
              Token<span className="text-accent">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                  location.pathname === link.href
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-elevated/50",
                )}
              >
                {link.name}
                {location.pathname === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Wallet Section */}
          <div className="hidden md:flex items-center gap-4">
            {!isConnected ? (
              /* ── Connect Button ── */
              <motion.button
                onClick={() => connect()}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative group flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-semibold text-sm text-white overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 60%, #7C3AED 100%)",
                  boxShadow: "0 0 24px rgba(108,99,255,0.45), 0 4px 16px rgba(108,99,255,0.25)",
                }}
              >
                {/* Shimmer sweep */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer-sweep 1.2s linear infinite",
                  }}
                />
                {/* Glow ring on hover */}
                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)" }}
                />
                <Wallet className="w-4 h-4 flex-shrink-0" />
                <span>Connect Wallet</span>
              </motion.button>
            ) : (
              /* ── Connected State ── */
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "flex items-center gap-2.5 rounded-2xl border transition-all duration-300 cursor-pointer",
                    "pl-2 pr-3 py-1.5",
                    dropdownOpen
                      ? "bg-card border-accent/40 shadow-glow"
                      : "bg-elevated/80 border-border hover:border-accent/30 hover:bg-card",
                  )}
                >
                  {/* Avatar ring */}
                  <div
                    className="relative w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${avatarColor}, #4F46E5)`,
                      boxShadow: `0 0 10px ${avatarColor}55`,
                    }}
                  >
                    {address ? address.slice(2, 4).toUpperCase() : "??"}
                  </div>

                  {/* Live dot + address */}
                  <div className="flex flex-col items-start leading-none gap-0.5">
                    <span className="text-[10px] text-text-muted font-medium tracking-wide uppercase">Connected</span>
                    <span className="text-sm font-semibold text-text-primary">{truncatedAddress}</span>
                  </div>

                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-text-secondary transition-transform duration-300 ml-0.5",
                      dropdownOpen && "rotate-180",
                    )}
                  />
                </motion.button>

                {/* Status dot — outside the button */}
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-background animate-pulse z-10 pointer-events-none" />

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute right-0 mt-3 w-64 rounded-2xl border border-border/60 overflow-hidden shadow-2xl"
                      style={{
                        background: "rgba(22, 27, 39, 0.92)",
                        backdropFilter: "blur(24px)",
                        boxShadow: "0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(108,99,255,0.12)",
                      }}
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-border/50">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${avatarColor}, #4F46E5)`,
                              boxShadow: `0 0 16px ${avatarColor}40`,
                            }}
                          >
                            {address ? address.slice(2, 4).toUpperCase() : "??"}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block animate-pulse" />
                              <span className="text-xs text-success font-semibold">Connected</span>
                            </div>
                            <p className="text-xs text-text-muted font-mono leading-tight">
                              {address
                                ? `${address.slice(0, 10)}...${address.slice(-8)}`
                                : "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-2 space-y-0.5">
                        {/* Copy Address */}
                        <button
                          onClick={copyAddress}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-elevated transition-colors text-sm group"
                        >
                          <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                            {copied
                              ? <CheckCircle2 className="w-4 h-4 text-success" />
                              : <Copy className="w-4 h-4 text-accent" />
                            }
                          </span>
                          <span className={cn("font-medium", copied ? "text-success" : "text-text-primary")}>
                            {copied ? "Copied!" : "Copy Address"}
                          </span>
                          {copied && (
                            <motion.span
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="ml-auto text-xs text-success"
                            >
                              ✓
                            </motion.span>
                          )}
                        </button>

                        {/* View on Explorer (placeholder) */}
                        <button
                          onClick={() =>
                            window.open(`https://sepolia.etherscan.io/address/${address}`, "_blank")
                          }
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-elevated transition-colors text-sm group"
                        >
                          <span className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#F59E0B]/20 transition-colors">
                            <ExternalLink className="w-4 h-4 text-warning" />
                          </span>
                          <span className="font-medium text-text-primary">View on Explorer</span>
                        </button>

                        <div className="my-1 border-t border-border/40 mx-1" />

                        {/* Disconnect */}
                        <button
                          onClick={() => {
                            disconnect();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-danger/10 transition-colors text-sm group"
                        >
                          <span className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center flex-shrink-0 group-hover:bg-danger/20 transition-colors">
                            <LogOut className="w-4 h-4 text-danger" />
                          </span>
                          <span className="font-medium text-danger">Disconnect</span>
                        </button>
                      </div>

                      {/* Footer badge */}
                      <div className="px-4 pb-3">
                        <div className="flex items-center gap-1.5 justify-center py-1.5 rounded-lg bg-elevated/50">
                          <Shield className="w-3 h-3 text-text-muted" />
                          <span className="text-[10px] text-text-muted font-medium tracking-wide">Secured by MetaMask</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-text-secondary hover:text-text-primary bg-elevated rounded-xl"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border"
            style={{
              background: "rgba(10,11,15,0.95)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-5 py-4 text-base font-semibold rounded-2xl transition-all",
                    location.pathname === link.href
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-text-secondary hover:bg-elevated/50",
                  )}
                >
                  {link.name}
                  <ChevronDown className="-rotate-90 w-4 h-4 opacity-50" />
                </Link>
              ))}

              <div className="pt-3 border-t border-border">
                {!isConnected ? (
                  <button
                    onClick={() => { connect(); setIsOpen(false); }}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-sm text-white"
                    style={{
                      background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 60%, #7C3AED 100%)",
                      boxShadow: "0 0 20px rgba(108,99,255,0.35)",
                    }}
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* Connected card */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${avatarColor}, #4F46E5)` }}
                      >
                        {address ? address.slice(2, 4).toUpperCase() : "??"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-success inline-block animate-pulse" />
                          <span className="text-xs text-success font-semibold">Connected</span>
                        </div>
                        <p className="text-sm font-medium text-text-primary">{truncatedAddress}</p>
                      </div>
                      <button onClick={copyAddress} className="ml-auto p-2 rounded-lg bg-elevated hover:bg-border-hover transition-colors">
                        {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-secondary" />}
                      </button>
                    </div>

                    <button
                      onClick={() => { disconnect(); setIsOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-danger/10 border border-danger/20 text-danger font-semibold text-sm hover:bg-danger/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer-sweep {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </nav>
  );
};
