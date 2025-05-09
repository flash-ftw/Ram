import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!slug,
  });
}
