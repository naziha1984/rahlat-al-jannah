import React from 'react';
import { useTranslation } from 'react-i18next';

const BookingsAdmin = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">{t('admin.bookings.title') || 'إدارة الحجوزات'}</h1>
      <p className="text-lg text-gray-600">{t('admin.bookings.subtitle') || 'Gérez les réservations des clients.'}</p>
    </div>
  );
};

export default BookingsAdmin; 