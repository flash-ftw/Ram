import { useScrollTop } from "@/hooks/useScrollTop";

/**
 * Composant qui fait défiler la page vers le haut lors des changements de route
 */
export default function ScrollToTop() {
  useScrollTop();
  return null;
}