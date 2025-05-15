import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { Package, ShoppingCart, Tag, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

interface DashboardStats {
  productCount: number;
  categoryCount: number;
  brandCount: number;
  messageCount: number;
}

export default function AdminDashboard() {
  const { t } = useTranslation('common');
  const isRTL = i18n.language === 'ar';
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
    <AdminLayout title={t('admin.dashboard.title')}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className={`flex flex-row items-center ${isRTL ? 'justify-between flex-row-reverse' : 'justify-between'} space-y-0 pb-2`}>
            <CardTitle className="text-sm font-medium">{t('admin.dashboard.productCount')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                stats.productCount
              )}
            </div>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
              {t('admin.dashboard.totalProducts')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={`flex flex-row items-center ${isRTL ? 'justify-between flex-row-reverse' : 'justify-between'} space-y-0 pb-2`}>
            <CardTitle className="text-sm font-medium">{t('admin.dashboard.categoryCount')}</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                stats.categoryCount
              )}
            </div>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
              {t('admin.dashboard.totalCategories')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={`flex flex-row items-center ${isRTL ? 'justify-between flex-row-reverse' : 'justify-between'} space-y-0 pb-2`}>
            <CardTitle className="text-sm font-medium">{t('admin.dashboard.brandCount')}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                stats.brandCount
              )}
            </div>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
              {t('admin.dashboard.totalBrands')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={`flex flex-row items-center ${isRTL ? 'justify-between flex-row-reverse' : 'justify-between'} space-y-0 pb-2`}>
            <CardTitle className="text-sm font-medium">{t('admin.dashboard.messageCount')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                stats.messageCount
              )}
            </div>
            <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
              {t('admin.dashboard.unreadMessages')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader className={isRTL ? 'text-right' : ''}>
            <CardTitle>{t('admin.dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
              {t('admin.dashboard.recentActivityDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}