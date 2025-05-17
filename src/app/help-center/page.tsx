
'use client'; // Required because AiAssistantChat is a client component

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, LifeBuoy, MessageSquare, Mail, FileQuestion } from 'lucide-react'; // Added FileQuestion icon
import AiAssistantChat from '@/components/app/AiAssistantChat'; // Import the new component
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';


export default function HelpCenterPage() {
  const [showChat, setShowChat] = useState(false);
  const supportEmail = "akgroup76.com@gmail.com";

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, go to the login screen and tap on the 'Forgot Password' link. Follow the instructions sent to your registered email or phone number."
    },
    {
      question: "How can I change my username?",
      answer: "Your display name can be changed in 'Edit Profile' settings. However, your unique login username (@username) typically cannot be changed after account creation for security reasons. If you have a critical issue, contact support."
    },
    {
      question: "What should I do if my account is locked or frozen?",
      answer: "If your account is locked, it's usually for security reasons or a violation of our terms. Please contact our support team at " + supportEmail + " with your account details for assistance."
    },
    {
      question: "I made a payment for a promotion/Blue Badge, but it's not active. What's wrong?",
      answer: "Please ensure you paid to the correct UPI ID (arbaj00100@fam) and entered the UTR/Transaction ID correctly. Verification can take a few hours. If it's been over 24 hours, contact support with your transaction details."
    },
    {
      question: "How do I report inappropriate content or a user?",
      answer: "You can usually report content (posts, comments, stories) or user profiles directly within the app by tapping the three-dot menu (...) associated with it and selecting 'Report'. Provide as much detail as possible."
    },
  ];

  return (
    <div className="container mx-auto max-w-3xl py-8">
       <Button variant="outline" size="sm" asChild className="mb-6">
           <Link href="/settings">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
           </Link>
        </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
             <LifeBuoy className="h-6 w-6 text-primary"/> AKmax Help Center
          </CardTitle>
          <CardDescription>
            Find answers to common questions, chat with our AI assistant, or contact support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Welcome to the AKmax Help Center (by AK Group 76).
          </p>
          <p>
            If you need quick assistance with account issues (username, password, locked accounts), payment/UTR verification, ad promotions, or general app usage, try our AI Assistant below.
          </p>
           <Button onClick={() => setShowChat(!showChat)}>
             <MessageSquare className="mr-2 h-4 w-4"/> {showChat ? 'Hide AI Assistant' : 'Chat with AI Assistant'}
           </Button>

           {/* Render AI Chat conditionally */}
           {showChat && (
             <div className="mt-4">
               <AiAssistantChat />
             </div>
           )}
        </CardContent>
      </Card>

       <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary"/> Contact Support
          </CardTitle>
          <CardDescription>
            If the AI Assistant couldn't resolve your issue or you need further help.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
           <p>
            For complex issues or if you require human assistance, please email our support team.
          </p>
          <p>
            Email us at: <a href={`mailto:${supportEmail}`} className="text-primary font-semibold hover:underline">{supportEmail}</a>
          </p>
          <p className="text-xs text-muted-foreground">
            Please provide as much detail as possible, including your username and any relevant screenshots, to help us assist you faster.
          </p>
        </CardContent>
      </Card>

       <Card>
         <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary"/> Frequently Asked Questions
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                           {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
         </CardContent>
       </Card>
    </div>
  );
}

