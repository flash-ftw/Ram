import { Helmet } from 'react-helmet';
import ProductCatalog from "@/components/products/ProductCatalog";

const Products = () => {
  // Extract category from URL for title
  const searchParams = new URLSearchParams(window.location.search);
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  let title = "Toutes les Motos - Rammeh MotoScoot";
  let description = "Parcourez notre vaste collection de motos, pièces et accessoires pour chaque motard.";
  
  if (categorySlug) {
    // Capitalize first letter and add spaces between camelCase
    const categoryName = categorySlug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    
    title = `${categoryName} - Rammeh MotoScoot`;
    description = `Explorez notre collection de ${categoryName.toLowerCase()} motos et accessoires premium.`;
  } else if (searchQuery) {
    title = `Résultats de recherche pour "${searchQuery}" - Rammeh MotoScoot`;
    description = `Parcourez les motos et accessoires correspondant à votre recherche pour "${searchQuery}".`;
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
