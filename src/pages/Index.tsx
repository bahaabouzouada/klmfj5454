
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import HighlightCard from "@/components/HighlightCard";
import PromotionBanner from "@/components/PromotionBanner";
import Footer from "@/components/Footer";
import { Car, ShoppingBag, Building2, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Updated highlights with more realistic product listings
  const highlights = [
    {
      id: 1,
      title: "شاشة سامسونج QLED 4K جديدة - 65 بوصة",
      image: "https://images.unsplash.com/photo-1593640495390-1d98f0c8ddbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      category: "إلكترونيات",
      price: "180,000 دج",
      location: "الجزائر العاصمة",
      condition: "جديد",
      seller: "محل الإلكترونيات المركزي"
    },
    {
      id: 2,
      title: "سيارة هيونداي أكسنت 2019 - حالة ممتازة",
      image: "https://images.unsplash.com/photo-1555367692-1960a922f8e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
      category: "سيارات مستعملة",
      price: "1,200,000 دج",
      location: "وهران",
      condition: "مستعمل - ممتاز",
      seller: "معرض السيارات الوطني"
    },
    {
      id: 3,
      title: "هاتف آيفون 13 برو - 256 جيجا بايت",
      image: "https://images.unsplash.com/photo-1615394239346-8a6da8d64279?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      category: "هواتف ذكية",
      price: "95,000 دج",
      location: "قسنطينة",
      condition: "جديد - بكفالة",
      seller: "متجر التكنولوجيا"
    },
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

        {/* Advertisement space */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
              <p className="text-gray-500">مساحة إعلانية</p>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold mb-6">اكتشافات بانتظارك</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {highlights.map((item) => (
                <HighlightCard
                  key={item.id}
                  title={item.title}
                  image={item.image}
                  category={item.category}
                  price={item.price}
                  location={item.location}
                  // Pass additional details to the card component
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
