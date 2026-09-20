import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { appParams } from "@/lib/app-params";
import { LanguageProvider } from "@/lib/LanguageContext";

const Home = lazy(() => import("@/pages/Home"));
const News = lazy(() => import("@/pages/News"));
const ArticleDetail = lazy(() => import("@/pages/ArticleDetail"));
const Categories = lazy(() => import("@/pages/Categories"));
const Subscriptions = lazy(() => import("@/pages/Subscriptions"));
const BusinessPage = lazy(() => import("@/pages/BusinessPage"));
const Delivery = lazy(() => import("@/pages/Delivery"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgetPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const SubscribeCheckout = lazy(() => import("@/pages/SubscribeCheckout"));
const SubscribeSuccess = lazy(() => import("@/pages/SubscribeSuccess"));
const ReaderDashboard = lazy(() => import("@/pages/ReaderDashboard"));
const BusinessDashboard = lazy(() => import("@/pages/BusinessDashboard"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const BusinessShipments = lazy(() => import("@/pages/BusinessShipments"));
const AdminShipments = lazy(() => import("@/pages/AdminShipments"));
const AdminShipmentDetail = lazy(() => import("@/pages/AdminShipmentDetail"));
const BusinessTeam = lazy(() => import("@/pages/BusinessTeam"));
const BusinessOrders = lazy(() => import("@/pages/BusinessOrders"));
const BusinessInvoices = lazy(() => import("@/pages/BusinessInvoices"));
const BusinessLocations = lazy(() => import("@/pages/BusinessLocations"));
const BusinessSettings = lazy(() => import("@/pages/BusinessSettings"));
const AdminContentList = lazy(() => import("@/pages/AdminContentList"));
const AdminContentEditor = lazy(() => import("@/pages/AdminContentEditor"));
const AdminSchedule = lazy(() => import("@/pages/AdminSchedule"));
const AdminSubscribers = lazy(() => import("@/pages/AdminSubscribers"));
const AdminCompanies = lazy(() => import("@/pages/AdminCompanies"));
const AdminGovernance = lazy(() => import("@/pages/AdminGovernance"));
const AdminCategories = lazy(() => import("@/pages/AdminCategories"));
const AdminCategoryDetail = lazy(
  () => import("@/pages/AdminCategoryDetail"),
);
const AdminOrderRequests = lazy(() => import("@/pages/AdminOrderRequests"));
const AdminSubscriptions = lazy(() => import("@/pages/AdminSubscriptions"));
const AdminCompanyDetail = lazy(() => import("@/pages/AdminCompanyDetail"));
const AdminSubscriberDetail = lazy(
  () => import("@/pages/AdminSubscriberDetail"),
);
const BusinessShipmentDetail = lazy(
  () => import("@/pages/BusinessShipmentDetail"),
);
const BusinessLocationDetail = lazy(
  () => import("@/pages/BusinessLocationDetail"),
);
const BusinessOrderDetail = lazy(() => import("@/pages/BusinessOrderDetail"));
const BusinessOrderRequests = lazy(
  () => import("@/pages/BusinessOrderRequests"),
);
const BusinessInvoiceDetail = lazy(
  () => import("@/pages/BusinessInvoiceDetail"),
);
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Refund = lazy(() => import("@/pages/Refund"));
const Cookies = lazy(() => import("@/pages/Cookies"));
const AdminLegalContent = lazy(() => import("@/pages/AdminLegalContent"));
const TemplatePreview = lazy(() => import("@/pages/TemplatePreview"));
const ReaderOverviewPage = lazy(
  () => import("@/components/dashboard/ReaderOverviewPage"),
);
const BusinessOverviewPage = lazy(
  () => import("@/components/dashboard/BusinessOverviewPage"),
);
const AdminOverviewPage = lazy(
  () => import("@/components/dashboard/AdminOverviewPage"),
);
const ReaderDeliveriesPage = lazy(() =>
  import("@/components/dashboard/ReaderWorkspacePages").then((module) => ({
    default: module.ReaderDeliveriesPage,
  })),
);
const ReaderBillingPage = lazy(() =>
  import("@/components/dashboard/ReaderWorkspacePages").then((module) => ({
    default: module.ReaderBillingPage,
  })),
);
const ReaderHistoryPage = lazy(() =>
  import("@/components/dashboard/ReaderWorkspacePages").then((module) => ({
    default: module.ReaderHistoryPage,
  })),
);
const ReaderProfilePage = lazy(() =>
  import("@/components/dashboard/ReaderWorkspacePages").then((module) => ({
    default: module.ReaderProfilePage,
  })),
);
const ReaderPrivacyPage = lazy(() =>
  import("@/components/dashboard/ReaderWorkspacePages").then((module) => ({
    default: module.ReaderPrivacyPage,
  })),
);
const ReaderDeliveryDetailPage = lazy(() =>
  import("@/components/dashboard/ReaderWorkspacePages").then((module) => ({
    default: module.ReaderDeliveryDetailPage,
  })),
);

const BrandLoader = ({
  fullscreen = false,
  label = "Preparing your reading workspace",
}) => {
  return (
    <div
      className={[
        "flex items-center justify-center bg-paper px-4",
        fullscreen ? "fixed inset-0 py-10" : "min-h-[40vh] py-12",
      ].join(" ")}
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center rounded-full border border-stone-300/70 bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-redacted">
          Loading
        </div>
        <p className="mt-5 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
          {appParams.appName}
        </p>
        <div className="mx-auto mt-4 h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-heritage" />
        <p className="mt-3 text-sm text-redacted md:text-base">{label}</p>
      </div>
    </div>
  );
};

const roleJourney = {
  reader: "individual",
  business: "business",
  admin: "admin",
};

const RoleBoundary = ({ role, children }) => {
  const { user, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return <BrandLoader label="Checking workspace access" />;
  }

  if (!user || user.role !== role) {
    const from = `${location.pathname}${location.search}`;
    const params = new URLSearchParams({
      journey: roleJourney[role] || "individual",
      from,
    });
    return <Navigate to={`/login?${params.toString()}`} replace />;
  }

  return children;
};

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
    return <BrandLoader fullscreen label="Loading the latest issue" />;
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    }

    if (authError.type === "auth_required" && !isAuthPage) {
      navigateToLogin();
      return null;
    }
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<BrandLoader label="Opening your next page" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/subscribe/checkout" element={<SubscribeCheckout />} />
        <Route path="/subscribe/success" element={<SubscribeSuccess />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <RoleBoundary role="reader">
              <ReaderDashboard />
            </RoleBoundary>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ReaderOverviewPage />} />
          <Route path="deliveries" element={<ReaderDeliveriesPage />} />
          <Route
            path="deliveries/:trackingCode"
            element={<ReaderDeliveryDetailPage />}
          />
          <Route path="billing" element={<ReaderBillingPage />} />
          <Route path="history" element={<ReaderHistoryPage />} />
          <Route path="profile" element={<ReaderProfilePage />} />
          <Route path="privacy" element={<ReaderPrivacyPage />} />
        </Route>
        <Route
          path="/business-dashboard"
          element={
            <RoleBoundary role="business">
              <BusinessDashboard />
            </RoleBoundary>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<BusinessOverviewPage />} />
          <Route path="team" element={<BusinessTeam />} />
          <Route path="orders" element={<BusinessOrders />} />
          <Route
            path="orders/:orderId"
            element={<BusinessOrderDetail />}
          />
          <Route path="order-requests" element={<BusinessOrderRequests />} />
          <Route path="invoices" element={<BusinessInvoices />} />
          <Route
            path="invoices/:invoiceId"
            element={<BusinessInvoiceDetail />}
          />
          <Route path="locations" element={<BusinessLocations />} />
          <Route
            path="locations/:locationId"
            element={<BusinessLocationDetail />}
          />
          <Route path="shipments" element={<BusinessShipments />} />
          <Route
            path="shipments/:shipmentId"
            element={<BusinessShipmentDetail />}
          />
          <Route path="settings" element={<BusinessSettings />} />
        </Route>
        <Route
          path="/admin"
          element={
            <RoleBoundary role="admin">
              <AdminDashboard />
            </RoleBoundary>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverviewPage />} />
          <Route path="content" element={<AdminContentList />} />
          <Route path="content/new" element={<AdminContentEditor />} />
          <Route path="content/:id" element={<AdminContentEditor />} />
          <Route path="schedule" element={<AdminSchedule />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
          <Route
            path="subscribers/:subscriberId"
            element={<AdminSubscriberDetail />}
          />
          <Route path="companies" element={<AdminCompanies />} />
          <Route
            path="companies/:companyId"
            element={<AdminCompanyDetail />}
          />
          <Route path="governance" element={<AdminGovernance />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route
            path="categories/:categoryId"
            element={<AdminCategoryDetail />}
          />
          <Route path="shipments" element={<AdminShipments />} />
          <Route
            path="shipments/:shipmentId"
            element={<AdminShipmentDetail />}
          />
          <Route path="order-requests" element={<AdminOrderRequests />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="legal-content" element={<AdminLegalContent />} />
        </Route>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/templates" element={<TemplatePreview />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <a href="#main-content" className="app-skip-link">
              Skip to main content
            </a>
            <ScrollToTop />
            <AuthenticatedApp />
            <WhatsAppFloat />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
