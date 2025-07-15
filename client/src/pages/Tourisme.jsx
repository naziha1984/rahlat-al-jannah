import React from 'react';
import { useTranslation } from 'react-i18next';

const Tourisme = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">{t('tourisme.title') || 'قسم السياحة'}</h1>
      <p className="text-lg text-gray-600">{t('tourisme.subtitle') || 'Découvrez nos offres touristiques.'}</p>
    </div>
  );
};

export default Tourisme; 