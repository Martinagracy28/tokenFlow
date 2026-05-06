import { motion } from "framer-motion";
import { 
  Wallet, 
  ArrowRight, 
  Coins, 
  BarChart3, 
  Lock, 
  ShieldCheck, 
  Zap, 
  Timer, 
  Users, 
  Github,
  CheckCircle2,
  ExternalLink,
  Gift,
  Activity
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const { isConnected, connect, address, truncatedAddress } = useWallet();
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const features = [
    {
      title: "Token Management",
      description: "Create ERC20 tokens with mint, burn, and supply control with just a few clicks.",
      icon: <Coins className="w-6 h-6 text-accent" />,
      delay: 0.1
    },
    {
      title: "Staking & Rewards",
      description: "Stake tokens, earn rewards, and choose lock durations to maximize your yield.",
      icon: <BarChart3 className="w-6 h-6 text-warning" />,
      delay: 0.2
    },
    {
      title: "Vesting System",
      description: "Lock tokens with cliff and linear release schedules for investors and team members.",
      icon: <Lock className="w-6 h-6 text-success" />,
      delay: 0.3
    }
  ];

  const steps = [
    {
      title: "Connect Wallet",
      description: "Securely connect your MetaMask wallet to the Sepolia network.",
      icon: <Wallet className="w-5 h-5" />
    },
    {
      title: "Allocate Assets",
      description: "Stake your TFW tokens or set up new vesting schedules for your team.",
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: "Collect Rewards",
      description: "Track your earnings in real-time and claim rewards or vested tokens.",
      icon: <Gift className="w-5 h-5" />
    }
  ];

  const keyFeatures = [
    { title: "Secure", description: "OpenZeppelin-based contracts", icon: <ShieldCheck className="w-4 h-4 text-success" /> },
    { title: "Real-time", description: "Reward tracking", icon: <Activity className="w-4 h-4 text-accent" /> },
    { title: "Time-lock", description: "Staking support", icon: <Timer className="w-4 h-4 text-warning" /> },
    { title: "Multi-user", description: "Vesting system", icon: <Users className="w-4 h-4 text-primary" /> },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center space-y-8 pt-0 pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Next-Gen Token Management
          </motion.div>
          
          <motion.h1 
            {...fadeInUp}
            className="text-5xl md:text-7xl font-bold text-text-primary tracking-tight leading-[1.1]"
          >
            Build and Manage Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-glow to-primary">Token Ecosystem</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Create tokens, stake assets, and manage vesting — all in one powerful, 
            decentralized dashboard built for the future of finance.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {!isConnected ? (
              <Button 
                onClick={connect}
                size="lg" 
                className="h-12 px-8 text-base shadow-glow relative group"
              >
                <Wallet className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-card border border-accent/30 shadow-glow animate-fadeInUp">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-accent font-bold uppercase tracking-widest leading-none mb-1">Connected</p>
                  <p className="text-sm font-mono font-semibold text-text-primary">{truncatedAddress}</p>
                </div>
              </div>
            )}
            <Button 
              variant="secondary" 
              size="lg" 
              className="h-12 px-8 text-base"
              onClick={() => navigate("/dashboard")}
            >
              Explore Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </section>

        {/* What You Can Do Section */}
        <section className="py-12 md:py-16">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">What You Can Do</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Everything you need to launch and grow your token economy, securely and efficiently.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
              >
                <Card className="h-full group hover:border-accent/40 transition-all duration-500 hover:shadow-glow-lg p-8">
                  <div className="w-14 h-14 rounded-2xl bg-elevated border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-16 border-y border-border/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-text-primary tracking-tight">How It Works</h2>
              <p className="text-text-secondary text-lg">Follow three simple steps to start participating in the TokenFlow ecosystem.</p>
              
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold group-hover:bg-accent group-hover:text-white transition-all duration-300">
                      {i + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors">{step.title}</h4>
                      <p className="text-text-secondary">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative lg:h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full animate-pulse-glow" />
              <Card className="relative w-full max-w-sm p-0 overflow-hidden border-accent/30 bg-surface/80 backdrop-blur-xl">
                 <div className="p-6 border-b border-border bg-elevated/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-danger/50" />
                      <div className="w-3 h-3 rounded-full bg-warning/50" />
                      <div className="w-3 h-3 rounded-full bg-success/50" />
                    </div>
                    <span className="text-xs font-mono text-text-muted uppercase">TokenFlow Terminal</span>
                 </div>
                 <div className="p-8 space-y-6 font-mono">
                    <div className="space-y-2">
                      <p className="text-xs text-accent">$ connect_wallet --provider metamask</p>
                      <p className="text-xs text-success">✓ Connection established: 0x71C...4e2</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-accent">$ stake_tokens --amount 5000 --lock 12m</p>
                      <p className="text-xs text-text-primary">Staking 5,000 TFW for 1 year...</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-success">✓ Success: Earning 15% APY rewards</p>
                      <p className="text-xs text-text-muted animate-pulse">_</p>
                    </div>
                 </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {keyFeatures.map((kf, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3 p-6 rounded-3xl bg-elevated/30 border border-border/50 hover:border-accent/20 transition-colors">
                <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center shadow-sm">
                  {kf.icon}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-text-primary tracking-tight">{kf.title}</h5>
                  <p className="text-xs text-text-secondary">{kf.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16">
          <div className="relative rounded-[40px] overflow-hidden p-12 md:p-24 text-center border border-accent/20 shadow-glow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-surface to-primary/10 -z-10" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 -z-10" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
                Start Building Your Web3 Economy
              </h2>
              <p className="text-text-secondary text-lg">
                Join thousands of creators and investors who trust TokenFlow for their DeFi infrastructure. 
                Get started today on the Sepolia testnet.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="h-12 px-10 text-base shadow-glow"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="h-12 px-10 text-base"
                  onClick={() => window.open(`https://sepolia.etherscan.io/address/0x7ab82B5063E19d3748389DdDA5291412E3B25fF4`, "_blank")}
                >
                  <ExternalLink className="w-5 h-5" />
                  View Contracts
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-24 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-text-primary tracking-tighter">
                  Token<span className="text-accent">Flow</span>
                </span>
              </div>
              <p className="text-text-secondary text-sm max-w-xs">
                The ultimate decentralized platform for token management, staking, and vesting.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex items-center gap-6">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">Developed by <span className="text-accent">TokenFlow Team</span></p>
                <p className="text-xs text-text-muted mt-1">© 2026 TokenFlow. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
