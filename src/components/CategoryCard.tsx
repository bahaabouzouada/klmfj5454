
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  icon: ReactNode;
  color: string;
  href: string;
}

const CategoryCard = ({ title, icon, color, href }: CategoryCardProps) => {
  return (
    <Link 
      to={href} 
      className={`flex items-center gap-3 p-4 rounded-lg hover:shadow-md transition-all ${color}`}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full">
        {icon}
      </div>
      <span className="font-medium">{title}</span>
    </Link>
  );
};

export default CategoryCard;
