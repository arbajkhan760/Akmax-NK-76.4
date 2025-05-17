
"use client";

import { useState, useEffect, useRef } from 'react'; // Added useRef
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';


const countryCodes = [
  { value: '+91', label: '🇮🇳 India (+91)' },
  { value: '+1', label: '🇺🇸 USA (+1)' },
  { value: '+44', label: '🇬🇧 UK (+44)' },
  // Add more as needed
];

const SYNTHETIC_EMAIL_DOMAIN = "phone.akmax.app"; // Must match signup

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const firebaseConfigToastShownRef = useRef(false); // Ref to track if toast has been shown

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSentUI, setIsOtpSentUI] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);


  // Initialize reCAPTCHA for OTP based phone login (if we add that option)
  useEffect(() => {
    if (typeof window !== 'undefined' && loginMethod === 'phone_otp' && !window.recaptchaVerifierOtpLogin) { // Use a different verifier instance for login
      // Check if auth object is valid (not the dummy {} from firebase.ts)
      if (!auth || !auth.app) {
        console.warn("Firebase Auth not properly initialized or misconfigured. Skipping reCAPTCHA setup for login.");
        if (!firebaseConfigToastShownRef.current) {
            toast({
                variant: "destructive",
                title: "Firebase Misconfiguration",
                description: "Firebase is not configured correctly. OTP features will not work. Please check .env.local and restart the server.",
                duration: 10000,
            });
            firebaseConfigToastShownRef.current = true;
        }
        return;
      }
      
      try {
        window.recaptchaVerifierOtpLogin = new RecaptchaVerifier(auth, 'recaptcha-container-login', {
          'size': 'invisible',
          'callback': (response: any) => { console.log("reCAPTCHA for login solved:", response); },
          'expired-callback': () => {
            toast({ variant: "destructive", title: "reCAPTCHA Expired", description: "Please try sending OTP again." });
          }
        });
        window.recaptchaVerifierOtpLogin.render().catch(err => console.error("Error rendering reCAPTCHA for login", err));
      } catch (error: any) {
          console.error("Error initializing RecaptchaVerifier for login:", error);
          if (!firebaseConfigToastShownRef.current) {
            toast({ variant: "destructive", title: "reCAPTCHA Error", description: `Could not initialize reCAPTCHA: ${error.message}. This might be due to Firebase misconfiguration.`});
            firebaseConfigToastShownRef.current = true;
          }
      }
    }
  }, [loginMethod, toast]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth || !auth.app) {
        toast({ variant: "destructive", title: "Login Failed", description: "Authentication service is not available. Please check Firebase configuration." });
        setIsLoading(false);
        if (!firebaseConfigToastShownRef.current) {
            firebaseConfigToastShownRef.current = true; // Ensure toast is shown if not already
        }
        return;
    }

    if (loginMethod === 'email') {
      if (!identifier.includes('@')) {
        toast({ variant: "destructive", title: "Invalid Email" });
        setIsLoading(false);
        return;
      }
      try {
        await signInWithEmailAndPassword(auth, identifier, password);
        toast({ title: "Login Successful!" });
        router.push('/'); // Redirect to home or dashboard
      } catch (error: any) {
        console.error("Email login error:", error);
        toast({ variant: "destructive", title: "Login Failed", description: error.message });
      }
    } else if (loginMethod === 'phone') { // This is now Phone + Password
      const fullPhoneNumber = countryCode + identifier;
      if (!/^\+\d{1,3}\d{7,15}$/.test(fullPhoneNumber)) {
        toast({ variant: "destructive", title: "Invalid Phone Number." });
        setIsLoading(false);
        return;
      }
      const syntheticEmail = `${fullPhoneNumber}@${SYNTHETIC_EMAIL_DOMAIN}`;
      try {
        await signInWithEmailAndPassword(auth, syntheticEmail, password);
        toast({ title: "Login Successful!" });
        router.push('/');
      } catch (error: any) {
        console.error("Phone + Password login error:", error);
        // Handle specific errors like 'auth/user-not-found' or 'auth/wrong-password'
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
             toast({ variant: "destructive", title: "Login Failed", description: "Invalid phone number or password."});
        } else {
            toast({ variant: "destructive", title: "Login Failed", description: error.message });
        }
      }
    }
    // TODO: If implementing direct OTP login, add another 'else if (loginMethod === 'phone_otp')'
    // and handle OTP sending and verification here.
    // For now, the "Phone" tab is for Phone+Password.

    setIsLoading(false);
  };

  const handleTabChange = (value: string) => {
    setLoginMethod(value as 'email' | 'phone');
    setIdentifier('');
    setPassword('');
    setOtp('');
    setIsOtpSentUI(false);
    setConfirmationResult(null);
    // Potentially reset reCAPTCHA if switching away from an OTP tab
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50 p-4">
      <Tabs defaultValue="phone" className="w-full max-w-sm" onValueChange={handleTabChange}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">AKmax Login</CardTitle>
            <CardDescription>Enter your details to login</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phone"><Phone className="mr-1 h-4 w-4 inline-block"/> Phone</TabsTrigger>
              <TabsTrigger value="email"><Mail className="mr-1 h-4 w-4 inline-block"/> Email</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <TabsContent value="phone" className="pt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-login">Phone Number</Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-[150px]" aria-label="Country Code"><SelectValue placeholder="Code" /></SelectTrigger>
                      <SelectContent>{countryCodes.map(cc => (<SelectItem key={cc.value} value={cc.value}>{cc.label}</SelectItem>))}</SelectContent>
                    </Select>
                    <Input id="phone-login" type="tel" placeholder="Your phone number" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-phone-login">Password</Label>
                  <div className="relative">
                    <Input id="password-phone-login" type={showPassword ? "text" : "password"} placeholder="Enter your 8-character password" required minLength={8} maxLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div id="recaptcha-container-login"></div> {/* For potential OTP login reCAPTCHA */}
              </TabsContent>

              <TabsContent value="email" className="pt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email Address or Username</Label>
                  <Input id="email-login" type="text" placeholder="you@example.com or your_username" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-email-login">Password</Label>
                  <div className="relative">
                    <Input id="password-email-login" type={showPassword ? "text" : "password"} placeholder="Enter your 8-character password" required minLength={8} maxLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm">
            <span>Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign Up</Link></span>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
}

