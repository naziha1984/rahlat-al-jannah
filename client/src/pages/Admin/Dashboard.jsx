import React from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">{t('admin.dashboard.title') || 'لوحة تحكم الإدارة'}</h1>
      <p className="text-lg text-gray-600">{t('admin.dashboard.subtitle') || 'Bienvenue sur le tableau de bord administrateur.'}</p>
    </div>
  );
};

export default Dashboard; 