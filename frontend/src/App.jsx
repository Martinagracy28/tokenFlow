import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Landing } from "./pages/Landing";
import { Staking } from "./pages/Staking";
import { Vesting } from "./pages/Vesting";
import { useWallet } from "./hooks/useWallet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { checkConnection, isConnected } = useWallet();

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route 
              path="/dashboard" 
              element={isConnected ? <Dashboard /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/staking" 
              element={isConnected ? <Staking /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/vesting" 
              element={isConnected ? <Vesting /> : <Navigate to="/" replace />} 
            />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
