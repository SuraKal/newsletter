import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "@/pages/Home";
import News from "@/pages/News";
import ArticleDetail from "@/pages/ArticleDetail";
import Categories from "@/pages/Categories";
import Subscriptions from "@/pages/Subscriptions";
import BusinessPage from "@/pages/BusinessPage";
import Delivery from "@/pages/Delivery";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgetPassword";
import ResetPassword from "@/pages/ResetPassword";
import ReaderDashboard from "@/pages/ReaderDashboard";
import BusinessDashboard from "@/pages/BusinessDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } =
    useAuth();
  const location = useLocation();
  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ].includes(location.pathname);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-paper">
        <div className="text-center">
          <h1 className="font-display text-3xl font-black text-ink tracking-tight">
            ንቐደም
          </h1>
          <div className="w-8 h-8 border-2 border-stone-200 border-t-heritage rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    } else if (authError.type === "auth_required" && !isAuthPage) {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<News />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/subscriptions" element={<Subscriptions />} />
      <Route path="/business" element={<BusinessPage />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<ReaderDashboard />} />
      <Route path="/business-dashboard" element={<BusinessDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
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
