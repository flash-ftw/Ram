import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  MessageSquare, 
  LogOut, 
  Settings, 
  ChevronDown, 
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
            title: "Access denied",
            description: "You need to login as admin to access this page",
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
  }, [setLocation, toast]);

  const handleLogout = async () => {
    try {
      await apiRequest({
        url: "/api/auth/logout",
        method: "POST",
      });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      setLocation("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An error occurred while logging out",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { title: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/admin/dashboard" },
    { title: "Products", icon: <Package className="h-5 w-5" />, path: "/admin/products" },
    { title: "Categories", icon: <Tag className="h-5 w-5" />, path: "/admin/categories" },
    { title: "Brands", icon: <Settings className="h-5 w-5" />, path: "/admin/brands" },
    { title: "Messages", icon: <MessageSquare className="h-5 w-5" />, path: "/admin/contact-submissions" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile menu toggle */}
      <div className="block md:hidden fixed top-0 left-0 right-0 z-30 bg-white p-4 border-b shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Admin Panel</h1>
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
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="py-4 flex-1 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setLocation(item.path)}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Button>
              ))}
            </nav>
            <div className="px-2 py-4 border-t">
              {user && (
                <div className="px-3 py-2 rounded-md mb-2">
                  <p className="text-sm font-medium">Logged in as:</p>
                  <p className="text-sm">{user.username}</p>
                </div>
              )}
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-[57px] left-0 w-64 h-full bg-white shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="py-4 flex-1 px-2 space-y-1">
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setLocation(item.path);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Button>
                ))}
              </nav>
              <div className="px-2 py-4 border-t">
                {user && (
                  <div className="px-3 py-2 rounded-md mb-2">
                    <p className="text-sm font-medium">Logged in as:</p>
                    <p className="text-sm">{user.username}</p>
                  </div>
                )}
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
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