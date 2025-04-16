
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  Plus, 
  Edit, 
  Grid, 
  Layers 
} from "lucide-react";
import AdBanner from "@/components/AdBanner";

// نموذج لبيانات الإعلان
interface Ad {
  id: string;
  title: string;
  image: string;
  position: string;
  isActive: boolean;
  clickCount: number;
  impressions: number;
  startDate: string;
  endDate: string;
}

const AdsManagement = () => {
  const [ads, setAds] = useState<Ad[]>([
    {
      id: "1",
      title: "إعلان رئيسي",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop",
      position: "الصفحة الرئيسية",
      isActive: true,
      clickCount: 245,
      impressions: 1240,
      startDate: "2025-04-01",
      endDate: "2025-05-01"
    },
    {
      id: "2",
      title: "إعلان جانبي",
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop",
      position: "الصفحة الرئيسية - جانبي",
      isActive: true,
      clickCount: 120,
      impressions: 980,
      startDate: "2025-04-05",
      endDate: "2025-05-05"
    },
    {
      id: "3",
      title: "إعلان فئة السيارات",
      image: "https://images.unsplash.com/photo-1624486522963-89c929e1e83c?w=800&auto=format&fit=crop",
      position: "صفحة السيارات",
      isActive: false,
      clickCount: 78,
      impressions: 560,
      startDate: "2025-03-20",
      endDate: "2025-04-20"
    }
  ]);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  
  // يمكن استخدام هذه الدالة للتحقق مما إذا كان المستخدم مشرفًا
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();
      
      if (error || !data?.is_admin) {
        navigate('/');
        toast({
          title: "خطأ في الوصول",
          description: "يجب أن تكون مشرفًا للوصول إلى هذه الصفحة",
          variant: "destructive"
        });
      }
    };
    
    checkAdminStatus();
  }, [navigate, toast]);
  
  // تبديل حالة الإعلان (نشط/غير نشط)
  const toggleAdStatus = (id: string) => {
    setAds(ads.map(ad => 
      ad.id === id ? { ...ad, isActive: !ad.isActive } : ad
    ));
    
    toast({
      title: "تم تحديث الإعلان",
      description: "تم تحديث حالة الإعلان بنجاح",
    });
  };
  
  // حذف إعلان
  const deleteAd = (id: string) => {
    setAds(ads.filter(ad => ad.id !== id));
    
    toast({
      title: "تم حذف الإعلان",
      description: "تم حذف الإعلان بنجاح",
    });
  };
  
  // يمكن إضافة دوال لإضافة وتعديل الإعلانات لاحقًا
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة الإعلانات</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin">العودة للوحة التحكم</Link>
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> إضافة إعلان جديد
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">جميع الإعلانات</TabsTrigger>
            <TabsTrigger value="active">الإعلانات النشطة</TabsTrigger>
            <TabsTrigger value="inactive">الإعلانات غير النشطة</TabsTrigger>
            <TabsTrigger value="preview">معاينة الإعلانات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>جميع الإعلانات</CardTitle>
                <CardDescription>عرض وإدارة جميع الإعلانات في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان الإعلان</TableHead>
                      <TableHead>الموقع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>النقرات</TableHead>
                      <TableHead>المشاهدات</TableHead>
                      <TableHead>تاريخ البداية</TableHead>
                      <TableHead>تاريخ النهاية</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ads.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell className="font-medium">{ad.title}</TableCell>
                        <TableCell>{ad.position}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${ad.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {ad.isActive ? 'نشط' : 'غير نشط'}
                          </span>
                        </TableCell>
                        <TableCell>{ad.clickCount}</TableCell>
                        <TableCell>{ad.impressions}</TableCell>
                        <TableCell>{ad.startDate}</TableCell>
                        <TableCell>{ad.endDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => toggleAdStatus(ad.id)}
                            >
                              {ad.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => deleteAd(ad.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>الإعلانات النشطة</CardTitle>
                <CardDescription>الإعلانات المعروضة حاليًا على الموقع</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان الإعلان</TableHead>
                      <TableHead>الموقع</TableHead>
                      <TableHead>النقرات</TableHead>
                      <TableHead>المشاهدات</TableHead>
                      <TableHead>تاريخ النهاية</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ads.filter(ad => ad.isActive).map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell className="font-medium">{ad.title}</TableCell>
                        <TableCell>{ad.position}</TableCell>
                        <TableCell>{ad.clickCount}</TableCell>
                        <TableCell>{ad.impressions}</TableCell>
                        <TableCell>{ad.endDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => toggleAdStatus(ad.id)}
                            >
                              <EyeOff className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inactive">
            <Card>
              <CardHeader>
                <CardTitle>الإعلانات غير النشطة</CardTitle>
                <CardDescription>الإعلانات المتوقفة حاليًا</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان الإعلان</TableHead>
                      <TableHead>الموقع</TableHead>
                      <TableHead>تاريخ البداية</TableHead>
                      <TableHead>تاريخ النهاية</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ads.filter(ad => !ad.isActive).map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell className="font-medium">{ad.title}</TableCell>
                        <TableCell>{ad.position}</TableCell>
                        <TableCell>{ad.startDate}</TableCell>
                        <TableCell>{ad.endDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => toggleAdStatus(ad.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => deleteAd(ad.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>معاينة الإعلانات</CardTitle>
                <CardDescription>عرض شكل الإعلانات كما ستظهر للمستخدمين</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-medium mb-3">الإعلان الرئيسي</h3>
                    {ads.find(ad => ad.id === "1") && (
                      <AdBanner 
                        title={ads.find(ad => ad.id === "1")?.title}
                        image={ads.find(ad => ad.id === "1")?.image || ""}
                        onClose={() => {}}
                        height="h-60"
                        fullWidth
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">الإعلان الجانبي</h3>
                    {ads.find(ad => ad.id === "2") && (
                      <AdBanner 
                        title={ads.find(ad => ad.id === "2")?.title}
                        image={ads.find(ad => ad.id === "2")?.image || ""}
                        onClose={() => {}}
                        height="h-60"
                      />
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">إعلان صفحة الفئة</h3>
                  {ads.find(ad => ad.id === "3") && (
                    <AdBanner 
                      title={ads.find(ad => ad.id === "3")?.title}
                      image={ads.find(ad => ad.id === "3")?.image || ""}
                      onClose={() => {}}
                      height="h-40"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdsManagement;
