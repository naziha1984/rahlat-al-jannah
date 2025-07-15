import React from 'react';

const Contact = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-emerald-100 via-yellow-50 to-white">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-emerald-700">اتصل بنا</h1>
        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">الاسم الكامل</label>
            <input type="text" className="input" placeholder="اكتب اسمك الكامل" required />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">البريد الإلكتروني</label>
            <input type="email" className="input" placeholder="example@email.com" required />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">رسالتك</label>
            <textarea className="input" rows={4} placeholder="اكتب رسالتك هنا..." required></textarea>
          </div>
          <button type="submit" className="w-full btn btn-primary">إرسال</button>
        </form>
        <div className="mt-8 text-center text-gray-600">
          <p>أو تواصل معنا عبر:</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="tel:+213XXXXXXXXX" className="font-bold text-emerald-700">الهاتف</a>
            <a href="mailto:contact@paradis.com" className="font-bold text-emerald-700">البريد الإلكتروني</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600">فيسبوك</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;