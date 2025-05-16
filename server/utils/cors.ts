import { CorsOptions } from 'cors';

/**
 * Configuration CORS pour l'application
 * @returns Options de configuration CORS
 */
export function getCorsConfig(): CorsOptions {
  // En développement, autoriser toutes les origines
  // En production, utiliser une configuration plus stricte
  if (process.env.NODE_ENV === 'development') {
    return {
      origin: true, // Autorise toutes les origines en développement
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    };
  }
  
  // Configuration pour la production
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:5000', 'http://localhost:3000'];

  // En production, ajoutez automatiquement le domaine Railway
  if (process.env.RAILWAY_SERVICE_DOMAIN) {
    allowedOrigins.push(`https://${process.env.RAILWAY_SERVICE_DOMAIN}`);
  }

  // Si un domaine personnalisé est configuré
  if (process.env.CUSTOM_DOMAIN) {
    allowedOrigins.push(`https://${process.env.CUSTOM_DOMAIN}`);
  }

  return {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Autoriser les requêtes sans origine (comme les applications mobiles ou curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Temporairement autoriser toutes les origines
        // En production, vous pourriez vouloir : callback(new Error('Non autorisé par CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Permet l'envoi de cookies lors des requêtes cross-origin
  };
}