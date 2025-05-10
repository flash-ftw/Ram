import { Helmet } from 'react-helmet';
import AboutSection from "@/components/home/AboutSection";

const About = () => {
  return (
    <>
      <Helmet>
        <title>À Propos - Rammeh MotoScoot</title>
        <meta name="description" content="Découvrez Rammeh MotoScoot, le premier showroom de motos en Tunisie, notre passion pour les motos, et notre engagement pour un service exceptionnel depuis 2015." />
        <meta property="og:title" content="À Propos - Rammeh MotoScoot" />
        <meta property="og:description" content="Découvrez Rammeh MotoScoot, le premier showroom de motos en Tunisie, notre passion pour les motos, et notre engagement pour un service exceptionnel depuis 2015." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2 moto-heading inline-block after:bottom-[-10px] after:w-24 after:left-1/2 after:-translate-x-1/2">À Propos de Rammeh MotoScoot</h1>
        </div>
      </div>
      
      <AboutSection />
      
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center moto-heading inline-block after:bottom-[-10px] after:w-24 after:left-1/2 after:-translate-x-1/2">Notre Aventure Moto</h2>
            <div className="prose prose-lg prose-invert mx-auto text-gray-300">
              <p>
                Rammeh MotoScoot est né en 2015 d'une passion pure pour les motos et la route. Ce qui a commencé comme un petit atelier géré par des passionnés de moto s'est transformé en l'une des destinations principales de Tunisie pour les motos, les pièces, les accessoires et un service expert.
              </p>
              <p>
                Notre équipe est composée de techniciens certifiés, de motards expérimentés et d'aficionados de la moto qui vivent et respirent cette culture. Nous sélectionnons soigneusement chaque moto et accessoire de notre inventaire en fonction des performances, de la fiabilité et de la valeur - car nous ne vendrions jamais quelque chose que nous ne conduirions pas nous-mêmes.
              </p>
              <p>
                Chez Rammeh MotoScoot, nous avons bâti notre réputation sur un service exceptionnel. Que vous soyez un motard chevronné à la recherche de votre prochaine machine haute performance, un novice achetant votre première moto, ou quelqu'un cherchant un entretien expert, notre équipe vous offre une attention personnalisée et des conseils d'experts.
              </p>
              <p>
                Nous sommes fiers de représenter certaines des plus prestigieuses marques de motos du monde tout en soutenant la communauté croissante de motards en Tunisie. Notre showroom ultramoderne à Tunis présente les derniers modèles, tandis que notre département de service assure que votre moto fonctionne à son meilleur niveau.
              </p>
              <p>
                Visitez-nous aujourd'hui et découvrez pourquoi des milliers de motards à travers la Tunisie font confiance à Rammeh MotoScoot pour tous leurs besoins en matière de moto.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
