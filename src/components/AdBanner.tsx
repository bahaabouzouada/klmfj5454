
import React from 'react';
import { X } from 'lucide-react';

interface AdBannerProps {
  title?: string;
  image: string;
  onClose: () => void;
  height?: string;
  fullWidth?: boolean;
  vertical?: boolean;
}

const AdBanner = ({ 
  title = "إعلان",
  image, 
  onClose,
  height = "h-40",
  fullWidth = false,
  vertical = false
}: AdBannerProps) => {
  return (
    <div className={`relative rounded-lg overflow-hidden ${height} bg-gray-100 shadow-sm border border-gray-200`}>
      {/* إظهار صورة الإعلان */}
      <img 
        src={image} 
        alt={title}
        className={`w-full h-full object-cover ${vertical ? 'object-top' : 'object-center'}`}
      />
      
      {/* طبقة داكنة خفيفة لزيادة وضوح العنوان */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent h-12"></div>
      
      {/* عنوان الإعلان */}
      <div className="absolute top-2 right-3 text-white text-sm font-medium flex items-center">
        <span className="bg-black/50 px-2 py-1 rounded text-xs">{title}</span>
      </div>
      
      {/* زر إغلاق الإعلان */}
      <button 
        onClick={onClose}
        className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
        aria-label="إغلاق الإعلان"
      >
        <X className="h-4 w-4" />
      </button>
      
      {/* إضافة زر للحملة الإعلانية في أسفل الإعلان إذا كان بعرض كامل */}
      {fullWidth && (
        <div className="absolute bottom-3 right-3">
          <a 
            href="#" 
            className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700 transition-colors"
          >
            تصفح العرض
          </a>
        </div>
      )}
    </div>
  );
};

export default AdBanner;
