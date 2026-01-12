"use server";

import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const addItemToCart = async (data: CartItem) => {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value || null;
    if (!sessionCartId) {
      throw new Error("Session Cart ID not found");
    }

    const session = await auth();
    const userId = session?.user?.id || null;

    const cart = await getMyCart();

    // parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!cart) {
      // create new cart
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // Add to database
      await prisma.cart.create({ data: newCart });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // check if items is already in cart

      const existItem = (cart.items as CartItem[]).find(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existItem) {
        // check stock
        if (existItem.qty + 1 > product.stock) {
          throw new Error(`Not enough stock`);
        }

        // Increase the quantity
        (cart.items as CartItem[]).find(
          (cartItem) => cartItem.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        // check stock
        if (product.stock < 1) {
          throw new Error(`Not enough stock`);
        }

        // Add new item to cart
        (cart.items as CartItem[]).push(item);
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }

    // console.log({
    //   "Session Cart ID": sessionCartId,
    //   "User Id": userId,
    //   "Item Requested": item,
    //   "Product found": product,
    // });
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value || null;
  if (!sessionCartId) {
    throw new Error("Session Cart ID not found");
  }

  const session = await auth();
  const userId = session?.user?.id || null;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
