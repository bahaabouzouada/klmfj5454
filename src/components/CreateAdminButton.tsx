
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CreateAdminButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createAdmin = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://gkzsryuitebpnkelakrx.supabase.co/functions/v1/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrenNyeXVpdGVicG5rZWxha3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzk0ODQsImV4cCI6MjA1OTcxNTQ4NH0.70QitNU8mBKVOfqNdOFRvF6leL59H2drXsGwFzyB82I`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(result.message);
        toast.info(`يمكنك تسجيل الدخول باستخدام: ${result.user.email} / pass123`);
      } else {
        toast.error(result.error || 'حدث خطأ أثناء إنشاء حساب المدير');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={createAdmin} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? 'جاري إنشاء حساب المدير...' : 'إنشاء حساب المدير'}
    </Button>
  );
};

export default CreateAdminButton;
