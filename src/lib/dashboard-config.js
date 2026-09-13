import {
  BookOpenText,
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  LayoutDashboard,
  MapPinned,
  Package,
  PenSquare,
  ShieldCheck,
  Truck,
  UserRound,
  Users,
} from "lucide-react";

export const dashboardWorkspaces = {
  reader: {
    key: "reader",
    label: "Reader Workspace",
    subtitle: "Subscriber control center",
    searchPlaceholder: "Search articles, deliveries, or invoices",
    sections: [
      {
        id: "overview",
        label: "Overview",
        path: "/dashboard/overview",
        icon: LayoutDashboard,
      },
      {
        id: "deliveries",
        label: "Deliveries",
        path: "/dashboard/deliveries",
        icon: Truck,
      },
      {
        id: "billing",
        label: "Billing",
        path: "/dashboard/billing",
        icon: CreditCard,
      },
      {
        id: "history",
        label: "Reading",
        path: "/dashboard/history",
        icon: BookOpenText,
      },
      {
        id: "profile",
        label: "Profile",
        path: "/dashboard/profile",
        icon: UserRound,
      },
      {
        id: "privacy",
        label: "Privacy",
        path: "/dashboard/privacy",
        icon: ShieldCheck,
      },
    ],
  },
  business: {
    key: "business",
    label: "Business Workspace",
    subtitle: "Organization operations center",
    searchPlaceholder: "Search team, invoices, or shipments",
    sections: [
      {
        id: "overview",
        label: "Overview",
        path: "/business-dashboard/overview",
        icon: LayoutDashboard,
      },
      {
        id: "team",
        label: "Team",
        path: "/business-dashboard/team",
        icon: Users,
      },
      {
        id: "orders",
        label: "Orders",
        path: "/business-dashboard/orders",
        icon: Package,
      },
      {
        id: "invoices",
        label: "Invoices",
        path: "/business-dashboard/invoices",
        icon: FileText,
      },
      {
        id: "locations",
        label: "Locations",
        path: "/business-dashboard/locations",
        icon: MapPinned,
      },
      {
        id: "shipments",
        label: "Shipments",
        path: "/business-dashboard/shipments",
        icon: Truck,
      },
      {
        id: "settings",
        label: "Settings",
        path: "/business-dashboard/settings",
        icon: ShieldCheck,
      },
    ],
  },
  admin: {
    key: "admin",
    label: "Admin Workspace",
    subtitle: "Editorial and operations control center",
    searchPlaceholder: "Search content, subscribers, or routes",
    sections: [
      {
        id: "overview",
        label: "Overview",
        path: "/admin/overview",
        icon: LayoutDashboard,
      },
      {
        id: "content",
        label: "Content",
        path: "/admin/content",
        icon: PenSquare,
      },
      {
        id: "schedule",
        label: "Schedule",
        path: "/admin/schedule",
        icon: CalendarDays,
      },
      {
        id: "subscribers",
        label: "Subscribers",
        path: "/admin/subscribers",
        icon: Users,
      },
      {
        id: "companies",
        label: "Companies",
        path: "/admin/companies",
        icon: Building2,
      },
      {
        id: "governance",
        label: "Governance",
        path: "/admin/governance",
        icon: ShieldCheck,
      },
      {
        id: "shipments",
        label: "Shipments",
        path: "/admin/shipments",
        icon: Truck,
      },
      {
        id: "pricing",
        label: "Pricing",
        path: "/admin/pricing",
        icon: CreditCard,
      },
    ],
  },
};

export const getDefaultDashboardRoute = (role) => {
  if (role === "admin") {
    return "/admin/overview";
  }

  if (role === "business") {
    return "/business-dashboard/overview";
  }

  return "/dashboard/overview";
};
