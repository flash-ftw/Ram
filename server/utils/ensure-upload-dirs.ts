import fs from 'fs';
import path from 'path';

/**
 * Cette fonction garantit que tous les répertoires nécessaires pour les uploads existent
 */
export function ensureUploadDirectoriesExist() {
  const directories = [
    path.join(process.cwd(), 'public'),
    path.join(process.cwd(), 'public', 'uploads'),
    path.join(process.cwd(), 'public', 'uploads', 'products'),
    path.join(process.cwd(), 'public', 'uploads', 'brands'),
    path.join(process.cwd(), 'tmp')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Création du répertoire: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}