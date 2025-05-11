import { Helmet } from 'react-helmet';
import { useParams } from "wouter";
import ProductDetailComponent from "@/components/products/ProductDetail";
import { useProduct } from "@/hooks/useProduct";
import { useCategories } from "@/hooks/useCategories";
import { getImageUrl } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

const ProductDetail = () => {
  const { t } = useTranslation('common');
  const { language } = useLanguage();
  const { slug } = useParams();
  const { data: product } = useProduct(slug as string);
  const { data: categories = [] } = useCategories();
  
  // Find category for meta description
  const category = product && categories.length
    ? categories.find(c => c.id === product.categoryId)
    : null;
  
  const title = product 
    ? `${product.name} - ${t('seo.siteName')}`
    : `${t('seo.product.defaultTitle')} - ${t('seo.siteName')}`;
  
  const description = product
    ? `${product.description.slice(0, 155)}...`
    : t('seo.product.defaultDescription');

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="product" />
        {product?.mainImage && <meta property="og:image" content={getImageUrl(product.mainImage)} />}
        {category && <meta property="product:category" content={category.name} />}
        {product?.price && <meta property="product:price:amount" content={product.price.toString()} />}
        <meta property="product:price:currency" content="TND" />
        <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
      </Helmet>
      
      <ProductDetailComponent />
    </>
  );
};

export default ProductDetail;
