import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-emerald-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="font-extrabold text-2xl mb-2">رحلات الجنة</div>
          <div className="text-sm text-emerald-100">{t('footer.description') || 'Votre partenaire pour le Hajj, Omra et le tourisme.'}</div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">Liens rapides</span>
          <a href="/" className="hover:underline">{t('home.title') || 'Accueil'}</a>
          <a href="/hajj" className="hover:underline">{t('hajj.title') || 'Hajj'}</a>
          <a href="/omra" className="hover:underline">{t('omra.title') || 'Omra'}</a>
          <a href="/tourisme" className="hover:underline">{t('tourisme.title') || 'Tourisme'}</a>
          <a href="/contact" className="hover:underline">{t('contact.title') || 'Contact'}</a>
        </div>
        <div className="text-sm text-emerald-100">
          <div>{t('footer.contactInfo') || 'Contact : info@rahlat-aljanna.com'}</div>
          <div>{t('footer.address') || '123 Rue du Voyage, Paris'}</div>
        </div>
      </div>
      <div className="text-center text-xs text-emerald-200 mt-6">&copy; {new Date().getFullYear()} رحلات الجنة. {t('footer.allRightsReserved') || 'Tous droits réservés.'}</div>
    </footer>
  );
};

export default Footer; 