import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, FileQuestion, FileText, Users, Shield, Info, Edit } from 'lucide-react'; // Added more icons

export default function TermsPage() {
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
            <FileQuestion className="h-6 w-6 text-primary"/> AKmax Terms of Service (AK Group 76)
          </CardTitle>
          <CardDescription>
            The legal terms governing your use of the AKmax application and services provided by AK Group 76. Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            Welcome to AKmax! By accessing or using our application and services (collectively, "Services"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, please do not use our Services.
          </p>
          
            <h3 className="font-semibold pt-4 border-t text-xl">Key Sections</h3>
            
            <div className="space-y-4">
                <div>
                    <h4 className="font-medium flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Your Account</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        You are responsible for safeguarding your account credentials and for any activities or actions under your account. You must notify AK Group 76 immediately upon becoming aware of any breach of security or unauthorized use of your account. You must be at least 13 years old (or the minimum age required by your country’s laws to use our Services) to create an account.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>Content Rights and Responsibilities</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        You retain ownership of any intellectual property rights that you hold in the content you submit to AKmax. However, by submitting content, you grant AK Group 76 a worldwide, royalty-free, non-exclusive license to use, distribute, reproduce, modify, adapt, publish, and display such content for the purpose of providing and promoting the Services. You are solely responsible for the content you post and must ensure it complies with our Community Guidelines and applicable laws.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Shield className="h-5 w-5 text-primary"/>Using AKmax Services</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        You agree to use AKmax Services in compliance with all applicable laws and our Community Guidelines. Prohibited activities include, but are not limited to, interfering with the Services, accessing them using a method other than the interface and instructions we provide, or engaging in any activity that is harmful, fraudulent, deceptive, or offensive.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Disclaimers and Limitations of Liability</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        AKmax Services are provided "as is" without any warranties, express or implied. AK Group 76 does not guarantee that the Services will be uninterrupted, error-free, or secure. To the fullest extent permitted by law, AK Group 76 shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><FileQuestion className="h-5 w-5 text-primary"/>Governing Law</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Edit className="h-5 w-5 text-primary"/>Changes to Terms</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        AK Group 76 reserves the right to modify these Terms at any time. We will provide notice of any material changes. Your continued use of the Services after such changes constitutes your acceptance of the new Terms.
                    </p>
                </div>
            </div>
             <p className="text-xs text-muted-foreground mt-6 pt-4 border-t">
               If you have any questions about these Terms, please contact us at <a href="mailto:akgroup76.com@gmail.com" className="text-primary hover:underline">akgroup76.com@gmail.com</a>.
             </p>
        </CardContent>
      </Card>
    </div>
  );
}

