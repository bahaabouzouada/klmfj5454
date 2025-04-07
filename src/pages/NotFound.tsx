
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">عذراً، الصفحة غير موجودة</p>
        <p className="text-gray-500 mb-8">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Button asChild className="bg-teal-600 hover:bg-teal-700">
          <Link to="/">العودة إلى الصفحة الرئيسية</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
