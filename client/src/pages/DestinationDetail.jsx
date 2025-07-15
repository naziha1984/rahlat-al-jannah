import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    specialRequests: ''
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    try {
      const response = await api.get(`/destinations/${id}`);
      setDestination(response.data.destination);
    } catch (error) {
      console.error('Error fetching destination:', error);
      navigate('/destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: `/destinations/${id}` } });
      return;
    }

    setBookingLoading(true);
    try {
      const response = await api.post('/reservations', {
        destinationId: id,
        ...booking
      });
      
      setShowBookingModal(false);
      navigate('/profile', { 
        state: { 
          message: t('destination.bookingSuccess'),
          reservationId: response.data.reservation._id 
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(t('destination.bookingError'));
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!destination || !booking.startDate || !booking.endDate) return 0;
    
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    return destination.price * days * booking.numberOfPeople;
  };

  const calculateDuration = () => {
    if (!booking.startDate || !booking.endDate) return 0;
    
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('destination.notFound')}
          </h2>
          <button
            onClick={() => navigate('/destinations')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            {t('destination.backToDestinations')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px]">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {destination.name}
            </h1>
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {destination.location}
              </div>
              <div className="flex items-center">
                <FaStar className="mr-2 text-yellow-400" />
                {destination.rating}
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                {destination.duration} {t('common.days')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('destination.about')}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {destination.description}
              </p>
              
              {/* Highlights */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t('destination.highlights')}
                  </h3>
                  <ul className="space-y-3">
                    {destination.highlights?.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t('destination.included')}
                  </h3>
                  <ul className="space-y-3">
                    {destination.included?.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            {destination.itinerary && (
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('destination.itinerary')}
                </h2>
                <div className="space-y-6">
                  {destination.itinerary.map((day, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {t('destination.day')} {index + 1}
                      </h3>
                      <p className="text-gray-700">{day}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {destination.reviews && destination.reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('destination.reviews')}
                </h2>
                <div className="space-y-6">
                  {destination.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold">
                              {review.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                            <div className="flex items-center text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {destination.price} {t('common.currency')}
                </div>
                <div className="text-gray-600">
                  {t('destination.perPerson')} / {t('common.day')}
                </div>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-300 mb-4"
              >
                {t('destination.bookNow')}
              </button>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaClock className="mr-3 text-blue-600" />
                  {t('destination.duration')}: {destination.duration} {t('common.days')}
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-3 text-blue-600" />
                  {t('destination.maxGroup')}: {destination.maxGroupSize || 'Unlimited'}
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-3 text-blue-600" />
                  {t('destination.location')}: {destination.location}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('destination.bookTrip')}
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('destination.startDate')}
                  </label>
                  <input
                    type="date"
                    required
                    value={booking.startDate}
                    onChange={(e) => setBooking(prev => ({ ...prev, startDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('destination.endDate')}
                  </label>
                  <input
                    type="date"
                    required
                    value={booking.endDate}
                    onChange={(e) => setBooking(prev => ({ ...prev, endDate: e.target.value }))}
                    min={booking.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('destination.numberOfPeople')}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={destination.maxGroupSize || 20}
                    value={booking.numberOfPeople}
                    onChange={(e) => setBooking(prev => ({ ...prev, numberOfPeople: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('destination.specialRequests')}
                  </label>
                  <textarea
                    value={booking.specialRequests}
                    onChange={(e) => setBooking(prev => ({ ...prev, specialRequests: e.target.value }))}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('destination.specialRequestsPlaceholder')}
                  />
                </div>

                {/* Price Summary */}
                {booking.startDate && booking.endDate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t('destination.priceSummary')}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{t('destination.duration')}:</span>
                        <span>{calculateDuration()} {t('common.days')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('destination.people')}:</span>
                        <span>{booking.numberOfPeople}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('destination.pricePerPerson')}:</span>
                        <span>{destination.price} {t('common.currency')}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>{t('destination.total')}:</span>
                        <span>{calculateTotalPrice()} {t('common.currency')}</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? t('destination.booking') : t('destination.confirmBooking')}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetail; 