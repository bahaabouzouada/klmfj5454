
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  CheckCircle,
  Home,
  MessageSquare,
  PieChart,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-teal-700 ml-2">كلشي</h1>
            <span className="text-sm text-gray-500">لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <Home className="w-4 h-4 ml-2" />
                العودة للموقع
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                م
              </div>
              <span className="text-sm font-medium">المدير</span>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1 py-2">
                  <Button
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none pr-2 text-right"
                    onClick={() => setActiveTab("overview")}
                  >
                    <PieChart className="h-4 w-4 ml-2" />
                    نظرة عامة
                  </Button>
                  <Button
                    variant={activeTab === "users" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none pr-2 text-right"
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="h-4 w-4 ml-2" />
                    المستخدمون
                  </Button>
                  <Button
                    variant={activeTab === "listings" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none pr-2 text-right"
                    onClick={() => setActiveTab("listings")}
                  >
                    <ShoppingBag className="h-4 w-4 ml-2" />
                    الإعلانات
                  </Button>
                  <Button
                    variant={activeTab === "messages" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none pr-2 text-right"
                    onClick={() => setActiveTab("messages")}
                  >
                    <MessageSquare className="h-4 w-4 ml-2" />
                    الرسائل
                  </Button>
                  <Button
                    variant={activeTab === "stats" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none pr-2 text-right"
                    onClick={() => setActiveTab("stats")}
                  >
                    <BarChart className="h-4 w-4 ml-2" />
                    الإحصائيات
                  </Button>
                  <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none pr-2 text-right"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-4 w-4 ml-2" />
                    الإعدادات
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatsCard 
                    title="المستخدمون النشطون" 
                    value="2,543" 
                    change="+12%" 
                    icon={<Users className="h-5 w-5" />} 
                  />
                  <StatsCard 
                    title="الإعلانات الجديدة" 
                    value="128" 
                    change="+24%" 
                    icon={<ShoppingBag className="h-5 w-5" />} 
                  />
                  <StatsCard 
                    title="نسبة الاكتمال" 
                    value="94%" 
                    change="+3%" 
                    icon={<CheckCircle className="h-5 w-5" />} 
                  />
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>نظرة عامة على النشاط</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
                      <p className="text-gray-500">بيانات الرسم البياني هنا</p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>أحدث المستخدمين</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['أحمد محمد', 'سارة علي', 'خالد عمر', 'فاطمة أحمد'].map((name) => (
                          <div key={name} className="flex items-center gap-3 border-b pb-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
                              {name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{name}</p>
                              <p className="text-xs text-gray-500">انضم اليوم</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>أحدث الإعلانات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          'شقة فاخرة للبيع', 
                          'سيارة مرسيدس 2022', 
                          'هاتف iPhone 14', 
                          'كمبيوتر محمول'
                        ].map((listing) => (
                          <div key={listing} className="flex items-center gap-3 border-b pb-2">
                            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-500">
                              <ShoppingBag className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{listing}</p>
                              <p className="text-xs text-gray-500">نُشر منذ ساعة</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {activeTab !== "overview" && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === "users" && "إدارة المستخدمين"}
                    {activeTab === "listings" && "إدارة الإعلانات"}
                    {activeTab === "messages" && "الرسائل"}
                    {activeTab === "stats" && "الإحصائيات"}
                    {activeTab === "settings" && "الإعدادات"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500">محتوى {
                      activeTab === "users" ? "المستخدمين" : 
                      activeTab === "listings" ? "الإعلانات" : 
                      activeTab === "messages" ? "الرسائل" : 
                      activeTab === "stats" ? "الإحصائيات" : 
                      "الإعدادات"
                    } هنا</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon 
}: { 
  title: string, 
  value: string, 
  change: string, 
  icon: React.ReactNode 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className="text-xs text-green-600 mt-1">{change} من الشهر الماضي</p>
          </div>
          <div className="bg-teal-50 p-2 rounded-md text-teal-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
