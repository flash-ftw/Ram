import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";
import { Product } from "@shared/schema";

export default function ProductEdit() {
  const { id } = useParams();
  const [defaultValues, setDefaultValues] = useState<ProductFormValues>();
  const productId = parseInt(id as string);

  // Fetch the product data
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/admin/products/${productId}`],
    enabled: !isNaN(productId),
  });

  // When product data loads, set it as default values for the form
  useEffect(() => {
    if (product) {
      setDefaultValues({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || null,
        features: product.features,
        categoryId: product.categoryId,
        brandId: product.brandId,
        featured: product.featured,
        mainImage: product.mainImage,
        galleryImages: product.galleryImages || [],
        inStock: product.inStock,
        quantity: product.quantity,
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