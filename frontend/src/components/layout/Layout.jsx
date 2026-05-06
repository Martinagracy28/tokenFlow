import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Toaster } from "react-hot-toast";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-accent/40 selection:text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {children}
        </motion.div>
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#161B27",
            color: "#F0F4FF",
            border: "1px solid #1E2535",
            borderRadius: "16px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#161B27",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#161B27",
            },
          },
        }}
      />

      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/15 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full delay-1000 animate-pulse" />
        <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-success/5 blur-[80px] rounded-full" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>
    </div>
  );
};
