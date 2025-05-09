import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import type { ProductFormValues } from "@/components/admin/ProductForm";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  features: string;
  categoryId: number;
  brandId: number;
  featured: boolean;
  mainImage: string;
  galleryImages: string[];
  inStock: boolean;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductEdit() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [defaultValues, setDefaultValues] = useState<ProductFormValues>();
  const productId = parseInt(id as string);

  // Fetch the product data
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/admin/products/${productId}`],
    queryFn: async () => {
      const response = await fetch(`/api/admin/products/${productId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            variant: "destructive",
            title: "Product Not Found",
            description: "The product you're trying to edit doesn't exist."
          });
          setTimeout(() => setLocation("/admin/products"), 1500);
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
      }
      
      return response.json();
    },
    enabled: !isNaN(productId),
  });

  // When product data loads, set it as default values for the form
  useEffect(() => {
    if (product) {
      setDefaultValues({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        features: product.features,
        categoryId: product.categoryId || 0,
        brandId: product.brandId || 0,
        featured: product.featured || false,
        mainImage: product.mainImage,
        galleryImages: product.galleryImages || [],
        inStock: product.inStock || true,
        quantity: product.quantity || 0,
      });
    }
  }, [product]);

  if (isLoading) {
    return (
      <AdminLayout title="Edit Product">
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout title="Edit Product">
        <div className="bg-red-50 p-6 rounded-lg">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Product</h3>
          <p className="text-red-600">
            We couldn't load the product information. Please try again or go back to the product list.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit Product: ${product.name}`}>
      {defaultValues ? (
        <ProductForm 
          productId={productId} 
          defaultValues={defaultValues}
          isEdit={true}
        />
      ) : (
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AdminLayout>
  );
}