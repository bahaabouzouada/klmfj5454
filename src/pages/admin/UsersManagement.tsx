
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { UserCog, UserMinus } from "lucide-react";

type User = {
  id: string;
  username: string;
  email?: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  created_at: string;
};

const UsersManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("حدث خطأ أثناء جلب المستخدمين");
        console.error(error);
      } else {
        setUsers(data || []);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    if (!window.confirm(
      currentStatus 
        ? "هل أنت متأكد من رغبتك في إزالة صلاحيات المدير من هذا المستخدم؟" 
        : "هل أنت متأكد من رغبتك في منح صلاحيات المدير لهذا المستخدم؟"
    )) {
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: !currentStatus })
        .eq("id", userId);

      if (error) {
        toast.error("حدث خطأ أثناء تحديث صلاحيات المستخدم");
        console.error(error);
      } else {
        toast.success("تم تحديث صلاحيات المستخدم بنجاح");
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, is_admin: !currentStatus } : user
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <Button onClick={() => navigate("/admin")}>العودة للوحة التحكم</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">لا يوجد مستخدمين</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم المستخدم</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>مدير</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    {user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'غير محدد'}
                  </TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <span className="text-green-500">نعم</span>
                    ) : (
                      <span className="text-gray-500">لا</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant={user.is_admin ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                      >
                        {user.is_admin ? (
                          <>
                            <UserMinus className="h-4 w-4 ml-2" />
                            إزالة المدير
                          </>
                        ) : (
                          <>
                            <UserCog className="h-4 w-4 ml-2" />
                            جعله مديرًا
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
