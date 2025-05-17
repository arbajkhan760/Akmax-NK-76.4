
"use client";

import { useState, useEffect, useRef } from 'react'; // Added useRef
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  ConfirmationResult,
  EmailAuthProvider,
  linkWithCredential,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const countryCodes = [
  { value: '+91', label: '🇮🇳 India (+91)' },
  { value: '+1', label: '🇺🇸 USA (+1)' },
  { value: '+44', label: '🇬🇧 UK (+44)' },
  // Add more as needed
];

const SYNTHETIC_EMAIL_DOMAIN = "phone.akmax.app"; // For internal use

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const firebaseConfigToastShownRef = useRef(false); // Ref to track if toast has been shown

  const [identifier, setIdentifier] = useState(''); // Holds phone number or email
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [signupMethod, setSignupMethod] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [isLoading, setIsLoading] = useState(false);

  // Firebase specific state
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isOtpSentUI, setIsOtpSentUI] = useState(false); // For UI state, not actual OTP sent status


  // Ensure reCAPTCHA is only initialized client-side
  useEffect(() => {
    if (typeof window !== 'undefined' && signupMethod === 'phone' && !window.recaptchaVerifier) {
      // Check if auth object is valid (not the dummy {} from firebase.ts)
      if (!auth || !auth.app ) { // Check if auth.app exists, indicating a real Auth instance
        console.warn("Firebase Auth not properly initialized or misconfigured. Skipping reCAPTCHA setup.");
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
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible', // Can be 'normal' or 'invisible'
          'callback': (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log("reCAPTCHA solved:", response);
          },
          'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            toast({ variant: "destructive", title: "reCAPTCHA Expired", description: "Please try sending OTP again." });
            if (window.recaptchaVerifier && window.grecaptcha) { // Check grecaptcha exists
                window.recaptchaVerifier.render().then((widgetId) => {
                    if (widgetId !== undefined) window.grecaptcha!.reset(widgetId); // Ensure grecaptcha is available
                });
            }
          }
        });
        window.recaptchaVerifier.render().catch(err => console.error("Error rendering reCAPTCHA", err));
      } catch (error: any) {
          console.error("Error initializing RecaptchaVerifier:", error);
          if (!firebaseConfigToastShownRef.current) {
            toast({ variant: "destructive", title: "reCAPTCHA Error", description: `Could not initialize reCAPTCHA: ${error.message}. This might be due to Firebase misconfiguration.`});
            firebaseConfigToastShownRef.current = true;
          }
      }
    }
  }, [signupMethod, toast]);


  const checkUsernameAvailability = async (uname: string): Promise<boolean> => {
    // This is a simplified check. In a real app, you'd query a 'usernames' collection
    // or use Firebase rules to ensure uniqueness.
    // For demo: assuming if a doc exists at users/uname it's taken for email signup.
    // For phone signup, username is stored after auth.
    // This check is more relevant for email signup before creating auth user.
    // For phone signup, username check can happen before Firestore write.
    if(signupMethod === 'email') {
        try {
            // A direct check for username usually needs a separate collection or query.
            // This is a placeholder for a real uniqueness check.
            // For this example, we'll skip a direct Firestore check for username availability on email signup
            // and assume it will be handled by backend rules or a more complex client-side check if needed.
            // Firebase Auth doesn't handle username uniqueness itself.
            console.warn("Username availability check is simplified for this demo.");
            return true; // Placeholder
        } catch (error) {
            console.error("Error checking username (simulated):", error);
            return false;
        }
    }
    return true; // For phone, check happens before Firestore save later
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth || !auth.app) {
        toast({ variant: "destructive", title: "Signup Failed", description: "Authentication service is not available. Please check Firebase configuration." });
        setIsLoading(false);
        if (!firebaseConfigToastShownRef.current) {
           firebaseConfigToastShownRef.current = true; // Ensure toast is shown if not already
        }
        return;
    }

    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords do not match!" });
      setIsLoading(false);
      return;
    }
    if (password.length !== 8) {
      toast({ variant: "destructive", title: "Password must be exactly 8 characters long." });
      setIsLoading(false);
      return;
    }
    if (!username.trim()) {
      toast({ variant: "destructive", title: "Please choose a username." });
      setIsLoading(false);
      return;
    }

    const isUsernameAvailable = await checkUsernameAvailability(username);
    if (!isUsernameAvailable) {
        toast({ variant: "destructive", title: "Username Taken", description: "This username is already in use. Please choose another." });
        setIsLoading(false);
        return;
    }

    if (signupMethod === 'email') {
      if (!identifier.includes('@')) {
        toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid email address." });
        setIsLoading(false);
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, identifier, password);
        await updateProfile(userCredential.user, { displayName: username });
        
        // Save additional user info to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          username: username,
          email: userCredential.user.email,
          createdAt: serverTimestamp(),
          // any other initial profile data
        });

        toast({ title: "Signup Successful!", description: "Your account has been created." });
        router.push('/'); // Redirect to home or dashboard
      } catch (error: any) {
        console.error("Email signup error:", error);
        toast({ variant: "destructive", title: "Signup Failed", description: error.message });
      }
    } else if (signupMethod === 'phone') {
        // This part is for initiating OTP. The actual account creation with password happens after OTP verification.
        const fullPhoneNumber = countryCode + identifier;
        if (!/^\+\d{1,3}\d{7,15}$/.test(fullPhoneNumber)) {
            toast({ variant: "destructive", title: "Invalid Phone Number." });
            setIsLoading(false);
            return;
        }
        if (!window.recaptchaVerifier) {
            toast({ variant: "destructive", title: "reCAPTCHA not ready. Please wait or check Firebase config.", duration: 5000 });
            setIsLoading(false);
            return;
        }
        try {
            const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
            setConfirmationResult(confirmation);
            setIsOtpSentUI(true); // Update UI to show OTP field
            toast({ title: "OTP Sent", description: `An OTP has been sent to ${fullPhoneNumber}.` });
        } catch (error: any) {
            console.error("Phone signup - OTP send error:", error);
            toast({ variant: "destructive", title: "OTP Send Failed", description: error.message });
            // Reset reCAPTCHA if it exists
            if (window.recaptchaVerifier && window.grecaptcha) {
                window.recaptchaVerifier.render().then((widgetId) => {
                   if(widgetId !== undefined) window.grecaptcha!.reset(widgetId);
                }).catch(renderError => console.error("Error resetting reCAPTCHA after OTP fail", renderError));
            }
        }
    }
    setIsLoading(false);
  };

  const handleVerifyOtpAndCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || !otp.trim()) {
      toast({ variant: "destructive", title: "Missing Information", description: "OTP or confirmation result is missing." });
      return;
    }
    setIsLoading(true);
    try {
      const userCredentialFromPhone = await confirmationResult.confirm(otp);
      const phoneUser = userCredentialFromPhone.user;
      toast({ title: "Phone Verified!", description: "Your phone number is verified." });

      // Phone user is now authenticated. Now link/create email-password for password login.
      const fullPhoneNumber = countryCode + identifier;
      const syntheticEmail = `${fullPhoneNumber}@${SYNTHETIC_EMAIL_DOMAIN}`;

      try {
        // Attempt to link with an Email/Password provider using the synthetic email and the chosen password.
        // This step is tricky if the synthetic email could already exist from a previous different user.
        // A more robust flow would be to try creating a new user with synthetic email and password,
        // then IF that user is different from phoneUser, try to link them.
        // However, Firebase aims to merge users if the email is the same and verified.
        
        // For simplicity, let's assume we can update the phoneUser's profile or link credentials.
        // The most direct way to "add" a password to a phone-verified user is to link an EmailAuthProvider.
        const emailPasswordCredential = EmailAuthProvider.credential(syntheticEmail, password);
        await linkWithCredential(phoneUser, emailPasswordCredential);

        toast({ title: "Account Finalized!", description: "Password set for your account." });

      } catch (linkError: any) {
        if (linkError.code === 'auth/credential-already-in-use' || linkError.code === 'auth/email-already-in-use') {
          // This synthetic email is somehow already tied to another account. This shouldn't happen if synthetic emails are unique per phone.
          // Or, the phoneUser already has an email credential.
          toast({ variant: "destructive", title: "Account Conflict", description: "This phone number might already be linked to an account with a password. Try logging in." });
          setIsLoading(false);
          return;
        } else if (linkError.code === 'auth/provider-already-linked') {
            toast({ title: "Account Finalized!", description: "Password was already set for this account." });
        }
        else {
          throw linkError; // Re-throw other linking errors
        }
      }

      await updateProfile(phoneUser, { displayName: username });

      // Save user info to Firestore
      await setDoc(doc(db, "users", phoneUser.uid), {
        uid: phoneUser.uid,
        username: username,
        phoneNumber: phoneUser.phoneNumber, // Actual phone number from auth
        syntheticEmail: syntheticEmail, // Store for potential lookup or recovery
        createdAt: serverTimestamp(),
      });

      toast({ title: "Signup Successful!", description: "Your account has been created." });
      router.push('/');

    } catch (error: any) {
      console.error("OTP Verification or Account Finalization error:", error);
      toast({ variant: "destructive", title: "Signup Failed", description: error.message });
    }
    setIsLoading(false);
  };


  const currentFormSubmitHandler = isOtpSentUI ? handleVerifyOtpAndCreateAccount : handleSignup;

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50 p-4">
      <Tabs defaultValue="phone" className="w-full max-w-sm" onValueChange={(value) => { setSignupMethod(value as 'email' | 'phone'); setIsOtpSentUI(false); setConfirmationResult(null); setIdentifier(''); setUsername(''); setPassword(''); setConfirmPassword(''); setOtp(''); }}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Join AKmax</CardTitle>
            <CardDescription>Create your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phone"><Phone className="mr-1 h-4 w-4 inline-block"/> Phone</TabsTrigger>
              <TabsTrigger value="email"><Mail className="mr-1 h-4 w-4 inline-block"/> Email</TabsTrigger>
            </TabsList>

            <form onSubmit={currentFormSubmitHandler} className="space-y-4">
              {!isOtpSentUI && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username-signup">Choose a Username</Label>
                    <Input id="username-signup" type="text" placeholder="your_unique_username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Create Password (8 characters)</Label>
                    <div className="relative">
                      <Input id="password-signup" type={showPassword ? "text" : "password"} placeholder="Enter 8-character password" required minLength={8} maxLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password-signup">Confirm Password</Label>
                    <div className="relative">
                      <Input id="confirm-password-signup" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" required minLength={8} maxLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </>
              )}
              
              <TabsContent value="phone" className="pt-0 space-y-4">
                 {!isOtpSentUI && (
                    <div className="space-y-2">
                        <Label htmlFor="phone-identifier">Phone Number</Label>
                        <div className="flex gap-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                            <SelectTrigger className="w-[150px]" aria-label="Country Code"><SelectValue placeholder="Code" /></SelectTrigger>
                            <SelectContent>{countryCodes.map(cc => (<SelectItem key={cc.value} value={cc.value}>{cc.label}</SelectItem>))}</SelectContent>
                        </Select>
                        <Input id="phone-identifier" type="tel" placeholder="Your phone number" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="flex-1" />
                        </div>
                    </div>
                 )}
                {signupMethod === 'phone' && <div id="recaptcha-container"></div>}

                {isOtpSentUI && (
                  <div className="space-y-2">
                    <Label htmlFor="otp-phone-signup">Enter OTP sent to {countryCode}{identifier}</Label>
                    <Input id="otp-phone-signup" type="text" inputMode="numeric" pattern="\d{6}" placeholder="Enter 6-digit OTP" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="email" className="pt-0 space-y-4">
                {!isOtpSentUI && ( // Email form part, not shown when OTP is sent for phone
                  <div className="space-y-2">
                    <Label htmlFor="email-identifier">Email Address</Label>
                    <Input id="email-identifier" type="email" placeholder="you@example.com" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                  </div>
                )}
              </TabsContent>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                  (isOtpSentUI ? 'Verify OTP & Create Account' : (signupMethod === 'phone' ? 'Send OTP' : 'Create Account'))
                }
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm">
            {isOtpSentUI ? (
              <Button variant="link" size="sm" onClick={() => { setIsOtpSentUI(false); setOtp(''); setConfirmationResult(null); /* Potentially reset reCAPTCHA here */ }}>
                Change number or Resend OTP?
              </Button>
            ) : (
              <span>Already have an account? <Link href="/login" className="text-primary hover:underline">Log In</Link></span>
            )}
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
}

