
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UserProducts = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
    
    if (user) {
      fetchUserProducts();
    }
  }, [user, isLoading, navigate]);

  const fetchUserProducts = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching user products:", error);
      toast({
        title: "حدث خطأ",
        description: error.message || "فشل تحميل المنتجات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      
      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== productId));
      
      toast({
        title: "تم الحذف",
        description: "تم حذف المنتج بنجاح",
      });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "حدث خطأ",
        description: error.message || "فشل حذف المنتج",
        variant: "destructive",
      });
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">منتجاتي</h1>
          
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link to="/product/add" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </Link>
          </Button>
        </div>
        
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">لا يوجد منتجات حاليًا</p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link to="/product/add" className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>إضافة منتج جديد</span>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={product.images && product.images.length > 0 
                      ? product.images[0] 
                      : "https://via.placeholder.com/300"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded">
                    {product.category}
                  </div>
                </div>
                
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <p className="font-bold text-orange-600 mb-1">{product.price} دج</p>
                  <p className="text-sm text-gray-500 mb-1">{product.location}</p>
                  <p className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1 inline-block">
                    {product.condition}
                  </p>
                </CardContent>
                
                <CardFooter className="p-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                  >
                    <Link to={`/product/${product.id}`}>
                      عرض
                    </Link>
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-500"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProducts;
