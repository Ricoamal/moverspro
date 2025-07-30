import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Import new UI components
import Preloader from "components/ui/Preloader";
import WhatsAppButton from "components/ui/WhatsAppButton";
import ScrollToTopButton from "components/ui/ScrollToTop";
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
// Removed standalone website builder - now integrated into landing page
import AboutPage from "pages/about";
import ServicesPage from "pages/services";
import WorkPage from "pages/work";
import ContactPage from "pages/contact";
import PrivacyPolicyPage from "pages/privacy-policy";
import TermsOfServicePage from "pages/terms-of-service";
import FAQPage from "pages/faq";
import HelpCenterPage from "pages/help-center";
import MovingTipsPage from "pages/moving-tips";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        {/* Global UI Components */}
        <Preloader />
        <WhatsAppButton />
        <ScrollToTopButton />
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
        {/* Website builder now integrated into landing page */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/moving-tips" element={<MovingTipsPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;