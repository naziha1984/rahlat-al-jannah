import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar, 
  ArrowRight,
  Sparkles,
  X,
  SlidersHorizontal,
  Globe,
  Mountain,
  Building,
  TreePine,
  Waves,
  Heart,
  Eye
} from 'lucide-react';
import api from '../services/api';
import DestinationCard from '../components/DestinationCard/DestinationCard';

const Destinations = () => {
  const { t, i18n } = useTranslation();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    duration: '',
    rating: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'beach', label: t('destinations.categories.beach') || 'Plage', icon: Waves, color: 'from-cyan-500 to-blue-500' },
    { value: 'mountain', label: t('destinations.categories.mountain') || 'Montagne', icon: Mountain, color: 'from-gray-600 to-gray-800' },
    { value: 'city', label: t('destinations.categories.city') || 'Ville', icon: Building, color: 'from-purple-500 to-pink-500' },
    { value: 'desert', label: t('destinations.categories.desert') || 'Désert', icon: Globe, color: 'from-yellow-500 to-orange-500' },
    { value: 'forest', label: t('destinations.categories.forest') || 'Forêt', icon: TreePine, color: 'from-green-500 to-emerald-500' }
  ];

  const durations = [
    { value: '1-3', label: '1-3 ' + (t('common.days') || 'jours') },
    { value: '4-7', label: '4-7 ' + (t('common.days') || 'jours') },
    { value: '8-14', label: '8-14 ' + (t('common.days') || 'jours') },
    { value: '15+', label: '15+ ' + (t('common.days') || 'jours') }
  ];

  const ratings = [
    { value: '4.5', label: '4.5+ ' + (t('common.stars') || 'étoiles') },
    { value: '4.0', label: '4.0+ ' + (t('common.stars') || 'étoiles') },
    { value: '3.5', label: '3.5+ ' + (t('common.stars') || 'étoiles') }
  ];

  useEffect(() => {
    fetchDestinations();
  }, [filters, currentPage]);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...filters
      });

      const response = await api.get(`/destinations?${params}`);
      setDestinations(response.data.destinations);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      duration: '',
      rating: ''
    });
    setCurrentPage(1);
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce-gentle"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium mb-8">
            <Globe className="w-5 h-5 text-purple-400" />
            <span>{t('destinations.badge') || 'Découvrez le monde'}</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-8">
            {t('destinations.title') || 'Destinations'}
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('destinations.subtitle') || 'Explorez des destinations extraordinaires et créez des souvenirs inoubliables'}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder={t('destinations.searchPlaceholder') || 'Rechercher une destination...'}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 font-bold"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {t('destinations.filters') || 'Filtres'}
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 pt-8 border-t border-white/10"
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      {t('destinations.category') || 'Catégorie'}
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white"
                    >
                      <option value="">{t('destinations.allCategories') || 'Toutes les catégories'}</option>
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      {t('destinations.minPrice') || 'Prix minimum'}
                    </label>
                    <input
                      type="number"
                      placeholder={t('destinations.minPrice') || 'Prix minimum'}
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      {t('destinations.maxPrice') || 'Prix maximum'}
                    </label>
                    <input
                      type="number"
                      placeholder={t('destinations.maxPrice') || 'Prix maximum'}
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      {t('destinations.duration') || 'Durée'}
                    </label>
                    <select
                      value={filters.duration}
                      onChange={(e) => handleFilterChange('duration', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white"
                    >
                      <option value="">{t('destinations.anyDuration') || 'Toute durée'}</option>
                      {durations.map(duration => (
                        <option key={duration.value} value={duration.value}>
                          {duration.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      {t('destinations.rating') || 'Note'}
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white"
                    >
                      <option value="">{t('destinations.anyRating') || 'Toute note'}</option>
                      {ratings.map(rating => (
                        <option key={rating.value} value={rating.value}>
                          {rating.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-6 py-3 text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                  >
                    <X className="w-4 h-4" />
                    {t('destinations.clearFilters') || 'Effacer les filtres'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Category Pills */}
        <motion.div 
          className="flex flex-wrap gap-4 mb-12 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.value}
              onClick={() => handleFilterChange('category', filters.category === category.value ? '' : category.value)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 border ${
                filters.category === category.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500 shadow-lg shadow-purple-500/25'
                  : 'bg-white/10 backdrop-blur-sm text-gray-300 border-white/20 hover:bg-white/20 hover:text-white'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon className="w-5 h-5" />
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Destinations Grid */}
        {!loading && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {destinations.map((destination, index) => (
              <motion.div
                key={destination._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <DestinationCard 
                  destination={destination} 
                  variant={destination.category || 'default'}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!loading && destinations.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {t('destinations.noResults') || 'Aucune destination trouvée'}
            </h3>
            <p className="text-gray-300 mb-8">
              {t('destinations.noResultsDescription') || 'Essayez de modifier vos filtres pour trouver plus de destinations.'}
            </p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1"
            >
              {t('destinations.clearFilters') || 'Effacer les filtres'}
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div 
            className="flex justify-center items-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-12 h-12 rounded-2xl font-semibold transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/10 backdrop-blur-sm text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Destinations; 