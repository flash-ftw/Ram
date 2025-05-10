import { Medal, Users, Globe, Package, Wrench, Settings, Award, Clock } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex items-center gap-16">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-yellow-500 rounded-lg"></div>
              <div 
                className="rounded-lg shadow-lg w-full h-80 bg-gray-800 relative z-10 flex items-center justify-center"
              >
                <img 
                  src="/logo.png" 
                  alt="Rammeh MotoScoot Logo" 
                  className="w-auto max-h-64 object-contain" 
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-black py-2 px-4 rounded-lg font-bold z-20">
                Depuis 2015
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="inline-block mb-6">
              <h2 className="text-4xl font-bold mb-2 moto-heading">L'Histoire de Rammeh MotoScoot</h2>
            </div>
            <p className="text-gray-300 mb-4 text-lg">
              Bienvenue chez Rammeh MotoScoot, le premier showroom de motos en Tunisie. Fondé en 2015 par des passionnés de moto, 
              nous sommes devenus la destination la plus fiable du pays pour les motos haute performance, les accessoires de qualité et un service expert.
            </p>
            <p className="text-gray-300 mb-4 text-lg">
              Notre passion guide tout ce que nous faisons. Nous sélectionnons soigneusement chaque moto pour sa performance, sa fiabilité et sa valeur. 
              Notre équipe de techniciens certifiés fournit des services exceptionnels de maintenance et de personnalisation pour garder votre moto 
              en parfait état de marche.
            </p>
            <p className="text-gray-300 mb-6 text-lg">
              Visitez notre showroom ultramoderne à Tunis ou parcourez notre catalogue en ligne pour découvrir votre moto parfaite. Chez Rammeh MotoScoot, 
              nous ne vendons pas simplement des motos – nous livrons des rêves sur deux roues.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mt-10">
              <div className="text-center bg-gray-900 p-5 rounded-lg border-l-4 border-yellow-500">
                <div className="text-yellow-500 text-3xl font-bold mb-2 flex justify-center">
                  <Award className="mr-2" size={28} />
                  8+
                </div>
                <p className="text-gray-300">Années d'Excellence</p>
              </div>
              <div className="text-center bg-gray-900 p-5 rounded-lg border-l-4 border-yellow-500">
                <div className="text-yellow-500 text-3xl font-bold mb-2 flex justify-center">
                  <Users className="mr-2" size={28} />
                  5K+
                </div>
                <p className="text-gray-300">Motards Satisfaits</p>
              </div>
              <div className="text-center bg-gray-900 p-5 rounded-lg border-l-4 border-yellow-500">
                <div className="text-yellow-500 text-3xl font-bold mb-2 flex justify-center">
                  <Wrench className="mr-2" size={28} />
                  10K+
                </div>
                <p className="text-gray-300">Services Réalisés</p>
              </div>
              <div className="text-center bg-gray-900 p-5 rounded-lg border-l-4 border-yellow-500">
                <div className="text-yellow-500 text-3xl font-bold mb-2 flex justify-center">
                  <Settings className="mr-2" size={28} />
                  200+
                </div>
                <p className="text-gray-300">Modèles Disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
