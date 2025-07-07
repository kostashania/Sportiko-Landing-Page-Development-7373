import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMail, FiLock, FiSave, FiEye, FiEyeOff, FiEdit3 } = FiIcons;

const UserProfile = ({ user }) => {
  const { updatePassword, updateProfile, error } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      const { error } = await updateProfile({
        full_name: profileData.fullName
      });

      if (error) throw error;

      setSuccess('Το προφίλ ενημερώθηκε επιτυχώς!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Οι κωδικοί δεν ταιριάζουν');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες');
      setLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(passwordData.newPassword);

      if (error) throw error;

      setSuccess('Ο κωδικός ενημερώθηκε επιτυχώς!');
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Προφίλ Χρήστη</h2>
        <p className="text-gray-600 mb-8">
          Διαχειριστείτε τις πληροφορίες του λογαριασμού σας.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <SafeIcon icon={FiUser} className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Πληροφορίες Προφίλ</h3>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiEdit3} className="w-4 h-4" />
              {isEditing ? 'Ακύρωση' : 'Επεξεργασία'}
            </button>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Πλήρες Όνομα
              </label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Εισάγετε το πλήρες όνομά σας"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Το email δεν μπορεί να αλλάξει
              </p>
            </div>

            {isEditing && (
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <SafeIcon icon={FiSave} className="w-5 h-5" />
                {loading ? 'Αποθήκευση...' : 'Αποθήκευση Αλλαγών'}
              </button>
            )}
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <SafeIcon icon={FiLock} className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Αλλαγή Κωδικού</h3>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiEdit3} className="w-4 h-4" />
              {showPasswordForm ? 'Ακύρωση' : 'Αλλαγή'}
            </button>
          </div>

          {showPasswordForm ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Νέος Κωδικός
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Εισάγετε νέο κωδικό"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={showNewPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Επιβεβαίωση Κωδικού
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Επιβεβαιώστε τον κωδικό"
                  required
                />
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Σημείωση:</strong> Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <SafeIcon icon={FiSave} className="w-5 h-5" />
                {loading ? 'Αποθήκευση...' : 'Αλλαγή Κωδικού'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <SafeIcon icon={FiLock} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Κάντε κλικ στο κουμπί "Αλλαγή" για να αλλάξετε τον κωδικό σας.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Πληροφορίες Λογαριασμού</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Ημερομηνία Δημιουργίας</p>
            <p className="font-medium">
              {new Date(user?.created_at).toLocaleDateString('el-GR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Τελευταία Σύνδεση</p>
            <p className="font-medium">
              {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('el-GR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Δεν υπάρχει καταγραφή'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ρόλος</p>
            <p className="font-medium">Administrator</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Κατάσταση</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Ενεργός
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;