import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Plane, Compass } from 'lucide-react';

const Logo = ({ 
  variant = 'default', 
  size = 'md', 
  animated = true, 
  className = '',
  useImage = true
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const variants = {
    default: {
      icon: Globe,
      gradient: 'from-blue-600 via-purple-600 to-pink-600',
      accent: 'from-yellow-400 to-orange-500'
    },
    plane: {
      icon: Plane,
      gradient: 'from-sky-500 via-blue-600 to-indigo-700',
      accent: 'from-yellow-400 to-orange-500'
    },
    compass: {
      icon: Compass,
      gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
      accent: 'from-yellow-400 to-orange-500'
    },
    luxury: {
      icon: Sparkles,
      gradient: 'from-purple-600 via-pink-600 to-rose-600',
      accent: 'from-yellow-400 to-orange-500'
    }
  };

  const currentVariant = variants[variant];
  const IconComponent = currentVariant.icon;

  return (
    <motion.div 
      className={`relative inline-flex items-center ${className}`}
      whileHover={animated ? { scale: 1.05 } : {}}
      whileTap={animated ? { scale: 0.95 } : {}}
    >
      {/* Logo Icon/Image */}
      <div className="relative">
        {useImage ? (
          <motion.div
            className={`${sizeClasses[size]} relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
            animate={animated ? {
              boxShadow: [
                "0 10px 25px rgba(59, 130, 246, 0.3)",
                "0 20px 40px rgba(147, 51, 234, 0.4)",
                "0 10px 25px rgba(59, 130, 246, 0.3)"
              ]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <img 
              src="/images/logo.png" 
              alt="رحلات الجنة - Voyages du Paradis"
              className="w-full h-full object-cover"
            />
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={animated ? {
                opacity: [0, 0.3, 0]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        ) : (
          <motion.div
            className={`${sizeClasses[size]} bg-gradient-to-br ${currentVariant.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
            animate={animated ? {
              boxShadow: [
                "0 10px 25px rgba(59, 130, 246, 0.3)",
                "0 20px 40px rgba(147, 51, 234, 0.4)",
                "0 10px 25px rgba(59, 130, 246, 0.3)"
              ]
            } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <IconComponent className={`text-white ${size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-8 h-8' : size === 'xl' ? 'w-10 h-10' : 'w-12 h-12'}`} />
            
            {/* Accent sparkle */}
            <motion.div
              className={`absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r ${currentVariant.accent} rounded-full flex items-center justify-center`}
              animate={animated ? {
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-1.5 h-1.5 text-white" />
            </motion.div>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={animated ? {
                opacity: [0, 0.3, 0]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}

        {/* Floating particles */}
        {animated && (
          <>
            <motion.div
              className="absolute -top-2 -left-2 w-2 h-2 bg-blue-400 rounded-full opacity-60"
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 0.2, 0.6]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-1 -right-2 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60"
              animate={{
                y: [0, 8, 0],
                opacity: [0.6, 0.2, 0.6]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </>
        )}
      </div>

      {/* Logo Text */}
      <div className="ml-3 flex flex-col">
        <motion.span 
          className={`font-bold bg-gradient-to-r ${currentVariant.gradient} bg-clip-text text-transparent ${textSizes[size]} leading-none`}
          animate={animated ? {
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          رحلات الجنة
        </motion.span>
        <span className={`text-gray-500 ${size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : size === 'lg' ? 'text-sm' : size === 'xl' ? 'text-sm' : 'text-base'} -mt-0.5 font-medium`}>
          Voyages du Paradis
        </span>
      </div>
    </motion.div>
  );
};

export default Logo; 