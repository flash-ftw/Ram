import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  featured: boolean;
  createdAt: string;
  categoryId: number;
}

export default function AdminProducts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { t } = useTranslation('common');
  const isRTL = i18n.language === 'ar';

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/admin/products'],
    queryFn: async () => {
      return await apiRequest<Product[]>({
        url: '/api/admin/products',
        method: 'GET'
      });
    }
  });

  const handleDelete = async (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      // Send DELETE request
      const response = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }
      
      toast({
        title: t('admin.products.delete.success'),
        description: t('admin.products.delete.successDescription', { name: productToDelete.name })
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      // Force refetch to update the UI
      queryClient.refetchQueries({ queryKey: ['/api/admin/products'] });
      
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        title: t('admin.products.delete.error'),
        description: t('admin.products.delete.errorDescription')
      });
    }
  };

  return (
    <AdminLayout title={t('admin.products.title')}>
      <div className={`flex justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h2 className="text-lg font-medium">{t('admin.products.manage')}</h2>
        <Button onClick={() => setLocation("/admin/products/new")}>
          {isRTL ? (
            <>
              {t('admin.products.add')}
              <Plus className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.products.add')}
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className={`text-red-800 ${isRTL ? 'text-right' : ''}`}>{t('admin.products.error')}</p>
        </div>
      ) : products && products.length > 0 ? (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.products.name')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.products.price')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.products.status')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.products.created')}</TableHead>
                <TableHead className={isRTL ? 'text-left' : 'text-right'}>{t('admin.products.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className={`font-medium ${isRTL ? 'text-right' : ''}`}>{product.name}</TableCell>
                  <TableCell className={isRTL ? 'text-right' : ''}>{formatPrice(product.price)}</TableCell>
                  <TableCell className={isRTL ? 'text-right' : ''}>
                    {product.featured ? (
                      <Badge>{t('admin.products.featured')}</Badge>
                    ) : (
                      <Badge variant="outline">{t('admin.products.standard')}</Badge>
                    )}
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : ''}>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setLocation(`/admin/products/edit/${product.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-gray-50 p-8 text-center rounded-md">
          <h3 className={`text-lg font-medium text-gray-600 mb-4 ${isRTL ? 'rtl' : ''}`}>{t('admin.products.noProducts')}</h3>
          <p className={`text-gray-500 mb-6 ${isRTL ? 'rtl' : ''}`}>{t('admin.products.noProductsDescription')}</p>
          <Button onClick={() => setLocation("/admin/products/new")}>
            {isRTL ? (
              <>
                {t('admin.products.add')}
                <Plus className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {t('admin.products.add')}
              </>
            )}
          </Button>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className={isRTL ? 'rtl' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.products.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.products.delete.description', { name: productToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
            <AlertDialogCancel>{t('admin.products.delete.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('admin.products.delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}