"use client";

import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";

export const AddToCart = ({ item }: { item: CartItem }) => {
  // const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast.error(res.message || "Failed to add item to cart");
      return;
    }

    toast.success(`${item.name} added to cart`);
  };

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus />
      Add To Cart
    </Button>
  );
};
