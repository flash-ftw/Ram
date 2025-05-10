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

async function seedMotorcycles() {
  console.log("Ajout des motos internationales...");

  // Récupérer les IDs des marques et catégories
  const hondaId = await getBrandIdBySlug("honda");
  const yamahaId = await getBrandIdBySlug("yamaha");
  const suzukiId = await getBrandIdBySlug("suzuki");
  const kawasakiId = await getBrandIdBySlug("kawasaki");
  const ktmId = await getBrandIdBySlug("ktm");
  const ducatiId = await getBrandIdBySlug("ducati");
  const harleyId = await getBrandIdBySlug("harley-davidson");
  const triumphId = await getBrandIdBySlug("triumph");
  const bmwId = await getBrandIdBySlug("bmw-motorrad");
  const vespaId = await getBrandIdBySlug("vespa");

  const sportivesId = await getCategoryIdBySlug("motos-sportives");
  const toutTerrainId = await getCategoryIdBySlug("motos-tout-terrain");
  const scootersId = await getCategoryIdBySlug("scooters");
  const tourismeId = await getCategoryIdBySlug("motos-de-tourisme");
  const classiquesId = await getCategoryIdBySlug("motos-classiques");
  const customsId = await getCategoryIdBySlug("motos-customs");
  const routieresId = await getCategoryIdBySlug("motos-routieres");
  const electriquesId = await getCategoryIdBySlug("motos-electriques");

  // Liste des motos internationales avec données précises
  const motorcycles: Omit<InsertProduct, "id" | "createdAt" | "updatedAt" | "inStock" | "quantity">[] = [
    // Honda
    {
      name: "Honda CBR1000RR-R Fireblade",
      slug: "honda-cbr1000rr-r-fireblade",
      description: "La nouvelle CBR1000RR-R Fireblade est directement inspirée des machines de compétition MotoGP. Avec son moteur 4 cylindres en ligne de 217 ch et son aérodynamisme avancé, elle représente le summum de la technologie Honda en matière de moto sportive.",
      price: 22000,
      originalPrice: 23500,
      features: "Moteur 4 cylindres en ligne, 999 cm³, 217 ch, Contrôle de traction électronique, Quickshifter, Modes de conduite multiples, Fourche Öhlins NPX, Étriers de frein Brembo Stylema, Aérodynamisme avancé",
      mainImage: "/uploads/products/honda-cbr1000rr-r.jpg",
      galleryImages: [
        "/uploads/products/honda-cbr1000rr-r-1.jpg",
        "/uploads/products/honda-cbr1000rr-r-2.jpg",
        "/uploads/products/honda-cbr1000rr-r-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: hondaId,
      categoryId: sportivesId,
      motorType: "4 temps",
      displacement: "999cc",
      cooling: "Refroidi par liquide",
      fuelSystem: "Injection électronique",
      transmission: "Manuelle",
      starter: "Électrique",
      brakes: "Disque (avant et arrière)",
      frontSuspension: "Fourche télescopique inversée Öhlins NPX",
      rearSuspension: "Mono-amortisseur Öhlins TTX36",
      frontTire: "120/70 ZR17",
      rearTire: "200/55 ZR17",
      wheelSize: "17 pouces",
      seatHeight: 830,
      weightDry: 201,
      fuelCapacity: 16.5,
      consumption: 6.2,
      maxSpeed: 299,
      acceleration: 2.8,
      weight: 201
    },
    // Yamaha
    {
      name: "Yamaha YZF-R1",
      slug: "yamaha-yzf-r1",
      description: "La Yamaha YZF-R1 est une moto de course homologuée pour la route, développée avec les technologies issues du MotoGP. Son moteur crossplane de 998 cm³ délivre une puissance impressionnante avec un caractère unique.",
      price: 19500,
      originalPrice: 20000,
      features: "Moteur 4 cylindres crossplane, 998 cm³, 200 ch, Contrôle électronique complet, IMU 6 axes, Quickshifter, Launch Control, Aérodynamisme optimisé, Étriers monobloc",
      mainImage: "/uploads/products/yamaha-r1.jpg",
      galleryImages: [
        "/uploads/products/yamaha-r1-1.jpg",
        "/uploads/products/yamaha-r1-2.jpg",
        "/uploads/products/yamaha-r1-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: yamahaId,
      categoryId: sportivesId,
      motorType: "4 temps",
      displacement: "998cc",
      cooling: "Refroidi par liquide",
      fuelSystem: "Injection électronique",
      transmission: "Manuelle",
      starter: "Électrique",
      brakes: "Disque (avant et arrière)",
      frontSuspension: "Fourche KYB inversée",
      rearSuspension: "Mono-amortisseur KYB",
      frontTire: "120/70 ZR17",
      rearTire: "190/55 ZR17",
      wheelSize: "17 pouces",
      seatHeight: 855,
      weightDry: 201,
      fuelCapacity: 17,
      consumption: 7.2,
      maxSpeed: 299,
      acceleration: 2.9,
      weight: 201
    },
    // Kawasaki
    {
      name: "Kawasaki Ninja ZX-10R",
      slug: "kawasaki-ninja-zx-10r",
      description: "Directement issue de l'expérience en championnat du monde Superbike, la Ninja ZX-10R incarne la philosophie 'la piste d'abord' de Kawasaki. Elle offre des performances exceptionnelles avec un niveau de contrôle élevé.",
      price: 18500,
      originalPrice: 19000,
      features: "Moteur 4 cylindres en ligne, 998 cm³, 203 ch, Aérodynamisme inspiré MotoGP, Contrôle de traction S-KTRC, Modes de conduite, Quickshifter, Launch control, Suspension Showa",
      mainImage: "/uploads/products/kawasaki-zx10r.jpg",
      galleryImages: [
        "/uploads/products/kawasaki-zx10r-1.jpg",
        "/uploads/products/kawasaki-zx10r-2.jpg",
        "/uploads/products/kawasaki-zx10r-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: kawasakiId,
      categoryId: sportivesId,
      motorType: "4 temps",
      displacement: "998cc",
      cooling: "Refroidi par liquide",
      fuelSystem: "Injection électronique",
      transmission: "Manuelle",
      starter: "Électrique",
      brakes: "Disque (avant et arrière)",
      frontSuspension: "Fourche Showa BFF inversée",
      rearSuspension: "Mono-amortisseur Showa BFRC",
      frontTire: "120/70 ZR17",
      rearTire: "190/55 ZR17",
      wheelSize: "17 pouces",
      seatHeight: 835,
      weightDry: 207,
      fuelCapacity: 17,
      consumption: 7.0,
      maxSpeed: 299,
      acceleration: 2.9,
      weight: 207
    },
    // KTM
    {
      name: "KTM 1290 Super Duke R",
      slug: "ktm-1290-super-duke-r",
      description: "Surnommée 'The Beast', la KTM 1290 Super Duke R est un roadster extrême qui combine puissance brute et agilité surprenante. Son moteur V-twin LC8 de 1301 cm³ en fait une des motos naked les plus puissantes du marché.",
      price: 19000,
      originalPrice: 19500,
      features: "Moteur V-twin LC8, 1301 cm³, 180 ch, 140 Nm, Châssis tubulaire en acier chromoly, Fourche WP APEX, Électronique complète, Modes de conduite, Écran TFT 5 pouces",
      mainImage: "/uploads/products/ktm-superduke.jpg",
      galleryImages: [
        "/uploads/products/ktm-superduke-1.jpg",
        "/uploads/products/ktm-superduke-2.jpg",
        "/uploads/products/ktm-superduke-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: ktmId,
      categoryId: routieresId,
      motorType: "4 temps",
      displacement: "1301cc",
      cooling: "Refroidi par liquide",
      fuelSystem: "Injection électronique",
      transmission: "Manuelle",
      starter: "Électrique",
      brakes: "Disque (avant et arrière)",
      frontSuspension: "Fourche WP APEX",
      rearSuspension: "Mono-amortisseur WP APEX",
      frontTire: "120/70 ZR17",
      rearTire: "200/55 ZR17",
      wheelSize: "17 pouces",
      seatHeight: 835,
      weightDry: 189,
      fuelCapacity: 16,
      consumption: 7.8,
      maxSpeed: 286,
      acceleration: 2.6,
      weight: 189
    },
    // BMW
    {
      name: "BMW R 1250 GS Adventure",
      slug: "bmw-r-1250-gs-adventure",
      description: "La BMW R 1250 GS Adventure est la référence des motos de voyage tout-terrain. Son moteur boxer à distribution variable ShiftCam lui confère à la fois puissance et souplesse, tandis que son équipement premium en fait une machine parfaite pour les longs voyages.",
      price: 21500,
      originalPrice: 22000,
      features: "Moteur boxer 2 cylindres ShiftCam, 1254 cm³, 136 ch, Réservoir 30L, Modes de conduite, Suspension électronique ESA, Contrôle de traction ASC, Protection tout-terrain renforcée, Système de navigation",
      mainImage: "/uploads/products/bmw-r1250gs.jpg",
      galleryImages: [
        "/uploads/products/bmw-r1250gs-1.jpg",
        "/uploads/products/bmw-r1250gs-2.jpg",
        "/uploads/products/bmw-r1250gs-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: bmwId,
      categoryId: tourismeId,
      motorType: "4 temps",
      displacement: "1254cc",
      cooling: "Refroidi par air/liquide",
      fuelSystem: "Injection électronique",
      transmission: "Manuelle",
      starter: "Électrique",
      brakes: "Disque (avant et arrière)",
      frontSuspension: "Telelever BMW",
      rearSuspension: "Paralever BMW",
      frontTire: "120/70 R19",
      rearTire: "170/60 R17",
      wheelSize: "19/17 pouces",
      seatHeight: 890,
      weightDry: 268,
      fuelCapacity: 30,
      consumption: 4.75,
      maxSpeed: 219,
      acceleration: 3.6,
      weight: 268
    },
    // Ducati
    {
      name: "Ducati Panigale V4",
      slug: "ducati-panigale-v4",
      description: "La Ducati Panigale V4 représente l'essence même de la moto sportive italienne. Son moteur V4 Desmosedici Stradale dérivé de la MotoGP offre des performances exceptionnelles dans un cadre ultraléger.",
      price: 24500,
      originalPrice: 25500,
      features: "Moteur V4 Desmosedici Stradale, 1103 cm³, 214 ch, Cadre 'Front Frame', Aérodynamisme avancé, Électronique Ducati de dernière génération, Suspensions Öhlins, Freins Brembo Stylema",
      mainImage: "/uploads/products/ducati-panigale.jpg",
      galleryImages: [
        "/uploads/products/ducati-panigale-1.jpg",
        "/uploads/products/ducati-panigale-2.jpg",
        "/uploads/products/ducati-panigale-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: ducatiId,
      categoryId: sportivesId,
      motorType: "4 temps",
      displacement: "1103cc",
      cooling: "Refroidi par liquide",
      fuelSystem: "Injection électronique",
      transmission: "Manuelle",
      starter: "Électrique",
      brakes: "Disque (avant et arrière)",
      frontSuspension: "Fourche Öhlins NIX30",
      rearSuspension: "Mono-amortisseur Öhlins TTX36",
      frontTire: "120/70 ZR17",
      rearTire: "200/60 ZR17",
      wheelSize: "17 pouces",
      seatHeight: 830,
      weightDry: 175,
      fuelCapacity: 16,
      consumption: 8.0,
      maxSpeed: 299,
      acceleration: 2.6,
      weight: 198
    },
    // Harley Davidson
    {
      name: "Harley-Davidson Road King",
      slug: "harley-davidson-road-king",
      description: "La Road King incarne le grand tourisme à l'américaine. Équipée du puissant moteur Milwaukee-Eight, elle offre une expérience de cruising incomparable avec un mélange parfait de style classique et de confort moderne.",
      price: 22500,
      originalPrice: 23000,
      features: "Moteur Milwaukee-Eight 107, 1745 cm³, Pare-brise amovible, Selle confortable, Sacoches rigides amovibles, Éclairage LED, Système de freinage Reflex Linked Brembo, Suspension arrière réglable",
      mainImage: "/uploads/products/harley-roadking.jpg",
      galleryImages: [
        "/uploads/products/harley-roadking-1.jpg",
        "/uploads/products/harley-roadking-2.jpg",
        "/uploads/products/harley-roadking-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: harleyId,
      categoryId: customsId,
      motorType: "4 temps",
      displacement: "1745cc",
      cooling: "Refroidi par air",
      fuelSystem: "Injection électronique",
      transmission: "Manuelle",
      starter: "Électrique",
      brakes: "Disque (avant et arrière)",
      frontSuspension: "Fourche télescopique",
      rearSuspension: "Amortisseurs réglables",
      frontTire: "130/90 B16",
      rearTire: "180/65 B16",
      wheelSize: "16 pouces",
      seatHeight: 705,
      weightDry: 362,
      fuelCapacity: 22.7,
      consumption: 5.6,
      maxSpeed: 180,
      acceleration: 4.5,
      weight: 362
    },
    // Triumph
    {
      name: "Triumph Bonneville T120",
      slug: "triumph-bonneville-t120",
      description: "La Triumph Bonneville T120 est l'incarnation moderne d'une icône motocycliste. Elle conserve l'esthétique classique de la Bonneville originale tout en intégrant une technologie moderne pour une expérience de conduite améliorée.",
      price: 14500,
      originalPrice: 15000,
      features: "Moteur bicylindre parallèle, 1200 cm³, 80 ch, Style néo-rétro authentique, Contrôle de traction, Accélérateur ride-by-wire, Double disques de frein avant, ABS, Modes de conduite",
      mainImage: "/uploads/products/triumph-bonneville.jpg",
      galleryImages: [
        "/uploads/products/triumph-bonneville-1.jpg",
        "/uploads/products/triumph-bonneville-2.jpg",
        "/uploads/products/triumph-bonneville-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: triumphId,
      categoryId: classiquesId,
      motorType: "4 temps",
      displacement: "1200cc",
      cooling: "Refroidi par liquide",
      fuelSystem: "Injection électronique",
      transmission: "Manuelle",
      starter: "Électrique",
      brakes: "Disque (avant et arrière)",
      frontSuspension: "Fourche télescopique",
      rearSuspension: "Double amortisseurs",
      frontTire: "100/90-18",
      rearTire: "150/70 R17",
      wheelSize: "18/17 pouces",
      seatHeight: 785,
      weightDry: 224,
      fuelCapacity: 14.5,
      consumption: 4.5,
      maxSpeed: 180,
      acceleration: 4.0,
      weight: 224
    },
    // Vespa
    {
      name: "Vespa Primavera 125",
      slug: "vespa-primavera-125",
      description: "La Vespa Primavera perpétue la légende du scooter italien le plus célèbre au monde. Compacte, élégante et maniable, elle est parfaite pour naviguer en ville avec style.",
      price: 4500,
      originalPrice: 4700,
      features: "Moteur 4 temps i-Get, 125 cm³, Démarrage électrique, Freinage ABS, Port USB, Tablier avant protecteur, Design iconique, Selle biplace confortable",
      mainImage: "/uploads/products/vespa-primavera.jpg",
      galleryImages: [
        "/uploads/products/vespa-primavera-1.jpg",
        "/uploads/products/vespa-primavera-2.jpg",
        "/uploads/products/vespa-primavera-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: vespaId,
      categoryId: scootersId,
      motorType: "4 temps",
      displacement: "125cc",
      cooling: "Refroidi par air",
      fuelSystem: "Injection électronique",
      transmission: "Automatique (CVT)",
      starter: "Électrique",
      brakes: "Disque (avant) / Tambour (arrière)",
      frontSuspension: "Monobras avec amortisseur",
      rearSuspension: "Amortisseur hydraulique",
      frontTire: "110/70-12",
      rearTire: "120/70-12",
      wheelSize: "12 pouces",
      seatHeight: 790,
      weightDry: 115,
      fuelCapacity: 8,
      consumption: 2.5,
      maxSpeed: 95,
      acceleration: 9.0,
      weight: 115
    },
    // Suzuki
    {
      name: "Suzuki GSX-R1000R",
      slug: "suzuki-gsx-r1000r",
      description: "La Suzuki GSX-R1000R représente l'apogée de la technologie sportive de Suzuki. Développée avec l'expérience acquise en MotoGP, elle offre des performances de haut niveau sur route comme sur circuit.",
      price: 19000,
      originalPrice: 19500,
      features: "Moteur 4 cylindres en ligne, 999.8 cm³, 202 ch, Système SR-VVT, Contrôle de traction Motion Track, Quickshifter bidirectionnel, Launch Control, ABS en virage, Suspensions Showa haut de gamme",
      mainImage: "/uploads/products/suzuki-gsxr1000.jpg",
      galleryImages: [
        "/uploads/products/suzuki-gsxr1000-1.jpg",
        "/uploads/products/suzuki-gsxr1000-2.jpg",
        "/uploads/products/suzuki-gsxr1000-3.jpg"
      ],
      featured: true,
      hidden: false,
      brandId: suzukiId,
      categoryId: sportivesId,
      motorType: "4 temps",
      displacement: "999cc",
      cooling: "Refroidi par liquide",
      fuelSystem: "Injection électronique",
      transmission: "Manuelle",
      starter: "Électrique",
      brakes: "Disque (avant et arrière)",
      frontSuspension: "Fourche Showa BPF inversée",
      rearSuspension: "Mono-amortisseur BFRC Lite",
      frontTire: "120/70 ZR17",
      rearTire: "190/55 ZR17",
      wheelSize: "17 pouces",
      seatHeight: 825,
      weightDry: 203,
      fuelCapacity: 16,
      consumption: 7.1,
      maxSpeed: 299,
      acceleration: 3.0,
      weight: 203
    }
  ];

  // Ajout des motos à la base de données
  for (const motorcycle of motorcycles) {
    const existing = await storage.getProductBySlug(motorcycle.slug);
    if (!existing) {
      await storage.createProduct(motorcycle);
      console.log(`Moto ajoutée: ${motorcycle.name}`);
    } else {
      console.log(`La moto ${motorcycle.name} existe déjà.`);
    }
  }
}

// Fonction principale
async function seedMotoProducts() {
  try {
    await seedMotorcycles();
    console.log("Produits motos ajoutés avec succès!");
  } catch (error) {
    console.error("Erreur lors de l'ajout des produits motos:", error);
  }
}

// Exécuter la fonction
seedMotoProducts();