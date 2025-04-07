
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ChevronDown } from "lucide-react";

const SearchBar = () => {
  const [selectedCategory, setSelectedCategory] = useState("جميع الفئات");
  const [location, setLocation] = useState("جميع المناطق");

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        {/* What are you looking for? */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            عم تبحث؟
          </label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="سيارات، هواتف، عقارات..."
              className="pr-10"
            />
          </div>
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
          <Button className="bg-orange-500 hover:bg-orange-600 h-10 px-6">
            <Search className="h-4 w-4 ml-2" />
            بحث
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
