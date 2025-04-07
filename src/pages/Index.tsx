
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import HighlightCard from "@/components/HighlightCard";
import PromotionBanner from "@/components/PromotionBanner";
import Footer from "@/components/Footer";
import { Car, ShoppingBag, Building2, Briefcase } from "lucide-react";

const Index = () => {
  // Sample data for highlights
  const highlights = [
    {
      id: 1,
      title: "قطة مين كون أنثى",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1143&q=80",
      category: "حيوانات أليفة",
      location: "سان موريتز (CO)",
    },
    {
      id: 2,
      title: "كلب بودل لعبة",
      image: "https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      category: "حيوانات أليفة",
      price: "١٢٠٠ د.إ",
      location: "تريفيزو (TV)",
    },
    {
      id: 3,
      title: "كلب جيرمان سبيتز قزم",
      image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=770&q=80",
      category: "حيوانات أليفة",
      location: "كومو (CO)",
    },
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
      </main>

      <Footer />
    </div>
  );
};

export default Index;
