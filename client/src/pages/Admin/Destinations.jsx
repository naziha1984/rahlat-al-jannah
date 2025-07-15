import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt
} from 'react-icons/fa';
import api from '../../services/api';

const Destinations = () => {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [destinationToDelete, setDestinationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const categories = [
    { value: 'beach', label: t('destinations.categories.beach') },
    { value: 'mountain', label: t('destinations.categories.mountain') },
    { value: 'city', label: t('destinations.categories.city') },
    { value: 'desert', label: t('destinations.categories.desert') },
    { value: 'forest', label: t('destinations.categories.forest') }
  ];

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await api.get('/admin/destinations');
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!destinationToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/admin/destinations/${destinationToDelete._id}`);
      setDestinations(prev => prev.filter(d => d._id !== destinationToDelete._id));
      setShowDeleteModal(false);
      setDestinationToDelete(null);
    } catch (error) {
      console.error('Error deleting destination:', error);
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (destination) => {
    setDestinationToDelete(destination);
    setShowDeleteModal(true);
  };

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || destination.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('admin.destinations.title')}
            </h1>
            <p className="text-gray-600">
              {t('admin.destinations.subtitle')}
            </p>
          </div>
          <Link
            to="/admin/destinations/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <FaPlus />
            {t('admin.destinations.addNew')}
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('admin.destinations.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('admin.destinations.allCategories')}</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-300 mb-4">🌍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {t('admin.destinations.noDestinations')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('admin.destinations.noDestinationsDescription')}
            </p>
            <Link
              to="/admin/destinations/new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              {t('admin.destinations.addFirstDestination')}
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination, index) => (
              <motion.div
                key={destination._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
                    {destination.price} {t('common.currency')}
                  </div>
                  {destination.featured && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {t('destinations.featured')}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {destination.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-yellow-500">
                      <FaStar className="mr-1" />
                      <span className="text-gray-700">{destination.rating}</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      {destination.duration} {t('common.days')}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FaMapMarkerAlt className="mr-1" />
                    {destination.location}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link
                        to={`/destinations/${destination._id}`}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                        title={t('admin.destinations.view')}
                      >
                        <FaEye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/destinations/${destination._id}/edit`}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-300"
                        title={t('admin.destinations.edit')}
                      >
                        <FaEdit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => confirmDelete(destination)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-300"
                        title={t('admin.destinations.delete')}
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      destination.category === 'beach' ? 'bg-blue-100 text-blue-800' :
                      destination.category === 'mountain' ? 'bg-green-100 text-green-800' :
                      destination.category === 'city' ? 'bg-purple-100 text-purple-800' :
                      destination.category === 'desert' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {categories.find(c => c.value === destination.category)?.label || destination.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('admin.destinations.confirmDelete')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('admin.destinations.deleteWarning', { name: destinationToDelete?.name })}
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50"
                >
                  {deleting ? t('admin.destinations.deleting') : t('admin.destinations.delete')}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDestinationToDelete(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                >
                  {t('admin.destinations.cancel')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations; 