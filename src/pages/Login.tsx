
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم تسجيل الدخول",
      description: "تم تسجيل دخولك بنجاح!",
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم التسجيل",
      description: "تم إنشاء حسابك بنجاح!",
    });
  };

  return (
    <div className="container my-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">مرحباً بك</CardTitle>
          <CardDescription>قم بتسجيل الدخول أو إنشاء حساب جديد</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="login" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="register">عضوية جديدة</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" placeholder="example@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="text-left">
                  <Link to="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700">
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                  تسجيل الدخول
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">الاسم الكامل</Label>
                  <Input id="reg-name" type="text" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">البريد الإلكتروني</Label>
                  <Input id="reg-email" type="email" placeholder="example@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">كلمة المرور</Label>
                  <Input id="reg-password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password-confirm">تأكيد كلمة المرور</Label>
                  <Input id="reg-password-confirm" type="password" required />
                </div>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                  التسجيل
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-600">
          {activeTab === "login" ? (
            <p>ليس لديك حساب؟ <Button variant="link" onClick={() => setActiveTab("register")} className="text-teal-600 hover:text-teal-700 p-0 h-auto">سجل الآن</Button></p>
          ) : (
            <p>لديك حساب بالفعل؟ <Button variant="link" onClick={() => setActiveTab("login")} className="text-teal-600 hover:text-teal-700 p-0 h-auto">تسجيل الدخول</Button></p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
