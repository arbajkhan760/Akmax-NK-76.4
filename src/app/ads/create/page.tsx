'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Target, Users, MapPin, Heart, ShoppingBag, Calendar, DollarSign, Megaphone, Image as ImageIcon, VideoIcon, Layers, ListChecks, BarChart, Send, Loader2, Briefcase, Globe, Settings2 } from 'lucide-react';
import type { AdCampaign, AdFormat, AdPlacement, AdCTA, AdTargeting } from '@/types/ads';
import { getUserAdStatus } from '@/services/adService'; 

const MOCK_USER_ID = 'user123';

export default function CreateAdPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [userStatus, setUserStatus] = useState<any>(null); 
    const [step, setStep] = useState(1); 

    const [campaignName, setCampaignName] = useState('');
    const [objective, setObjective] = useState('');
    const [adFormat, setAdFormat] = useState<AdFormat | ''>('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [headline, setHeadline] = useState('');
    const [cta, setCta] = useState<AdCTA | ''>('');
    const [destinationUrl, setDestinationUrl] = useState('');
    const [placements, setPlacements] = useState<AdPlacement[]>([]);
    const [targeting, setTargeting] = useState<AdTargeting>({ ageRange: [18, 65], genders: [], locations: [], interests: [] }); // Initialize with defaults
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    useEffect(() => {
      const fetchStatus = async () => {
          const status = await getUserAdStatus(MOCK_USER_ID);
          if (!status || !status.activePlanId) {
             toast({variant: 'destructive', title: "No Active Plan", description: "You need an active promotion plan to create ads."});
          }
          setUserStatus(status);
      }
      fetchStatus();
    }, [toast]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Submitting Ad Campaign:", {
            campaignName, objective, adFormat, mediaUrl, headline, cta, destinationUrl, placements, targeting, startDate, endDate
        });
        
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        const success = Math.random() > 0.1;

        setIsLoading(false);
        if (success) {
            toast({ title: "Ad Campaign Submitted!", description: "Your ad is being verified and will go live soon." });
            setStep(1);
            setCampaignName(''); setObjective(''); setAdFormat(''); setMediaUrl(''); setHeadline(''); setCta('');
            setDestinationUrl(''); setPlacements([]); setTargeting({ ageRange: [18, 65], genders: [], locations: [], interests: [] });
            setStartDate(''); setEndDate('');
        } else {
             toast({ variant: 'destructive', title: "Submission Failed", description: "Could not create ad campaign. Please check details." });
        }
    };

    const handlePlacementChange = (placement: AdPlacement, checked: boolean | string) => {
        setPlacements(prev =>
            checked ? [...prev, placement] : prev.filter(p => p !== placement)
        );
    };

    const handleGenderChange = (gender: 'male' | 'female' | 'other', checked: boolean | string) => {
        setTargeting(prev => {
            const currentGenders = prev.genders || [];
            return {
                ...prev,
                genders: checked ? [...currentGenders, gender] : currentGenders.filter(g => g !== gender)
            };
        });
    };

    return (
        <div className="container mx-auto max-w-3xl py-6 space-y-8">
             <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold tracking-tight">Create New Ad Campaign</h1>
                 <Button variant="outline" size="sm" asChild>
                     <Link href="/promote">← Back to Promotions</Link>
                 </Button>
            </div>

            <Card>
                 <form onSubmit={handleSubmit}>
                    <CardHeader>
                         <CardTitle>Campaign Details (Step {step}/3)</CardTitle>
                         <CardDescription>Define the basics of your ad campaign.</CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-4">
                         {step === 1 && (
                             <>
                                 <div className="space-y-1">
                                     <Label htmlFor="campaignName">Campaign Name</Label>
                                     <Input id="campaignName" placeholder="e.g., Summer Sale Campaign" value={campaignName} onChange={e => setCampaignName(e.target.value)} required />
                                 </div>
                                 <div className="space-y-1">
                                     <Label htmlFor="objective">Campaign Objective</Label>
                                     <Select value={objective} onValueChange={setObjective} required>
                                         <SelectTrigger><SelectValue placeholder="Select objective..." /></SelectTrigger>
                                         <SelectContent>
                                             <SelectItem value="reach"><Target className="inline h-4 w-4 mr-1"/>Reach (Impressions)</SelectItem>
                                             <SelectItem value="traffic"><Globe className="inline h-4 w-4 mr-1"/>Website Traffic</SelectItem>
                                             <SelectItem value="engagement"><Heart className="inline h-4 w-4 mr-1"/>Post Engagement</SelectItem>
                                             <SelectItem value="conversions"><ShoppingBag className="inline h-4 w-4 mr-1"/>Conversions / Sales</SelectItem>
                                             <SelectItem value="app_installs"><Briefcase className="inline h-4 w-4 mr-1"/>App Installs</SelectItem>
                                         </SelectContent>
                                     </Select>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-1">
                                         <Label htmlFor="startDate">Start Date</Label>
                                         <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required/>
                                     </div>
                                     <div className="space-y-1">
                                         <Label htmlFor="endDate">End Date (Optional)</Label>
                                         <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                                     </div>
                                 </div>
                             </>
                         )}
                         {step === 2 && (
                              <>
                                <div className="space-y-1">
                                     <Label htmlFor="adFormat">Ad Format</Label>
                                     <Select value={adFormat} onValueChange={(v) => setAdFormat(v as AdFormat)} required>
                                         <SelectTrigger><SelectValue placeholder="Select ad format..." /></SelectTrigger>
                                         <SelectContent>
                                             <SelectItem value="image"><ImageIcon className="inline h-4 w-4 mr-1"/>Single Image (Feed/Explore)</SelectItem>
                                             <SelectItem value="video"><VideoIcon className="inline h-4 w-4 mr-1"/>Single Video (Feed/Explore)</SelectItem>
                                             <SelectItem value="carousel"><Layers className="inline h-4 w-4 mr-1"/>Carousel (Feed/Explore)</SelectItem>
                                             <SelectItem value="story_image"><ImageIcon className="inline h-4 w-4 mr-1"/>Story Image Ad</SelectItem>
                                             <SelectItem value="story_video"><VideoIcon className="inline h-4 w-4 mr-1"/>Story Video Ad</SelectItem>
                                             <SelectItem value="reels_video"><VideoIcon className="inline h-4 w-4 mr-1"/>Reels Video Ad</SelectItem>
                                         </SelectContent>
                                     </Select>
                                 </div>
                                  <div className="space-y-1">
                                     <Label htmlFor="mediaUrl">Media URL (or Upload)</Label>
                                     <Input id="mediaUrl" placeholder="https://example.com/ad_image.jpg" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} required />
                                  </div>
                                  <div className="space-y-1">
                                      <Label htmlFor="headline">Headline / Primary Text</Label>
                                      <Textarea id="headline" placeholder="Your main ad message..." value={headline} onChange={e => setHeadline(e.target.value)} required />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-1">
                                         <Label htmlFor="cta">Call to Action</Label>
                                         <Select value={cta} onValueChange={(v) => setCta(v as AdCTA)} required>
                                             <SelectTrigger><SelectValue placeholder="Select CTA..." /></SelectTrigger>
                                             <SelectContent>
                                                <SelectItem value="shop_now">Shop Now</SelectItem>
                                                <SelectItem value="learn_more">Learn More</SelectItem>
                                                <SelectItem value="download">Download</SelectItem>
                                                <SelectItem value="contact_us">Contact Us</SelectItem>
                                                <SelectItem value="watch_more">Watch More</SelectItem>
                                                <SelectItem value="install_now">Install Now</SelectItem>
                                                <SelectItem value="visit_profile">Visit Profile</SelectItem>
                                                <SelectItem value="send_message">Send Message (DM)</SelectItem>
                                             </SelectContent>
                                         </Select>
                                     </div>
                                      <div className="space-y-1">
                                         <Label htmlFor="destinationUrl">Destination URL</Label>
                                         <Input id="destinationUrl" type="url" placeholder="https://yourwebsite.com" value={destinationUrl} onChange={e => setDestinationUrl(e.target.value)} required />
                                      </div>
                                  </div>
                              </>
                         )}
                         {step === 3 && (
                             <>
                                <div className="space-y-2">
                                     <Label>Ad Placements</Label>
                                     <div className="grid grid-cols-2 gap-2">
                                         {(['feed', 'stories', 'reels', 'explore'] as AdPlacement[]).map(p => (
                                             <div key={p} className="flex items-center space-x-2">
                                                 <Checkbox id={`placement-${p}`} checked={placements.includes(p)} onCheckedChange={(checked) => handlePlacementChange(p, checked)}/>
                                                 <Label htmlFor={`placement-${p}`} className="capitalize font-normal">{p}</Label>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                                <div className="space-y-3 pt-2 border-t mt-4">
                                    <Label className="font-semibold text-base">Targeting Options</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="ageRangeMin">Age Range (Min)</Label>
                                            <Input id="ageRangeMin" type="number" placeholder="e.g., 18" value={targeting.ageRange?.[0] || ''} onChange={e => setTargeting(prev => ({...prev, ageRange: [parseInt(e.target.value) || 13, prev.ageRange?.[1] || 65]}))} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="ageRangeMax">Age Range (Max)</Label>
                                            <Input id="ageRangeMax" type="number" placeholder="e.g., 65" value={targeting.ageRange?.[1] || ''} onChange={e => setTargeting(prev => ({...prev, ageRange: [prev.ageRange?.[0] || 18, parseInt(e.target.value) || 100]}))} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Gender</Label>
                                        <div className="flex gap-4">
                                            {(['male', 'female', 'other'] as ('male' | 'female' | 'other')[]).map(gender => (
                                                <div key={gender} className="flex items-center space-x-2">
                                                    <Checkbox id={`gender-${gender}`} checked={targeting.genders?.includes(gender)} onCheckedChange={(checked) => handleGenderChange(gender, checked)}/>
                                                    <Label htmlFor={`gender-${gender}`} className="capitalize font-normal">{gender}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="locations">Locations (Keywords)</Label>
                                        <Input id="locations" placeholder="e.g., Mumbai, India, New York" value={targeting.locations?.join(', ') || ''} onChange={(e) => setTargeting(prev => ({...prev, locations: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}))} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="interests">Interests (Keywords)</Label>
                                        <Input id="interests" placeholder="e.g., technology, fashion, travel" value={targeting.interests?.join(', ') || ''} onChange={(e) => setTargeting(prev => ({...prev, interests: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}))} />
                                    </div>
                                </div>
                             </>
                         )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setStep(s => Math.max(1, s-1))} disabled={step === 1}>Previous</Button>
                        {step < 3 ? (
                             <Button type="button" onClick={() => setStep(s => Math.min(3, s+1))}>Next</Button>
                        ) : (
                             <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                {isLoading ? 'Submitting...' : 'Submit Campaign'}
                             </Button>
                        )}
                    </CardFooter>
                 </form>
            </Card>
        </div>
    );
}
