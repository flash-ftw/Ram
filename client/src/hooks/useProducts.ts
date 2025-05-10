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
  // Reconstruct proper filtering with improved error handling
  const queryParams = new URLSearchParams();
  
  // Only add the featured filter if it's explicitly true
  if (params.featured === true) {
    queryParams.append('featured', 'true');
  }
  
  // Add category filters
  if (params.categories && params.categories.length > 0) {
    params.categories.forEach(category => {
      queryParams.append('category', category);
    });
  }
  
  // Add price range filters
  if (params.minPrice !== undefined && params.minPrice >= 0) {
    queryParams.append('minPrice', params.minPrice.toString());
  }
  
  if (params.maxPrice !== undefined && params.maxPrice > 0) {
    queryParams.append('maxPrice', params.maxPrice.toString());
  }
  
  // Add sort parameter
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  
  // Add search parameter
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
