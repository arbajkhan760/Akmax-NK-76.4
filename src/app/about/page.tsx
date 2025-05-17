
'use client'; // Required for using the AI service hook/function

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Info, Building, Users, Lightbulb, Goal, Cpu, ShieldCheck, Zap, Bot } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Akgroup76AiStatus } from '@/services/akgroup76AiService';
import { getAkgroup76AiStatus } from '@/services/akgroup76AiService';

export default function AboutPage() {
  const [aiStatus, setAiStatus] = useState<Akgroup76AiStatus | null>(null);

  useEffect(() => {
    // Fetch AI status on client mount
    setAiStatus(getAkgroup76AiStatus());
  }, []);

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
             <Info className="h-6 w-6 text-primary"/> About AKmax
          </CardTitle>
          <CardDescription>
            Learn more about the AKmax application by AK Group 76.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Building className="h-5 w-5 text-primary"/>Our Company: AK Group 76</h3>
            <p className="text-sm text-muted-foreground">
              AKmax is proudly developed and operated by AK Group 76, a forward-thinking technology company dedicated to creating innovative digital experiences. We believe in the power of connection and creativity.
            </p>
          </div>

           <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary"/>Our Vision</h3>
            <p className="text-sm text-muted-foreground">
              To be the next generation social media platform that empowers individuals to express themselves, share their passions, and build meaningful connections in a safe, engaging, and dynamic online environment.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Goal className="h-5 w-5 text-primary"/>Our Mission</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground pl-4 space-y-1">
                <li>Foster a vibrant community where creativity flourishes.</li>
                <li>Provide intuitive tools for content creation and sharing.</li>
                <li>Prioritize user safety, privacy, and well-being.</li>
                <li>Continuously innovate to deliver exciting new features and experiences.</li>
                <li>Support creators and enable them to reach a wider audience.</li>
            </ul>
          </div>
          
           <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>The AKmax Team</h3>
            <p className="text-sm text-muted-foreground">
              We are a passionate team of developers, designers, and strategists at AK Group 76, united by our goal to build a platform that users love. We are constantly working to improve AKmax and welcome your feedback.
            </p>
          </div>

          {/* AKGROUP76 AI Section */}
          <div className="pt-6 border-t">
            <h3 className="font-semibold text-xl flex items-center gap-2 mb-3">
                <Cpu className="h-6 w-6 text-purple-500"/> AKGROUP76 AI: The Future of AKmax
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
                AKmax is powered by AKGROUP76 AI, an internal, autonomous update engine designed to continuously evolve the application while ensuring its safety, integrity, and modern performance.
            </p>
            {aiStatus && (
                <div className="p-3 border rounded-md bg-secondary/50 space-y-1 mb-4">
                    <p className="text-sm font-medium">Current AI Status: <span className="text-primary">{aiStatus.phase}</span></p>
                    <p className="text-xs text-muted-foreground">{aiStatus.details}</p>
                </div>
            )}
            <div className="space-y-3">
                 <div>
                    <h4 className="font-medium text-md">Operational Phases:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground pl-4 space-y-1 mt-1">
                        <li><strong>Phase 1 – Observation Mode (First 6 Months):</strong> Silently monitors user interactions, app behavior, system performance, and feedback trends without pushing any updates. Gathers valuable data to prepare for smart upgrades.</li>
                        <li><strong>Phase 2 – Intelligent Update Mode (After 6 Months):</strong> Begins releasing automatic monthly updates, including new social features, creative tools, performance enhancements, UI/UX improvements, smart integrations, stability upgrades, and user demand prediction using trend analysis.</li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="font-medium text-md flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-green-500"/> Advanced Protection Features:</h4>
                     <p className="text-sm text-muted-foreground mb-1">AKGROUP76 AI is programmed to enforce the following protections:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground pl-4 space-y-1">
                        {aiStatus?.protectionFeatures.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                 </div>
                 <p className="text-xs text-muted-foreground">
                    AKGROUP76 AI evolves AKmax safely and intelligently from generation to generation. Updates require no human approval, run silently, and always keep the app secure, real, modern, and high-performing.
                </p>
            </div>
          </div>


          <div className="pt-4 border-t">
             <p className="text-sm">App Version: 0.1.0 (Powered by AKGROUP76 AI)</p>
             <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} AK Group 76. All rights reserved.</p>
          </div>
          
          <div className="pt-4 border-t">
             <h3 className="font-semibold mb-2">Connect With Us</h3>
              <div className="flex gap-4 text-sm">
                <a href="mailto:akgroup76.com@gmail.com" className="text-primary hover:underline">Contact Support</a>
                <span className="text-muted-foreground">Website (Coming Soon)</span>
                <span className="text-muted-foreground">Careers (Coming Soon)</span>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
