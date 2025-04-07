
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="w-full">
      {/* Top announcement bar */}
      <div className="bg-orange-100 text-orange-800 py-2 px-4 flex justify-center items-center text-sm relative">
        <div className="flex items-center">
          <span>ضع إعلانك على الصفحة الرئيسية للوصول إلى المزيد من المستخدمين.</span>
          <Link to="/more" className="mr-2 font-bold text-orange-600 hover:text-orange-700">
            اكتشف المزيد
          </Link>
        </div>
      </div>

      {/* Main navbar */}
      <div className="border-b">
        <div className="container flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-orange-500">
              سوبيتو
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link to="/magazine" className="text-gray-600 hover:text-teal-600">
              المجلة
            </Link>
            <Link to="/selling-tips" className="text-gray-600 hover:text-teal-600">
              نصائح البيع
            </Link>
            <Link to="/shops" className="text-gray-600 hover:text-teal-600">
              المتاجر والشركات
            </Link>
            <Link to="/business" className="text-gray-600 hover:text-teal-600">
              خدمات الأعمال
            </Link>
            <Link to="/help" className="text-gray-600 hover:text-teal-600">
              المساعدة
            </Link>
            <Link to="/saved" className="text-gray-600 hover:text-teal-600">
              المحفوظات
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link to="/login" className="text-gray-700 hover:text-teal-600">
              تسجيل الدخول
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-teal-600">
              التسجيل
            </Link>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              نشر إعلان
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
