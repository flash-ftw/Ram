import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// Fonction pour créer un répertoire s'il n'existe pas
async function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
    console.log(`Répertoire créé: ${dirPath}`);
  }
}

// Fonction pour télécharger une image
async function downloadImage(url: string, outputPath: string) {
  try {
    await execPromise(`curl -s -o "${outputPath}" "${url}"`);
    console.log(`Image téléchargée: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Erreur lors du téléchargement de ${url}:`, error);
    return false;
  }
}

// Fonction pour créer une image SVG de placeholder avec le texte spécifié
async function createPlaceholderSVG(text: string, outputPath: string) {
  const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="#555">${text}</text>
  </svg>`;
  
  await writeFile(outputPath, svgContent);
  console.log(`Image placeholder créée: ${outputPath}`);
}

// Fonction principale
async function downloadAllImages() {
  // Assurer que tous les répertoires nécessaires existent
  await ensureDirectoryExists('public/uploads/brands');
  await ensureDirectoryExists('public/uploads/categories');
  await ensureDirectoryExists('public/uploads/products');
  
  // Listes des marques, catégories et produits pour lesquels créer des placeholders
  const brands = [
    'honda', 'yamaha', 'suzuki', 'kawasaki', 'ducati', 'aprilia', 'harley-davidson', 
    'triumph', 'ktm', 'bmw-motorrad', 'vespa', 'piaggio', 'shoei', 'arai', 'agv', 
    'alpinestars', 'dainese', 'brembo', 'ohlins'
  ];
  
  const categories = [
    'motos-sportives', 'motos-tout-terrain', 'scooters', 'motos-de-tourisme', 
    'motos-classiques', 'motos-customs', 'motos-routieres', 'motos-electriques',
    'casques', 'vestes', 'gants', 'pantalons', 'bottes', 'bagagerie', 
    'accessoires-moto', 'pieces-detachees', 'equipement-pilote', 'entretien'
  ];
  
  const products = [
    'honda-cbr1000rr-r-fireblade', 'yamaha-yzf-r1', 'kawasaki-ninja-zx-10r', 
    'ktm-1290-super-duke-r', 'bmw-r-1250-gs-adventure', 'ducati-panigale-v4',
    'harley-davidson-road-king', 'triumph-bonneville-t120', 'vespa-primavera-125',
    'suzuki-gsx-r1000r', 'shoei-x-spirit-iii', 'arai-rx-7v', 'agv-pista-gp-rr',
    'dainese-racing-3-dair', 'alpinestars-gp-pro-v2-gants', 'alpinestars-supertech-r-bottes',
    'brembo-gp4-rx-etriers', 'ohlins-ttx-gp-amortisseur', 'dainese-smart-jacket'
  ];
  
  // Créer des placeholder SVG pour les logos de marque
  for (const brand of brands) {
    const logoPath = `public/uploads/brands/${brand}-logo.png`;
    await createPlaceholderSVG(`Logo ${brand}`, logoPath);
  }
  
  // Créer des placeholder SVG pour les images de catégorie
  for (const category of categories) {
    const imagePath = `public/uploads/categories/${category}.jpg`;
    await createPlaceholderSVG(`Catégorie ${category}`, imagePath);
  }
  
  // Créer des placeholder SVG pour les images de produit
  for (const product of products) {
    // Image principale
    const mainImagePath = `public/uploads/products/${product}.jpg`;
    await createPlaceholderSVG(`Produit ${product}`, mainImagePath);
    
    // Images de galerie
    for (let i = 1; i <= 3; i++) {
      const galleryImagePath = `public/uploads/products/${product}-${i}.jpg`;
      await createPlaceholderSVG(`${product} vue ${i}`, galleryImagePath);
    }
  }
  
  console.log("Toutes les images ont été créées avec succès!");
}

// Exécuter la fonction principale
downloadAllImages();