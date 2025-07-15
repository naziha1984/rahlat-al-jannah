import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/Logo/Logo';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { login, user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user) {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: t('auth.loginError') });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      {/* Formulaire centré glassmorphism */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
        <section className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 max-w-md w-full mx-auto my-12 text-center">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6 flex justify-center"
            >
              <Logo variant="luxury" size="lg" animated={true} useImage={true} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                {t('auth.loginTitle')}
              </h2>
              <p className="text-slate-600">
                {t('auth.loginSubtitle')}{' '}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline decoration-2 underline-offset-2"
                >
                  {t('auth.createAccount')}
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden"
          >
            {/* Card background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-50"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {errors.general && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{errors.general}</span>
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    {t('auth.email')}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full pl-10 pr-3 py-4 border rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                        errors.email ? 'border-red-300 bg-red-50/80' : 'border-slate-200 hover:border-slate-300 focus:bg-white'
                      }`}
                      placeholder={t('auth.emailPlaceholder')}
                    />
                  </div>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </motion.p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    {t('auth.password')}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full pl-10 pr-12 py-4 border rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                        errors.password ? 'border-red-300 bg-red-50/80' : 'border-slate-200 hover:border-slate-300 focus:bg-white'
                      }`}
                      placeholder={t('auth.passwordPlaceholder')}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-600 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password}</span>
                    </motion.p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded transition-all duration-200"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                      {t('auth.rememberMe')}
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline decoration-2 underline-offset-2"
                    >
                      {t('auth.forgotPassword')}
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('auth.loggingIn')}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5" />
                        <span>{t('auth.login')}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/90 backdrop-blur-xl text-slate-500 font-medium">
                      {t('auth.orContinueWith')}
                    </span>
                  </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="ml-2 font-medium">{t('auth.google')}</span>
                  </button>

                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    <span className="ml-2 font-medium">{t('auth.twitter')}</span>
                  </button>
                </div>

                {/* Back to Home */}
                <div className="text-center pt-4">
                  <Link
                    to="/"
                    className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium hover:scale-105 transform"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('common.backToHome')}</span>
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Login; 