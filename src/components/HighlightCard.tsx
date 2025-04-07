
import { Link } from "react-router-dom";

interface HighlightCardProps {
  title: string;
  image: string;
  category: string;
  price?: string;
  location?: string;
}

const HighlightCard = ({ title, image, category, price, location }: HighlightCardProps) => {
  return (
    <Link to="#" className="block rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded">
          {category}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-800 mb-1 truncate">{title}</h3>
        {location && (
          <div className="text-sm text-gray-500 mb-1">{location}</div>
        )}
        {price && (
          <div className="font-bold text-teal-600">{price}</div>
        )}
      </div>
    </Link>
  );
};

export default HighlightCard;
