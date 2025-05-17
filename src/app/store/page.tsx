
'use client';

import React from 'react'; // Added React import
import { useState } from 'react';
import ProductCard from '@/components/app/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, PlusCircle, Link as LinkIcon, Wallet } from 'lucide-react';
import Link from 'next/link';

// Mock data for products - Made prices deterministic using index `i`
const mockProducts = Array.from({ length: 12 }).map((_, i) => ({
  id: `prod-${i + 1}`,
  imageUrl: `https://picsum.photos/seed/product${i + 1}/400`,
  title: `Product Title ${i + 1}`,
  description: `This is a great product description for item ${i + 1}. High quality and affordable.`,
  price: ((i + 1) * 13.75 + 10).toFixed(2), // Deterministic price based on index
  stock: Math.floor((i + 1) * 7.3) % 100, // Make stock slightly more varied but still deterministic based on i
  category: ['Electronics', 'Fashion', 'Beauty', 'Books', 'Fitness', 'Home'][i % 6],
  sellerUsername: `seller_${i % 3 + 1}`,
}));

const categories = ['Electronics', 'Fashion', 'Beauty', 'Books', 'Fitness', 'Home', 'Toys', 'Grocery'];

const AdPlaceholderCard = () => (
  <div className="col-span-1 flex flex-col items-center justify-center h-full border rounded-lg p-4 bg-muted/30 text-muted-foreground">
    <p className="font-semibold">Ad Placeholder</p>
    <p className="text-xs">Google AdMob - Native Ad</p>
  </div>
);

export default function StorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]); // Example range

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean | string) => {
    if (checked) {
       setSelectedCategory(categoryId);
    } else {
        if(selectedCategory === categoryId) setSelectedCategory(null);
    }
  };

   const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesPrice = parseFloat(product.price) >= priceRange[0] && parseFloat(product.price) <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Store</h1>
        <div className="flex gap-2">
          <Button asChild>
             <Link href="/store/sell">
              <PlusCircle className="mr-2 h-4 w-4" /> Sell Product
             </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/store/affiliate">
               <LinkIcon className="mr-2 h-4 w-4" /> Affiliate Tools
            </Link>
           </Button>
           <Button variant="outline" asChild>
             <Link href="/store/earnings">
                <Wallet className="mr-2 h-4 w-4" /> My Earnings
             </Link>
            </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>

         <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-150px)] mt-4 pr-4">
             <div className="space-y-6 py-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${category}`}
                          checked={selectedCategory === category}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                        />
                        <Label htmlFor={`cat-${category}`} className="cursor-pointer flex-1">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Price Range</h3>
                  <Slider
                    defaultValue={[0, 500]}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    className="mt-4"
                  />
                   <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
             </div>
            </ScrollArea>
             <div className="mt-auto pt-4 border-t">
                <Button className="w-full">Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <React.Fragment key={product.id}>
              <ProductCard product={product} />
              {/* Insert ad placeholder after every 5 products (index 4, 9, 14...) */}
              {(index + 1) % 5 === 0 && <AdPlaceholderCard />}
            </React.Fragment>
          ))
        ) : (
           <div className="col-span-full text-center py-10 text-muted-foreground">
              No products found matching your criteria.
           </div>
        )}
      </div>

       <div className="text-center text-muted-foreground py-6">
          Loading more products...
       </div>
    </div>
  );
}

