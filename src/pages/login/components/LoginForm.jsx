import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useAuth } from '../../../contexts/AuthContext';

const LoginForm = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isRegister, setIsRegister] = useState(false);


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear login error when user modifies form
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setSuccessMsg('');
    if (!validateForm()) return;
    setIsLoading(true);
    const { email, password } = formData;
    try {
      if (isRegister) {
        await register(email, password);
        setSuccessMsg('Registration successful! Please check your email to confirm your account.');
        setIsRegister(false);
      } else {
        await login(email, password);
        // Redirect to dashboard (customize as needed)
        navigate('/cost-calculator');
      }
    } catch (err) {
      setLoginError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Password reset link has been sent to your email address.');
  };

  const handleGoogleSignIn = () => {
    // Mock Google Sign-In
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('userType', 'customer');
      localStorage.setItem('userEmail', 'google.user@gmail.com');
      navigate('/cost-calculator');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-elevated p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Truck" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your MoveEase Pro account</p>
        </div>

        {/* Login Error */}
        {loginError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <Icon name="AlertCircle" size={20} className="text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{loginError}</p>
          </div>
        )}

        {/* Mock Credentials Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>

        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-smooth"
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-blue-800 transition-smooth"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            iconName="LogIn"
            iconPosition="right"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Sign In */}
        <Button
          variant="outline"
          fullWidth
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="mb-6"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </div>
        </Button>

        {/* Footer Links */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsRegister(false)}
                  className="text-primary hover:text-blue-800 font-medium transition-smooth"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsRegister(true)}
                  className="text-primary hover:text-blue-800 font-medium transition-smooth"
                >
                  Register
                </button>
              </>
            )}
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <button className="hover:text-gray-700 transition-smooth">
              Help Center
            </button>
            <span>•</span>
            <button className="hover:text-gray-700 transition-smooth">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;