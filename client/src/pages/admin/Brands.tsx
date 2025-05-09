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
import { Plus, Pencil, Trash2, Link } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string;
  description: string | null;
  website: string | null;
  createdAt: string;
}

export default function AdminBrands() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for dialog control
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
    website: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: brands, isLoading, error } = useQuery({
    queryKey: ['/api/brands'],
    queryFn: async () => {
      return await apiRequest<Brand[]>({
        url: '/api/brands',
        method: 'GET'
      });
    }
  });

  const handleOpenCreateDialog = () => {
    setFormData({
      name: "",
      logo: "",
      description: "",
      website: "",
    });
    setLogoFile(null);
    setLogoPreview("");
    setCreateDialogOpen(true);
  };

  const handleOpenEditDialog = (brand: Brand) => {
    setCurrentBrand(brand);
    setFormData({
      name: brand.name,
      logo: brand.logo,
      description: brand.description || "",
      website: brand.website || "",
    });
    setLogoFile(null);
    setLogoPreview("");
    setEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (brand: Brand) => {
    setCurrentBrand(brand);
    setDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateBrand = async () => {
    if (!formData.name || (!formData.logo && !logoFile)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name and either a Logo URL or Logo File are required."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // If we have a file, use FormData to send it
      if (logoFile) {
        const formDataPayload = new FormData();
        formDataPayload.append('name', formData.name);
        formDataPayload.append('logo', logoFile);
        
        if (formData.description) {
          formDataPayload.append('description', formData.description);
        }
        
        if (formData.website) {
          formDataPayload.append('website', formData.website);
        }
        
        // Send direct fetch request since apiRequest doesn't handle FormData well
        const response = await fetch('/api/admin/brands', {
          method: 'POST',
          credentials: 'include',
          body: formDataPayload
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create brand: ${response.statusText}`);
        }
      } else {
        // Use JSON for URL-based logos
        await apiRequest({
          url: '/api/admin/brands',
          method: 'POST',
          body: JSON.stringify({
            name: formData.name,
            logo: formData.logo,
            description: formData.description || null,
            website: formData.website || null,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      
      toast({
        title: "Success",
        description: "Brand has been created successfully."
      });
      
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating brand:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create brand. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBrand = async () => {
    if (!currentBrand) return;
    
    if (!formData.name || (!formData.logo && !logoFile)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name and either a Logo URL or Logo File are required."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // If we have a file, use FormData to send it
      if (logoFile) {
        const formDataPayload = new FormData();
        formDataPayload.append('name', formData.name);
        formDataPayload.append('logo', logoFile);
        
        if (formData.description) {
          formDataPayload.append('description', formData.description);
        }
        
        if (formData.website) {
          formDataPayload.append('website', formData.website);
        }
        
        // Send direct fetch request since apiRequest doesn't handle FormData well
        const response = await fetch(`/api/admin/brands/${currentBrand.id}`, {
          method: 'PUT',
          credentials: 'include',
          body: formDataPayload
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update brand: ${response.statusText}`);
        }
      } else {
        // Use JSON for URL-based logos
        await apiRequest({
          url: `/api/admin/brands/${currentBrand.id}`,
          method: 'PUT',
          body: JSON.stringify({
            name: formData.name,
            logo: formData.logo,
            description: formData.description || null,
            website: formData.website || null,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      
      toast({
        title: "Success",
        description: "Brand has been updated successfully."
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating brand:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update brand. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBrand = async () => {
    if (!currentBrand) return;

    try {
      setIsSubmitting(true);
      
      await apiRequest({
        url: `/api/admin/brands/${currentBrand.id}`,
        method: 'DELETE',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      
      toast({
        title: "Success",
        description: "Brand has been deleted successfully."
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete brand. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Brands">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Manage Brands</h2>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">Error loading brands. Please try again.</p>
        </div>
      ) : brands && brands.length > 0 ? (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=Logo";
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>
                    {brand.website ? (
                      <a 
                        href={brand.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        <Link className="h-3 w-3 mr-1" />
                        Website
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(brand.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenEditDialog(brand)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenDeleteDialog(brand)}
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
          <h3 className="text-lg font-medium text-gray-600 mb-4">No brands found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first brand</p>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Brand
          </Button>
        </div>
      )}

      {/* Create Brand Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Brand</DialogTitle>
            <DialogDescription>
              Add a new product brand to your store.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Apple"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-file">Logo</Label>
              <div className="space-y-3">
                <Input
                  id="logo-file"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                />
                <div className="text-sm text-muted-foreground">Or enter a logo URL</div>
                <Input
                  id="logo"
                  name="logo"
                  placeholder="https://example.com/logo.jpg"
                  value={formData.logo}
                  onChange={handleInputChange}
                />
                {(logoPreview || formData.logo) && (
                  <div className="mt-2 border rounded p-2">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <img 
                      src={logoPreview || formData.logo} 
                      alt="Logo preview" 
                      className="h-16 w-auto object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/150?text=Preview+Not+Available";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website (optional)</Label>
              <Input
                id="website"
                name="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe this brand..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateBrand} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Brand Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>
              Make changes to the product brand.
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
              <Label htmlFor="edit-logo-file">Logo</Label>
              <div className="space-y-3">
                <Input
                  id="edit-logo-file"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                />
                <div className="text-sm text-muted-foreground">Current logo or enter a new URL</div>
                <Input
                  id="edit-logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                />
                {(logoPreview || formData.logo) && (
                  <div className="mt-2 border rounded p-2">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <img 
                      src={logoPreview || formData.logo} 
                      alt="Logo preview" 
                      className="h-16 w-auto object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/150?text=Preview+Not+Available";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-website">Website (optional)</Label>
              <Input
                id="edit-website"
                name="website"
                value={formData.website}
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
            <Button onClick={handleUpdateBrand} disabled={isSubmitting}>
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
              This will permanently delete the brand "{currentBrand?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBrand} className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}