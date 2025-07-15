import React from 'react';
import { useTranslation } from 'react-i18next';

const UsersAdmin = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">{t('admin.users.title') || 'إدارة المستخدمين'}</h1>
      <p className="text-lg text-gray-600">{t('admin.users.subtitle') || 'Gérez les comptes utilisateurs.'}</p>
    </div>
  );
};

export default UsersAdmin; 