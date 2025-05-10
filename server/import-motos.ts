import { storage } from "./storage";
import { InsertProduct } from "@shared/schema";

/**
 * Script d'importation pour les nouvelles motos
 */
async function importMotos() {
  console.log("Démarrage de l'importation des nouvelles motos...");

  const motos = [
    {
      name: "SENKE RAPTOR 125CC",
      slug: "senke-raptor-125cc",
      price: 7500,
      originalPrice: 8000,
      description: "Motocycle SENKE RAPTOR 125CC avec freins à disque avant et arrière",
      features: "Moteur : 125 cm³\nMonocylindre 4 temps\nRefroidissement : A air\nCapacité du Réservoir : 14 Litres\nVitesse Maximale : 120 km/h\nTransmission : 5 vitesses\nFreins à disque avant et arrière\nAdmission par carburateur\nEntraînement par chaîne\nEmpattement: 1380 mm\nDémarrage électrique\nDimensions : 2040 x 780 x 1100 mm",
      categoryId: 17, // Moteur Thermique
      brandId: 18, // SENKE
      featured: true,
      mainImage: "/uploads/products/default-product.png",
      galleryImages: [],
      inStock: true,
      quantity: 10,
      motorType: "Monocylindre 4 temps",
      displacement: "125 cm³",
      cooling: "Refroidi par air",
      fuelSystem: "Carburateur",
      transmission: "5 vitesses",
      starter: "Électrique",
      brakes: "Disque avant / Disque arrière",
      maxSpeed: 120,
      fuelCapacity: 14,
      wheelSize: "Standard",
      weight: 150
    },
    {
      name: "ZIMOTA RKS 125CC",
      slug: "zimota-rks-125cc",
      price: 7200,
      originalPrice: 7800,
      description: "Motocycle ZIMOTA RKS avec monocylindre 4 temps",
      features: "Moteur : 125 cm³\nMonocylindre : 4 temps\nRefroidissement : A air\nCapacité du Réservoir : 6 Litres\nCouple Maxi : 10.0 - 7000\nType d'alimentation : Carburateur\nPuissance maximale : 8.4 - 8.500\nFreins AV-AR : Monodisque 240 - Tambour 130\nPneumatique AV-AR: 90-90-17-110-80-17\nDimensions: 2040 x 780 x 1070 mm\nPoids: 117 Kg",
      categoryId: 17, // Moteur Thermique
      brandId: 19, // ZIMOTA
      featured: true,
      mainImage: "/uploads/products/default-product.png",
      galleryImages: [],
      inStock: true,
      quantity: 8,
      motorType: "Monocylindre 4 temps",
      displacement: "125 cm³",
      cooling: "Refroidi par air",
      fuelSystem: "Carburateur",
      transmission: "Manuelle",
      starter: "Électrique",
      brakes: "Monodisque / Tambour",
      maxSpeed: 110,
      fuelCapacity: 6,
      wheelSize: "17 pouces",
      weight: 117
    },
    {
      name: "CAPPUCINO SLC",
      slug: "cappucino-slc",
      price: 5800,
      originalPrice: 6000,
      description: "Scooter CAPPUCINO SLC 4 temps avec frein à disque avant",
      features: "4 TEMPS\n4 Vitesse\nType de Frein : Avant : disque / Arrière : Tambour\nMode de Fonctionnement du Frein : Avant et Arrière à la Main\nCapacité du Réservoir : 4.5 Litres\nVitesse Max : 90 Km-h\nSystème Alarme\nPneu : Tuplesse",
      categoryId: 17, // Moteur Thermique
      brandId: 13, // SLC
      featured: false,
      mainImage: "/uploads/products/default-product.png",
      galleryImages: [],
      inStock: true,
      quantity: 15,
      motorType: "4 temps",
      displacement: "100 cm³",
      cooling: "Refroidi par air",
      fuelSystem: "Carburateur",
      transmission: "4 vitesses",
      starter: "Électrique",
      brakes: "Disque avant / Tambour arrière",
      maxSpeed: 90,
      fuelCapacity: 4.5,
      wheelSize: "Standard",
      weight: 100
    },
    {
      name: "Scooter DAYUN 124CC",
      slug: "scooter-dayun-124cc",
      price: 6200,
      originalPrice: 6500,
      description: "Scooter DAYUN 124CC avec garantie 5000 KM",
      features: "Garantie 5000.Km\n4.TEMPS\nRefroidissement Air\n4 Vitesse\nType de Frein : Avant : disque / Arrière : Tambour\nMode de Fonctionnement du Frein : Avant et Arrière à la Main\nCapacité du Réservoir : 4.5 Litres\nConsommation du Carburant : 2.8 Litres\nVitesse Max : 100 Km-h\nSystème Alarme\nPneu : Tuplesse",
      categoryId: 17, // Moteur Thermique
      brandId: 20, // DAYUN
      featured: false,
      mainImage: "/uploads/products/default-product.png",
      galleryImages: [],
      inStock: true,
      quantity: 12,
      motorType: "4 temps",
      displacement: "124 cm³",
      cooling: "Refroidi par air",
      fuelSystem: "Carburateur",
      transmission: "4 vitesses",
      starter: "Électrique",
      brakes: "Disque avant / Tambour arrière",
      maxSpeed: 100,
      fuelCapacity: 4.5,
      fuelConsumption: 2.8,
      wheelSize: "Standard",
      weight: 110
    },
    {
      name: "ZIMOTA Sinus",
      slug: "zimota-sinus",
      price: 6800,
      originalPrice: 7200,
      description: "Scooter ZIMOTA Sinus avec monocylindre 4 temps",
      features: "Moteur monocylindre : 4 temps\nRefroidissement : A air\nCouple Maxi : 4.0 Nm-6500 tr-pm\nBatterie : 12V 7Ah\nDimensions (LxLxH) : 1900 X 685 X 1135 mm\nPoids À Sec : 112\nCapacité Du Réservoir : 6.2 Litres\nPneumatique (AV - AR) : 120-70-12 / 130-70-12\nSuspensions AV / AR : Fourche hydraulique / Amortisseur\nFreins AV / AR : Disque / Tambour",
      categoryId: 17, // Moteur Thermique
      brandId: 19, // ZIMOTA
      featured: true,
      mainImage: "/uploads/products/default-product.png",
      galleryImages: [],
      inStock: true,
      quantity: 7,
      motorType: "Monocylindre 4 temps",
      displacement: "125 cm³",
      cooling: "Refroidi par air",
      fuelSystem: "Carburateur",
      transmission: "Automatique",
      starter: "Électrique",
      brakes: "Disque avant / Tambour arrière",
      maxSpeed: 95,
      fuelCapacity: 6.2,
      wheelSize: "12 pouces",
      weight: 112
    },
    {
      name: "CORONE MOTORS NEO Électrique 2000W",
      slug: "corone-motors-neo-electrique-2000w",
      price: 8500,
      originalPrice: 9000,
      description: "Scooteur Électrique 2000 Watts avec une vitesse max de 60 Km/h",
      features: "Puissance : 2000 Watts\nVitesse Maximale : 60 Km-h\nEcran Digitale\nBatterie : 72V\nAutonomie : 100 Km\nType de frein (Avant - Arriére) : Disque",
      categoryId: 18, // Moteur Electrique
      brandId: 21, // CORONE MOTORS
      featured: true,
      mainImage: "/uploads/products/default-product.png",
      galleryImages: [],
      inStock: true,
      quantity: 5,
      motorType: "Électrique",
      transmission: "Automatique",
      brakes: "Disque avant / Disque arrière",
      maxSpeed: 60,
      wheelSize: "Standard",
      weight: 120
    },
    {
      name: "ZIMOTA Target 125",
      slug: "zimota-target-125",
      price: 6900,
      originalPrice: 7400,
      description: "Motocycle ZIMOTA Target 125 avec cylindrée 125 CC",
      features: "Cylindré 125 CC\n4 Temps\nReservoir : 3.8 Litres\nFreins AV - AR : Monodisque : ∅ 217 / Tambour : ∅ 130\nRefroidissement a air\nDimensions (LxLxH) : 1970x720x1110 mm",
      categoryId: 17, // Moteur Thermique
      brandId: 19, // ZIMOTA
      featured: false,
      mainImage: "/uploads/products/default-product.png",
      galleryImages: [],
      inStock: true,
      quantity: 8,
      motorType: "4 temps",
      displacement: "125 cm³",
      cooling: "Refroidi par air",
      fuelSystem: "Carburateur",
      transmission: "Manuelle",
      starter: "Électrique",
      brakes: "Monodisque / Tambour",
      maxSpeed: 100,
      fuelCapacity: 3.8,
      wheelSize: "Standard",
      weight: 115
    },
    {
      name: "FORZA DIAMANT",
      slug: "forza-diamant",
      price: 9500,
      originalPrice: 10000,
      description: "Scooter FORZA DIAMANT avec moteur monocylindre et double embrayages",
      features: "Type de moteur : Monocylindre\nDouble Embrayages\nPrise Usb Étanche\nPneu Tubeless\nPare Brise Spécifique\nAlarme\nRepose Pieds Larges\nFeu Led\nPossibilité De D'emmarge Avec Commande\nEcran digital",
      categoryId: 17, // Moteur Thermique
      brandId: 22, // FORZA
      featured: true,
      mainImage: "/uploads/products/default-product.png",
      galleryImages: [],
      inStock: true,
      quantity: 4,
      motorType: "Monocylindre 4 temps",
      displacement: "125 cm³",
      cooling: "Refroidi par air",
      fuelSystem: "Injection électronique",
      transmission: "Automatique",
      starter: "Électrique",
      brakes: "Disque avant / Disque arrière",
      maxSpeed: 110,
      fuelCapacity: 5.5,
      wheelSize: "13 pouces",
      weight: 130,
      dashboard: "Digital"
    },
    {
      name: "ZIMOTA KEE 109 CC",
      slug: "zimota-kee-109-cc",
      price: 5900,
      originalPrice: 6300,
      description: "Motocycle ZIMOTA KEE avec cylindrée 109 CC",
      features: "Moteur : Motocylindre 4 tps\nRefroidissement air\nCylindrée : 109 cm3\nPuissance Maximale : 5.0 @ 5.250\nBoite de vitesse : 4 vitesses\nType d'alimentation : Carburateur\nDimension (LxLxH) : 1950 x 685 x1120 mm\nRéservoir : 4,8 Litres\nFreins AV - AR : Monodisque 217 - Tambour 110\nPneumatique AV - AR : 2.50-17 / 2.75-17",
      categoryId: 17, // Moteur Thermique
      brandId: 19, // ZIMOTA
      featured: false,
      mainImage: "/uploads/products/default-product.png",
      galleryImages: [],
      inStock: true,
      quantity: 9,
      motorType: "Monocylindre 4 temps",
      displacement: "109 cm³",
      cooling: "Refroidi par air",
      fuelSystem: "Carburateur",
      transmission: "4 vitesses",
      starter: "Électrique",
      brakes: "Monodisque / Tambour",
      maxSpeed: 90,
      fuelCapacity: 4.8,
      wheelSize: "17 pouces",
      weight: 105
    },
    {
      name: "MOTOBIANCHI Électrique 2000W",
      slug: "motobianchi-electrique-2000w",
      price: 9800,
      originalPrice: 10500,
      description: "Motocycle Electrique MOTOBIANCHI avec batterie lithium d'origine américaine",
      features: "Puissance : 2000 Watts\nAutonomie : 60 Km\nDurée de charge : 8 Heures\nVitesse Maximale : 65 Km/h\nBatterie Lithium (Origine américain)\nNombre de rapport : x3\nLarge Jantes et pneus : 34 cm (anti glissants)\nAmortisseur avec gaz\nFreins avant et arrière avec disque\nRétroviseur : à gauche + droite\nCoffre avec serreur bloc - clé\nPlace pour charge batterie : 3 fiches + coffre spéciale pour la 2éme batterie\nFeux avant : LED\nSystème Alarme : anti vole",
      categoryId: 18, // Moteur Electrique
      brandId: 23, // MOTOBIANCHI
      featured: true,
      mainImage: "/uploads/products/default-product.png",
      galleryImages: [],
      inStock: true,
      quantity: 3,
      motorType: "Électrique",
      transmission: "Automatique",
      brakes: "Disque avant / Disque arrière",
      maxSpeed: 65,
      wheelSize: "34 cm",
      weight: 125,
      dashboard: "Digital"
    }
  ];

  try {
    console.log(`Tentative d'importation de ${motos.length} motos...`);

    for (const moto of motos) {
      console.log(`Importation de ${moto.name}...`);
      try {
        const product = await storage.createProduct(moto as InsertProduct);
        console.log(`✓ ${moto.name} importé avec succès (ID: ${product.id})`);
      } catch (error) {
        console.error(`✗ Erreur lors de l'importation de ${moto.name}:`, error);
      }
    }

    console.log("Importation terminée!");
  } catch (error) {
    console.error("Erreur globale lors de l'importation:", error);
  }
}

// Exécuter l'importation
importMotos();