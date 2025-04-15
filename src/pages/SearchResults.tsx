
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import ResultCard from "@/components/ResultCard";
import FilterSidebar from "@/components/FilterSidebar";
import { supabase } from "@/integrations/supabase/client";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  condition: string;
  images: string[];
  created_at: string;
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'جميع الفئات';
  const location = searchParams.get('location') || 'جميع المناطق';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let queryBuilder = supabase
          .from('products')
          .select('*', { count: 'exact' });
          
        // Add search term filter
        if (query) {
          queryBuilder = queryBuilder.ilike('title', `%${query}%`);
        }
        
        // Add category filter if not "all categories"
        if (category !== 'جميع الفئات') {
          queryBuilder = queryBuilder.eq('category', category);
        }
        
        // Add location filter if not "all locations"
        if (location !== 'جميع المناطق') {
          queryBuilder = queryBuilder.eq('location', location);
        }
        
        const { data, error, count } = await queryBuilder;
        
        if (error) throw error;
        
        setProducts(data || []);
        setTotalResults(count || 0);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [query, category, location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <SearchBar />
          
          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <div className="w-full md:w-64 lg:w-72">
              <FilterSidebar />
            </div>
            
            <div className="flex-1">
              <div className="mb-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">
                  {query ? `نتائج البحث عن "${query}"` : 'جميع المنتجات'}
                </h1>
                <p className="text-sm text-gray-500">
                  {totalResults} منتج
                </p>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="bg-gray-50 rounded-lg py-8 text-center">
                  <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد نتائج</h3>
                  <p className="text-gray-500">حاول استخدام كلمات بحث مختلفة أو تصفية أخرى</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ResultCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={`${product.price} دج`}
                      location={product.location}
                      imageUrl={product.images?.[0] || '/placeholder.svg'}
                      category={product.category}
                      condition={product.condition}
                      date={new Date(product.created_at).toLocaleDateString('ar-SA')}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
