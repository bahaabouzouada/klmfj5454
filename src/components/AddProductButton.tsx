
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddProductButton = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/product/add");
  };

  return (
    <Button 
      onClick={handleAddProduct} 
      className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
    >
      <Plus className="w-4 h-4" />
      إضافة منتج
    </Button>
  );
};

export default AddProductButton;
