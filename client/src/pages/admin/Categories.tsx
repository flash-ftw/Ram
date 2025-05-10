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
        title: "Error",
        description: "Name and Image are required fields."
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
        title: "Success",
        description: "Category has been created successfully."
      });
      
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create category. Please try again."
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
        title: "Error",
        description: "Name and Image are required fields."
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
        title: "Success",
        description: "Category has been updated successfully."
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update category. Please try again."
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
        title: "Success",
        description: "Category has been deleted successfully."
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Categories">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Manage Categories</h2>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">Error loading categories. Please try again.</p>
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
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
          <h3 className="text-lg font-medium text-gray-600 mb-4">No categories found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first category</p>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      )}

      {/* Create Category Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Add a new product category to your store.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Electronics"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe this category..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCategory} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to the product category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCategory} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{currentCategory?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}