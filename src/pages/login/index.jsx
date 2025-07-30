import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginBackground from './components/LoginBackground';

const Login = () => {
  useEffect(() => {
    // Check if user is already logged in
    const userType = localStorage.getItem('userType');
    if (userType === 'admin') {
      window.location.href = '/admin-dashboard';
    } else if (userType === 'customer') {
      window.location.href = '/cost-calculator';
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Sign In - MoveEase Pro | Secure Login Portal</title>
        <meta name="description" content="Sign in to your MoveEase Pro account. Access your moving services dashboard, manage quotes, and track your moving projects securely." />
        <meta name="keywords" content="MoveEase Pro login, moving services login, Kenya moving company, secure sign in" />
        <meta property="og:title" content="Sign In - MoveEase Pro" />
        <meta property="og:description" content="Access your MoveEase Pro account to manage your moving services and business operations." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <LoginHeader />

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Login Form Section */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
            <LoginForm />
          </div>

          {/* Background/Info Section - Desktop Only */}
          <LoginBackground />
        </div>

        {/* Mobile Footer */}
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>M-Pesa Integrated</span>
              </span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure Login</span>
              </span>
            </div>
            
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} MoveEase Pro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;