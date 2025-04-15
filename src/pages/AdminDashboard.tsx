import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  CheckCircle,
  Home,
  MessageSquare,
  PieChart,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import AddProductButton from "@/components/AddProductButton";

type StatsCardProps = {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
};

const StatsCard = ({ title, value, change, icon }: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {change && <p className="text-xs text-green-600 mt-1">{change}</p>}
          </div>
          <div className="bg-teal-50 p-2 rounded-md text-teal-600">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [requireEmailConfirmation, setRequireEmailConfirmation] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { count: usersCount, error: usersError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        const { count: productsCount, error: productsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        const { count: messagesCount, error: messagesError } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true });

        if (usersError || productsError || messagesError) {
          throw new Error("Error fetching stats");
        }

        setStats({
          users: usersCount || 0,
          products: productsCount || 0,
          messages: messagesCount || 0,
        });

        const { data: recentUsersData, error: recentUsersError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(4);

        if (recentUsersError) throw new Error("Error fetching recent users");
        setRecentUsers(recentUsersData || []);

        const { data: recentProductsData, error: recentProductsError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(4);

        if (recentProductsError) throw new Error("Error fetching recent products");
        setRecentProducts(recentProductsData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("حدث خطأ أثناء جلب بيانات لوحة التحكم");
      } finally {
        setLoading(false);
      }
    };

    const fetchEmailConfirmationSetting = async () => {
      try {
        setRequireEmailConfirmation(localStorage.getItem('requireEmailConfirmation') === 'true');
      } catch (error) {
        console.error("Error fetching email confirmation setting:", error);
      }
    };

    if (!authLoading) {
      fetchStats();
      fetchEmailConfirmationSetting();
    }
  }, [authLoading, isAdmin]);

  const toggleEmailConfirmation = async (value: boolean) => {
    try {
      localStorage.setItem('requireEmailConfirmation', value.toString());
      setRequireEmailConfirmation(value);
      toast.success(value ? 'تم تفعيل تأكيد البريد الإلكتروني' : 'تم إلغاء تفعيل تأكيد البريد الإلكتروني');
    } catch (error) {
      console.error("Error updating email confirmation setting:", error);
      toast.error('حدث خطأ أثناء تحديث إعدادات تأكيد البريد الإلكتروني');
    }
  };

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("ليس لديك صلاحية الوصول إلى لوحة التحكم");
      navigate("/");
    }
  }, [authLoading, isAdmin, navigate]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-teal-700 ml-2">كلشي</h1>
            <span className="text-sm text-gray-500">لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-4">
            <AddProductButton />
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <Home className="w-4 h-4 ml-2" />
                العودة للموقع
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                م
              </div>
              <span className="text-sm font-medium">المدير</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1 py-2">
                  <Button
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none pr-2 text-right"
                    onClick={() => setActiveTab("overview")}
                  >
                    <PieChart className="h-4 w-4 ml-2" />
                    نظرة عامة
                  </Button>
                  <Button
                    variant={activeTab === "users" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none pr-2 text-right"
                    onClick={() => navigate("/admin/users")}
                  >
                    <Users className="h-4 w-4 ml-2" />
                    المستخدمون
                  </Button>
                  <Button
                    variant={activeTab === "products" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none pr-2 text-right"
                    onClick={() => navigate("/admin/products")}
                  >
                    <ShoppingBag className="h-4 w-4 ml-2" />
                    المنتجات
                  </Button>
                  <Button
                    variant={activeTab === "messages" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none pr-2 text-right"
                    onClick={() => setActiveTab("messages")}
                  >
                    <MessageSquare className="h-4 w-4 ml-2" />
                    الرسائل
                  </Button>
                  <Button
                    variant={activeTab === "stats" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none pr-2 text-right"
                    onClick={() => setActiveTab("stats")}
                  >
                    <BarChart className="h-4 w-4 ml-2" />
                    الإحصائيات
                  </Button>
                  <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none pr-2 text-right"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-4 w-4 ml-2" />
                    الإعدادات
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex justify-end mb-4">
                  <AddProductButton />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatsCard 
                    title="المستخدمون" 
                    value={loading ? "..." : stats.users} 
                    icon={<Users className="h-5 w-5" />} 
                  />
                  <StatsCard 
                    title="المنتجات" 
                    value={loading ? "..." : stats.products} 
                    icon={<ShoppingBag className="h-5 w-5" />} 
                  />
                  <StatsCard 
                    title="الرسائل" 
                    value={loading ? "..." : stats.messages} 
                    icon={<MessageSquare className="h-5 w-5" />} 
                  />
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>نظرة عامة على النشاط</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
                      <p className="text-gray-500">بيانات الرسم البياني هنا</p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>أحدث المستخدمين</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {loading ? (
                          <p className="text-center py-4">جاري التحميل...</p>
                        ) : recentUsers.length === 0 ? (
                          <p className="text-center py-4">لا يوجد مستخدمين</p>
                        ) : (
                          recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center gap-3 border-b pb-2">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
                                {user.username.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{user.username}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(user.created_at).toLocaleDateString('ar-SA')}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>أحدث المنتجات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {loading ? (
                          <p className="text-center py-4">جاري التحميل...</p>
                        ) : recentProducts.length === 0 ? (
                          <p className="text-center py-4">لا توجد منتجات</p>
                        ) : (
                          recentProducts.map((product) => (
                            <div key={product.id} className="flex items-center gap-3 border-b pb-2">
                              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-500">
                                <ShoppingBag className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">{product.title}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(product.created_at).toLocaleDateString('ar-SA')}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>الإعدادات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-confirmation">تأكيد البريد الإلكتروني</Label>
                        <p className="text-sm text-muted-foreground">
                          تفعيل هذا الخيار سيطلب من المستخدمين الجدد تأكيد بريدهم الإلكتروني
                        </p>
                      </div>
                      <Switch 
                        id="email-confirmation" 
                        checked={requireEmailConfirmation}
                        onCheckedChange={toggleEmailConfirmation}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {(activeTab === "messages" || activeTab === "stats") && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === "messages" && "إدارة الرسائل"}
                    {activeTab === "stats" && "الإحصائيات"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500">محتوى {
                      activeTab === "messages" ? "الرسائل" : 
                      "الإحصائيات"
                    } هنا</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
