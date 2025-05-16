import fs from 'fs';
import path from 'path';

/**
 * Cette fonction garantit que tous les répertoires nécessaires pour les uploads existent
 * Compatible avec l'environnement Railway
 */
export function ensureUploadDirectoriesExist() {
  try {
    // Dans l'environnement de production (Railway), les répertoires doivent être créés différemment
    // Railway utilise /app comme répertoire racine en production
    const isProduction = process.env.NODE_ENV === 'production';
    const baseDir = isProduction ? '/app' : process.cwd();
    
    console.log(`Environnement: ${process.env.NODE_ENV}`);
    console.log(`Répertoire de base: ${baseDir}`);

    // Assurons-nous que le répertoire de base existe
    if (!fs.existsSync(baseDir) && !isProduction) {
      console.log(`Le répertoire de base n'existe pas mais ce n'est pas grave en production`);
    }

    // Définir les chemins relatifs à créer
    const directoryPaths = [
      'public',
      'public/uploads',
      'public/uploads/products',
      'public/uploads/brands',
      'tmp'
    ];

    // Créer chaque répertoire
    for (const relativePath of directoryPaths) {
      try {
        const absolutePath = path.join(baseDir, relativePath);
        console.log(`Vérification du répertoire: ${absolutePath}`);
        
        if (!fs.existsSync(absolutePath)) {
          console.log(`Création du répertoire: ${absolutePath}`);
          fs.mkdirSync(absolutePath, { recursive: true });
        }
      } catch (dirError) {
        console.error(`Erreur lors de la création du répertoire ${relativePath}:`, dirError);
        // Continuons avec les autres répertoires même si un échoue
      }
    }
    
    console.log('Processus de création des répertoires terminé');
  } catch (error) {
    console.error('Erreur générale lors de la création des répertoires:', error);
    // Ne pas faire échouer l'application si les répertoires ne peuvent pas être créés
  }
}
