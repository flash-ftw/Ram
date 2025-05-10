import { useQuery } from "@tanstack/react-query";
import { Brand } from "@shared/schema";

export function useBrands() {
  return useQuery<Brand[]>({
    queryKey: ['/api/brands'],
    staleTime: 30 * 60 * 1000, // 30 minutes - brands don't change often
  });
}