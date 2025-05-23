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
import { useTranslation } from "react-i18next";
import i18n from "i18next";

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
  const { t } = useTranslation();

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
        title: t('products.form.invalidUrl'),
        description: t('products.form.invalidUrlDescription'),
      });
      return;
    }

    const currentGalleryImages = form.getValues("galleryImages") || [];
    
    if (currentGalleryImages.includes(galleryImageUrl)) {
      toast({
        variant: "destructive",
        title: t('products.form.duplicateUrl'),
        description: t('products.form.duplicateUrlDescription'),
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
        title: isEdit ? t('products.form.productUpdated') : t('products.form.productCreated'),
        description: isEdit ? t('products.form.productUpdateSuccess') : t('products.form.productCreateSuccess'),
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
        title: t('products.form.saveError'),
        description: t('products.form.saveErrorDescription'),
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
          aria-label={t('products.form.backToProducts')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{isEdit ? t('products.form.editProduct') : t('products.form.createNewProduct')}</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium border-b pb-2">{t('products.form.basicInformation')}</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('products.form.productName')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('products.form.productNamePlaceholder')} />
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
                    <FormLabel>{t('products.form.description')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder={t('products.form.descriptionPlaceholder')} 
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
                    <FormLabel>{t('products.form.features')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder={t('products.form.featuresPlaceholder')}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('products.form.featuresDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Categorization */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">{t('products.form.categorization')}</h3>
              
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('products.form.category')}</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('products.form.selectCategory')} />
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
                    <FormLabel>{t('products.form.brand')}</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('products.form.selectBrand')} />
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
                      <FormLabel>{t('products.form.featuredProduct')}</FormLabel>
                      <FormDescription>
                        {t('products.form.featuredDescription')}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Pricing & Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">{t('products.form.pricingInventory')}</h3>
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('products.form.priceTND')}</FormLabel>
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
                    <FormLabel>{t('products.form.originalPrice')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder={t('products.form.originalPrice')}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('products.form.originalPriceDescription')}
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
                      <FormLabel>{t('products.form.inStockLabel')}</FormLabel>
                      <FormDescription>
                        {t('products.form.inStockDescription')}
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
          
          {/* Caractéristiques techniques pour motos thermiques */}
          <div className="space-y-4 mt-8">
            <h3 className="text-lg font-medium border-b pb-2">Caractéristiques Techniques (Motos Thermiques)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type de moteur */}
              <FormField
                control={form.control}
                name="motorType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de moteur</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Non applicable</SelectItem>
                        <SelectItem value="2 temps">2 temps</SelectItem>
                        <SelectItem value="4 temps">4 temps</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Cylindrée */}
              <FormField
                control={form.control}
                name="displacement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cylindrée</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Non applicable</SelectItem>
                        <SelectItem value="49cc">49cc</SelectItem>
                        <SelectItem value="70cc">70cc</SelectItem>
                        <SelectItem value="102cc">102cc</SelectItem>
                        <SelectItem value="110cc">110cc</SelectItem>
                        <SelectItem value="125cc">125cc</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Refroidissement */}
              <FormField
                control={form.control}
                name="cooling"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refroidissement</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Non applicable</SelectItem>
                        <SelectItem value="Refroidi par air">Refroidi par air</SelectItem>
                        <SelectItem value="Refroidi par eau">Refroidi par eau</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Système d'alimentation */}
              <FormField
                control={form.control}
                name="fuelSystem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Système d'alimentation</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Non applicable</SelectItem>
                        <SelectItem value="Carburateur">Carburateur</SelectItem>
                        <SelectItem value="EFI">EFI (injection électronique)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Transmission */}
              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmission</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Non applicable</SelectItem>
                        <SelectItem value="Manuelle">Manuelle</SelectItem>
                        <SelectItem value="Semi-automatique">Semi-automatique</SelectItem>
                        <SelectItem value="Automatique (CVT)">Automatique (CVT)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Démarrage */}
              <FormField
                control={form.control}
                name="starter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Démarrage</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Non applicable</SelectItem>
                        <SelectItem value="Kick">Kick</SelectItem>
                        <SelectItem value="Démarrage électrique">Démarrage électrique</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Allumage */}
              <FormField
                control={form.control}
                name="ignition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allumage</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Non applicable</SelectItem>
                        <SelectItem value="CDI">CDI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Phare */}
              <FormField
                control={form.control}
                name="headlight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phare</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Non applicable</SelectItem>
                        <SelectItem value="LED">LED</SelectItem>
                        <SelectItem value="Halogène">Halogène</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Freins */}
              <FormField
                control={form.control}
                name="brakes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Freins</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Non applicable</SelectItem>
                        <SelectItem value="Tambour">Tambour</SelectItem>
                        <SelectItem value="Disque (avant)">Disque (avant)</SelectItem>
                        <SelectItem value="Disque (arrière)">Disque (arrière)</SelectItem>
                        <SelectItem value="Disque (avant et arrière)">Disque (avant et arrière)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Vitesse maximale */}
              <FormField
                control={form.control}
                name="maxSpeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vitesse maximale (km/h)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 80"
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Capacité du réservoir */}
              <FormField
                control={form.control}
                name="fuelCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacité du réservoir (litres)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 4.5"
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Poids */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poids (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 100"
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Taille des roues */}
              <FormField
                control={form.control}
                name="wheelSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taille des roues</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Non applicable</SelectItem>
                        <SelectItem value="10&quot;">10"</SelectItem>
                        <SelectItem value="12&quot;">12"</SelectItem>
                        <SelectItem value="14&quot;">14"</SelectItem>
                        <SelectItem value="15&quot;">15"</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Pneus */}
              <FormField
                control={form.control}
                name="tires"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pneus</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Non applicable</SelectItem>
                        <SelectItem value="Sans chambre à air">Sans chambre à air</SelectItem>
                        <SelectItem value="Avec chambre à air">Avec chambre à air</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Consommation de carburant */}
              <FormField
                control={form.control}
                name="fuelConsumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consommation (L/100 km)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 2.5"
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Tableau de bord */}
              <FormField
                control={form.control}
                name="dashboard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tableau de bord</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Non applicable</SelectItem>
                        <SelectItem value="Analogique">Analogique</SelectItem>
                        <SelectItem value="Numérique">Numérique</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <Button 
              type="button" 
              variant="outline" 
              className="mr-2"
              onClick={() => setLocation("/admin/products")}
            >
              {t('products.delete.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? t('products.form.saving') : t('products.form.saveProduct')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;