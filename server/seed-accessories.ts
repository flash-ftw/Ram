import { InsertProduct } from "@shared/schema";
import { storage } from "./storage";

async function getBrandIdBySlug(slug: string): Promise<number | null> {
  const brand = await storage.getBrandBySlug(slug);
  return brand ? brand.id : null;
}

async function getCategoryIdBySlug(slug: string): Promise<number | null> {
  const category = await storage.getCategoryBySlug(slug);
  return category ? category.id : null;
}

async function seedAccessories() {
  console.log("Ajout des accessoires et casques...");

  // Récupérer les IDs des marques et catégories
  const shoeiId = await getBrandIdBySlug("shoei");
  const araiId = await getBrandIdBySlug("arai");
  const agvId = await getBrandIdBySlug("agv");
  const alpinestarsId = await getBrandIdBySlug("alpinestars");
  const daineseId = await getBrandIdBySlug("dainese");
  const bremboId = await getBrandIdBySlug("brembo");
  const ohlinsId = await getBrandIdBySlug("ohlins");

  const casquesId = await getCategoryIdBySlug("casques");
  const vestesId = await getCategoryIdBySlug("vestes");
  const gantsId = await getCategoryIdBySlug("gants");
  const bottesId = await getCategoryIdBySlug("bottes");
  const piecesId = await getCategoryIdBySlug("pieces-detachees");
  const accessoiresId = await getCategoryIdBySlug("accessoires-moto");

  // Liste des accessoires avec données précises
  const accessories: Omit<InsertProduct, "id" | "createdAt" | "updatedAt" | "inStock" | "quantity">[] = [
    // Casques
    {
      name: "Shoei X-Spirit III",
      slug: "shoei-x-spirit-iii",
      description: "Le Shoei X-Spirit III est un casque de course haut de gamme conçu pour les performances sur circuit et la sécurité maximale. Adopté par de nombreux pilotes professionnels, il offre un aérodynamisme avancé et une protection supérieure.",
      price: 769,
      originalPrice: 799,
      features: "Structure AIM+ multi-composite, Aérodynamisme de course, Système CWR-F2P avec Pinlock, E.Q.R.S. (système de secours), 6 entrées d'air et 6 extracteurs, 5 tailles de calottes, Intérieur entièrement démontable et lavable, Homologation ECE R 22-05",
      mainImage: "/uploads/products/shoei-xspirit.jpg",
      galleryImages: [
        "/uploads/products/shoei-xspirit-1.jpg",
        "/uploads/products/shoei-xspirit-2.jpg",
        "/uploads/products/shoei-xspirit-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: shoeiId,
      categoryId: casquesId,
      motorType: null,
      displacement: null,
      cooling: null,
      fuelSystem: null,
      transmission: null,
      starter: null,
      brakes: null,
      frontSuspension: null,
      rearSuspension: null,
      frontTire: null,
      rearTire: null,
      wheelSize: null,
      seatHeight: null,
      weightDry: null,
      fuelCapacity: null,
      consumption: null,
      maxSpeed: null,
      acceleration: null,
      weight: 1420
    },
    {
      name: "Arai RX-7V",
      slug: "arai-rx-7v",
      description: "L'Arai RX-7V est le casque premium de la marque japonaise, offrant une construction artisanale exceptionnelle et une protection supérieure. Sa coque PB-SNC2 offre résistance et légèreté.",
      price: 849,
      originalPrice: 899,
      features: "Coque PB-SNC2, Système de ventilation avancé, Écran VAS avec champ de vision élargi, Système d'urgence pour retrait de coussinets, Intérieur Eco-Pure antimicrobien, Homologation ECE R 22-05, Fabriqué à la main au Japon",
      mainImage: "/uploads/products/arai-rx7v.jpg",
      galleryImages: [
        "/uploads/products/arai-rx7v-1.jpg",
        "/uploads/products/arai-rx7v-2.jpg",
        "/uploads/products/arai-rx7v-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: araiId,
      categoryId: casquesId,
      motorType: null,
      displacement: null,
      cooling: null,
      fuelSystem: null,
      transmission: null,
      starter: null,
      brakes: null,
      frontSuspension: null,
      rearSuspension: null,
      frontTire: null,
      rearTire: null,
      wheelSize: null,
      seatHeight: null,
      weightDry: null,
      fuelCapacity: null,
      consumption: null,
      maxSpeed: null,
      acceleration: null,
      weight: 1500
    },
    {
      name: "AGV Pista GP RR",
      slug: "agv-pista-gp-rr",
      description: "L'AGV Pista GP RR est le casque de course ultime développé avec l'expertise de pilotes MotoGP comme Valentino Rossi. Construit en carbone 100%, il offre légèreté et résistance maximales pour la piste.",
      price: 1299,
      originalPrice: 1399,
      features: "Structure 100% carbone, Profil aérodynamique testé en soufflerie, Système de ventilation intégré, Intérieur démontable et lavable, Visière Race 5mm anti-rayures et anti-buée, Système de déshydratation, Hydration system, Homologation FIM Racing",
      mainImage: "/uploads/products/agv-pistagp.jpg",
      galleryImages: [
        "/uploads/products/agv-pistagp-1.jpg",
        "/uploads/products/agv-pistagp-2.jpg",
        "/uploads/products/agv-pistagp-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: agvId,
      categoryId: casquesId,
      motorType: null,
      displacement: null,
      cooling: null,
      fuelSystem: null,
      transmission: null,
      starter: null,
      brakes: null,
      frontSuspension: null,
      rearSuspension: null,
      frontTire: null,
      rearTire: null,
      wheelSize: null,
      seatHeight: null,
      weightDry: null,
      fuelCapacity: null,
      consumption: null,
      maxSpeed: null,
      acceleration: null,
      weight: 1450
    },
    // Équipements
    {
      name: "Dainese Racing 3 D-Air",
      slug: "dainese-racing-3-dair",
      description: "La combinaison Dainese Racing 3 D-Air intègre un système d'airbag électronique qui offre une protection inégalée pour les motards. Fabriquée en cuir de kangaroo premium, elle offre résistance et flexibilité.",
      price: 2499,
      originalPrice: 2699,
      features: "Cuir de kangaroo premium, Système d'airbag D-Air intégré, Protection composite aux épaules, coudes et genoux, Bosse aérodynamique, Panneaux élastiques S1, Doublure en micro-élasthanne, Certification CE - Cat. II - 89/686/EEC",
      mainImage: "/uploads/products/dainese-racing3.jpg",
      galleryImages: [
        "/uploads/products/dainese-racing3-1.jpg",
        "/uploads/products/dainese-racing3-2.jpg",
        "/uploads/products/dainese-racing3-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: daineseId,
      categoryId: vestesId,
      motorType: null,
      displacement: null,
      cooling: null,
      fuelSystem: null,
      transmission: null,
      starter: null,
      brakes: null,
      frontSuspension: null,
      rearSuspension: null,
      frontTire: null,
      rearTire: null,
      wheelSize: null,
      seatHeight: null,
      weightDry: null,
      fuelCapacity: null,
      consumption: null,
      maxSpeed: null,
      acceleration: null,
      weight: 3500
    },
    {
      name: "Alpinestars GP Pro v2 Gants",
      slug: "alpinestars-gp-pro-v2-gants",
      description: "Les gants Alpinestars GP Pro v2 sont conçus pour la course et offrent une protection et une dextérité optimales. Ils combinent cuir premium et matériaux techniques avancés pour des performances de haut niveau.",
      price: 239,
      originalPrice: 249,
      features: "Cuir de chèvre pleine fleur, Protection en carbone et polymère, Doigts pré-courbés pour réduire la fatigue, Renfort au niveau de la paume, Zones extensibles en accordéon, Fermeture double poignet, Compatibles écrans tactiles, Certification CE niveau 1 KP",
      mainImage: "/uploads/products/alpinestars-gppro.jpg",
      galleryImages: [
        "/uploads/products/alpinestars-gppro-1.jpg",
        "/uploads/products/alpinestars-gppro-2.jpg",
        "/uploads/products/alpinestars-gppro-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: alpinestarsId,
      categoryId: gantsId,
      motorType: null,
      displacement: null,
      cooling: null,
      fuelSystem: null,
      transmission: null,
      starter: null,
      brakes: null,
      frontSuspension: null,
      rearSuspension: null,
      frontTire: null,
      rearTire: null,
      wheelSize: null,
      seatHeight: null,
      weightDry: null,
      fuelCapacity: null,
      consumption: null,
      maxSpeed: null,
      acceleration: null,
      weight: 350
    },
    {
      name: "Alpinestars Supertech R Bottes",
      slug: "alpinestars-supertech-r-bottes",
      description: "Les bottes Alpinestars Supertech R sont utilisées par de nombreux pilotes MotoGP. Elles offrent une protection supérieure avec une flexibilité optimisée pour la performance sur circuit.",
      price: 459,
      originalPrice: 499,
      features: "Microfibre légère et résistante, Système de flexion contrôlée, Protection composite innovante, Semelle en caoutchouc haute adhérence, Curseur de talon remplaçable, Fermeture à zip et velcro, Protection interne de la cheville, Certification CE",
      mainImage: "/uploads/products/alpinestars-supertech.jpg",
      galleryImages: [
        "/uploads/products/alpinestars-supertech-1.jpg",
        "/uploads/products/alpinestars-supertech-2.jpg",
        "/uploads/products/alpinestars-supertech-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: alpinestarsId,
      categoryId: bottesId,
      motorType: null,
      displacement: null,
      cooling: null,
      fuelSystem: null,
      transmission: null,
      starter: null,
      brakes: null,
      frontSuspension: null,
      rearSuspension: null,
      frontTire: null,
      rearTire: null,
      wheelSize: null,
      seatHeight: null,
      weightDry: null,
      fuelCapacity: null,
      consumption: null,
      maxSpeed: null,
      acceleration: null,
      weight: 2100
    },
    // Pièces de performance
    {
      name: "Brembo GP4-RX Étriers de frein",
      slug: "brembo-gp4-rx-etriers",
      description: "Les étriers de frein Brembo GP4-RX sont des étriers monobloc conçus pour les motos sportives hautes performances. Ils offrent une puissance de freinage exceptionnelle avec un contrôle précis.",
      price: 999,
      originalPrice: 1099,
      features: "Construction monobloc en aluminium, 4 pistons de diamètre différentiel (30/34mm), Finition nickelée anti-corrosion, Système de montage radial, Adaptation rapide aux disques, Corps extra-rigide, Performance accrue au freinage",
      mainImage: "/uploads/products/brembo-gp4rx.jpg",
      galleryImages: [
        "/uploads/products/brembo-gp4rx-1.jpg",
        "/uploads/products/brembo-gp4rx-2.jpg",
        "/uploads/products/brembo-gp4rx-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: bremboId,
      categoryId: piecesId,
      motorType: null,
      displacement: null,
      cooling: null,
      fuelSystem: null,
      transmission: null,
      starter: null,
      brakes: null,
      frontSuspension: null,
      rearSuspension: null,
      frontTire: null,
      rearTire: null,
      wheelSize: null,
      seatHeight: null,
      weightDry: null,
      fuelCapacity: null,
      consumption: null,
      maxSpeed: null,
      acceleration: null,
      weight: 960
    },
    {
      name: "Öhlins TTX GP Amortisseur",
      slug: "ohlins-ttx-gp-amortisseur",
      description: "L'amortisseur Öhlins TTX GP représente la technologie de pointe en matière de suspension moto. Développé en compétition, il offre un réglage précis et des performances exceptionnelles.",
      price: 1159,
      originalPrice: 1199,
      features: "Technologie TTX (Twin Tube) avancée, Réglages séparés de compression et détente, Construction en aluminium de haute qualité, Réservoir intégré, Ajustement en hauteur, Précharge de ressort réglable, Conçu pour un usage sur circuit",
      mainImage: "/uploads/products/ohlins-ttxgp.jpg",
      galleryImages: [
        "/uploads/products/ohlins-ttxgp-1.jpg",
        "/uploads/products/ohlins-ttxgp-2.jpg",
        "/uploads/products/ohlins-ttxgp-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: ohlinsId,
      categoryId: piecesId,
      motorType: null,
      displacement: null,
      cooling: null,
      fuelSystem: null,
      transmission: null,
      starter: null,
      brakes: null,
      frontSuspension: null,
      rearSuspension: null,
      frontTire: null,
      rearTire: null,
      wheelSize: null,
      seatHeight: null,
      weightDry: null,
      fuelCapacity: null,
      consumption: null,
      maxSpeed: null,
      acceleration: null,
      weight: 2300
    },
    {
      name: "Dainese Smart Jacket",
      slug: "dainese-smart-jacket",
      description: "La Dainese Smart Jacket est un gilet avec airbag autonome qui peut être porté sous ou sur n'importe quelle veste. Il offre une protection D-air® de niveau 2 avec 7 capteurs qui analysent les données 1000 fois par seconde.",
      price: 699,
      originalPrice: 729,
      features: "Airbag D-air® technologie, Autonomie batterie 26 heures, Batterie rechargeable USB, Protection thorax et dos, Matériau Cordura® 600D résistant, Sans fils ni connexions, Utilisable avec tout type de vêtement, Certification CE",
      mainImage: "/uploads/products/dainese-smartjacket.jpg",
      galleryImages: [
        "/uploads/products/dainese-smartjacket-1.jpg",
        "/uploads/products/dainese-smartjacket-2.jpg",
        "/uploads/products/dainese-smartjacket-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: daineseId,
      categoryId: accessoiresId,
      motorType: null,
      displacement: null,
      cooling: null,
      fuelSystem: null,
      transmission: null,
      starter: null,
      brakes: null,
      frontSuspension: null,
      rearSuspension: null,
      frontTire: null,
      rearTire: null,
      wheelSize: null,
      seatHeight: null,
      weightDry: null,
      fuelCapacity: null,
      consumption: null,
      maxSpeed: null,
      acceleration: null,
      weight: 650
    }
  ];

  // Ajout des accessoires à la base de données
  for (const accessory of accessories) {
    const existing = await storage.getProductBySlug(accessory.slug);
    if (!existing) {
      await storage.createProduct(accessory);
      console.log(`Accessoire ajouté: ${accessory.name}`);
    } else {
      console.log(`L'accessoire ${accessory.name} existe déjà.`);
    }
  }
}

// Fonction principale
async function seedAccessoryProducts() {
  try {
    await seedAccessories();
    console.log("Accessoires ajoutés avec succès!");
  } catch (error) {
    console.error("Erreur lors de l'ajout des accessoires:", error);
  }
}

// Exécuter la fonction
seedAccessoryProducts();