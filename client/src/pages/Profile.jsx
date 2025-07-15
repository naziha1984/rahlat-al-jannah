import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations/my-reservations');
      setReservations(response.data.reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile(profileData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setEditing(false);
  };

  const getReservationStatus = (status) => {
    const statusMap = {
      pending: { label: t('profile.status.pending'), color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: t('profile.status.confirmed'), color: 'bg-green-100 text-green-800' },
      cancelled: { label: t('profile.status.cancelled'), color: 'bg-red-100 text-red-800' },
      completed: { label: t('profile.status.completed'), color: 'bg-blue-100 text-blue-800' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('profile.title')}
          </h1>
          <p className="text-gray-600">
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('profile.tabs.profile')}
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reservations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('profile.tabs.reservations')} ({reservations.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {t('profile.personalInfo')}
                  </h2>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      <FaEdit />
                      {t('profile.edit')}
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileUpdate}>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('profile.firstName')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          disabled={!editing}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('profile.lastName')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                          disabled={!editing}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('profile.email')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!editing}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('profile.phone')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!editing}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {editing && (
                    <div className="flex gap-4 mt-6">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
                      >
                        <FaSave />
                        {saving ? t('profile.saving') : t('profile.save')}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                      >
                        <FaTimes />
                        {t('profile.cancel')}
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {t('profile.myReservations')}
                </h2>

                {reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl text-gray-300 mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {t('profile.noReservations')}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t('profile.noReservationsDescription')}
                    </p>
                    <a
                      href="/destinations"
                      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      {t('profile.browseDestinations')}
                    </a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reservations.map((reservation) => (
                      <div
                        key={reservation._id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {reservation.destination.name}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <FaMapMarkerAlt className="mr-2" />
                              {reservation.destination.location}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FaCalendarAlt className="mr-2" />
                              {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getReservationStatus(reservation.status).color}`}>
                              {getReservationStatus(reservation.status).label}
                            </span>
                            <div className="text-2xl font-bold text-blue-600 mt-2">
                              {reservation.totalPrice} {t('common.currency')}
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">{t('profile.reservation.numberOfPeople')}:</span> {reservation.numberOfPeople}
                          </div>
                          <div>
                            <span className="font-medium">{t('profile.reservation.duration')}:</span> {reservation.duration} {t('common.days')}
                          </div>
                          <div>
                            <span className="font-medium">{t('profile.reservation.bookedOn')}:</span> {formatDate(reservation.createdAt)}
                          </div>
                        </div>

                        {reservation.specialRequests && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {t('profile.reservation.specialRequests')}:
                            </h4>
                            <p className="text-gray-600">{reservation.specialRequests}</p>
                          </div>
                        )}

                        <div className="flex gap-4 mt-4">
                          <button className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-300">
                            {t('profile.reservation.viewDetails')}
                          </button>
                          {reservation.status === 'pending' && (
                            <button className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors duration-300">
                              <FaTrash className="inline mr-1" />
                              {t('profile.reservation.cancel')}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 