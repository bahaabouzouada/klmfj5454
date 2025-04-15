
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import ResultCard from "@/components/ResultCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Search for products that match the query in title or description
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setResults(data || []);
      } catch (error: any) {
        console.error("Error fetching search results:", error);
        toast({
          title: "Error",
          description: `Failed to load search results: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, toast]);

  // Filter group for the sidebar
  const filterGroups = [
    {
      id: "category",
      title: "الفئة",
      options: [
        { value: "electronics", label: "إلكترونيات" },
        { value: "cars", label: "سيارات" },
        { value: "realestate", label: "عقارات" },
        { value: "furniture", label: "أثاث" },
        { value: "other", label: "أخرى" },
      ],
    },
    {
      id: "price",
      title: "السعر",
      options: [
        { value: "0-1000", label: "0 - 1,000 دج" },
        { value: "1000-5000", label: "1,000 - 5,000 دج" },
        { value: "5000-10000", label: "5,000 - 10,000 دج" },
        { value: "10000-50000", label: "10,000 - 50,000 دج" },
        { value: "50000+", label: "50,000+ دج" },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">نتائج البحث: {query}</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <FilterSidebar 
              title="تصفية النتائج"
              filterGroups={filterGroups}
            />
          </div>
          
          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <ResultCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price.toString()}
                    image={product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/300"}
                    location={product.location}
                    category={product.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">لم يتم العثور على نتائج مطابقة للبحث</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
