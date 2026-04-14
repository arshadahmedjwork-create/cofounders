import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Lazy load pages
const Index = lazy(() => import("./pages/Index.tsx"));
const BrowseProfiles = lazy(() => import("./pages/BrowseProfiles.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const SynapseTest = lazy(() => import("./pages/SynapseTest.tsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const OpportunityHub = lazy(() => import("./pages/OpportunityHub.tsx"));
const Requests = lazy(() => import("./pages/Requests.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Messages = lazy(() => import("./pages/Messages.tsx"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center">
    <Loader2 className="animate-spin text-primary mb-4" size={40} />
    <p className="text-muted-foreground font-medium animate-pulse">Loading...</p>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Strictly Auth Only, NO Profile Needed yet */}
            <Route element={<ProtectedRoute requireProfile={false} />}>
              <Route path="/onboarding" element={<Onboarding />} />
            </Route>

            {/* strictly Auth AND Profile needed to view the App contents */}
            <Route element={<ProtectedRoute requireProfile={true} />}>
              <Route path="/browse" element={<BrowseProfiles />} />
              <Route path="/assessment" element={<SynapseTest />} />
              <Route path="/posts" element={<OpportunityHub />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
