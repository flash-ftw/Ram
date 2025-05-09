import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Admin routes
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminBrands from "@/pages/admin/Brands";
import ProductNew from "@/pages/admin/ProductNew";
import ProductEdit from "@/pages/admin/ProductEdit";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  
  // Check if the current path is an admin route
  const isAdminRoute = location.startsWith("/admin");
  
  if (isAdminRoute) {
    return (
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/products/new" component={ProductNew} />
        <Route path="/admin/products/edit/:id" component={ProductEdit} />
        <Route path="/admin/products" component={AdminProducts} />
        <Route path="/admin/categories" component={AdminCategories} />
        <Route path="/admin/brands" component={AdminBrands} />
        <Route path="/admin/*">
          {() => {
            window.location.href = "/admin/dashboard";
            return null;
          }}
        </Route>
      </Switch>
    );
  }
  
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/product/:slug" component={ProductDetail} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
