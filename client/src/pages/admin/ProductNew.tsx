import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";

export default function ProductNew() {
  return (
    <AdminLayout title="Create New Product">
      <ProductForm />
    </AdminLayout>
  );
}