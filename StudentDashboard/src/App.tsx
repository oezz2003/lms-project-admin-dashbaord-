import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import GeolocationPopup from "./components/features/geolocationPushUp";
import { LoginPage } from "./pages/LogIn";
import { SignUpPage } from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ScrollToTop from "./components/ScrollToTop";
import Progress from "./pages/Progress";
import Rewards from "./pages/Rewards";
import Store from "./pages/Store";
import StudentDashboard from "./pages/studetDashboard";
import EditProfile from "./pages/EditProfile";

// Auth imports
import { AuthProvider, useAuth } from "@/lib/useAuth";

// A wrapper that checks auth and renders child routes via <Outlet/>
function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading…</div>;
  return user ? <Outlet /> : <Navigate to="/LogIn" replace />;
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="smart-learning-theme">
        <I18nProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/course/:id" element={<CourseDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/LogIn" element={<LoginPage />} />
                <Route path="/SignUp" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                
                

                {/* Internal (Protected) Routes Group */}
                <Route element={
                  <AuthProvider>
                    <ProtectedLayout />
                  </AuthProvider>
                }>
                  <Route path="/student-dashboard" element={<StudentDashboard />} />
                  <Route path="/profile" element={<EditProfile />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/Store" element={<Store />} />
                  {/* Add more protected child routes here */}
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <GeolocationPopup />
          </TooltipProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}