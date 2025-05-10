import { Helmet } from 'react-helmet';
import ContactForm from "@/components/contact/ContactForm";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contactez-Nous - Rammeh MotoScoot</title>
        <meta name="description" content="Contactez Rammeh MotoScoot pour vos demandes de motos, essais, rendez-vous d'entretien, ou toute question concernant nos motos et accessoires." />
        <meta property="og:title" content="Contactez-Nous - Rammeh MotoScoot" />
        <meta property="og:description" content="Contactez le premier showroom de motos en Tunisie pour les ventes, services, pièces et accessoires. Planifiez un essai ou un rendez-vous d'entretien dès aujourd'hui." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2 moto-heading inline-block after:bottom-[-10px] after:w-24 after:left-1/2 after:-translate-x-1/2">Contactez Rammeh MotoScoot</h1>
        </div>
      </div>
      
      <ContactForm />
      
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-900 p-8 rounded-lg border-l-4 border-yellow-500">
                <h2 className="text-2xl font-bold mb-4 text-yellow-500">Visitez Notre Showroom</h2>
                <p className="text-gray-300 mb-6">
                  Découvrez nos motos en personne dans notre showroom principal à Tunis. Notre équipe d'experts motards et de techniciens est prête à vous aider à trouver votre moto parfaite ou à entretenir votre monture actuelle.
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 text-white">Heures d'Ouverture :</h3>
                  <p className="text-gray-300">
                    Lundi - Vendredi : 9h - 19h<br />
                    Samedi : 10h - 17h<br />
                    Dimanche : Sur rendez-vous uniquement
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 p-8 rounded-lg border-l-4 border-yellow-500">
                <h2 className="text-2xl font-bold mb-4 text-yellow-500">Assistance Motards</h2>
                <p className="text-gray-300 mb-6">
                  Besoin d'aide avec votre moto, des pièces détachées, ou des questions sur l'entretien ? Notre équipe d'assistance dédiée est là pour aider chaque motard.
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 text-white">Informations de Contact :</h3>
                  <p className="text-gray-300">
                    Téléphone : +216 58 274 563<br />
                    Email : info@rammehmotoscoot.tn<br />
                    WhatsApp : +216 58 274 563
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
