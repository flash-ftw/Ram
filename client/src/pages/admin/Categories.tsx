import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string;
  createdAt: string;
}

export default function AdminCategories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
  
  // State for dialog control
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/admin/categories'],
    queryFn: async () => {
      return await apiRequest<Category[]>({
        url: '/api/admin/categories',
        method: 'GET'
      });
    }
  });

  const handleOpenCreateDialog = () => {
    setFormData({
      name: "",
      image: "",
      description: "",
    });
    setCreateDialogOpen(true);
  };

  const handleOpenEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      image: category.image,
      description: category.description || "",
    });
    setEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (category: Category) => {
    setCurrentCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateCategory = async () => {
    if (!formData.name || !formData.image) {
      toast({
        variant: "destructive",
        title: t('admin.categories.create.error'),
        description: t('admin.categories.fieldsRequiredError')
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await apiRequest({
        url: '/api/admin/categories',
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          image: formData.image,
          description: formData.description || null,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      
      toast({
        title: t('admin.categories.create.success'),
        description: t('admin.categories.create.successDescription')
      });
      
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        variant: "destructive",
        title: t('admin.categories.create.error'),
        description: t('admin.categories.create.errorDescription')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!currentCategory) return;
    
    if (!formData.name || !formData.image) {
      toast({
        variant: "destructive",
        title: t('admin.categories.update.error'),
        description: t('admin.categories.fieldsRequiredError')
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await apiRequest({
        url: `/api/admin/categories/${currentCategory.id}`,
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          image: formData.image,
          description: formData.description || null,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      
      toast({
        title: t('admin.categories.update.success'),
        description: t('admin.categories.update.successDescription')
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        variant: "destructive",
        title: t('admin.categories.update.error'),
        description: t('admin.categories.update.errorDescription')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!currentCategory) return;

    try {
      setIsSubmitting(true);
      
      await apiRequest({
        url: `/api/admin/categories/${currentCategory.id}`,
        method: 'DELETE',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      
      toast({
        title: t('admin.categories.delete.success'),
        description: t('admin.categories.delete.successDescription', { name: currentCategory.name })
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: "destructive",
        title: t('admin.categories.delete.error'),
        description: t('admin.categories.delete.errorDescription')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title={t('admin.categories.title')}>
      <div className={`flex justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h2 className="text-lg font-medium">{t('admin.categories.manage')}</h2>
        <Button onClick={handleOpenCreateDialog}>
          {isRTL ? (
            <>
              {t('admin.categories.add')}
              <Plus className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.categories.add')}
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
          <p className={`text-red-800 ${isRTL ? 'text-right' : ''}`}>{t('admin.categories.error')}</p>
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.categories.name')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.categories.slug')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : ''}>{t('admin.categories.created')}</TableHead>
                <TableHead className={isRTL ? 'text-left' : 'text-right'}>{t('admin.categories.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className={`font-medium ${isRTL ? 'text-right' : ''}`}>{category.name}</TableCell>
                  <TableCell className={isRTL ? 'text-right' : ''}>{category.slug}</TableCell>
                  <TableCell className={isRTL ? 'text-right' : ''}>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenEditDialog(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenDeleteDialog(category)}
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
          <h3 className={`text-lg font-medium text-gray-600 mb-4 ${isRTL ? 'rtl' : ''}`}>{t('admin.categories.noCategories')}</h3>
          <p className={`text-gray-500 mb-6 ${isRTL ? 'rtl' : ''}`}>{t('admin.categories.noCategoriesDescription')}</p>
          <Button onClick={handleOpenCreateDialog}>
            {isRTL ? (
              <>
                {t('admin.categories.add')}
                <Plus className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {t('admin.categories.add')}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Create Category Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className={isRTL ? 'rtl' : ''}>
          <DialogHeader>
            <DialogTitle>{t('admin.categories.create')}</DialogTitle>
            <DialogDescription>
              {t('admin.categories.createDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t('admin.categories.name')}</Label>
              <Input
                id="name"
                name="name"
                placeholder={isRTL ? "مثال: إلكترونيات" : "e.g. Electronics"}
                value={formData.name}
                onChange={handleInputChange}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">{t('admin.categories.imageUrl')}</Label>
              <Input
                id="image"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleInputChange}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('admin.categories.description')}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={isRTL ? "صف هذه الفئة..." : "Describe this category..."}
                value={formData.description}
                onChange={handleInputChange}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
          <DialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>{t('admin.categories.delete.cancel')}</Button>
            <Button onClick={handleCreateCategory} disabled={isSubmitting}>
              {isSubmitting ? t('admin.categories.creating') : t('admin.categories.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className={isRTL ? 'rtl' : ''}>
          <DialogHeader>
            <DialogTitle>{t('admin.categories.edit')}</DialogTitle>
            <DialogDescription>
              {t('admin.categories.editDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t('admin.categories.name')}</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">{t('admin.categories.imageUrl')}</Label>
              <Input
                id="edit-image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{t('admin.categories.description')}</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
          <DialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>{t('admin.categories.delete.cancel')}</Button>
            <Button onClick={handleUpdateCategory} disabled={isSubmitting}>
              {isSubmitting ? t('admin.categories.updating') : t('admin.categories.update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className={isRTL ? 'rtl' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.categories.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.categories.delete.description', { name: currentCategory?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
            <AlertDialogCancel>{t('admin.categories.delete.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
              {isSubmitting ? t('admin.categories.deleting') : t('admin.categories.delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}