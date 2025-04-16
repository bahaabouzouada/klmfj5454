
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { UploadCloud, X, Link as LinkIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { v4 as uuidv4 } from 'uuid';

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "جديد",
    location: ""
  });

  const categories = [
    "إلكترونيات",
    "أثاث",
    "ملابس",
    "سيارات",
    "عقارات",
    "أخرى"
  ];

  const conditions = ["جديد", "مستعمل - ممتاز", "مستعمل - جيد", "مستعمل - مقبول"];

  useEffect(() => {
    if (!user) {
      toast("يجب تسجيل الدخول لإضافة منتج");
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert FileList to array and filter out non-image files
    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    // Limit to 5 images maximum
    const newFiles = [...uploadedFiles, ...fileArray].slice(0, 5);
    setUploadedFiles(newFiles);
    
    // Create preview URLs
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setImages(newPreviewUrls);
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    
    // Check if it's a valid URL
    try {
      new URL(imageUrl);
    } catch (e) {
      toast("الرجاء إدخال رابط صحيح");
      return;
    }
    
    // Add to images array (max 5)
    if (images.length < 5) {
      setImages([...images, imageUrl]);
      setImageUrl('');
    } else {
      toast("يمكنك إضافة 5 صور كحد أقصى");
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const uploadImagesToStorage = async (): Promise<string[]> => {
    if (uploadMethod === 'url' || uploadedFiles.length === 0) {
      return images; // Return URL images directly
    }
    
    const uploadedUrls: string[] = [];
    
    try {
      // First create the bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'product-images')) {
        // Create the bucket
        await supabase.storage.createBucket('product-images', {
          public: true, // Make the bucket public
        });
      }
      
      // Upload each file
      for (const file of uploadedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);
          
        if (error) {
          console.error('Error uploading image:', error);
          continue;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(publicUrl);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Exception uploading images:', error);
      return []; // Return empty array on error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast("يجب تسجيل الدخول لإضافة منتج");
      navigate("/auth");
      return;
    }
    
    // Validate form
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.location) {
      toast("الرجاء إكمال جميع الحقول المطلوبة");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // First upload images if any
      let productImages: string[] = [];
      if (images.length > 0) {
        if (uploadMethod === 'upload') {
          productImages = await uploadImagesToStorage();
        } else {
          productImages = images; // Use URL images directly
        }
      }
      
      // Then create the product
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          condition: formData.condition,
          location: formData.location,
          seller_id: user.id,
          images: productImages
        })
        .select();

      if (error) throw error;
      
      toast("تم إضافة المنتج بنجاح");
      
      // Redirect to product detail page if created successfully
      if (data && data[0]) {
        navigate(`/product/${data[0].id}`);
      } else {
        navigate("/products");
      }
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast(error.message || "حدث خطأ أثناء إضافة المنتج");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">إضافة منتج جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان المنتج</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="أدخل عنوان المنتج"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">وصف المنتج</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="أدخل وصف المنتج"
                  rows={4}
                />
              </div>
              
              {/* Product Images */}
              <div className="space-y-4">
                <Label>صور المنتج (حد أقصى 5 صور)</Label>
                
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <Button 
                    type="button" 
                    variant={uploadMethod === 'upload' ? "default" : "outline"}
                    onClick={() => setUploadMethod('upload')}
                    className="flex-1"
                  >
                    <UploadCloud className="ml-2 h-4 w-4" />
                    رفع صور
                  </Button>
                  <Button 
                    type="button" 
                    variant={uploadMethod === 'url' ? "default" : "outline"}
                    onClick={() => setUploadMethod('url')}
                    className="flex-1"
                  >
                    <LinkIcon className="ml-2 h-4 w-4" />
                    إضافة روابط
                  </Button>
                </div>
                
                {uploadMethod === 'upload' ? (
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                    
                    <div className="text-sm text-gray-500">
                      يمكنك رفع حتى 5 صور بحجم أقصى 5 ميجابايت لكل صورة
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="أدخل رابط الصورة"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                      <Button type="button" onClick={addImageUrl}>
                        إضافة
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Display image previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={img} 
                          alt={`صورة ${index + 1}`} 
                          className="h-32 w-full object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">السعر</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="أدخل السعر"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">التصنيف</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="condition">الحالة</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange("condition", value)}
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="اختر حالة المنتج" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">الموقع</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="أدخل الموقع"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "جاري الإضافة..." : "إضافة المنتج"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
