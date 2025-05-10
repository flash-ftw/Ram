import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function runScript(scriptPath: string): Promise<void> {
  try {
    console.log(`Exécution de ${scriptPath}...`);
    const { stdout, stderr } = await execPromise(`npx tsx ${scriptPath}`);
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
  } catch (error) {
    console.error(`Erreur lors de l'exécution de ${scriptPath}:`, error);
    throw error;
  }
}

async function seedAll() {
  try {
    // Exécuter les scripts dans l'ordre
    await runScript('server/seed-products.ts'); // D'abord les marques et catégories
    await runScript('server/seed-moto-products.ts'); // Ensuite les motos
    await runScript('server/seed-accessories.ts'); // Puis les accessoires
    
    console.log("Tous les scripts d'ensemencement ont été exécutés avec succès !");
  } catch (error) {
    console.error("Une erreur s'est produite lors de l'ensemencement:", error);
  }
}

// Exécuter la fonction principale
seedAll();