
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface ResultCardProps {
  id: number;
  title: string;
  price?: string;
  location: string;
  image: string;
  date: string;
  href: string;
}

const ResultCard = ({
  id,
  title,
  price,
  location,
  image,
  date,
  href,
}: ResultCardProps) => {
  return (
    <Link
      to={href}
      className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image container */}
      <div className="w-full md:w-48 h-48 md:h-36 flex-shrink-0 rounded-md overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
            {price && (
              <div className="text-lg font-bold text-teal-600 mb-2">
                {price}
              </div>
            )}
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <span>{location}</span>
              <span className="mx-2">•</span>
              <span>{date}</span>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-red-500 focus:outline-none">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ResultCard;
