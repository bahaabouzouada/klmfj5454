
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ChevronDown, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type Product = {
  id: string;
  title: string;
  category: string;
};

const SearchBar = () => {
  const [selectedCategory, setSelectedCategory] = useState("جميع الفئات");
  const [location, setLocation] = useState("جميع المناطق");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, title, category")
          .ilike("title", `%${searchTerm}%`)
          .limit(5);

        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search queries
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}&category=${selectedCategory}&location=${location}`);
    }
  };

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
    setShowResults(false);
  };

  const handleInputFocus = () => {
    if (searchTerm.length >= 2) {
      setShowResults(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        {/* What are you looking for? */}
        <div className="flex-1 relative" ref={searchRef}>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            عم تبحث؟
          </label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="سيارات، هواتف، عقارات..."
              className="pr-10"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-3 text-center text-sm text-gray-500">جاري البحث...</div>
              ) : (
                <ul className="py-1">
                  {searchResults.map((product) => (
                    <li 
                      key={product.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{product.title}</span>
                        <span className="text-xs text-gray-500">{product.category}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Category selection */}
        <div className="w-full md:w-64">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            في أي فئة؟
          </label>
          <div className="relative">
            <div className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:border-teal-500 transition-colors">
              <span>{selectedCategory}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Location selection */}
        <div className="w-full md:w-64">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            أين؟
          </label>
          <div className="relative">
            <div className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:border-teal-500 transition-colors">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 ml-2" />
                <span>{location}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Search button */}
        <div className="self-end">
          <Button 
            className="bg-orange-500 hover:bg-orange-600 h-10 px-6"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 ml-2" />
            بحث
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
