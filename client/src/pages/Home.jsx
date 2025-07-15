
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaUsers, FaGlobe, FaHeart } from "react-icons/fa";
import logo from "/public/images/logo.png";

const navLinks = [
  { to: "/hajj", key: "nav.hajj", color: "bg-green-500 hover:bg-green-600 text-white" },
  { to: "/omra", key: "nav.omra", color: "bg-blue-500 hover:bg-blue-600 text-white" },
  { to: "/app/tourisme", key: "nav.tourisme", color: "bg-yellow-500 hover:bg-yellow-600 text-white" },
  { to: "/app/contact", key: "nav.contact", color: "bg-pink-500 hover:bg-pink-600 text-white" },
];

const Home = () => {
  const { t, i18n } = useTranslation();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/image4.png')" }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full flex flex-col md:flex-row items-center justify-between px-8 py-4 bg-white/40 backdrop-blur-md rounded-b-3xl shadow-lg z-20">
          {/* Logo et titre */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-14 w-14 rounded-full shadow" />
            <span className="text-2xl font-bold text-green-700">رحلات الجنّة</span>
          </div>
          {/* Navigation */}
          <nav className="flex gap-3 mt-4 md:mt-0">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                className={`px-4 py-2 rounded-full font-semibold shadow transition ${link.color} mx-1`}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
          {/* Sélecteur de langue */}
          <div className="flex gap-2 mt-4 md:mt-0">
            {["fr", "ar", "en"].map((lng) => (
              <button
                key={lng}
                onClick={() => i18n.changeLanguage(lng)}
                className={`px-2 py-1 rounded ${i18n.language === lng ? "bg-blue-600 text-white" : "bg-white/60 text-blue-600"}`}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {/* Section d'accueil principale */}
        <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
          <section className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 max-w-2xl mx-auto my-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4 drop-shadow">{t("welcome.title")}</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">{t("welcome.subtitle")}</p>
            <div className="flex gap-4 justify-center mb-8 flex-wrap">
              <button className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full shadow-lg hover:scale-105 transition">{t("welcome.getStarted")}</button>
              <button className="px-8 py-3 border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition">{t("welcome.explore")}</button>
            </div>
            {/* Statistiques */}
            <div className="flex flex-col md:flex-row gap-8 justify-center mb-8">
              <div className="flex flex-col items-center">
                <FaUsers className="text-3xl text-green-600 mb-2" />
                <span className="text-xl font-bold">{t("stats.travelers")}</span>
                <span className="text-gray-600">{t("welcome.satisfiedTravelers")}</span>
              </div>
              <div className="flex flex-col items-center">
                <FaGlobe className="text-3xl text-blue-600 mb-2" />
                <span className="text-xl font-bold">{t("stats.destinations")}</span>
                <span className="text-gray-600">{t("welcome.uniqueDestinations")}</span>
              </div>
              <div className="flex flex-col items-center">
                <FaHeart className="text-3xl text-pink-500 mb-2" />
                <span className="text-xl font-bold">{t("stats.satisfaction")}</span>
                <span className="text-gray-600">{t("welcome.guaranteedSatisfaction")}</span>
              </div>
            </div>
            {/* Pourquoi nous choisir */}
            <div className="bg-white/70 backdrop-blur rounded-xl shadow p-6 mt-4">
              <h2 className="text-2xl font-bold text-green-700 mb-4">{t("welcome.whyChooseUs")}</h2>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{t("welcome.qualityTitle")}</h3>
              <p className="text-gray-700">{t("welcome.qualityDescription")}</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
