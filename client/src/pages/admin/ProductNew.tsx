import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { useTranslation } from "react-i18next";

export default function ProductNew() {
  const { t } = useTranslation();
  
  return (
    <AdminLayout title={t('products.form.createNewProduct')}>
      <ProductForm />
    </AdminLayout>
  );
}