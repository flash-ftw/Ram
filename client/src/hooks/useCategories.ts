import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['/api/categories'],
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
}
