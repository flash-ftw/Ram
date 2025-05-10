import { storage } from "./storage";

/**
 * Script de correction des descriptions et spécifications des motos
 */
async function updateMotos() {
  console.log("Démarrage des corrections pour les fiches motos...");

  const corrections = [
    {
      slug: "forza-diamant",
      features: "Type de moteur : Monocylindre\nDouble Embrayages\nPrise Usb Étanche\nPneu Tubeless\nPare Brise Spécifique\nAlarme\nRepose Pieds Larges\nFeu Led\nPossibilité De Démarrage Avec Commande\nEcran digital",
      description: "Scooter FORZA DIAMANT avec moteur monocylindre et double embrayages"
    },
    {
      slug: "cappucino-slc",
      features: "4 TEMPS\n4 Vitesses\nType de Frein : Avant : disque / Arrière : Tambour\nMode de Fonctionnement du Frein : Avant et Arrière à la Main\nCapacité du Réservoir : 4.5 Litres\nVitesse Max : 90 Km/h\nSystème d'Alarme\nPneu : Tubeless",
      description: "Scooter CAPPUCINO SLC 4 temps avec frein à disque avant"
    },
    {
      slug: "scooter-dayun-124cc",
      features: "Garantie 5000 Km\n4 TEMPS\nRefroidissement Air\n4 Vitesses\nType de Frein : Avant : disque / Arrière : Tambour\nMode de Fonctionnement du Frein : Avant et Arrière à la Main\nCapacité du Réservoir : 4.5 Litres\nConsommation du Carburant : 2.8 Litres\nVitesse Max : 100 Km/h\nSystème d'Alarme\nPneu : Tubeless",
      description: "Scooter DAYUN 124CC avec garantie 5000 KM"
    },
    {
      slug: "corone-motors-neo-electrique-2000w",
      features: "Puissance : 2000 Watts\nVitesse Maximale : 60 Km/h\nEcran Digital\nBatterie : 72V\nAutonomie : 100 Km\nType de frein (Avant - Arrière) : Disque",
      description: "Scooter Électrique 2000 Watts avec une vitesse max de 60 Km/h et une autonomie de 100 Km"
    },
    {
      slug: "zimota-kee-109-cc",
      features: "Moteur : Monocylindre 4 temps\nRefroidissement air\nCylindrée : 109 cm3\nPuissance Maximale : 5.0 @ 5.250\nBoite de vitesse : 4 vitesses\nType d'alimentation : Carburateur\nDimension (LxLxH) : 1950 x 685 x 1120 mm\nRéservoir : 4,8 Litres\nFreins AV - AR : Monodisque 217 - Tambour 110\nPneumatique AV - AR : 2.50-17 / 2.75-17",
      description: "Motocycle ZIMOTA KEE avec cylindrée 109 CC et refroidissement par air"
    },
    {
      slug: "motobianchi-electrique-2000w",
      features: "Puissance : 2000 Watts\nAutonomie : 60 Km\nDurée de charge : 8 Heures\nVitesse Maximale : 65 Km/h\nBatterie Lithium (Origine américaine)\nNombre de rapports : x3\nLarges Jantes et pneus : 34 cm (anti-glissants)\nAmortisseur avec gaz\nFreins avant et arrière à disque\nRétroviseurs : à gauche + droite\nCoffre avec serrure bloc-clé\nPlace pour charge batterie : 3 fiches + coffre spécial pour la 2ème batterie\nFeux avant : LED\nSystème d'alarme anti-vol",
      description: "Motocycle Électrique MOTOBIANCHI avec batterie lithium d'origine américaine et autonomie de 60 Km"
    },
    {
      slug: "zimota-target-125",
      features: "Cylindrée 125 CC\n4 Temps\nRéservoir : 3.8 Litres\nFreins AV - AR : Monodisque : ∅ 217 / Tambour : ∅ 130\nRefroidissement à air\nDimensions (LxLxH) : 1970 x 720 x 1110 mm",
      description: "Motocycle ZIMOTA Target 125 avec cylindrée 125 CC et freins à disque avant"
    },
    {
      slug: "zimota-sinus",
      features: "Moteur monocylindre : 4 temps\nRefroidissement : À air\nCouple Maxi : 4.0 Nm-6500 tr/min\nBatterie : 12V 7Ah\nDimensions (LxLxH) : 1900 x 685 x 1135 mm\nPoids À Sec : 112 kg\nCapacité Du Réservoir : 6.2 Litres\nPneumatique (AV - AR) : 120-70-12 / 130-70-12\nSuspensions AV / AR : Fourche hydraulique / Amortisseur\nFreins AV / AR : Disque / Tambour",
      description: "Scooter ZIMOTA Sinus avec monocylindre 4 temps et refroidissement par air"
    },
    {
      slug: "zimota-rks-125cc",
      features: "Moteur : 125 cm³\nMonocylindre : 4 temps\nRefroidissement : À air\nCapacité du Réservoir : 6 Litres\nCouple Maxi : 10.0 - 7000\nType d'alimentation : Carburateur\nPuissance maximale : 8.4 - 8.500\nFreins AV-AR : Monodisque 240 - Tambour 130\nPneumatique AV-AR: 90-90-17 / 110-80-17\nDimensions: 2040 x 780 x 1070 mm\nPoids: 117 Kg",
      description: "Motocycle ZIMOTA RKS avec moteur monocylindre 4 temps et refroidissement par air"
    },
    {
      slug: "senke-raptor-125cc",
      features: "Moteur : 125 cm³\nMonocylindre 4 temps\nRefroidissement : À air\nCapacité du Réservoir : 14 Litres\nVitesse Maximale : 120 km/h\nTransmission : 5 vitesses\nFreins à disque avant et arrière\nAdmission par carburateur\nEntraînement par chaîne\nEmpattement: 1380 mm\nDémarrage électrique\nDimensions : 2040 x 780 x 1100 mm",
      description: "Motocycle SENKE RAPTOR 125CC avec moteur 125 cm³ et freins à disque avant et arrière"
    }
  ];

  try {
    console.log(`Tentative de correction de ${corrections.length} fiches motos...`);

    for (const correction of corrections) {
      console.log(`Mise à jour de ${correction.slug}...`);
      try {
        // Récupérer d'abord le produit actuel
        const product = await storage.getProductBySlug(correction.slug);
        
        if (!product) {
          console.error(`✗ Produit non trouvé: ${correction.slug}`);
          continue;
        }
        
        // Mettre à jour le produit
        const result = await storage.updateProduct(product.id, {
          features: correction.features,
          description: correction.description
        });
        
        if (result) {
          console.log(`✓ ${correction.slug} mis à jour avec succès`);
        } else {
          console.error(`✗ Échec de la mise à jour de ${correction.slug}`);
        }
      } catch (error) {
        console.error(`✗ Erreur lors de la mise à jour de ${correction.slug}:`, error);
      }
    }

    console.log("Corrections terminées!");
  } catch (error) {
    console.error("Erreur globale lors des corrections:", error);
  }
}

// Exécuter les corrections
updateMotos();