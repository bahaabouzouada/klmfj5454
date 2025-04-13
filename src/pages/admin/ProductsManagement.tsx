
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Cross, Pencil, Trash } from "lucide-react";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  seller_id: string;
  images: string[];
  created_at: string;
};

const ProductsManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("حدث خطأ أثناء جلب المنتجات");
        console.error(error);
      } else {
        setProducts(data || []);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج؟")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("حدث خطأ أثناء حذف المنتج");
        console.error(error);
      } else {
        toast.success("تم حذف المنتج بنجاح");
        setProducts(products.filter((product) => product.id !== id));
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    try {
      const { error } = await supabase
        .from("products")
        .update({
          title: currentProduct.title,
          description: currentProduct.description,
          price: currentProduct.price,
          category: currentProduct.category,
          condition: currentProduct.condition,
          location: currentProduct.location,
        })
        .eq("id", currentProduct.id);

      if (error) {
        toast.error("حدث خطأ أثناء تحديث المنتج");
        console.error(error);
      } else {
        toast.success("تم تحديث المنتج بنجاح");
        setProducts(
          products.map((p) =>
            p.id === currentProduct.id ? currentProduct : p
          )
        );
        setIsEditing(false);
        setCurrentProduct(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Button onClick={() => navigate("/admin")}>العودة للوحة التحكم</Button>
      </div>

      {isEditing && currentProduct ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">تعديل المنتج</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsEditing(false);
                setCurrentProduct(null);
              }}
            >
              <Cross className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان المنتج</Label>
              <Input
                id="title"
                value={currentProduct.title}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    title: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف المنتج</Label>
              <Textarea
                id="description"
                value={currentProduct.description}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">السعر</Label>
                <Input
                  id="price"
                  type="number"
                  value={currentProduct.price}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">الفئة</Label>
                <Input
                  id="category"
                  value={currentProduct.category}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      category: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">الحالة</Label>
                <Input
                  id="condition"
                  value={currentProduct.condition}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      condition: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">الموقع</Label>
                <Input
                  id="location"
                  value={currentProduct.location}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      location: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">حفظ التغييرات</Button>
            </div>
          </form>
        </div>
      ) : null}

      {isLoading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">لا توجد منتجات متاحة</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان المنتج</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الموقع</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.location}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
