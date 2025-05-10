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
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  // Réactivons progressivement les paramètres
  // Ne pas ajouter featured=false, cela semble causer un problème
  if (params.featured === true) {  // Changement important : vérifier strictement true
    queryParams.append('featured', 'true');
  }
  
  if (params.categories && params.categories.length > 0) {
    params.categories.forEach(category => {
      queryParams.append('category', category);
    });
  }
  
  if (params.minPrice !== undefined) {
    queryParams.append('minPrice', params.minPrice.toString());
  }
  
  if (params.maxPrice !== undefined) {
    queryParams.append('maxPrice', params.maxPrice.toString());
  }
  
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  
  if (params.search) {
    queryParams.append('search', params.search);
  }
  
  const queryString = queryParams.toString();
  const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
  
  console.log("Requête API produits:", endpoint);

  return useQuery<Product[]>({
    queryKey: [endpoint],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
