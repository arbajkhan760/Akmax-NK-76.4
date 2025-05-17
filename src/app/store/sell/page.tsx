'use client';

import { useState, useRef, useEffect } from 'react'; // Added useRef, useEffect
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Upload, DollarSign, Package, List, Info, Image as ImageIcon } from 'lucide-react'; // Added ImageIcon
import Link from 'next/link';
import Image from 'next/image'; // Import next/image

const categories = ['Electronics', 'Fashion', 'Beauty', 'Books', 'Fitness', 'Home', 'Toys', 'Grocery', 'Other'];

// Make imageUrl optional as we now have file upload
const productSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(1000),
  price: z.coerce.number().min(1, { message: "Price must be at least ₹1." }), // Use coerce for string input
  stock: z.coerce.number().int().min(0, { message: "Stock cannot be negative." }), // Use coerce for string input
  category: z.string().min(1, { message: "Please select a category." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')), // Make URL optional
  // Define imageFile, but make it optional in Zod schema as direct file validation is complex client-side
  // Actual check for file or URL presence will be in onSubmit
  imageFile: z.any().optional(),
}).refine(data => data.imageUrl || data.imageFile, {
  message: "Either an image URL or an uploaded image is required.",
  path: ["imageUrl"], // Report error on imageUrl field for simplicity
});


export default function SellProductPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      stock: 1,
      category: '',
      imageUrl: '',
      imageFile: undefined,
    },
  });

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     const file = event.target.files?.[0];
     if (file) {
       form.setValue('imageFile', file); // Update form state with the File object
       form.setValue('imageUrl', ''); // Clear image URL if file is chosen
       const reader = new FileReader();
       reader.onloadend = () => {
         setImagePreview(reader.result as string);
       };
       reader.readAsDataURL(file);
     } else {
        form.setValue('imageFile', undefined);
        setImagePreview(null);
     }
   };

    // Function to trigger file input click
   const triggerFileInput = () => {
    fileInputRef.current?.click();
   };

    // Watch imageUrl changes to potentially clear file/preview
   useEffect(() => {
       const subscription = form.watch((value, { name }) => {
           if (name === 'imageUrl' && value.imageUrl) {
               form.setValue('imageFile', undefined); // Clear file if URL is entered
               setImagePreview(null); // Clear preview
           }
       });
       return () => subscription.unsubscribe();
   }, [form]);


  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    setIsLoading(true);
    console.log('Product Data:', values);

    // --- TODO: Implement Product Listing Logic ---
    // 1. Check if imageFile exists. If yes, upload values.imageFile to storage
    //    (e.g., Firebase Storage) and get the public URL.
    //    Replace `values.imageUrl` with this URL before sending to backend.
    let finalImageUrl = values.imageUrl;
    if (values.imageFile instanceof File) {
        console.log("Uploading image file:", values.imageFile.name);
        // Simulate upload and get URL
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
        finalImageUrl = `https://picsum.photos/seed/${values.imageFile.name}/400`; // Use a mock URL based on filename
        console.log("Simulated upload complete. Image URL:", finalImageUrl);
    }

    if (!finalImageUrl) {
        toast({ variant: 'destructive', title: 'Missing Image', description: 'Please provide an image URL or upload an image file.' });
        setIsLoading(false);
        return;
    }

    const dataToSend = {
        title: values.title,
        description: values.description,
        price: values.price,
        stock: values.stock,
        category: values.category,
        imageUrl: finalImageUrl, // Send the final image URL
    };

    console.log("Data being sent to backend:", dataToSend);


    // 2. Send the product data (dataToSend) to your backend API to save it.
    // 3. Handle success and error scenarios.

    // Placeholder for API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    const success = Math.random() > 0.2; // Simulate success/failure

    setIsLoading(false);

    if (success) {
      toast({
        title: 'Product Listed Successfully!',
        description: `Your product "${values.title}" is now available in the store.`,
      });
      form.reset(); // Reset form on success
      setImagePreview(null);
      // Optionally redirect user: router.push('/store/my-products');
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to List Product',
        description: 'An error occurred. Please try again later.',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
       <Button variant="outline" size="sm" asChild className="mb-4">
           <Link href="/store">← Back to Store</Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">List a New Product</CardTitle>
          <CardDescription>Fill in the details below to sell your item on AK Reels Store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               {/* Image Upload/URL Input */}
               <div className="space-y-2">
                  <Label>Product Image</Label>
                  {imagePreview && (
                    <div className="mt-2 border rounded-md overflow-hidden max-w-xs mx-auto">
                      <Image src={imagePreview} alt="Product Preview" width={400} height={300} style={{objectFit: 'contain'}} />
                    </div>
                  )}
                   <div className="flex flex-col sm:flex-row gap-2 items-center">
                     <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden" // Hide the default file input
                      />
                       <Button type="button" variant="outline" onClick={triggerFileInput} className="w-full sm:w-auto">
                          <Upload className="mr-2 h-4 w-4" /> Upload Image
                       </Button>
                       <span className="text-xs text-muted-foreground text-center sm:text-left">OR</span>
                       <FormField
                         control={form.control}
                         name="imageUrl"
                         render={({ field }) => (
                           <FormItem className="flex-1 w-full">
                             <FormControl>
                                <Input
                                  placeholder="Paste image URL" {...field}
                                  disabled={!!form.watch('imageFile')} // Disable if file is selected
                                />
                              </FormControl>
                             <FormMessage />
                           </FormItem>
                          )}
                        />
                   </div>
                    {form.formState.errors.imageUrl && !form.watch('imageFile') && ( // Show error only if relevant
                        <p className="text-sm font-medium text-destructive">{form.formState.errors.imageUrl.message}</p>
                    )}
               </div>


               {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><Info className="inline-block mr-1 h-4 w-4" /> Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Stylish Wireless Headphones" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><List className="inline-block mr-1 h-4 w-4" /> Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product in detail..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><DollarSign className="inline-block mr-1 h-4 w-4" /> Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 499.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 {/* Stock */}
                 <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><Package className="inline-block mr-1 h-4 w-4" /> Stock Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" placeholder="e.g., 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="p-0 pt-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Listing Product...' : 'List Product for Sale'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}