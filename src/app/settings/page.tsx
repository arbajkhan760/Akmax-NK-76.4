
'use client';

import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported
import type { FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Bell,
  Lock,
  Palette,
  Info,
  User,
  LogOut,
  ShieldCheck,
  Smartphone,
  Trash2,
  Languages,
  Accessibility,
  LifeBuoy,
  FileQuestion,
  FileText as FileTextIcon,
  BookOpenCheck,
  AlertCircle,
  Users,
  Download,
  MessageSquareText,
  AtSign,
  ListFilter,
  Contact,
  Eye,
  Wallet,
  QrCode,
  Share2,
  KeyRound,
  History,
  RadioTower,
  Film,
  ThumbsUp,
  ShieldOff,
  PlayCircle,
  Captions,
  Repeat,
  BadgeCheck,
  VolumeX,
  CheckCircle,
  Megaphone,
  Target,
  Archive,
  TrendingUp,
  LayoutDashboard,
  Briefcase,
  Settings as SettingsIcon // Added SettingsIcon to prevent naming conflict
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription as DialogDescriptionRadix, 
    DialogHeader as DialogHeaderRadix, 
    DialogTitle as DialogTitleRadix, 
    DialogTrigger as DialogTriggerRadix, 
    DialogFooter as DialogFooterRadix 
} from "@/components/ui/dialog";
import {
    Alert,
    AlertDescription as AlertDescriptionRadix, 
    AlertTitle as AlertTitleRadix, 
} from "@/components/ui/alert";
import { Loader2 } from "lucide-react"
import { cn } from '@/lib/utils';
import AccountSwitcherDialog from '@/components/app/AccountSwitcherDialog'; // Import the dialog

const AlertDescription = React.forwardRef<
    React.ElementRef<typeof AlertDescriptionRadix>,
    React.ComponentPropsWithoutRef<typeof AlertDescriptionRadix>
    >(({ className, ...props }, ref) => (
    <AlertDescriptionRadix
        ref={ref}
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
        />
));
AlertDescription.displayName = AlertDescriptionRadix.displayName

const AlertTitle = React.forwardRef<
    React.ElementRef<typeof AlertTitleRadix>,
    React.ComponentPropsWithoutRef<typeof AlertTitleRadix>
    >(({ className, ...props }, ref) => (
    <AlertTitleRadix
        ref={ref}
        className={cn("mb-1 font-medium leading-none tracking-tight", className)}
        {...props}
        />
));
AlertTitle.displayName = AlertTitleRadix.displayName


const SettingsPage: FC = () => {
  const { toast } = useToast();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [suggestAccount, setSuggestAccount] = useState(true);
  const [syncContacts, setSyncContacts] = useState(true);
  const [allowDownloads, setAllowDownloads] = useState(true);
  const [dmSetting, setDmSetting] = useState<'everyone' | 'friends' | 'noone'>('everyone');
  const [dataSaver, setDataSaver] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState(true);
  const [videoUpdatesNotifications, setVideoUpdatesNotifications] = useState(true);
  const [recommendationsNotifications, setRecommendationsNotifications] = useState(true);
  const [hasBlueBadge, setHasBlueBadge] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isEligibleForFreeBadge, setIsEligibleForFreeBadge] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [utrCode, setUtrCode] = useState('');
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [isVerifyingUTR, setIsVerifyingUTR] = useState(false);
  const [showEligibilityCheck, setShowEligibilityCheck] = useState(false);
  const [allowAdPersonalization, setAllowAdPersonalization] = useState(true);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false); // State for account switcher

  const MOCK_CURRENT_USER_PROFILE_URL = '/profile/ak_group_76_official'; 
  const MOCK_CURRENT_USERNAME = 'ak_group_76_official';

  useEffect(() => {
    // Logic to set theme based on localStorage or system preference on initial load
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      applyTheme('system'); // Default to system
    }
  }, []);


  const handleLogout = () => {
    console.log('Logging out...');
     toast({
      title: "Logged Out",
      description: "You have been successfully logged out from AKmax.",
    });
     window.location.href = '/login';
  };

   const handleClearCache = () => {
    console.log('Clearing cache...');
    toast({
      title: "Cache Cleared (Simulated)",
      description: "AKmax app cache has been cleared.",
    });
  };

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    setSelectedTheme(theme);
    console.log(`Theme set to ${theme}`);
     if (theme === 'system') {
      document.documentElement.classList.remove('light', 'dark');
      localStorage.removeItem('theme');
      // Optional: If you want to match system preference immediately
      // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      //   document.documentElement.classList.add('dark');
      // } else {
      //   document.documentElement.classList.remove('dark');
      // }
    } else {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
    // No toast here, to avoid spamming if called from useEffect
  };

   const checkEligibility = () => {
        const mockFollowerCount = Math.floor(Math.random() * 2000000);
        setFollowerCount(mockFollowerCount);
        setIsEligibleForFreeBadge(mockFollowerCount >= 1000000);
        setShowEligibilityCheck(true);
        console.log(`User has ${mockFollowerCount} followers`);
    };

   const handleVerifyUtr = async () => {
       setIsVerifyingUTR(true);
       await new Promise(resolve => setTimeout(resolve, 1200));
       const isValidUTR = Math.random() > 0.1;

       setIsVerifyingUTR(false);

       if (isValidUTR) {
           setHasBlueBadge(true);
           setIsVerificationDialogOpen(false);
           toast({ title: "Blue Badge Activated!", description: "Your account is now verified." });
       } else {
           toast({ variant: "destructive", title: "UTR Verification Failed", description: "Invalid UTR code. Please check and try again." });
       }
   };

   const handlePaymentMethodSelect = (method: string) => {
        setPaymentMethod(method);
        if (method === 'upi') {
            setIsVerificationDialogOpen(true);
        } else {
             toast({ title: `Payment via ${method}`, description: "This payment method is currently unavailable in the demo." });
        }
    };

    const handleShareProfile = async () => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      const shareData = {
        title: `Check out ${MOCK_CURRENT_USERNAME}'s profile on AKmax`,
        text: `Connect with ${MOCK_CURRENT_USERNAME} on AKmax!`,
        url: window.location.origin + MOCK_CURRENT_USER_PROFILE_URL,
      };
      try {
        if (navigator.share && window.isSecureContext) {
          await navigator.share(shareData);
          toast({ title: "Profile Shared!" });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareData.url);
          toast({ title: "Profile Link Copied!", description: "Share feature not available or not in secure context. Link copied." });
        } else {
          toast({ variant: "destructive", title: "Sharing Not Supported", description: "Your browser does not support this feature." });
        }
      } catch (error: any) {
        console.error('Error sharing profile:', error);
        if (error.name === 'NotAllowedError' || error.message?.includes('Permission denied')) {
             let descriptionMessage: string;
             if (typeof window !== 'undefined' && !window.isSecureContext) {
                 descriptionMessage = "Web Share API requires a secure (HTTPS) connection. Trying to copy link instead.";
             } else {
                 descriptionMessage = "Sharing permission was denied or this action is not allowed by your browser. Trying to copy link instead.";
             }
             toast({
                variant: "destructive",
                title: "Sharing Problem",
                description: descriptionMessage,
                duration: 7000,
             });
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                try {
                    await navigator.clipboard.writeText(shareData.url);
                    toast({ title: "Link Copied!", description: "Sharing feature was unavailable, but your profile link has been copied to the clipboard." });
                } catch (copyError) {
                    console.error('Fallback copy to clipboard failed:', copyError);
                    toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy the link." });
                }
            }
         } else if (error.name === 'AbortError') {
             toast({ variant: "destructive", title: "Sharing Cancelled", description: "You cancelled the share operation." });
         } else {
             toast({ variant: "destructive", title: "Sharing Failed", description: "Could not share your profile at this time. Please try again." });
         }
      }
    };


  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Accordion type="multiple" className="w-full space-y-4" defaultValue={['account', 'privacy', 'support']}>
        <AccordionItem value="account">
           <Card className="overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                 <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                     <CardTitle className="text-lg font-medium">Account</CardTitle>
                     <CardDescription className="text-sm">Manage your AKmax profile and account actions.</CardDescription>
                    </div>
                  </div>
               </AccordionTrigger>
              <AccordionContent>
                <Separator />
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <Button variant="outline" asChild>
                    <Link href="/profile/edit">Edit Profile</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/settings/change-password"><KeyRound className="mr-2 h-4 w-4"/>Change Password</Link>
                  </Button>
                  <Button variant="outline" onClick={() => setIsAccountSwitcherOpen(true)}>
                    <Repeat className="mr-2 h-4 w-4"/>Switch Account
                  </Button>
                   <Button variant="outline" asChild>
                     <Link href="/profile/qr"><QrCode className="mr-2 h-4 w-4"/>QR Code</Link>
                   </Button>
                   <Button variant="outline" onClick={handleShareProfile}>
                    <Share2 className="mr-2 h-4 w-4"/>Share Profile
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/settings/professional-account"><Briefcase className="mr-2 h-4 w-4"/>Switch to Professional Account</Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="destructive-outline" className="sm:col-span-2">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and all associated data from AKmax.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => toast({
                                variant: "destructive",
                                title: "Account Deletion Process Initiated (Demo)",
                                description: "In a real app, this would start the account deletion process."
                            })}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Yes, delete my account
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                 </AlertDialog>
                 </CardContent>
             </AccordionContent>
          </Card>
        </AccordionItem>

         <AccordionItem value="privacy">
           <Card className="overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                     <div className="text-left">
                      <CardTitle className="text-lg font-medium">Privacy</CardTitle>
                      <CardDescription className="text-sm">Control your AKmax account visibility and interactions.</CardDescription>
                    </div>
                  </div>
              </AccordionTrigger>
              <AccordionContent>
                 <Separator />
                 <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="private-account" className="flex flex-col space-y-1">
                          <span>Private Account</span>
                          <span className="font-normal leading-snug text-muted-foreground text-xs">
                           If your account is private, only followers you approve can see your content on AKmax.
                          </span>
                        </Label>
                        <Switch id="private-account" checked={isPrivateAccount} onCheckedChange={setIsPrivateAccount}/>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="suggest-account" className="flex flex-col space-y-1">
                        <span>Suggest account to others</span>
                        <span className="font-normal leading-snug text-muted-foreground text-xs">
                           Allow your AKmax account to be suggested to people.
                        </span>
                        </Label>
                        <Switch id="suggest-account" checked={suggestAccount} onCheckedChange={setSuggestAccount}/>
                    </div>
                     <Separator />
                     <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="sync-contacts" className="flex flex-col space-y-1">
                        <span>Sync contacts and friends</span>
                         <span className="font-normal leading-snug text-muted-foreground text-xs">
                           Find people you may know on AKmax by syncing contacts.
                         </span>
                        </Label>
                        <Switch id="sync-contacts" checked={syncContacts} onCheckedChange={setSyncContacts}/>
                    </div>
                    <Separator />
                     <Button variant="outline" className="w-full justify-start text-left" onClick={() => toast({ title: "Feature unavailable"})}>
                        <ListFilter className="mr-2 h-4 w-4"/> Manage comment filters <span className="ml-auto text-muted-foreground text-xs">Off</span>
                     </Button>
                     <Separator />
                     <Button variant="outline" className="w-full justify-start text-left" onClick={() => toast({ title: "Feature unavailable"})}>
                        <MessageSquareText className="mr-2 h-4 w-4"/> Who can send you direct messages <span className="ml-auto text-muted-foreground text-xs capitalize">{dmSetting}</span>
                     </Button>
                    <Separator />
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="allow-downloads" className="flex flex-col space-y-1">
                        <span>Allow post downloads</span>
                         <span className="font-normal leading-snug text-muted-foreground text-xs">
                           Let others download your AKmax posts.
                         </span>
                        </Label>
                        <Switch id="allow-downloads" checked={allowDownloads} onCheckedChange={setAllowDownloads}/>
                    </div>
                    <Separator />
                     <Button variant="outline" onClick={() => toast({ title: "Feature unavailable"})}><Users className="mr-2 h-4 w-4"/> Blocked Users</Button>
                      <Button variant="outline" onClick={() => toast({ title: "Feature unavailable"})}><VolumeX className="mr-2 h-4 w-4"/> Muted Accounts</Button>
                       <Button variant="outline" onClick={() => toast({ title: "Feature unavailable"})}><Eye className="mr-2 h-4 w-4"/> Story Settings</Button>
                  </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

        <AccordionItem value="subscription">
            <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                        <BadgeCheck className="h-5 w-5 text-muted-foreground" />
                        <div className="text-left">
                            <CardTitle className="text-lg font-medium">AKmax Blue</CardTitle>
                            <CardDescription className="text-sm">Get verified and unlock premium features.</CardDescription>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <Separator />
                    <CardContent className="p-6 space-y-4">
                         {!hasBlueBadge ? (
                                <>
                                    <p>Get the AKmax Blue badge to show you're authentic and unlock exclusive features.</p>
                                    <Button onClick={checkEligibility}>Check Blue Badge Eligibility</Button>

                                    {showEligibilityCheck && (
                                         isEligibleForFreeBadge ? (
                                            <>
                                                <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400"/>
                                                    <AlertTitle className="text-green-800 dark:text-green-300">Congratulations!</AlertTitle>
                                                    <AlertDescription className="text-green-700 dark:text-green-400">
                                                        Your account is eligible for a free Blue Badge due to having {followerCount.toLocaleString()} followers.
                                                    </AlertDescription>
                                                </Alert>
                                                <Button onClick={() => { setHasBlueBadge(true); toast({ title: "Blue Badge Activated!" }); }}>Activate Free Blue Badge</Button>
                                            </>
                                        ) : (
                                            <>
                                                <Alert variant="destructive">
                                                     <AlertCircle className="h-4 w-4" />
                                                    <AlertTitle>Not Eligible for Free Badge</AlertTitle>
                                                    <AlertDescription>
                                                        You have {followerCount.toLocaleString()} followers. Purchase the Blue Badge for ₹100/month.
                                                    </AlertDescription>
                                                </Alert>

                                                <div className="space-y-2 pt-4">
                                                    <Label>Choose Payment Method:</Label>
                                                     <div className="grid grid-cols-2 gap-2">
                                                        <Button variant="outline" className="w-full justify-start" onClick={() => handlePaymentMethodSelect('upi')}>UPI (arbaj00100@fam)</Button>
                                                        <Button variant="outline" className="w-full justify-start" onClick={() => handlePaymentMethodSelect('debit')}>Debit Card</Button>
                                                        <Button variant="outline" className="w-full justify-start" onClick={() => handlePaymentMethodSelect('credit')}>Credit Card</Button>
                                                        <Button variant="outline" className="w-full justify-start" onClick={() => handlePaymentMethodSelect('paypal')}>PayPal</Button>
                                                        <Button variant="outline" className="w-full justify-start" onClick={() => handlePaymentMethodSelect('paytm')}>Paytm</Button>
                                                        <Button variant="outline" className="w-full justify-start" onClick={() => handlePaymentMethodSelect('gpay')}>Google Pay</Button>
                                                        <Button variant="outline" className="w-full justify-start" onClick={() => handlePaymentMethodSelect('bank')}>Bank Transfer</Button>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    )}
                                </>
                            ) : (
                                <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400"/>
                                    <AlertTitle className="text-green-800 dark:text-green-300">AKmax Blue Activated</AlertTitle>
                                    <AlertDescription className="text-green-700 dark:text-green-400">
                                        Your account is verified with the Blue Badge.
                                    </AlertDescription>
                                </Alert>
                            )}
                    </CardContent>
                </AccordionContent>
            </Card>
        </AccordionItem>

         <AccordionItem value="promote">
           <Card className="overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                     <TrendingUp className="h-5 w-5 text-muted-foreground" />
                     <div className="text-left">
                      <CardTitle className="text-lg font-medium">Promote</CardTitle>
                      <CardDescription className="text-sm">Manage your ads and promotions on AKmax.</CardDescription>
                     </div>
                  </div>
              </AccordionTrigger>
              <AccordionContent>
                 <Separator />
                 <CardContent className="p-6 space-y-2">
                     <Button variant="outline" className="w-full justify-start" asChild>
                       <Link href="/promote"><Megaphone className="mr-2 h-4 w-4"/> View Ad Plans & Get Started</Link>
                     </Button>
                     <Button variant="outline" className="w-full justify-start" asChild>
                       <Link href="/ads/create"><FileTextIcon className="mr-2 h-4 w-4"/> Create New Ad</Link>
                     </Button>
                     <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/ads/dashboard"><LayoutDashboard className="mr-2 h-4 w-4"/> Ad Dashboard & Analytics</Link>
                     </Button>
                     <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/settings/payments"><Wallet className="mr-2 h-4 w-4"/> Ad Payment Methods</Link>
                     </Button>
                 </CardContent>
               </AccordionContent>
           </Card>
         </AccordionItem>

        <AccordionItem value="notifications">
           <Card className="overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                   <Bell className="h-5 w-5 text-muted-foreground" />
                   <div className="text-left">
                    <CardTitle className="text-lg font-medium">Notifications</CardTitle>
                    <CardDescription className="text-sm">Choose which AKmax activities you want to be notified about.</CardDescription>
                   </div>
                 </div>
              </AccordionTrigger>
              <AccordionContent>
                <Separator />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between space-x-2"><Label htmlFor="notif-likes">Likes</Label><Switch id="notif-likes" defaultChecked/></div>
                  <Separator/>
                  <div className="flex items-center justify-between space-x-2"><Label htmlFor="notif-comments">Comments</Label><Switch id="notif-comments" defaultChecked/></div>
                  <Separator/>
                  <div className="flex items-center justify-between space-x-2"><Label htmlFor="notif-followers">New Followers</Label><Switch id="notif-followers" defaultChecked/></div>
                  <Separator/>
                  <div className="flex items-center justify-between space-x-2"><Label htmlFor="notif-mentions">Mentions & Tags</Label><Switch id="notif-mentions" defaultChecked/></div>
                  <Separator/>
                  <div className="flex items-center justify-between space-x-2"><Label htmlFor="notif-dms">Direct Messages</Label><Switch id="notif-dms" defaultChecked/></div>
                  <Separator/>
                  <div className="flex items-center justify-between space-x-2"><Label htmlFor="notif-live">Live</Label><Switch id="notif-live" checked={liveNotifications} onCheckedChange={setLiveNotifications}/></div>
                  <Separator/>
                  <div className="flex items-center justify-between space-x-2"><Label htmlFor="notif-video-updates">Video updates from accounts you follow</Label><Switch id="notif-video-updates" checked={videoUpdatesNotifications} onCheckedChange={setVideoUpdatesNotifications}/></div>
                  <Separator/>
                  <div className="flex items-center justify-between space-x-2"><Label htmlFor="notif-recommendations">Recommendations</Label><Switch id="notif-recommendations" checked={recommendationsNotifications} onCheckedChange={setRecommendationsNotifications}/></div>
                  <Separator/>
                  <div className="flex items-center justify-between space-x-2"><Label htmlFor="push-notifications">Enable Push Notifications</Label><Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications}/></div>
                  <Separator/>
                  <div className="flex items-center justify-between space-x-2"><Label htmlFor="email-notifications">Enable Email Notifications</Label><Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications}/></div>
                </CardContent>
              </AccordionContent>
          </Card>
        </AccordionItem>

         <AccordionItem value="display">
           <Card className="overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                 <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                     <div className="text-left">
                      <CardTitle className="text-lg font-medium">Content & Display</CardTitle>
                      <CardDescription className="text-sm">Customize language, appearance, and accessibility for AKmax.</CardDescription>
                     </div>
                 </div>
               </AccordionTrigger>
              <AccordionContent>
                 <Separator />
                 <CardContent className="p-6 space-y-6">
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Feature unavailable"})}>
                      <Languages className="mr-2 h-4 w-4"/> App Language <span className="ml-auto text-muted-foreground text-xs">English</span>
                    </Button>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <div className="flex gap-2">
                        <Button variant={selectedTheme === 'light' ? 'default' : 'outline'} onClick={() => applyTheme('light')}>Light</Button>
                        <Button variant={selectedTheme === 'dark' ? 'default' : 'outline'} onClick={() => applyTheme('dark')}>Dark</Button>
                        <Button variant={selectedTheme === 'system' ? 'default' : 'outline'} onClick={() => applyTheme('system')}>System</Button>
                      </div>
                       <p className="text-xs text-muted-foreground">Theme switching applies to the AKmax app's appearance.</p>
                    </div>
                    <Separator />
                     <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Feature unavailable"})}>
                       <ShieldOff className="mr-2 h-4 w-4"/> Digital Wellbeing (Screen Time, Restricted Mode)
                     </Button>
                     <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Feature unavailable"})}>
                       <PlayCircle className="mr-2 h-4 w-4"/> Playback (Autoplay, Captions)
                     </Button>
                     <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Feature unavailable"})}>
                       <Accessibility className="mr-2 h-4 w-4"/> Accessibility Settings
                     </Button>
                 </CardContent>
             </AccordionContent>
           </Card>
         </AccordionItem>

        <AccordionItem value="ads">
           <Card className="overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                 <div className="flex items-center gap-3">
                    <Megaphone className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                     <CardTitle className="text-lg font-medium">Advertising Preferences</CardTitle>
                      <CardDescription className="text-sm">Control how ads are shown to you on AKmax.</CardDescription>
                    </div>
                  </div>
               </AccordionTrigger>
              <AccordionContent>
                <Separator />
                <CardContent className="p-6 space-y-6">
                   <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="ad-personalization" className="flex flex-col space-y-1">
                        <span>Allow Ad Personalization</span>
                        <span className="font-normal leading-snug text-muted-foreground text-xs">
                          Allow AKmax (AK Group 76) to use your activity to show you more relevant ads.
                        </span>
                      </Label>
                      <Switch id="ad-personalization" checked={allowAdPersonalization} onCheckedChange={setAllowAdPersonalization}/>
                   </div>
                   <Separator />
                    <Button variant="outline" className="w-full justify-start text-left" onClick={() => toast({ title: "Feature unavailable", description:"Managing ad topics coming soon." })}>
                      <Target className="mr-2 h-4 w-4"/> Manage Ad Topics
                    </Button>
                     <Separator />
                    <Button variant="link" className="p-0 h-auto text-sm justify-start" asChild>
                       <Link href="/privacy">
                         <span className="flex items-center gap-2">
                            <Info className="h-4 w-4"/> Learn how AKmax uses data for ads
                         </span>
                       </Link>
                    </Button>
                 </CardContent>
             </AccordionContent>
          </Card>
        </AccordionItem>

         <AccordionItem value="cache">
           <Card className="overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                     <Trash2 className="h-5 w-5 text-muted-foreground" />
                     <div className="text-left">
                      <CardTitle className="text-lg font-medium">Cache & Cellular</CardTitle>
                      <CardDescription className="text-sm">Manage AKmax storage space and data usage.</CardDescription>
                     </div>
                  </div>
              </AccordionTrigger>
              <AccordionContent>
                 <Separator />
                 <CardContent className="p-6 space-y-4">
                    <Button variant="outline" className="w-full justify-start" onClick={handleClearCache}>
                      <Trash2 className="mr-2 h-4 w-4"/> Free up space (Clear Cache) <span className="ml-auto text-muted-foreground text-xs">150 MB</span>
                    </Button>
                     <Separator />
                     <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="data-saver" className="flex flex-col space-y-1">
                        <span>Data Saver</span>
                        <span className="font-normal leading-snug text-muted-foreground text-xs">
                           Reduces your cellular data usage on AKmax. Videos may be lower resolution.
                        </span>
                        </Label>
                        <Switch id="data-saver" checked={dataSaver} onCheckedChange={setDataSaver}/>
                    </div>
                 </CardContent>
               </AccordionContent>
           </Card>
         </AccordionItem>

        <AccordionItem value="archive">
           <Card className="overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                 <div className="flex items-center gap-3">
                    <Archive className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                     <CardTitle className="text-lg font-medium">Archive</CardTitle>
                    <CardDescription className="text-sm">View your archived stories and posts.</CardDescription>
                    </div>
                  </div>
               </AccordionTrigger>
              <AccordionContent>
                <Separator />
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/profile/archive/stories">View Story Archive</Link>
                    </Button>
                     <Button variant="outline" asChild>
                        <Link href="/profile/archive/posts">View Posts Archive</Link>
                     </Button>
                 </CardContent>
             </AccordionContent>
          </Card>
        </AccordionItem>

         <AccordionItem value="support">
           <Card className="overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                     <LifeBuoy className="h-5 w-5 text-muted-foreground" />
                     <div className="text-left">
                      <CardTitle className="text-lg font-medium">Support & About</CardTitle>
                      <CardDescription className="text-sm">Help center, AKmax policies, and app info.</CardDescription>
                     </div>
                  </div>
              </AccordionTrigger>
              <AccordionContent>
                 <Separator />
                 <CardContent className="p-6 space-y-2"> 
                    <Button variant="link" className="p-0 h-auto flex items-center gap-2 justify-start w-full" asChild>
                      <Link href="/help-center">
                        <span className="flex items-center gap-2"><LifeBuoy className="h-4 w-4"/> Help Center</span>
                      </Link>
                    </Button>
                    <Button variant="link" className="p-0 h-auto flex items-center gap-2 justify-start w-full" asChild>
                      <Link href="/safety-center">
                         <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Safety Center (AK Group 76)</span>
                      </Link>
                    </Button>
                    <Button variant="link" className="p-0 h-auto flex items-center gap-2 justify-start w-full" asChild>
                      <Link href="/community-guidelines">
                        <span className="flex items-center gap-2"><BookOpenCheck className="h-4 w-4"/> Community Guidelines</span>
                      </Link>
                    </Button>
                     <Button variant="link" className="p-0 h-auto flex items-center gap-2 justify-start w-full" asChild>
                      <Link href="/terms">
                        <span className="flex items-center gap-2"><FileQuestion className="h-4 w-4"/> Terms of Service (AK Group 76)</span>
                      </Link>
                    </Button>
                    <Button variant="link" className="p-0 h-auto flex items-center gap-2 justify-start w-full" asChild>
                      <Link href="/privacy">
                        <span className="flex items-center gap-2"><Lock className="h-4 w-4"/> Privacy Policy (AK Group 76)</span>
                      </Link>
                    </Button>
                     <Button variant="link" className="p-0 h-auto flex items-center gap-2 justify-start w-full" asChild>
                       <Link href="/copyright">
                         <span className="flex items-center gap-2"><FileTextIcon className="h-4 w-4"/> Copyright Policy (AK Group 76)</span>
                      </Link>
                    </Button>
                     <Button variant="link" className="p-0 h-auto flex items-center gap-2 justify-start w-full" asChild>
                       <Link href="/about">
                         <span className="flex items-center gap-2"><Info className="h-4 w-4"/> About AKmax</span>
                        </Link>
                     </Button>
                     <Separator className="my-3"/>
                    <p className="text-sm text-muted-foreground">AKmax App Version: 0.1.0 (by AK Group 76)</p>
                 </CardContent>
               </AccordionContent>
           </Card>
         </AccordionItem>
      </Accordion>

      <Card>
        <CardContent className="p-6">
           <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </CardContent>
      </Card>

       <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
            <DialogContent>
                <DialogHeaderRadix>
                    <DialogTitleRadix>Complete Payment & Verify</DialogTitleRadix>
                    <DialogDescriptionRadix>
                        Please pay ₹100 to UPI ID: <span className="font-mono font-semibold">arbaj00100@fam</span>.
                        Once paid, enter the UTR/Transaction ID below to activate your Blue Badge.
                    </DialogDescriptionRadix>
                </DialogHeaderRadix>
                <div className="py-4 space-y-2">
                    <Label htmlFor="utr-code">Enter UTR / Transaction ID</Label>
                    <Input
                        id="utr-code"
                        placeholder="e.g., UTR1234567890"
                        value={utrCode}
                        onChange={(e) => setUtrCode(e.target.value)}
                    />
                </div>
                <DialogFooterRadix>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleVerifyUtr} disabled={isVerifyingUTR || !utrCode}>
                        {isVerifyingUTR ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                        {isVerifyingUTR ? "Verifying..." : "Verify & Activate Badge"}
                    </Button>
                </DialogFooterRadix>
            </DialogContent>
        </Dialog>

        <AccountSwitcherDialog isOpen={isAccountSwitcherOpen} onOpenChange={setIsAccountSwitcherOpen} />
    </div>
  );
};

export default SettingsPage;

