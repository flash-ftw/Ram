import { CorsOptions } from 'express';

/**
 * Configuration CORS pour l'application
 * @returns Options de configuration CORS
 */
export function getCorsConfig(): CorsOptions {
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
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origine (comme les applications mobiles ou curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Non autorisé par CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Permet l'envoi de cookies lors des requêtes cross-origin
  };
}