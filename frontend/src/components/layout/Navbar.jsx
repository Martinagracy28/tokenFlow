import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { address, isConnected, truncatedAddress, connect, disconnect } =
    useWallet();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/" },
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

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
        scrolled
          ? "bg-background/60 backdrop-blur-2xl border-white/5 py-4"
          : "bg-transparent border-transparent py-6",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 bg-accent blur-[12px] opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tighter">
              Token<span className="text-accent">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav */}
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
              <Button onClick={() => connect()} className="shadow-glow">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
            ) : (
              <div className="relative">
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-elevated border border-border rounded-full pl-3 pr-2 py-1.5 cursor-pointer hover:border-accent/50 transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-medium text-text-primary">
                    {truncatedAddress}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-text-secondary transition-transform",
                      dropdownOpen && "rotate-180",
                    )}
                  />
                </div>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
                    >
                      <button
                        onClick={copyAddress}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-elevated transition-colors text-sm text-text-secondary hover:text-text-primary"
                      >
                        Copy Address
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          disconnect();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-danger/10 transition-colors text-sm text-danger"
                      >
                        Disconnect
                        <LogOut className="w-4 h-4" />
                      </button>
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
            className="md:hidden bg-background border-b border-border"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-6 py-4 text-lg font-semibold rounded-2xl transition-all",
                    location.pathname === link.href
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-text-secondary hover:bg-elevated/50",
                  )}
                >
                  {link.name}
                  <ChevronDown className="-rotate-90 w-5 h-5 opacity-50" />
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                {!isConnected ? (
                  <Button
                    onClick={() => {
                      connect();
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    Connect Wallet
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                      <span className="text-sm text-text-secondary">
                        Address
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        {truncatedAddress}
                      </span>
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => {
                        disconnect();
                        setIsOpen(false);
                      }}
                      className="w-full"
                    >
                      Disconnect
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
