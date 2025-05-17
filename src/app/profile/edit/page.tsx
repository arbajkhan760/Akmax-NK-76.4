
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UserCircle, Upload } from 'lucide-react';
import Link from 'next/link';

// --- TODO: Fetch Real User Data ---
// Replace this mock data with data fetched from your backend API
// based on the currently logged-in user.
const fetchUserProfile = async (): Promise<ProfileFormData> => {
  console.log("Fetching user profile data...");
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    username: "ak_group_76_official",
    name: "AK Group 76",
    bio: "Official account for AK Group 76. Innovating the future.",
    avatarUrl: "https://picsum.photos/id/76/150",
    website: "https://akgroup76.example.com", // Example field
  };
};

// --- TODO: Update User Profile Logic ---
// Replace this with your actual update logic.
const updateUserProfile = async (data: ProfileFormData): Promise<boolean> => {
  console.log("Updating user profile with data:", data);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate success/failure
  return Math.random() > 0.1; // 90% success rate
};


// Define Zod schema for validation
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name too long."),
  username: z.string()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username too long.")
    .regex(/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, underscores, and periods."),
  bio: z.string().max(150, "Bio cannot exceed 150 characters.").optional(),
  website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  avatarUrl: z.string().url("Please enter a valid image URL.").optional().or(z.literal('')),
  // Add other fields like email, phone (read-only maybe?) if needed
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function EditProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      username: '',
      bio: '',
      website: '',
      avatarUrl: '',
    },
  });

  useEffect(() => {
    const loadProfileData = async () => {
      setIsDataLoading(true);
      try {
        const profileData = await fetchUserProfile();
        form.reset(profileData); // Populate form with fetched data
        setImagePreview(profileData.avatarUrl || null);
      } catch (error) {
        console.error("Failed to load profile data:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load profile data.' });
      } finally {
        setIsDataLoading(false);
      }
    };
    loadProfileData();
  }, [form, toast]);

  // Watch avatarUrl to update preview
   useEffect(() => {
     const subscription = form.watch((value, { name }) => {
       if (name === 'avatarUrl') {
         setImagePreview(value.avatarUrl || null);
       }
     });
     return () => subscription.unsubscribe();
   }, [form]);


  const onSubmit = async (values: ProfileFormData) => {
    setIsLoading(true);
    try {
      // TODO: Handle avatar file upload if implementing direct upload instead of URL
      const success = await updateUserProfile(values);
      if (success) {
        toast({
          title: 'Profile Updated!',
          description: 'Your changes have been saved successfully.',
        });
        // Optionally redirect back to profile page: router.push('/profile');
      } else {
        throw new Error('Failed to update profile on the server.');
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not save your changes. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" asChild>
        <Link href="/profile">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Make changes to your profile information.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Avatar className="h-20 w-20 border">
                  <AvatarImage src={imagePreview || undefined} alt={form.getValues('username')} />
                   <AvatarFallback>
                      <UserCircle className="h-12 w-12 text-muted-foreground"/>
                   </AvatarFallback>
                </Avatar>
                 <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem className="flex-1 w-full">
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          {/* Simplified URL input for avatar */}
                          <Input placeholder="https://example.com/avatar.jpg" {...field} />
                          {/* TODO: Implement proper file upload component */}
                          {/* <Button type="button" variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> Change Photo</Button> */}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                 />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl><Input placeholder="Your unique username" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl><Input type="url" placeholder="https://yourwebsite.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little about yourself..."
                        className="resize-none"
                        maxLength={150}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Add other fields here */}

            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
