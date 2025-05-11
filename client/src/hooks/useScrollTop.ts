import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook qui fait défiler la page vers le haut à chaque changement de route
 */
export function useScrollTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // 'instant' au lieu de 'smooth' pour retour immédiat en haut
    });
  }, [location]); // Se déclenche à chaque changement d'URL

  return null;
}