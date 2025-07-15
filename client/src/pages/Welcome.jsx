import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Star,
  Users,
  Calendar,
  Globe,
  Shield,
  Heart
} from 'lucide-react';
import Logo from '../components/Logo/Logo';

const Welcome = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-gentle"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.div 
            className="mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Logo size="lg" animated={true} />
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('welcome.title') || 'رحلات الجنة'}
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t('welcome.subtitle') || 'Découvrez des destinations extraordinaires où chaque voyage devient une aventure inoubliable'}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              to="/register"
              className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                {t('welcome.getStarted') || 'Commencer l\'aventure'}
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              to="/destinations"
              className="group relative bg-white/10 backdrop-blur-sm border border-white/20 text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                {t('welcome.explore') || 'Explorer les destinations'}
                <MapPin className="ml-3 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              { number: '10K+', label: 'Voyageurs satisfaits', icon: Users },
              { number: '50+', label: 'Destinations uniques', icon: Globe },
              { number: '99%', label: 'Satisfaction garantie', icon: Heart }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {t('welcome.whyChooseUs') || 'Pourquoi nous choisir ?'}
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[{
              icon: Star,
              title: t('welcome.qualityTitle') || 'Excellence Premium',
              desc: t('welcome.qualityDescription') || 'Des expériences de voyage soigneusement sélectionnées pour vous offrir le meilleur.',
              color: 'from-yellow-400 to-orange-500',
              bgColor: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20'
            }, {
              icon: Shield,
              title: t('welcome.experienceTitle') || 'Sécurité Totale',
              desc: t('welcome.experienceDescription') || 'Votre sécurité et votre tranquillité d\'esprit sont notre priorité absolue.',
              color: 'from-blue-400 to-cyan-500',
              bgColor: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
            }, {
              icon: Calendar,
              title: t('welcome.flexibilityTitle') || 'Flexibilité Maximale',
              desc: t('welcome.flexibilityDescription') || 'Personnalisez votre voyage selon vos envies et votre budget.',
              color: 'from-green-400 to-emerald-500',
              bgColor: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
            }].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`${feature.bgColor} backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300`}
              >
                <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${feature.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-300 text-center leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-pink-600/90 to-purple-800/90 backdrop-blur-sm"></div>
          
          {/* Animated background elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="relative z-10 p-16 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('welcome.readyToStart') || 'Prêt à vivre votre rêve ?'}
            </h2>
            <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('welcome.ctaDescription') || 'Rejoignez des milliers de voyageurs qui ont déjà transformé leurs rêves en réalité avec nous.'}
            </p>
            <Link
              to="/register"
              className="group inline-flex items-center justify-center bg-white text-purple-700 px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-1 hover:scale-105"
            >
              <span>{t('welcome.createAccount') || 'Créer mon compte maintenant'}</span>
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Welcome;
