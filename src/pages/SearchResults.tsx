
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

  // Filter group for the sidebar - fixed to match the FilterSidebar component type
  const filterGroups = [
    {
      title: "الفئة",
      options: [
        { id: "electronics", label: "إلكترونيات" },
        { id: "cars", label: "سيارات" },
        { id: "realestate", label: "عقارات" },
        { id: "furniture", label: "أثاث" },
        { id: "other", label: "أخرى" },
      ],
    },
    {
      title: "السعر",
      options: [
        { id: "0-1000", label: "0 - 1,000 دج" },
        { id: "1000-5000", label: "1,000 - 5,000 دج" },
        { id: "5000-10000", label: "5,000 - 10,000 دج" },
        { id: "10000-50000", label: "10,000 - 50,000 دج" },
        { id: "50000+", label: "50,000+ دج" },
      ],
    },
  ];

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-DZ');
  };

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
              <div className="grid grid-cols-1 gap-4">
                {results.map((product) => (
                  <ResultCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price.toString()}
                    location={product.location}
                    image={product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/300"}
                    date={formatDate(product.created_at)}
                    href={`/product/${product.id}`}
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
