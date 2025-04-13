
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, UserCog } from "lucide-react";

const Navbar = () => {
  const { user, profile, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

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
              كلشي
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <span>{profile?.username || user.email}</span>
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-semibold">
                      {profile?.username ? profile.username.charAt(0).toUpperCase() : "U"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <User className="ml-2 h-4 w-4" />
                      <span>الملف الشخصي</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer flex items-center">
                      <Settings className="ml-2 h-4 w-4" />
                      <span>الإعدادات</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer flex items-center">
                        <UserCog className="ml-2 h-4 w-4" />
                        <span>لوحة التحكم</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer flex items-center text-red-500 focus:text-red-500">
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth" className="text-gray-700 hover:text-teal-600">
                  تسجيل الدخول
                </Link>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  نشر إعلان
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
