import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

import Home from "@/pages/Home";
import News from "@/pages/News";
import ArticleDetail from "@/pages/ArticleDetail";
import Categories from "@/pages/Categories";
import Subscriptions from "@/pages/Subscriptions";
import Business from "@/pages/Business";
import Delivery from "@/pages/Delivery";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import ReaderDashboard from "@/pages/ReaderDashboard";
import BusinessDashboard from "@/pages/BusinessDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgetPassword";
import ResetPassword from "@/pages/ResetPassword";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center nq-parchment">
        <div className="text-center">
          <h1 className="font-display text-3xl font-black text-ink italic">
            Nequdem
          </h1>
          <div className="w-8 h-8 border-2 border-rule border-t-heritage rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<News />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/subscriptions" element={<Subscriptions />} />
      <Route path="/business" element={<Business />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        element={
          <ProtectedRoute
            unauthenticatedElement={<Navigate to="/login" replace />}
          />
        }
      >
        <Route path="reader-dashboard" element={<ReaderDashboard />} />
        <Route path="business-dashboard" element={<BusinessDashboard />} />
        <Route path="admin-dashboard" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
