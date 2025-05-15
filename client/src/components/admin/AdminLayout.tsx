import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  MessageSquare, 
  LogOut, 
  Settings, 
  ShoppingBag,
  Menu, 
  X 
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: number; username: string; isAdmin: boolean } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation('common');
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest<{ user: { id: number; username: string; isAdmin: boolean } }>({
          url: "/api/auth/me",
          method: "GET",
        });
        
        if (response?.user?.isAdmin) {
          setUser(response.user);
        } else {
          toast({
            variant: "destructive",
            title: t('admin.layout.accessDenied'),
            description: t('admin.layout.needAdminLogin'),
          });
          setLocation("/admin/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setLocation("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setLocation, toast, t]);

  const handleLogout = async () => {
    try {
      await apiRequest({
        url: "/api/auth/logout",
        method: "POST",
      });
      
      toast({
        title: t('admin.layout.loggedOut'),
        description: t('admin.layout.logoutSuccess'),
      });
      
      setLocation("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: t('admin.layout.logoutFailed'),
        description: t('admin.layout.logoutError'),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">{t('admin.layout.loading')}</p>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { title: t('admin.layout.dashboard'), icon: <LayoutDashboard className="h-5 w-5" />, path: "/admin/dashboard" },
    { title: t('admin.layout.products'), icon: <Package className="h-5 w-5" />, path: "/admin/products" },
    { title: t('admin.layout.categories'), icon: <Tag className="h-5 w-5" />, path: "/admin/categories" },
    { title: t('admin.layout.brands'), icon: <Settings className="h-5 w-5" />, path: "/admin/brands" },
    { title: t('admin.layout.orders'), icon: <ShoppingBag className="h-5 w-5" />, path: "/admin/orders" },
    { title: t('admin.layout.messages'), icon: <MessageSquare className="h-5 w-5" />, path: "/admin/contact-submissions" },
  ];

  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col md:flex-row ${isRTL ? 'rtl' : ''}`}>
      {/* Mobile menu toggle */}
      <div className="block md:hidden fixed top-0 left-0 right-0 z-30 bg-white p-4 border-b shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">{t('admin.layout.adminPanel')}</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col bg-white border-r shadow-sm">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
            <h1 className="text-xl font-bold">{t('admin.layout.adminPanel')}</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="py-4 flex-1 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={`w-full ${isRTL ? 'justify-end text-right' : 'justify-start text-left'}`}
                  onClick={() => setLocation(item.path)}
                >
                  {isRTL ? (
                    <>
                      <span className="mr-3">{item.title}</span>
                      {item.icon}
                    </>
                  ) : (
                    <>
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </>
                  )}
                </Button>
              ))}
            </nav>
            <div className="px-2 py-4 border-t">
              {user && (
                <div className="px-3 py-2 rounded-md mb-2">
                  <p className="text-sm font-medium">{t('admin.layout.loggedInAs')}</p>
                  <p className="text-sm">{user.username}</p>
                </div>
              )}
              <Button 
                variant="destructive" 
                className={`w-full ${isRTL ? 'justify-end' : 'justify-start'}`}
                onClick={handleLogout}
              >
                {isRTL ? (
                  <>
                    {t('admin.layout.logout')}
                    <LogOut className="h-5 w-5 mr-2" />
                  </>
                ) : (
                  <>
                    <LogOut className="h-5 w-5 mr-2" />
                    {t('admin.layout.logout')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className={`absolute top-[57px] ${isRTL ? 'right-0' : 'left-0'} w-64 h-full bg-white shadow-lg`} onClick={e => e.stopPropagation()}>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="py-4 flex-1 px-2 space-y-1">
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={`w-full ${isRTL ? 'justify-end text-right' : 'justify-start text-left'}`}
                    onClick={() => {
                      setLocation(item.path);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {isRTL ? (
                      <>
                        <span className="mr-3">{item.title}</span>
                        {item.icon}
                      </>
                    ) : (
                      <>
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </>
                    )}
                  </Button>
                ))}
              </nav>
              <div className="px-2 py-4 border-t">
                {user && (
                  <div className="px-3 py-2 rounded-md mb-2">
                    <p className="text-sm font-medium">{t('admin.layout.loggedInAs')}</p>
                    <p className="text-sm">{user.username}</p>
                  </div>
                )}
                <Button 
                  variant="destructive" 
                  className={`w-full ${isRTL ? 'justify-end' : 'justify-start'}`}
                  onClick={handleLogout}
                >
                  {isRTL ? (
                    <>
                      {t('admin.layout.logout')}
                      <LogOut className="h-5 w-5 mr-2" />
                    </>
                  ) : (
                    <>
                      <LogOut className="h-5 w-5 mr-2" />
                      {t('admin.layout.logout')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 pt-16 md:pt-0">
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}