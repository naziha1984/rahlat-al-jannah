import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Header = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const { currentLanguage, languages, switchLanguage } = useLanguage();

  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="font-extrabold text-xl text-emerald-700 tracking-tight">
          رحلات الجنة
        </Link>
        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-emerald-700 font-medium">{t('home.title') || 'Accueil'}</Link>
          <Link to="/hajj" className="hover:text-emerald-700 font-medium">{t('hajj.title') || 'Hajj'}</Link>
          <Link to="/omra" className="hover:text-emerald-700 font-medium">{t('omra.title') || 'Omra'}</Link>
          <Link to="/tourisme" className="hover:text-emerald-700 font-medium">{t('tourisme.title') || 'Tourisme'}</Link>
          <Link to="/contact" className="hover:text-emerald-700 font-medium">{t('contact.title') || 'Contact'}</Link>
          <Link to="/admin" className="hover:text-emerald-700 font-medium">Admin</Link>
        </nav>
        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Langues */}
          <select
            value={currentLanguage}
            onChange={e => switchLanguage(e.target.value)}
            className="rounded px-2 py-1 border border-gray-300 bg-white text-sm"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
            ))}
          </select>
          {/* Auth */}
          {isAuthenticated ? (
            <button onClick={logout} className="text-red-600 font-semibold hover:underline">{t('logout') || 'Déconnexion'}</button>
          ) : (
            <Link to="/login" className="text-emerald-700 font-semibold hover:underline">{t('login') || 'Connexion'}</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 