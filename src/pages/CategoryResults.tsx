
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import ResultCard from "@/components/ResultCard";
import SearchBar from "@/components/SearchBar";

const CategoryResults = () => {
  const { category } = useParams<{ category: string }>();

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

  // بيانات تجريبية للنتائج
  const getCategoryResults = (category: string) => {
    switch (category) {
      case "cars":
        return [
          {
            id: 1,
            title: "تويوتا كورولا 2022",
            price: "١١٥,٠٠٠ د.إ",
            location: "دبي",
            image:
              "https://images.unsplash.com/photo-1590510733081-aaa302dad8f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
            date: "منذ يومين",
            href: "/cars/1",
          },
          {
            id: 2,
            title: "نيسان التيما 2021",
            price: "٨٥,٠٠٠ د.إ",
            location: "أبو ظبي",
            image:
              "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
            date: "منذ ٣ أيام",
            href: "/cars/2",
          },
          {
            id: 3,
            title: "مرسيدس C-Class 2023",
            price: "٢٣٠,٠٠٠ د.إ",
            location: "الشارقة",
            image:
              "https://images.unsplash.com/photo-1563720223185-5ae1639f3d77?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
            date: "منذ أسبوع",
            href: "/cars/3",
          },
          {
            id: 4,
            title: "أودي A6 2022",
            price: "١٩٠,٠٠٠ د.إ",
            location: "عجمان",
            image:
              "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
            date: "منذ أسبوعين",
            href: "/cars/4",
          },
        ];
      case "real-estate":
        return [
          {
            id: 1,
            title: "شقة فاخرة بإطلالة بحرية",
            price: "١,٢٠٠,٠٠٠ د.إ",
            location: "دبي مارينا",
            image:
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            date: "منذ ٣ أيام",
            href: "/real-estate/1",
          },
          {
            id: 2,
            title: "فيلا مستقلة مع حديقة",
            price: "٣,٥٠٠,٠٠٠ د.إ",
            location: "جميرا",
            image:
              "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
            date: "منذ أسبوع",
            href: "/real-estate/2",
          },
          {
            id: 3,
            title: "شقة غرفتين وصالة للإيجار",
            price: "٧٠,٠٠٠ د.إ / سنوياً",
            location: "البرشاء",
            image:
              "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
            date: "منذ ٥ أيام",
            href: "/real-estate/3",
          },
          {
            id: 4,
            title: "أرض سكنية للبيع",
            price: "٢,٢٠٠,٠٠٠ د.إ",
            location: "الخوانيج",
            image:
              "https://images.unsplash.com/photo-1524813686514-a57563d77965?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80",
            date: "منذ أسبوعين",
            href: "/real-estate/4",
          },
        ];
      case "market":
      default:
        return [
          {
            id: 1,
            title: "آيفون 14 برو ماكس",
            price: "٤,٥٠٠ د.إ",
            location: "دبي",
            image:
              "https://images.unsplash.com/photo-1660800025976-bc447143ceaa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
            date: "منذ يوم",
            href: "/market/1",
          },
          {
            id: 2,
            title: "كنبة جلد إيطالي ٣ مقاعد",
            price: "٢,٢٠٠ د.إ",
            location: "أبو ظبي",
            image:
              "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
            date: "منذ ٣ أيام",
            href: "/market/2",
          },
          {
            id: 3,
            title: "سماعات سوني XM4",
            price: "٩٠٠ د.إ",
            location: "الشارقة",
            image:
              "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
            date: "منذ أسبوع",
            href: "/market/3",
          },
          {
            id: 4,
            title: "ساعة أبل الإصدار ٨",
            price: "١,٣٠٠ د.إ",
            location: "عجمان",
            image:
              "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
            date: "منذ أسبوعين",
            href: "/market/4",
          },
        ];
    }
  };

  // الحصول على عنوان الفئة
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
  const results = getCategoryResults(category || "");
  const categoryTitle = getCategoryTitle(category || "");

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
                <div className="space-y-4">
                  {results.map((result) => (
                    <ResultCard key={result.id} {...result} />
                  ))}
                </div>
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
