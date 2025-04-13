
import { Link } from "react-router-dom";

interface HighlightCardProps {
  id: string | number;
  title: string;
  image: string;
  category: string;
  price?: string;
  location?: string;
  condition?: string;
  seller?: string;
}

const HighlightCard = ({ 
  id,
  title, 
  image, 
  category, 
  price, 
  location, 
  condition, 
  seller 
}: HighlightCardProps) => {
  return (
    <Link to={`/product/${id}`} className="block rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
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
        {price && (
          <div className="font-bold text-teal-600 mb-1">{price}</div>
        )}
        {location && (
          <div className="text-sm text-gray-500 mb-1">{location}</div>
        )}
        {condition && (
          <div className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1 inline-block mb-1">
            {condition}
          </div>
        )}
        {seller && (
          <div className="text-xs text-gray-500">من: {seller}</div>
        )}
      </div>
    </Link>
  );
};

export default HighlightCard;
