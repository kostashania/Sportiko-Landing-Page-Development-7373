import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiEye, FiEyeOff, FiMail, FiLock } = FiIcons;

const LoginForm = () => {
  const { signIn, resetPassword, error } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      console.error('Login error:', error);
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await resetPassword(forgotEmail);
    
    if (!error) {
      setResetSent(true);
    }
    
    setLoading(false);
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Επαναφορά Κωδικού</h1>
            <p className="text-gray-600">
              {resetSent 
                ? 'Έχει σταλεί email επαναφοράς στη διεύθυνσή σας'
                : 'Εισάγετε το email σας για επαναφορά κωδικού'
              }
            </p>
          </div>

          {!resetSent ? (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin@sportiko.eu"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? 'Αποστολή...' : 'Αποστολή Email Επαναφοράς'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiMail} className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 mb-6">
                Ελέγξτε το email σας και ακολουθήστε τις οδηγίες για επαναφορά του κωδικού σας.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
              Επιστροφή στη Σύνδεση
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Συνδεθείτε για να διαχειριστείτε τη σελίδα</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@sportiko.eu"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Κωδικός Πρόσβασης
            </label>
            <div className="relative">
              <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
          >
            {loading ? 'Σύνδεση...' : 'Σύνδεση'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
          >
            Ξεχάσατε τον κωδικό σας;
          </button>
        </div>

        <div className="mt-8 text-center">
          <a
            href="#/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
            Επιστροφή στη Σελίδα
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;