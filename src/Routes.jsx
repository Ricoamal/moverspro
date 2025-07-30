import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import AdminDashboard from "pages/admin-dashboard";
import LandingPage from "pages/landing-page";
import CostCalculator from "pages/cost-calculator";
import InvoiceManagement from "pages/invoice-management";
import Login from "pages/login";
import QuoteManagement from "pages/quote-management";
import Settings from "pages/settings";
import CustomerManagement from "pages/customers";
import StaffManagement from "pages/staff";
import PayrollManagement from "pages/payroll";
import CRMManagement from "pages/crm";
import WebsiteBuilder from "pages/website-builder";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/cost-calculator" element={<CostCalculator />} />
        <Route path="/invoice-management" element={<InvoiceManagement />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quote-management" element={<QuoteManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/customers" element={<CustomerManagement />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/payroll" element={<PayrollManagement />} />
        <Route path="/crm" element={<CRMManagement />} />
        <Route path="/website-builder" element={<WebsiteBuilder />} />
        <Route path="/help" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;