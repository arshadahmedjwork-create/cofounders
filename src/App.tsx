import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index.tsx";
import BrowseProfiles from "./pages/BrowseProfiles.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import SynapseTest from "./pages/SynapseTest.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Posts from "./pages/Posts.tsx";
import Requests from "./pages/Requests.tsx";
import Profile from "./pages/Profile.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
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
              <Route path="/posts" element={<Posts />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
