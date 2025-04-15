
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, Shield, Moon, Languages, Bell, Mail, Globe, Phone, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schemas
const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  newMessage: z.boolean().default(true),
  productUpdates: z.boolean().default(true),
});

const privacySchema = z.object({
  profileVisibility: z.enum(["public", "registered", "private"]).default("public"),
  showPhoneNumber: z.boolean().default(false),
  showEmail: z.boolean().default(false),
});

const interfaceSchema = z.object({
  language: z.enum(["ar", "fr", "en"]).default("ar"),
  theme: z.enum(["light", "dark", "system"]).default("light"),
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
});

const Settings = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("notifications");
  const [isSaving, setIsSaving] = useState(false);

  // Default settings
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      newMessage: true,
      productUpdates: true,
    },
    privacy: {
      profileVisibility: "public",
      showPhoneNumber: false,
      showEmail: false,
    },
    interface: {
      language: "ar",
      theme: "light",
      fontSize: "medium",
    }
  });

  const notificationsForm = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: settings.notifications,
  });

  const privacyForm = useForm({
    resolver: zodResolver(privacySchema),
    defaultValues: settings.privacy,
  });

  const interfaceForm = useForm({
    resolver: zodResolver(interfaceSchema),
    defaultValues: settings.interface,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
    
    // Fetch user settings
    const fetchSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setSettings({
            notifications: {
              emailNotifications: data.email_notifications ?? true,
              pushNotifications: data.push_notifications ?? true,
              marketingEmails: data.marketing_emails ?? false,
              newMessage: data.new_message_notification ?? true,
              productUpdates: data.product_updates_notification ?? true,
            },
            privacy: {
              profileVisibility: data.profile_visibility ?? "public",
              showPhoneNumber: data.show_phone_number ?? false,
              showEmail: data.show_email ?? false,
            },
            interface: {
              language: data.language ?? "ar",
              theme: data.theme ?? "light",
              fontSize: data.font_size ?? "medium",
            }
          });
          
          // Update form values
          notificationsForm.reset(settings.notifications);
          privacyForm.reset(settings.privacy);
          interfaceForm.reset(settings.interface);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    
    fetchSettings();
  }, [user, isLoading, navigate]);

  const saveSettings = async (formData: any, settingType: string) => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // Convert form data to database format
      let dbData = {};
      
      if (settingType === "notifications") {
        dbData = {
          email_notifications: formData.emailNotifications,
          push_notifications: formData.pushNotifications,
          marketing_emails: formData.marketingEmails,
          new_message_notification: formData.newMessage,
          product_updates_notification: formData.productUpdates,
        };
      } else if (settingType === "privacy") {
        dbData = {
          profile_visibility: formData.profileVisibility,
          show_phone_number: formData.showPhoneNumber,
          show_email: formData.showEmail,
        };
      } else if (settingType === "interface") {
        dbData = {
          language: formData.language,
          theme: formData.theme,
          font_size: formData.fontSize,
        };
      }
      
      // Check if settings exist
      const { data: existingSettings } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      let result;
      
      if (existingSettings) {
        // Update existing settings
        result = await supabase
          .from("user_settings")
          .update(dbData)
          .eq("user_id", user.id);
      } else {
        // Insert new settings
        result = await supabase
          .from("user_settings")
          .insert({
            user_id: user.id,
            ...dbData
          });
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ الإعدادات بنجاح",
      });
      
      // Update local state with new settings
      setSettings(prev => ({
        ...prev,
        [settingType]: formData
      }));
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "حدث خطأ",
        description: error.message || "فشل حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onNotificationsSubmit = (data: z.infer<typeof notificationSchema>) => {
    saveSettings(data, "notifications");
  };

  const onPrivacySubmit = (data: z.infer<typeof privacySchema>) => {
    saveSettings(data, "privacy");
  };

  const onInterfaceSubmit = (data: z.infer<typeof interfaceSchema>) => {
    saveSettings(data, "interface");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>
          
          <Tabs defaultValue="notifications" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 ml-2" />
                الإشعارات
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center">
                <Shield className="h-4 w-4 ml-2" />
                الخصوصية
              </TabsTrigger>
              <TabsTrigger value="interface" className="flex items-center">
                <Globe className="h-4 w-4 ml-2" />
                الواجهة
              </TabsTrigger>
            </TabsList>
            
            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الإشعارات</CardTitle>
                  <CardDescription>
                    تحكم في كيفية وصول الإشعارات إليك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...notificationsForm}>
                    <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                      <FormField
                        control={notificationsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-x-reverse">
                            <div className="space-y-0.5">
                              <FormLabel>إشعارات البريد الإلكتروني</FormLabel>
                              <FormDescription>
                                استلام إشعارات عبر البريد الإلكتروني
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-x-reverse">
                            <div className="space-y-0.5">
                              <FormLabel>الإشعارات المنبثقة</FormLabel>
                              <FormDescription>
                                استلام إشعارات منبثقة على جهازك
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="marketingEmails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-x-reverse">
                            <div className="space-y-0.5">
                              <FormLabel>رسائل تسويقية</FormLabel>
                              <FormDescription>
                                استلام عروض وأخبار جديدة
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="newMessage"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-x-reverse">
                            <div className="space-y-0.5">
                              <FormLabel>رسائل جديدة</FormLabel>
                              <FormDescription>
                                إشعار عند استلام رسالة جديدة
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="productUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-x-reverse">
                            <div className="space-y-0.5">
                              <FormLabel>تحديثات المنتجات</FormLabel>
                              <FormDescription>
                                إشعارات عن تحديثات المنتجات التي تتابعها
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSaving}>
                        {isSaving ? "جاري الحفظ..." : "حفظ الإعدادات"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Privacy Settings */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الخصوصية</CardTitle>
                  <CardDescription>
                    تحكم في ما يمكن للآخرين رؤيته عنك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...privacyForm}>
                    <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
                      <FormField
                        control={privacyForm.control}
                        name="profileVisibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>خصوصية الملف الشخصي</FormLabel>
                            <FormDescription>
                              اختر من يمكنه رؤية معلومات ملفك الشخصي
                            </FormDescription>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر مستوى الخصوصية" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="public">عام - يمكن لأي شخص الوصول</SelectItem>
                                <SelectItem value="registered">مسجل - المستخدمين المسجلين فقط</SelectItem>
                                <SelectItem value="private">خاص - أنت فقط</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={privacyForm.control}
                        name="showPhoneNumber"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-x-reverse">
                            <div className="space-y-0.5">
                              <FormLabel>إظهار رقم الهاتف</FormLabel>
                              <FormDescription>
                                عرض رقم هاتفك للمستخدمين الآخرين
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={privacyForm.control}
                        name="showEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-x-reverse">
                            <div className="space-y-0.5">
                              <FormLabel>إظهار البريد الإلكتروني</FormLabel>
                              <FormDescription>
                                عرض بريدك الإلكتروني للمستخدمين الآخرين
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSaving}>
                        {isSaving ? "جاري الحفظ..." : "حفظ الإعدادات"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Interface Settings */}
            <TabsContent value="interface">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الواجهة</CardTitle>
                  <CardDescription>
                    خصص تجربة استخدامك للتطبيق
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...interfaceForm}>
                    <form onSubmit={interfaceForm.handleSubmit(onInterfaceSubmit)} className="space-y-6">
                      <FormField
                        control={interfaceForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اللغة</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر اللغة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ar">العربية</SelectItem>
                                <SelectItem value="fr">الفرنسية</SelectItem>
                                <SelectItem value="en">الإنجليزية</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={interfaceForm.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المظهر</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر المظهر" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="light">فاتح</SelectItem>
                                <SelectItem value="dark">داكن</SelectItem>
                                <SelectItem value="system">حسب نظام التشغيل</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={interfaceForm.control}
                        name="fontSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>حجم الخط</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر حجم الخط" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="small">صغير</SelectItem>
                                <SelectItem value="medium">متوسط</SelectItem>
                                <SelectItem value="large">كبير</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSaving}>
                        {isSaving ? "جاري الحفظ..." : "حفظ الإعدادات"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
