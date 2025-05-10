import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

interface ProductsQueryParams {
  featured?: boolean;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  search?: string;
  
  // Nouveaux filtres pour spécifications motos
  motorType?: string;
  displacement?: string;
  cooling?: string;
  fuelSystem?: string;
  transmission?: string;
  startType?: string;
  brakes?: string;
  wheelSize?: string;
  maxSpeedMin?: number;
  maxSpeedMax?: number;
  weightMin?: number;
  weightMax?: number;
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
  
  // Ajout des filtres pour spécifications motos
  if (params.motorType && params.motorType !== "all") {
    queryParams.append('motorType', params.motorType);
  }
  
  if (params.displacement && params.displacement !== "all") {
    queryParams.append('displacement', params.displacement);
  }
  
  if (params.cooling && params.cooling !== "all") {
    queryParams.append('cooling', params.cooling);
  }
  
  if (params.fuelSystem && params.fuelSystem !== "all") {
    queryParams.append('fuelSystem', params.fuelSystem);
  }
  
  if (params.transmission && params.transmission !== "all") {
    queryParams.append('transmission', params.transmission);
  }
  
  if (params.startType && params.startType !== "all") {
    queryParams.append('startType', params.startType);
  }
  
  if (params.brakes && params.brakes !== "all") {
    queryParams.append('brakes', params.brakes);
  }
  
  if (params.wheelSize && params.wheelSize !== "all") {
    queryParams.append('wheelSize', params.wheelSize);
  }
  
  // Filtres numériques avec min/max
  if (params.maxSpeedMin !== undefined && params.maxSpeedMin >= 0) {
    queryParams.append('maxSpeedMin', params.maxSpeedMin.toString());
  }
  
  if (params.maxSpeedMax !== undefined && params.maxSpeedMax > 0) {
    queryParams.append('maxSpeedMax', params.maxSpeedMax.toString());
  }
  
  if (params.weightMin !== undefined && params.weightMin >= 0) {
    queryParams.append('weightMin', params.weightMin.toString());
  }
  
  if (params.weightMax !== undefined && params.weightMax > 0) {
    queryParams.append('weightMax', params.weightMax.toString());
  }
  
  const queryString = queryParams.toString();
  const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
  
  console.log("Requête API produits:", endpoint);

  return useQuery<Product[]>({
    queryKey: [endpoint],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
