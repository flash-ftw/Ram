import { db } from "./db";
import { brands, categories, products, InsertBrand, InsertCategory, InsertProduct } from "@shared/schema";
import { storage } from "./storage";

// Liste des marques internationales
const internationalBrands: Omit<InsertBrand, "id" | "createdAt">[] = [
  {
    name: "Honda",
    slug: "honda",
    logo: "/uploads/brands/honda-logo.png",
    description: "Honda est un constructeur japonais de motos, automobiles et d'équipements motorisés, connu pour sa fiabilité et son innovation.",
    website: "https://www.honda.com/"
  },
  {
    name: "Yamaha",
    slug: "yamaha",
    logo: "/uploads/brands/yamaha-logo.png",
    description: "Yamaha est un fabricant japonais de motos et de produits motorisés reconnu pour ses performances et sa qualité.",
    website: "https://www.yamaha-motor.com/"
  },
  {
    name: "Suzuki",
    slug: "suzuki",
    logo: "/uploads/brands/suzuki-logo.png",
    description: "Suzuki est un constructeur japonais de motos et d'automobiles réputé pour ses véhicules économiques et durables.",
    website: "https://www.suzuki.com/"
  },
  {
    name: "Kawasaki",
    slug: "kawasaki",
    logo: "/uploads/brands/kawasaki-logo.png",
    description: "Kawasaki est un fabricant japonais de motos sportives haute performance et de produits motorisés.",
    website: "https://www.kawasaki.com/"
  },
  {
    name: "Ducati",
    slug: "ducati",
    logo: "/uploads/brands/ducati-logo.png",
    description: "Ducati est un constructeur italien de motos sportives de luxe connu pour son design et ses performances.",
    website: "https://www.ducati.com/"
  },
  {
    name: "Aprilia",
    slug: "aprilia",
    logo: "/uploads/brands/aprilia-logo.png",
    description: "Aprilia est un fabricant italien de motos sportives et de scooters, célèbre pour ses technologies innovantes.",
    website: "https://www.aprilia.com/"
  },
  {
    name: "Harley-Davidson",
    slug: "harley-davidson",
    logo: "/uploads/brands/harley-davidson-logo.png",
    description: "Harley-Davidson est un constructeur américain de motos, célèbre pour ses cruisers et son héritage culturel.",
    website: "https://www.harley-davidson.com/"
  },
  {
    name: "Triumph",
    slug: "triumph",
    logo: "/uploads/brands/triumph-logo.png",
    description: "Triumph est un fabricant britannique de motos classiques et modernes connu pour son héritage et sa qualité.",
    website: "https://www.triumphmotorcycles.com/"
  },
  {
    name: "KTM",
    slug: "ktm",
    logo: "/uploads/brands/ktm-logo.png",
    description: "KTM est un constructeur autrichien de motos tout-terrain et sportives, reconnu pour ses performances.",
    website: "https://www.ktm.com/"
  },
  {
    name: "BMW Motorrad",
    slug: "bmw-motorrad",
    logo: "/uploads/brands/bmw-motorrad-logo.png",
    description: "BMW Motorrad est la division moto de BMW, fabricant allemand réputé pour ses motos de tourisme et ses innovations technologiques.",
    website: "https://www.bmw-motorrad.com/"
  },
  {
    name: "Vespa",
    slug: "vespa",
    logo: "/uploads/brands/vespa-logo.png",
    description: "Vespa est un fabricant italien de scooters iconiques, connu pour son design classique et son style intemporel.",
    website: "https://www.vespa.com/"
  },
  {
    name: "Piaggio",
    slug: "piaggio",
    logo: "/uploads/brands/piaggio-logo.png",
    description: "Piaggio est un constructeur italien de scooters et véhicules légers, propriétaire de marques comme Vespa et Aprilia.",
    website: "https://www.piaggio.com/"
  },
  {
    name: "Shoei",
    slug: "shoei",
    logo: "/uploads/brands/shoei-logo.png",
    description: "Shoei est un fabricant japonais de casques moto premium, reconnu pour sa qualité et sa sécurité.",
    website: "https://www.shoei.com/"
  },
  {
    name: "Arai",
    slug: "arai",
    logo: "/uploads/brands/arai-logo.png",
    description: "Arai est un fabricant japonais de casques haut de gamme, réputé pour sa fabrication artisanale et sa protection.",
    website: "https://www.araihelmet.com/"
  },
  {
    name: "AGV",
    slug: "agv",
    logo: "/uploads/brands/agv-logo.png",
    description: "AGV est un fabricant italien de casques de course et de sport, utilisé par de nombreux pilotes professionnels.",
    website: "https://www.agv.com/"
  },
  {
    name: "Alpinestars",
    slug: "alpinestars",
    logo: "/uploads/brands/alpinestars-logo.png",
    description: "Alpinestars est une marque italienne d'équipements et de vêtements de protection pour la moto et les sports mécaniques.",
    website: "https://www.alpinestars.com/"
  },
  {
    name: "Dainese",
    slug: "dainese",
    logo: "/uploads/brands/dainese-logo.png",
    description: "Dainese est un fabricant italien d'équipements de protection pour motocyclistes, connu pour ses innovations en matière de sécurité.",
    website: "https://www.dainese.com/"
  },
  {
    name: "Brembo",
    slug: "brembo",
    logo: "/uploads/brands/brembo-logo.png",
    description: "Brembo est un fabricant italien de systèmes de freinage haute performance pour motos et automobiles.",
    website: "https://www.brembo.com/"
  },
  {
    name: "Öhlins",
    slug: "ohlins",
    logo: "/uploads/brands/ohlins-logo.png",
    description: "Öhlins est un fabricant suédois de suspensions haute performance pour motos et véhicules de compétition.",
    website: "https://www.ohlins.com/"
  }
];

// Liste des catégories
const motoCategories: Omit<InsertCategory, "id" | "createdAt">[] = [
  {
    name: "Motos Sportives",
    slug: "motos-sportives",
    description: "Motos conçues pour la performance, la vitesse et l'agilité sur route.",
    image: "/uploads/categories/sportives.jpg"
  },
  {
    name: "Motos Tout-Terrain",
    slug: "motos-tout-terrain",
    description: "Motos conçues pour rouler hors des sentiers battus, sur des terrains difficiles.",
    image: "/uploads/categories/tout-terrain.jpg"
  },
  {
    name: "Scooters",
    slug: "scooters",
    description: "Véhicules motorisés à deux roues, compacts et pratiques pour la ville.",
    image: "/uploads/categories/scooters.jpg"
  },
  {
    name: "Motos de Tourisme",
    slug: "motos-de-tourisme",
    description: "Motos conçues pour le confort sur de longues distances.",
    image: "/uploads/categories/tourisme.jpg"
  },
  {
    name: "Motos Classiques",
    slug: "motos-classiques",
    description: "Motos au design vintage et classique, évoquant la tradition et l'héritage.",
    image: "/uploads/categories/classiques.jpg"
  },
  {
    name: "Motos Customs",
    slug: "motos-customs",
    description: "Motos personnalisées ou d'usine avec un style distinctif et une position de conduite détendue.",
    image: "/uploads/categories/customs.jpg"
  },
  {
    name: "Motos Routières",
    slug: "motos-routieres",
    description: "Motos polyvalentes adaptées à un usage quotidien sur route.",
    image: "/uploads/categories/routieres.jpg"
  },
  {
    name: "Motos Électriques",
    slug: "motos-electriques",
    description: "Motos propulsées par des moteurs électriques, écologiques et silencieuses.",
    image: "/uploads/categories/electriques.jpg"
  }
];

const accessoireCategories: Omit<InsertCategory, "id" | "createdAt">[] = [
  {
    name: "Casques",
    slug: "casques",
    description: "Équipement de protection essentiel pour la tête, disponible en différents styles et niveaux de protection.",
    image: "/uploads/categories/casques.jpg"
  },
  {
    name: "Vestes",
    slug: "vestes",
    description: "Vêtements de protection pour le haut du corps, avec des options pour toutes les saisons.",
    image: "/uploads/categories/vestes.jpg"
  },
  {
    name: "Gants",
    slug: "gants",
    description: "Protection pour les mains, offrant adhérence et sécurité.",
    image: "/uploads/categories/gants.jpg"
  },
  {
    name: "Pantalons",
    slug: "pantalons",
    description: "Protection pour le bas du corps, incluant des jeans renforcés et des pantalons techniques.",
    image: "/uploads/categories/pantalons.jpg"
  },
  {
    name: "Bottes",
    slug: "bottes",
    description: "Chaussures spécialisées offrant protection et adhérence pour la conduite moto.",
    image: "/uploads/categories/bottes.jpg"
  },
  {
    name: "Bagagerie",
    slug: "bagagerie",
    description: "Sacs, sacoches et valises conçus pour le transport sur moto.",
    image: "/uploads/categories/bagagerie.jpg"
  },
  {
    name: "Accessoires Moto",
    slug: "accessoires-moto",
    description: "Équipements additionnels pour personnaliser et améliorer votre moto.",
    image: "/uploads/categories/accessoires-moto.jpg"
  },
  {
    name: "Pièces Détachées",
    slug: "pieces-detachees",
    description: "Composants de remplacement et d'amélioration pour motos.",
    image: "/uploads/categories/pieces-detachees.jpg"
  },
  {
    name: "Équipement Pilote",
    slug: "equipement-pilote",
    description: "Équipements divers pour le confort et la sécurité du motard.",
    image: "/uploads/categories/equipement-pilote.jpg"
  },
  {
    name: "Entretien",
    slug: "entretien",
    description: "Produits pour le nettoyage et la maintenance de votre moto.",
    image: "/uploads/categories/entretien.jpg"
  }
];

// Fonction pour ajouter les marques
async function addBrands() {
  console.log("Ajout des marques internationales...");
  for (const brand of internationalBrands) {
    const existingBrand = await storage.getBrandBySlug(brand.slug);
    if (!existingBrand) {
      await storage.createBrand(brand);
      console.log(`Marque ajoutée: ${brand.name}`);
    } else {
      console.log(`La marque ${brand.name} existe déjà.`);
    }
  }
}

// Fonction pour ajouter les catégories
async function addCategories() {
  console.log("Ajout des catégories de motos...");
  for (const category of [...motoCategories, ...accessoireCategories]) {
    const existingCategory = await storage.getCategoryBySlug(category.slug);
    if (!existingCategory) {
      await storage.createCategory(category);
      console.log(`Catégorie ajoutée: ${category.name}`);
    } else {
      console.log(`La catégorie ${category.name} existe déjà.`);
    }
  }
}

// Main function to execute
async function seedDatabase() {
  try {
    await addBrands();
    await addCategories();
    console.log("Base de données ensemencée avec succès!");
  } catch (error) {
    console.error("Erreur lors de l'ensemencement de la base de données:", error);
  }
}

// Run the seeding process
seedDatabase();