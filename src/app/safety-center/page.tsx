
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, UserCheck, AlertTriangle, Bell, ShieldQuestion, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic'; // Ensures the page is dynamically rendered

export default function SafetyCenterPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
       <Button variant="outline" size="sm" asChild className="mb-6">
           <Link href="/settings">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
           </Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary"/> AKmax Safety Center (AK Group 76)
          </CardTitle>
          <CardDescription>
            Learn about our commitment to safety and how to stay safe on AKmax.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            Your safety is our priority at AK Group 76. AKmax is designed to be a positive and secure environment. This Safety Center provides resources and information to help you manage your safety and privacy on our platform.
          </p>
          
            <h3 className="font-semibold pt-4 border-t text-xl">Key Safety Areas</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-medium flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary"/>Keeping Your Account Secure</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm pl-4">
                        <li>Use a strong, unique password.</li>
                        <li>Enable two-factor authentication (if available).</li>
                        <li>Be cautious of phishing attempts and suspicious links.</li>
                        <li>Regularly review your login activity.</li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary"/>Reporting Violations</h4>
                    <p className="text-sm text-muted-foreground">
                       If you see content or behavior that violates our Community Guidelines, please report it. You can typically report posts, comments, or profiles directly within the app. Your reports help us maintain a safe community.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><ShieldQuestion className="h-5 w-5 text-primary"/>Bullying and Harassment Prevention</h4>
                    <p className="text-sm text-muted-foreground">
                        AKmax has a zero-tolerance policy for bullying and harassment. We encourage respectful interactions. Utilize blocking and reporting tools if you encounter such behavior.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Lock className="h-5 w-5 text-primary"/>Privacy Settings</h4>
                     <p className="text-sm text-muted-foreground">
                        Manage who can see your content and interact with you through your privacy settings. You can often choose to make your account private, control who can send you messages, and manage comment visibility. Explore these options in your account settings.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/>Resources for Parents and Teens</h4>
                     <p className="text-sm text-muted-foreground">
                       We are committed to providing a safe experience for younger users. Resources for parents and teens, including safety tips and guides, will be developed to help navigate online safety.
                    </p>
                </div>
            </div>
             <p className="text-xs text-muted-foreground mt-6 pt-4 border-t">
                For immediate assistance or to report serious safety concerns, please contact our support team via the Help Center or email <a href="mailto:akgroup76.com@gmail.com" className="text-primary hover:underline">akgroup76.com@gmail.com</a>.
             </p>
        </CardContent>
      </Card>
    </div>
  );
}
