import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import ResultCard from "@/components/ResultCard";
import SearchBar from "@/components/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdBanner from "@/components/AdBanner";

const CategoryResults = () => {
  const { category } = useParams<{ category: string }>();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [showAd, setShowAd] = useState(true);

  // بيانات تجريبية للفلاتر حسب الفئة
  const getFiltersByCategory = (category: string) => {
    switch (category) {
      case "cars":
        return [
          {
            title: "الماركة",
            options: [
              { id: "brand-toyota", label: "تويوتا" },
              { id: "brand-honda", label: "هوندا" },
              { id: "brand-nissan", label: "نيسان" },
              { id: "brand-bmw", label: "بي ام دبليو" },
              { id: "brand-mercedes", label: "مرسيدس" },
            ],
          },
          {
            title: "السنة",
            options: [
              { id: "year-2023", label: "2023" },
              { id: "year-2022", label: "2022" },
              { id: "year-2021", label: "2021" },
              { id: "year-2020", label: "2020" },
              { id: "year-2019", label: "2019" },
            ],
          },
          {
            title: "نوع الوقود",
            options: [
              { id: "fuel-petrol", label: "بنزين" },
              { id: "fuel-diesel", label: "ديزل" },
              { id: "fuel-electric", label: "كهربائي" },
              { id: "fuel-hybrid", label: "هجين" },
            ],
          },
        ];
      case "real-estate":
        return [
          {
            title: "نوع العقار",
            options: [
              { id: "type-apartment", label: "شقة" },
              { id: "type-villa", label: "فيلا" },
              { id: "type-land", label: "أرض" },
              { id: "type-commercial", label: "تجاري" },
            ],
          },
          {
            title: "عدد الغرف",
            options: [
              { id: "rooms-1", label: "غرفة" },
              { id: "rooms-2", label: "غرفتين" },
              { id: "rooms-3", label: "3 غرف" },
              { id: "rooms-4", label: "4 غرف" },
              { id: "rooms-5", label: "5+ غرف" },
            ],
          },
          {
            title: "العرض",
            options: [
              { id: "offer-sale", label: "للبيع" },
              { id: "offer-rent", label: "للإيجار" },
            ],
          },
        ];
      case "market":
      default:
        return [
          {
            title: "الفئة",
            options: [
              { id: "category-electronics", label: "إلكترونيات" },
              { id: "category-clothing", label: "ملابس" },
              { id: "category-furniture", label: "أثاث" },
              { id: "category-books", label: "كتب" },
              { id: "category-sports", label: "رياضة" },
            ],
          },
          {
            title: "الحالة",
            options: [
              { id: "condition-new", label: "جديد" },
              { id: "condition-used", label: "مستعمل بحالة ممتازة" },
              { id: "condition-good", label: "مستعمل بحالة جيدة" },
              { id: "condition-fair", label: "مستعمل" },
            ],
          },
          {
            title: "السعر",
            options: [
              { id: "price-1", label: "أقل من ٥٠٠ د.إ" },
              { id: "price-2", label: "٥٠٠ - ١٠٠٠ د.إ" },
              { id: "price-3", label: "١٠٠٠ - ٣٠٠٠ د.إ" },
              { id: "price-4", label: "أكثر من ٣٠٠٠ د.إ" },
            ],
          },
        ];
    }
  };

  // Get category mapping
  const getCategoryMapping = (routeCategory: string | undefined) => {
    switch (routeCategory) {
      case "cars":
        return "سيارات";
      case "real-estate":
        return "عقارات";
      case "jobs":
        return "وظائف";
      case "market":
        return "السوق";
      default:
        return "منتجات";
    }
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      const dbCategory = getCategoryMapping(category);
      
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("category", dbCategory)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setResults(data || []);
      } catch (error: any) {
        console.error("Error fetching category products:", error);
        toast({
          title: "خطأ",
          description: `فشل في تحميل المنتجات: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category, toast]);

  // الحصول على عنوان الفئة للعرض
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "cars":
        return "سيارات";
      case "real-estate":
        return "عقارات";
      case "market":
        return "السوق";
      case "jobs":
        return "وظائف";
      default:
        return "نتائج البحث";
    }
  };

  const filters = getFiltersByCategory(category || "");
  const categoryTitle = getCategoryTitle(category || "");

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-DZ');
  };

  // Hide advertisement
  const handleHideAd = () => {
    setShowAd(false);
    toast({
      title: "تم إخفاء الإعلان",
      description: "لن يظهر هذا الإعلان مرة أخرى خلال هذه الجلسة",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero section with search */}
        <section className="bg-gradient-to-bl from-teal-500 to-teal-600 py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-white text-xl md:text-2xl font-bold mb-4 text-center">
              {categoryTitle}
            </h1>
            <div className="max-w-4xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Advertisement section */}
        {showAd && (
          <section className="py-4">
            <div className="container mx-auto px-4">
              <AdBanner 
                title="إعلان مميز" 
                onClose={handleHideAd} 
                image="https://images.unsplash.com/photo-1624486522963-89c929e1e83c?w=800&auto=format&fit=crop"
                height="h-40"
              />
            </div>
          </section>
        )}

        {/* Results section with sidebar */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <div className="w-full lg:w-1/4">
                <FilterSidebar
                  title="فلتر النتائج"
                  filterGroups={filters}
                />
              </div>

              {/* Results */}
              <div className="w-full lg:w-3/4">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">
                      {results.length} نتيجة
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">ترتيب حسب:</span>
                      <select className="text-sm border rounded p-1">
                        <option>الأحدث</option>
                        <option>السعر: الأقل للأعلى</option>
                        <option>السعر: الأعلى للأقل</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Results list */}
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((product) => (
                      <ResultCard 
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={`${product.price} دج`}
                        location={product.location}
                        image={product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/300"}
                        date={formatDate(product.created_at)}
                        href={`/product/${product.id}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">لم يتم العثور على نتائج مطابقة في هذه الفئة</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryResults;
