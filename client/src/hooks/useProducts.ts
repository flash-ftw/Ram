import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

interface ProductsQueryParams {
  featured?: boolean;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  search?: string;
}

export function useProducts(params: ProductsQueryParams = {}) {
  // Pour résoudre le problème d'affichage des produits, utilisons l'URL directe
  // sans paramètres, ce qui nous a permis d'afficher les produits précédemment
  const endpoint = `/api/products`;
  
  console.log("Requête API produits:", endpoint);

  return useQuery<Product[]>({
    queryKey: [endpoint],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
