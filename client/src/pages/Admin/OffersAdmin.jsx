import React from 'react';
import { useTranslation } from 'react-i18next';

const OffersAdmin = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">{t('admin.offers.title') || 'إدارة العروض'}</h1>
      <p className="text-lg text-gray-600">{t('admin.offers.subtitle') || 'Ajoutez, modifiez ou supprimez les offres.'}</p>
    </div>
  );
};

export default OffersAdmin; 