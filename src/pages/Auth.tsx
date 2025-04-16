
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import CreateAdminButton from "@/components/CreateAdminButton";
import { Separator } from "@/components/ui/separator";

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        console.error("Login error:", error);
        if (error.message === "Invalid login credentials") {
          toast("بيانات الدخول غير صحيحة، تأكد من البريد الإلكتروني وكلمة المرور");
        } else {
          toast(error.message);
        }
      } else {
        toast("تم تسجيل الدخول بنجاح");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login exception:", error);
      toast(error.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (registerData.password !== registerData.confirmPassword) {
      toast("كلمات المرور غير متطابقة");
      setIsLoading(false);
      return;
    }
    
    if (registerData.password.length < 6) {
      toast("كلمة المرور يجب أن تكون على الأقل 6 أحرف");
      setIsLoading(false);
      return;
    }
    
    try {
      const { error, data } = await signUp(
        registerData.email,
        registerData.password,
        registerData.username
      );
      
      console.log("Registration response:", data);
      
      if (error) {
        console.error("Registration error:", error);
        
        // Provide more user-friendly error messages
        if (error.message.includes("already registered")) {
          toast("هذا البريد الإلكتروني مسجل بالفعل، الرجاء استخدام بريد آخر أو تسجيل الدخول");
        } else {
          toast(error.message);
        }
      } else {
        toast("تم إنشاء الحساب بنجاح");
        
        // Redirect to home page even before email confirmation
        if (data.user) {
          toast("تم تسجيل دخولك تلقائيًا");
          navigate("/");
        } else {
          toast("تم إرسال رابط تأكيد إلى بريدك الإلكتروني، الرجاء التحقق من بريدك وتأكيد حسابك");
        }
      }
    } catch (error: any) {
      console.error("Registration exception:", error);
      toast(error.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">تسجيل الدخول / إنشاء حساب</CardTitle>
          <CardDescription>
            قم بتسجيل الدخول أو إنشاء حساب جديد للمتابعة
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    placeholder="example@example.com"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">البريد الإلكتروني</Label>
                  <Input
                    id="register-email"
                    placeholder="example@example.com"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input
                    id="username"
                    placeholder="اسم المستخدم"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">كلمة المرور</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="********"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500">كلمة المرور يجب أن تكون على الأقل 6 أحرف</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="********"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "جاري التحميل..." : "إنشاء حساب"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Separator className="my-4" />
            <h3 className="text-sm font-medium mb-2 text-center">إنشاء حساب المدير</h3>
            <p className="text-xs text-gray-500 mb-3 text-center">
              انقر على الزر أدناه لإنشاء حساب المدير (admin@example.com / pass123)
            </p>
            <CreateAdminButton />
          </div>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-500 w-full">
            بتسجيل الدخول، أنت توافق على شروط الخدمة وسياسة الخصوصية
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
