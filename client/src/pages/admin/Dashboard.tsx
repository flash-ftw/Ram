import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { Package, ShoppingCart, Tag, MessageSquare } from "lucide-react";

interface DashboardStats {
  productCount: number;
  categoryCount: number;
  brandCount: number;
  messageCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    productCount: 0,
    categoryCount: 0,
    brandCount: 0,
    messageCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products count
        const products = await apiRequest<any[]>({
          url: "/api/products",
          method: "GET",
        });
        
        // Fetch categories count
        const categories = await apiRequest<any[]>({
          url: "/api/categories",
          method: "GET",
        });
        
        // Fetch brands count
        const brands = await apiRequest<any[]>({
          url: "/api/brands",
          method: "GET",
        });
        
        // For contact submissions, we'd need to create a dedicated endpoint
        // For now, let's just use 0
        
        setStats({
          productCount: products?.length || 0,
          categoryCount: categories?.length || 0,
          brandCount: brands?.length || 0,
          messageCount: 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                stats.productCount
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total products in inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                stats.categoryCount
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total product categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brands</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                stats.brandCount
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total product brands
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                stats.messageCount
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Unread contact messages
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is where recent activity would be displayed. For now, this section is a placeholder.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}