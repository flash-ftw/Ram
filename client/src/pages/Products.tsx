import { Helmet } from 'react-helmet';
import ProductCatalog from "@/components/products/ProductCatalog";

const Products = () => {
  // Extract category from URL for title
  const searchParams = new URLSearchParams(window.location.search);
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  let title = "All Motorcycles - Rammeh MotoScoot";
  let description = "Browse our extensive collection of motorcycles, parts, and accessories for every rider.";
  
  if (categorySlug) {
    // Capitalize first letter and add spaces between camelCase
    const categoryName = categorySlug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    
    title = `${categoryName} - Rammeh MotoScoot`;
    description = `Explore our collection of premium ${categoryName.toLowerCase()} motorcycles and accessories.`;
  } else if (searchQuery) {
    title = `Search Results for "${searchQuery}" - Rammeh MotoScoot`;
    description = `Browse motorcycles and accessories matching your search for "${searchQuery}".`;
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <ProductCatalog />
    </>
  );
};

export default Products;
