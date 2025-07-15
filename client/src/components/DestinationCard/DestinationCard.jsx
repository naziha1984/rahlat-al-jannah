import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight,
  Heart,
  Eye,
  Calendar,
  Sparkles
} from 'lucide-react';

const DestinationCard = ({ 
  destination, 
  variant = 'default',
  showActions = true,
  className = '' 
}) => {
  const variants = {
    default: {
      gradient: 'from-purple-600 to-pink-600',
      hoverGradient: 'from-purple-700 to-pink-700',
      shadow: 'hover:shadow-purple-500/25',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/20'
    },
    luxury: {
      gradient: 'from-purple-600 to-pink-600',
      hoverGradient: 'from-purple-700 to-pink-700',
      shadow: 'hover:shadow-purple-500/25',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/20'
    },
    adventure: {
      gradient: 'from-green-600 to-emerald-600',
      hoverGradient: 'from-green-700 to-emerald-700',
      shadow: 'hover:shadow-green-500/25',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/20'
    },
    beach: {
      gradient: 'from-cyan-600 to-blue-600',
      hoverGradient: 'from-cyan-700 to-blue-700',
      shadow: 'hover:shadow-cyan-500/25',
      bgGradient: 'from-cyan-500/10 to-blue-500/10',
      borderColor: 'border-cyan-500/20'
    },
    mountain: {
      gradient: 'from-orange-500 to-red-500',
      hoverGradient: 'from-orange-600 to-red-600',
      shadow: 'hover:shadow-orange-500/25',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-500/20'
    },
    city: {
      gradient: 'from-indigo-600 to-purple-600',
      hoverGradient: 'from-indigo-700 to-purple-700',
      shadow: 'hover:shadow-indigo-500/25',
      bgGradient: 'from-indigo-500/10 to-purple-500/10',
      borderColor: 'border-indigo-500/20'
    }
  };

  const currentVariant = variants[variant];

  return (
    <motion.div
      className={`group relative bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 border ${currentVariant.borderColor} hover:border-white/30 ${className}`}
      whileHover={{ y: -15, scale: 1.02 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentVariant.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        {/* Price Badge */}
        <motion.div 
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-xl px-4 py-2 rounded-2xl text-lg font-bold text-purple-600 shadow-2xl border border-white/20"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>{destination.price} €</span>
          </div>
        </motion.div>

        {/* Rating */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white bg-black/40 backdrop-blur-sm px-3 py-2 rounded-2xl border border-white/20">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold">{destination.rating}</span>
        </div>

        {/* Duration */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2 text-white bg-black/40 backdrop-blur-sm px-3 py-2 rounded-2xl border border-white/20">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{destination.duration} jours</span>
        </div>

        {/* Favorite Button */}
        {showActions && (
          <motion.button
            className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/30 border border-white/20 hover:border-white/30 transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className="w-5 h-5" />
          </motion.button>
        )}

        {/* Quick View Button */}
        {showActions && (
          <motion.button
            className="absolute top-4 left-16 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/30 border border-white/20 hover:border-white/30 transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Title */}
        <motion.h3 
          className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          {destination.name}
        </motion.h3>

        {/* Description */}
        <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed text-base">
          {destination.description}
        </p>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-base mb-6 bg-white/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/20">
          <MapPin className="w-5 h-5 mr-3 text-purple-500" />
          <span className="font-medium">{destination.location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Max {destination.maxParticipants || 12}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="font-medium">{destination.season || 'Toute l\'année'}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/destinations/${destination._id}`}
          className={`group/btn block w-full bg-gradient-to-r ${currentVariant.gradient} text-white text-center py-4 rounded-2xl font-bold text-lg hover:${currentVariant.hoverGradient} transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center justify-center space-x-3 ${currentVariant.shadow} border border-white/20`}
        >
          <span>Découvrir cette destination</span>
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
        </Link>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-8 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 left-6 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      />
    </motion.div>
  );
};

export default DestinationCard; 