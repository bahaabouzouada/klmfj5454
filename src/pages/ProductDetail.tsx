
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Phone, 
  MapPin, 
  Info, 
  ChevronLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Mock comments
const mockComments = [
  { id: 1, user: "أحمد محمد", date: "منذ 2 أيام", text: "هل الضمان ساري المفعول؟ وما هي مدة الضمان؟" },
  { id: 2, user: "سارة علي", date: "منذ 3 أيام", text: "هل يمكن التوصيل إلى منطقة بن عكنون؟ وما هي تكلفة التوصيل؟" },
  { id: 3, user: "محمد أمين", date: "منذ 5 أيام", text: "جودة ممتازة، سبق وتعاملت مع هذا المتجر ولم أواجه أي مشاكل في منتجاتهم." },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(mockComments);
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, profiles:seller_id(username)")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProduct(data);
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        toast({
          title: "خطأ في تحميل المنتج",
          description: error.message || "حدث خطأ أثناء محاولة تحميل المنتج",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, toast]);

  // Mock data fallback if no product found
  const productsData = [
    {
      id: "1",
      title: "شاشة سامسونج QLED 4K جديدة - 65 بوصة",
      images: [
        "https://images.unsplash.com/photo-1593640495390-1d98f0c8ddbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        "https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
        "https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=704&q=80",
      ],
      description: "شاشة سامسونج حجم 65 بوصة بدقة 4K فائقة الوضوح. إمكانية الاتصال الذكي بالإنترنت ومنافذ HDMI متعددة. اللون أسود. الجهاز جديد في علبته الأصلية مع الضمان الكامل من الوكيل المعتمد.",
      category: "إلكترونيات",
      price: "180,000 دج",
      location: "الجزائر العاصمة",
      condition: "جديد",
      seller: "محل الإلكترونيات المركزي",
      sellerPhone: "+213 555 123 456",
      datePosted: "منذ 3 أيام",
      viewCount: 128,
      features: [
        "شاشة QLED بحجم 65 بوصة",
        "دقة 4K فائقة الوضوح",
        "تقنية Quantum Dot للألوان الحية",
        "منافذ HDMI متعددة",
        "اتصال WiFi مدمج",
        "تصميم نحيف وأنيق",
        "جهاز تحكم ذكي"
      ]
    },
    // ... the rest of the mock products data
  ];

  // Use mock data if database product not found
  const productToDisplay = product || productsData.find(p => p.id === id);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!productToDisplay) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">عفواً، لم يتم العثور على المنتج</h1>
            <Link to="/" className="text-teal-600 hover:underline">
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يرجى تسجيل الدخول لإضافة تعليق",
      });
      navigate("/auth");
      return;
    }
    
    // Add new comment to the list
    const newComment = {
      id: comments.length + 1,
      user: user.email || "المستخدم الحالي",
      date: "الآن",
      text: commentText
    };
    
    setComments([newComment, ...comments]);
    setCommentText("");
    
    toast({
      title: "تم إضافة التعليق بنجاح",
      description: "شكراً على مشاركتك",
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "تمت إزالة المنتج من المفضلة" : "تمت إضافة المنتج إلى المفضلة",
      description: isFavorite ? "يمكنك إضافته مرة أخرى في أي وقت" : "يمكنك مشاهدة المفضلة في لوحة التحكم",
    });
  };

  const handleContactSeller = () => {
    toast({
      title: "جاري الاتصال بالبائع",
      description: `سيتم توجيهك للاتصال على الرقم: ${productToDisplay.sellerPhone || "غير متوفر"}`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "تمت مشاركة المنتج",
      description: "تم نسخ رابط المنتج إلى الحافظة",
    });
  };

  // Format price from database (numeric) to string with currency
  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      return `${price.toLocaleString()} دج`;
    }
    return price;
  };

  // Use either database images or mock images
  const productImages = product && product.images && product.images.length > 0 
    ? product.images 
    : (productToDisplay.images || ["https://via.placeholder.com/800x600?text=No+Image"]);

  // Get seller name from profile relation or use fallback
  const sellerName = product ? 
    (product.profiles ? product.profiles.username : "بائع غير معروف") : 
    productToDisplay.seller;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-teal-600 mb-6">
            <ChevronLeft className="h-5 w-5 ml-1" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product images */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden h-80">
                <img 
                  src={productImages[activeImageIndex] || "https://via.placeholder.com/800x600?text=No+Image"} 
                  alt={productToDisplay.title} 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex space-x-2 rtl:space-x-reverse">
                {productImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                      activeImageIndex === index ? 'border-teal-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`صورة ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{productToDisplay.title}</h1>
                <button 
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <Heart className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
              
              <div className="text-2xl font-bold text-teal-600 mb-4">
                {formatPrice(productToDisplay.price)}
              </div>
              
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <MapPin className="h-4 w-4 ml-1" />
                <span>{productToDisplay.location}</span>
                <span className="mx-2">•</span>
                <span>{productToDisplay.datePosted || "تاريخ غير محدد"}</span>
                <span className="mx-2">•</span>
                <span>{productToDisplay.viewCount || 0} مشاهدة</span>
              </div>
              
              <div className="bg-gray-100 rounded-md px-3 py-2 inline-block text-sm text-gray-600 mb-4">
                {productToDisplay.condition}
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">الوصف:</h3>
                <p className="text-gray-600">{productToDisplay.description}</p>
              </div>
              
              {productToDisplay.features && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">المميزات:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 pr-4">
                    {productToDisplay.features.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-2">البائع:</h3>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">{sellerName}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 rtl:space-x-reverse">
                <Button onClick={handleContactSeller} className="flex-1 bg-teal-600 hover:bg-teal-700">
                  <Phone className="ml-2 h-5 w-5" />
                  اتصل بالبائع
                </Button>
                <Button variant="outline" onClick={handleShare} className="flex-1">
                  <Share2 className="ml-2 h-5 w-5" />
                  مشاركة
                </Button>
              </div>
            </div>
          </div>

          {/* Comments section */}
          <div className="mt-12">
            <Tabs defaultValue="comments" className="w-full">
              <TabsList className="w-full border-b">
                <TabsTrigger value="comments" className="flex items-center">
                  <MessageSquare className="h-4 w-4 ml-2" />
                  التعليقات ({comments.length})
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center">
                  <Info className="h-4 w-4 ml-2" />
                  تفاصيل إضافية
                </TabsTrigger>
              </TabsList>
              <TabsContent value="comments" className="pt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-4">أضف تعليقك</h3>
                      <Textarea
                        placeholder="اكتب تعليقك أو سؤالك هنا..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="resize-none mb-4"
                        rows={4}
                      />
                      <Button onClick={handleCommentSubmit} disabled={!commentText.trim()}>
                        إرسال التعليق
                      </Button>
                    </div>
                    
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{comment.user}</div>
                            <div className="text-sm text-gray-500">{comment.date}</div>
                          </div>
                          <p className="text-gray-600">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="details" className="pt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">معلومات المنتج:</h3>
                          <ul className="space-y-2">
                            <li className="flex justify-between">
                              <span className="text-gray-600">الفئة:</span>
                              <span>{productToDisplay.category}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">الحالة:</span>
                              <span>{productToDisplay.condition}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">السعر:</span>
                              <span className="font-medium text-teal-600">{formatPrice(productToDisplay.price)}</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">معلومات البائع:</h3>
                          <ul className="space-y-2">
                            <li className="flex justify-between">
                              <span className="text-gray-600">الاسم:</span>
                              <span>{sellerName}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">الموقع:</span>
                              <span>{productToDisplay.location}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">تاريخ النشر:</span>
                              <span>{productToDisplay.datePosted || "غير محدد"}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
