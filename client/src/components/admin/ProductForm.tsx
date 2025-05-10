import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save } from "lucide-react";
import { Product } from "@shared/schema";

// Create a schema for product validation
const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0" }),
  originalPrice: z.coerce.number().nullable().optional(),
  features: z.string().min(5, { message: "Features must be at least 5 characters" }),
  categoryId: z.coerce.number({ required_error: "Category is required" }),
  brandId: z.coerce.number({ required_error: "Brand is required" }),
  featured: z.boolean().default(false),
  mainImage: z.string().optional(), // Allow empty string for file upload
  mainImageFile: z.instanceof(File).optional(), // For file upload
  galleryImages: z.array(z.string()).default([]),
  galleryImageFiles: z.array(z.instanceof(File)).optional(), // For multiple file uploads
  inStock: z.boolean().default(true),
  quantity: z.coerce.number().int().min(0, { message: "Quantity must be a non-negative integer" }),
  
  // Nouveaux champs pour motos thermiques
  motorType: z.string().optional(), // 2 temps / 4 temps
  displacement: z.string().optional(), // 49cc / 70cc / 102cc / 110cc / 125cc
  cooling: z.string().optional(), // Refroidi par air / Refroidi par eau
  fuelSystem: z.string().optional(), // Carburateur / EFI (injection électronique de carburant)
  transmission: z.string().optional(), // Manuelle / Semi-automatique / Automatique (CVT)
  starter: z.string().optional(), // Kick / Démarrage électrique
  ignition: z.string().optional(), // CDI
  headlight: z.string().optional(), // LED / Halogène
  brakes: z.string().optional(), // Tambour / Disque (avant et/ou arrière)
  maxSpeed: z.coerce.number().int().min(0).optional(), // Vitesse maximale en km/h
  fuelCapacity: z.coerce.number().min(0).optional(), // Capacité du réservoir en litres
  weight: z.coerce.number().int().min(0).optional(), // Poids en kg
  wheelSize: z.string().optional(), // 10" / 12" / 14" / 15"
  tires: z.string().optional(), // Sans chambre à air / Avec chambre à air
  fuelConsumption: z.coerce.number().min(0).optional(), // Consommation de carburant en L/100 km
  dashboard: z.string().optional(), // Analogique / Numérique
});

export type ProductFormValues = z.infer<typeof productSchema>;
export { productSchema };

interface ProductFormProps {
  productId?: number;
  defaultValues?: ProductFormValues;
  isEdit?: boolean;
}

const ProductForm = ({ productId, defaultValues, isEdit = false }: ProductFormProps) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [galleryImageUrl, setGalleryImageUrl] = useState("");

  // Get categories and brands for dropdown options
  interface Category {
    id: number;
    name: string;
    slug: string;
  }
  
  interface Brand {
    id: number;
    name: string;
    slug: string;
  }

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  // Form setup
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      price: 0,
      originalPrice: null,
      features: "",
      categoryId: 0,
      brandId: 0,
      featured: false,
      mainImage: "",
      galleryImages: [],
      inStock: true,
      quantity: 0,
      
      // Nouveaux champs pour motos thermiques
      motorType: "",
      displacement: "",
      cooling: "",
      fuelSystem: "",
      transmission: "",
      starter: "",
      ignition: "",
      headlight: "",
      brakes: "",
      maxSpeed: undefined,
      fuelCapacity: undefined,
      weight: undefined,
      wheelSize: "",
      tires: "",
      fuelConsumption: undefined,
      dashboard: "",
    },
  });

  // Function to add a gallery image
  const addGalleryImage = () => {
    if (!galleryImageUrl) return;
    
    if (!z.string().url().safeParse(galleryImageUrl).success) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid image URL",
      });
      return;
    }

    const currentGalleryImages = form.getValues("galleryImages") || [];
    
    if (currentGalleryImages.includes(galleryImageUrl)) {
      toast({
        variant: "destructive",
        title: "Duplicate URL",
        description: "This image URL is already in the gallery",
      });
      return;
    }

    form.setValue("galleryImages", [...currentGalleryImages, galleryImageUrl]);
    setGalleryImageUrl("");
    
    // Mark the field as touched to ensure validation happens
    form.trigger("galleryImages");
  };

  // Function to remove a gallery image
  const removeGalleryImage = (index: number) => {
    const currentGalleryImages = form.getValues("galleryImages") || [];
    const newGalleryImages = [...currentGalleryImages];
    newGalleryImages.splice(index, 1);
    form.setValue("galleryImages", newGalleryImages);
  };

  // Submit handler
  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add all the regular form data
      Object.keys(data).forEach(key => {
        if (key !== 'mainImageFile' && key !== 'galleryImageFiles') {
          if (key === 'galleryImages') {
            // Skip galleryImages array - we'll use the uploaded files instead
            const dataValue = data[key as keyof typeof data];
            if (Array.isArray(dataValue) && dataValue.length > 0) {
              // If there are URLs that aren't data URIs (existing images), add them
              dataValue.forEach((img, index) => {
                if (typeof img === 'string' && !img.startsWith('data:')) {
                  formData.append(`galleryImagesUrls[${index}]`, img);
                }
              });
            }
          } else {
            const dataValue = data[key as keyof typeof data];
            if (dataValue !== null && dataValue !== undefined) {
              formData.append(key, String(dataValue));
            }
          }
        }
      });
      
      // Add the main image file if present
      if (data.mainImageFile) {
        formData.append('mainImage', data.mainImageFile);
      }
      
      // Add gallery image files if present
      if (data.galleryImageFiles && data.galleryImageFiles.length > 0) {
        Array.from(data.galleryImageFiles).forEach((file, index) => {
          formData.append(`galleryImages`, file);
        });
      }
      
      let response;
      
      if (isEdit && productId) {
        // Update existing product
        response = await fetch(`/api/admin/products/${productId}`, {
          method: 'PUT',
          credentials: 'include',
          body: formData, // No Content-Type header for multipart/form-data
        });
      } else {
        // Create new product
        response = await fetch('/api/admin/products', {
          method: 'POST',
          credentials: 'include',
          body: formData, // No Content-Type header for multipart/form-data
        });
      }
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} product: ${response.statusText}`);
      }
      
      toast({
        title: isEdit ? "Product updated" : "Product created",
        description: `The product has been ${isEdit ? 'updated' : 'created'} successfully.`,
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      // Force refetch to update the UI
      queryClient.refetchQueries({ queryKey: ['/api/admin/products'] });
      
      // Navigate back to products list
      setLocation("/admin/products");
      
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setLocation("/admin/products")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{isEdit ? "Edit Product" : "Create New Product"}</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter product name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Enter product description" 
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Enter product features, one per line" 
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter features separated by line breaks or commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Categorization */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Categorization</h3>
              
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Product</FormLabel>
                      <FormDescription>
                        This product will be displayed in the featured section on the homepage
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Pricing & Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Pricing & Inventory</h3>
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (TND)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (TND) (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="Leave empty if no discount"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormDescription>
                      Set this only if the product is on sale
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>In Stock</FormLabel>
                      <FormDescription>
                        Is this product currently available for purchase?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity in Stock</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Images */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium border-b pb-2">Images</h3>
              
              <FormField
                control={form.control}
                name="mainImageFile"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Main Product Image</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              form.setValue("mainImageFile", file);
                              
                              // Create a preview URL
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  form.setValue("mainImage", reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          {...fieldProps}
                        />
                        {isEdit && (
                          <FormDescription>
                            Leave empty to keep the current image
                          </FormDescription>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                    {form.getValues("mainImage") && (
                      <div className="mt-2">
                        <img 
                          src={form.getValues("mainImage")} 
                          alt="Main product image preview" 
                          className="h-32 w-auto object-contain border rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/150?text=Preview+Not+Available";
                          }}
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="galleryImageFiles"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Gallery Images</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input 
                            type="file" 
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 0) {
                                form.setValue("galleryImageFiles", files);
                                
                                // Create previews for all selected files
                                files.forEach(file => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (typeof reader.result === 'string') {
                                      const currentGalleryImages = form.getValues("galleryImages") || [];
                                      form.setValue("galleryImages", [...currentGalleryImages, reader.result]);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                });
                              }
                            }}
                            {...fieldProps}
                          />
                          {isEdit && (
                            <FormDescription>
                              You can add more gallery images to the existing ones
                            </FormDescription>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormLabel>Or Add Gallery Image by URL</FormLabel>
                  <div className="flex gap-2">
                    <Input 
                      value={galleryImageUrl} 
                      onChange={(e) => setGalleryImageUrl(e.target.value)}
                      placeholder="https://example.com/gallery-image.jpg"
                    />
                    <Button 
                      type="button" 
                      onClick={addGalleryImage}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <FormLabel>Gallery Images Preview</FormLabel>
                  {form.getValues("galleryImages")?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      {form.getValues("galleryImages")?.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={imageUrl} 
                            alt={`Gallery image ${index + 1}`} 
                            className="h-24 w-full object-cover border rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/150?text=Preview+Not+Available";
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeGalleryImage(index)}
                          >
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm mt-2">No gallery images added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              className="mr-2"
              onClick={() => setLocation("/admin/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;