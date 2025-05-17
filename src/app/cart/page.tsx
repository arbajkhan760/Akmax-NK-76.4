
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

// --- TODO: Fetch Real Cart Data ---
// Replace this mock data with data fetched from your backend API or local storage
// based on the logged-in user.

interface CartItem {
  id: string; // Usually the product variant ID or a unique cart item ID
  productId: string;
  imageUrl: string;
  title: string;
  price: number;
  quantity: number;
  stock: number; // Available stock for the product
  sellerUsername: string;
}

const mockCartItems: CartItem[] = [
  { id: 'cart-item-1', productId: 'prod-2', imageUrl: 'https://picsum.photos/seed/product2/100', title: 'Product Title 2', price: 93.10, quantity: 1, stock: 50, sellerUsername: 'seller_1' },
  { id: 'cart-item-2', productId: 'prod-5', imageUrl: 'https://picsum.photos/seed/product5/100', title: 'Product Title 5', price: 24.80, quantity: 2, stock: 20, sellerUsername: 'seller_2' },
  { id: 'cart-item-3', productId: 'prod-9', imageUrl: 'https://picsum.photos/seed/product9/100', title: 'Product Title 9 (Low Stock)', price: 49.50, quantity: 1, stock: 3, sellerUsername: 'seller_1' },
];

export default function CartPage() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching cart data
    setIsLoading(true);
    setTimeout(() => {
      setCartItems(mockCartItems);
      setIsLoading(false);
    }, 500);
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          // Clamp quantity between 1 and available stock
          const clampedQuantity = Math.max(1, Math.min(newQuantity, item.stock));
          if (newQuantity > item.stock) {
              toast({ variant: 'destructive', title: 'Stock Limit Reached', description: `Only ${item.stock} items available for ${item.title}.`});
          }
          return { ...item, quantity: clampedQuantity };
        }
        return item;
      })
    );
    // --- TODO: Update cart on backend ---
    console.log(`Updating item ${itemId} quantity to ${newQuantity}`);
  };

  const removeItem = (itemId: string) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    // --- TODO: Remove item from cart on backend ---
     console.log(`Removing item ${itemId}`);
     toast({ title: 'Item Removed', description: `${itemToRemove?.title} removed from cart.` });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  // --- TODO: Calculate shipping, taxes, and total based on backend logic/user address ---
  const shippingCost = subtotal > 0 ? 50.00 : 0; // Example fixed shipping
  const taxes = subtotal * 0.05; // Example 5% tax
  const total = subtotal + shippingCost + taxes;

  if (isLoading) {
    return <div className="text-center py-20">Loading your cart...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Card className="text-center py-10">
          <CardHeader>
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>Your Cart is Empty</CardTitle>
            <CardDescription>Looks like you haven't added anything yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/store">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="flex items-center p-4 gap-4">
                <div className="relative h-20 w-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                     sizes="80px"
                     data-ai-hint="product photo"
                  />
                </div>
                <div className="flex-grow space-y-1">
                  <Link href={`/store/product/${item.productId}`} className="font-semibold hover:underline line-clamp-1">
                    {item.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">Sold by: {item.sellerUsername}</p>
                  <p className="text-sm font-medium">₹{item.price.toFixed(2)}</p>
                   {item.stock <= 5 && item.stock > 0 && (
                      <p className="text-xs text-destructive">Only {item.stock} left in stock!</p>
                   )}
                    {item.stock === 0 && (
                       <p className="text-xs text-destructive font-semibold">Out of Stock</p>
                    )}
                </div>
                 <div className="flex items-center border rounded-md flex-shrink-0 mx-4">
                   <Button
                     variant="ghost"
                     size="icon"
                     className="h-8 w-8 border-r"
                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
                     disabled={item.quantity <= 1}
                    >
                     <Minus className="h-4 w-4" />
                   </Button>
                   <Input
                     type="number"
                     value={item.quantity}
                     readOnly
                     className="h-8 w-12 text-center border-none focus-visible:ring-0 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 border-l"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-4 w-4" />
                   </Button>
                 </div>
                 <div className="text-right flex-shrink-0 w-20">
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                 </div>
                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeItem(item.id)}>
                   <Trash2 className="h-4 w-4" />
                   <span className="sr-only">Remove item</span>
                 </Button>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>₹{shippingCost.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-sm">
                  <span>Taxes (Est.)</span>
                  <span>₹{taxes.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                 <Button size="lg" className="w-full" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                    {/* TODO: Implement checkout logic/page */}
                 </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
