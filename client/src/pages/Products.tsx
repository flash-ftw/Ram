import { Helmet } from 'react-helmet';
import ProductCatalog from "@/components/products/ProductCatalog";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

const Products = () => {
  const { t } = useTranslation('common');
  const { language } = useLanguage();
  
  // Extract category from URL for title
  const searchParams = new URLSearchParams(window.location.search);
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  let title = t('seo.products.title');
  let description = t('seo.products.description');
  
  if (categorySlug) {
    // Capitalize first letter and add spaces between camelCase
    const categoryName = categorySlug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    
    title = `${categoryName} - ${t('seo.siteName')}`;
    description = t('seo.products.categoryDescription', { category: categoryName.toLowerCase() });
  } else if (searchQuery) {
    title = t('seo.products.searchTitle', { query: searchQuery });
    description = t('seo.products.searchDescription', { query: searchQuery });
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
      </Helmet>
      
      <ProductCatalog />
    </>
  );
};

export default Products;
