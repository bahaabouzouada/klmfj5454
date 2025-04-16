import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import HighlightCard from "@/components/HighlightCard";
import PromotionBanner from "@/components/PromotionBanner";
import Footer from "@/components/Footer";
import { Car, ShoppingBag, Building2, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdBanner from "@/components/AdBanner";

const Index = () => {
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMainAd, setShowMainAd] = useState(true);
  const [showSideAd, setShowSideAd] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch latest products
    const fetchLatestProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);
        
        if (error) throw error;
        setLatestProducts(data || []);
      } catch (error) {
        console.error("Error fetching latest products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  // Define sample highlights for the static section
  const highlights = [
    {
      id: 1,
      title: "سيارة فورد موستانج 2022",
      image: "https://images.unsplash.com/photo-1581650107963-3e8c1f48241b?w=800&auto=format&fit=crop",
      category: "سيارات",
      price: "3,200,000 دج",
      location: "الجزائر العاصمة",
      condition: "جديد",
      seller: "محمد"
    },
    {
      id: 2,
      title: "شقة فاخرة للإيجار",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop",
      category: "عقارات",
      price: "70,000 دج / شهر",
      location: "وهران",
      condition: "ممتاز",
      seller: "أحمد"
    },
    {
      id: 3,
      title: "آيفون 13 برو ماكس",
      image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop",
      category: "إلكترونيات",
      price: "180,000 دج",
      location: "قسنطينة",
      condition: "مستعمل",
      seller: "فاطمة"
    }
  ];

  // Data for keywords sections
  const carKeywords = [
    { id: 1, title: "سيارات كورية", href: "/search?q=سيارات-كورية" },
    { id: 2, title: "سيارات فرنسية", href: "/search?q=سيارات-فرنسية" },
    { id: 3, title: "سيارات ألمانية", href: "/search?q=سيارات-ألمانية" },
    { id: 4, title: "سيارات صينية", href: "/search?q=سيارات-صينية" },
    { id: 5, title: "سيارات يابانية", href: "/search?q=سيارات-يابانية" },
    { id: 6, title: "هيونداي", href: "/search?q=هيونداي" },
    { id: 7, title: "رينو", href: "/search?q=رينو" },
    { id: 8, title: "بيجو", href: "/search?q=بيجو" },
    { id: 9, title: "مرسيدس", href: "/search?q=مرسيدس" },
    { id: 10, title: "بي ام دبليو", href: "/search?q=بي-ام-دبليو" },
  ];

  const electronicsKeywords = [
    { id: 1, title: "سامسونج", href: "/search?q=سامسونج" },
    { id: 2, title: "آيفون", href: "/search?q=آيفون" },
    { id: 3, title: "هواوي", href: "/search?q=هواوي" },
    { id: 4, title: "شاومي", href: "/search?q=شاومي" },
    { id: 5, title: "اوبو", href: "/search?q=اوبو" },
    { id: 6, title: "نوكيا", href: "/search?q=نوكيا" },
    { id: 7, title: "سوني", href: "/search?q=سوني" },
    { id: 8, title: "إل جي", href: "/search?q=إل-جي" },
    { id: 9, title: "لابتوب", href: "/search?q=لابتوب" },
    { id: 10, title: "تلفزيون", href: "/search?q=تلفزيون" },
  ];

  // Handle ad closure
  const handleCloseMainAd = () => {
    setShowMainAd(false);
    toast({
      title: "تم إخفاء الإعلان",
      description: "لن يظهر هذا الإعلان مرة أخرى خلال هذه الجلسة",
    });
  };

  const handleCloseSideAd = () => {
    setShowSideAd(false);
    toast({
      title: "تم إخفاء الإعلان",
      description: "لن يظهر هذا الإعلان الجانبي مرة أخرى خلال هذه الجلسة",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section with search */}
        <section className="bg-gradient-to-bl from-teal-500 to-teal-600 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-6 text-center">
              ابحث عن كل ما تحتاجه في مكان واحد
            </h1>
            <div className="max-w-4xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <CategoryCard 
                title="سيارات" 
                icon={<Car className="h-6 w-6 text-teal-600" />} 
                color="bg-teal-50 hover:bg-teal-100"
                href="/categories/cars"
              />
              <CategoryCard 
                title="السوق" 
                icon={<ShoppingBag className="h-6 w-6 text-orange-500" />} 
                color="bg-orange-50 hover:bg-orange-100"
                href="/categories/market"
              />
              <CategoryCard 
                title="عقارات" 
                icon={<Building2 className="h-6 w-6 text-purple-500" />} 
                color="bg-purple-50 hover:bg-purple-100"
                href="/categories/real-estate"
              />
              <CategoryCard 
                title="وظائف" 
                icon={<Briefcase className="h-6 w-6 text-teal-600" />} 
                color="bg-teal-50 hover:bg-teal-100"
                href="/categories/jobs"
              />
            </div>
          </div>
        </section>

        {/* Main Advertisement space */}
        {showMainAd && (
          <section className="py-6">
            <div className="container mx-auto px-4">
              <AdBanner 
                title="إعلان مميز" 
                onClose={handleCloseMainAd}
                image="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop"
                height="h-60"
                fullWidth
              />
            </div>
          </section>
        )}

        {/* Latest Products with Side Ad */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold mb-6">أحدث المنتجات</h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className={`${showSideAd ? 'md:w-3/4' : 'w-full'}`}>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                ) : latestProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {latestProducts.map((item) => (
                      <HighlightCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        image={item.images && item.images.length > 0 ? item.images[0] : "https://via.placeholder.com/300"}
                        category={item.category}
                        price={`${item.price} دج`}
                        location={item.location}
                        condition={item.condition}
                        seller={item.seller_id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">لا توجد منتجات متاحة حاليًا</p>
                  </div>
                )}
              </div>
              
              {/* Side Advertisement */}
              {showSideAd && (
                <div className="md:w-1/4">
                  <AdBanner 
                    title="إعلان جانبي" 
                    onClose={handleCloseSideAd}
                    image="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop"
                    height="h-full min-h-[400px]"
                    vertical
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Old highlights section can stay with the static data */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold mb-6">اكتشافات بانتظارك</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {highlights.map((item) => (
                <HighlightCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  category={item.category}
                  price={item.price}
                  location={item.location}
                  condition={item.condition}
                  seller={item.seller}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Car promotion */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold mb-6">لمحبي السيارات</h2>
            
            <PromotionBanner
              title="ابحث عن سيارتك القادمة"
              description="اختر سيارتك القادمة واكسسواراتها من أكبر سوق للسيارات"
              actionText="عرض جميع السيارات"
              actionLink="/cars"
              secondaryActionText="عرض الكل"
              secondaryActionLink="/all"
              image="https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1536&q=80"
            />
          </div>
        </section>

        {/* Keywords for Cars */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-6">تصفح حسب نوع السيارة</h2>
            
            <div className="flex flex-wrap gap-3">
              {carKeywords.map((keyword) => (
                <Link 
                  key={keyword.id} 
                  to={keyword.href}
                  className="bg-white px-4 py-2 rounded-full text-sm border border-gray-200 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-600 transition-colors"
                >
                  {keyword.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Keywords for Electronics */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-6">تصفح حسب الإلكترونيات</h2>
            
            <div className="flex flex-wrap gap-3">
              {electronicsKeywords.map((keyword) => (
                <Link 
                  key={keyword.id} 
                  to={keyword.href}
                  className="bg-white px-4 py-2 rounded-full text-sm border border-gray-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-colors"
                >
                  {keyword.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
