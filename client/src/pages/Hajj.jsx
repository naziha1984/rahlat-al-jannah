import React from "react";
import { useTranslation } from "react-i18next";

const Hajj = () => {
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/image4.png')" }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <section className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 max-w-2xl mx-auto my-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4 drop-shadow">
            {t("hajj.title") || "Hajj - Le voyage d'une vie"}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            {t("hajj.description") || "Découvrez nos offres exceptionnelles pour le Hajj, avec accompagnement, confort et spiritualité."}
          </p>
        </section>
      </div>
    </div>
  );
};

export default Hajj; 