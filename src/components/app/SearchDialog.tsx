
"use client";

import type { Dispatch, FC, SetStateAction } from 'react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Hash, Users, MapPin, TrendingUp, Clock, Store as StoreIcon } from 'lucide-react'; // Renamed Store to StoreIcon
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';

interface SearchDialogProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

// Expanded list of popular tags/categories
const popularTags = [
  "travel", "foodie", "fashion", "fitness", "photography", "art", "music",
  "technology", "gaming", "diy", "nature", "memes", "books", "movies",
  "sports", "health", "beauty", "finance", "education", "business",
  "pets", "cars", "science", "history", "comedy", "dance", "news", "travelphotography",
  "foodphotography", "style", "ootd", "workout", "motivation", "inspiration",
  "quotes", "love", "instagood", "photooftheday", "beautiful", "happy",
  "cute", "tbt", "like4like", "followme", "picoftheday", "follow", "me",
  "selfie", "summer", "friends", "instadaily", "girl", "fun", "smile", "tagsforlikes",
  "repost", "art", "artist", "drawing", "artwork", "creative", "instaart",
  "artoftheday", "gallery", "abstractart", "digitalart", "illustrator",
  "painting", "sketch", "design", "graphicdesign", "logo", "webdesign",
  "uidesign", "uxdesign", "typography", "branding", "minimalism", "architecture",
  "interiordesign", "homedecor", "cityscape", "streetphotography",
  "landscape", "naturelovers", "sunset", "sunrise", "adventure", "explore",
  "wanderlust", "vacation", "holiday", "travelgram", "instatravel",
  "foodporn", "foodgasm", "healthyfood", "vegan", "vegetarian", "recipe",
  "cooking", "baking", "dessert", "coffee", "tea", "wine", "cocktails",
  "fitnessmotivation", "gym", "yoga", "running", "cycling", "hiking", "swimming",
  "football", "basketball", "cricket", "tennis", "musiclover", "concert",
  "festival", "dj", "livemusic", "newmusic", "nowplaying", "musician",
  "singer", "songwriter", "guitar", "piano", "drums", "edm", "hiphop", "rock", "pop",
  "classicalmusic", "jazz", "blues", "countrymusic", "movies", "cinema",
  "film", "tvshow", "netflix", "actor", "actress", "director", "hollywood",
  "bollywood", "anime", "manga", "comics", "books", "reading", "bookstagram",
  "author", "writer", "poetry", "quotes", "literature", "storytelling",
  "gaming", "gamer", "videogames", "pcgaming", "consolegaming", "esports",
  "twitch", "youtube", "streaming", "tech", "gadgets", "innovation", "ai",
  "programming", "coding", "developer", "software", "hardware", "apple",
  "android", "windows", "linux", "opensource", "startup", "entrepreneur",
  "marketing", "socialmedia", "digitalmarketing", "seo", "contentmarketing",
  "influencer", "vlogger", "blogger", "podcast", "news", "politics", "worldnews",
  "currentaffairs", "journalism", "science", "space", "astronomy", "physics",
  "chemistry", "biology", "mathematics", "history", "archaeology", "culture",
  "heritage", "philosophy", "psychology", "sociology", "spirituality",
  "meditation", "mindfulness", "religion", "spiritanimal", "astrology",
  "tarot", "crystals", "healing", "wellness", "selfcare", "mentalhealth",
  "motivation", "inspiration", "lifehacks", "productivity", "diy", "crafts",
  "handmade", "homemade", "woodworking", "knitting", "crochet", "sewing",
  "gardening", "plants", "flowers", "pets", "dogs", "cats", "animals",
  "wildlife", "conservation", "environment", "sustainability", "gogreen",
  "climatechange", "cars", "motorcycle", "luxurycars", "supercars", "classiccars",
  "aviation", "travelblogger", "foodblogger", "fashionblogger", "beautyblogger",
  "lifestyleblogger", "parenting", "family", "kids", "baby", "love", "relationships",
  "wedding", "marriage", "friendship", "lgbtq", "pride", "equality",
  "humanrights", "feminism", "activism", "socialjustice", "charity",
  "volunteer", "nonprofit", "education", "learning", "students", "teachers",
  "university", "college", "school", "languagelearning", "finance", "investing",
  "cryptocurrency", "bitcoin", "stocks", "realestate", "businessowner",
  "smallbusiness", "supportsmallbusiness", "localbusiness", "shoplocal",
  "handmadebusiness", "etsy", "ecommerce", "onlineshopping", "deals",
  "discounts", "sales", "giveaway", "contest", "challenge", "funny",
  "humor", "comedyvideos", "standupcomedy", "jokes", "memesdaily",
  "viral", "trending", "explorepage", "foryoupage", "fyp", "tiktok",
  "instagramreels", "shorts", "youtubechannel", "youtuber", "subscribe",
  "likeforlikes", "followforfollowback", "comment4comment", "shareforshare"
];

const trendingSearches = [
  "summer vacation ideas", "new tech gadgets 2024", "easy dinner recipes",
  "popular movie releases", "local events this weekend", "AI tools for productivity",
  "latest fashion trends", "home workout routines", "financial planning tips", "sustainable living"
];

const SearchDialog: FC<SearchDialogProps> = ({ isOpen, onOpenChange }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const storedSearches = localStorage.getItem('akmaxRecentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  const handleSearch = (e?: React.FormEvent<HTMLFormElement>, term?: string) => {
    if (e) e.preventDefault();
    const currentSearchTerm = term || searchTerm;
    if (currentSearchTerm.trim() === '') return;

    // Add to recent searches
    const updatedSearches = [currentSearchTerm, ...recentSearches.filter(s => s.toLowerCase() !== currentSearchTerm.toLowerCase())].slice(0, 5); // Keep last 5, case-insensitive check
    setRecentSearches(updatedSearches);
    localStorage.setItem('akmaxRecentSearches', JSON.stringify(updatedSearches));

    router.push(`/search?q=${encodeURIComponent(currentSearchTerm)}`);
    onOpenChange(false); // Close dialog on search
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('akmaxRecentSearches');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] p-0 max-h-[80vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg font-semibold">Search AKmax</DialogTitle>
          <DialogDescription>Find people, posts, tags, and more.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSearch} className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for users, tags, products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
              autoFocus
            />
          </div>
        </form>

        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-6">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center"><Clock className="h-4 w-4 mr-2" /> Recent Searches</h3>
                  <button onClick={clearRecentSearches} className="text-xs text-primary hover:underline">Clear all</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Badge
                      key={`${search}-${index}`} // Use index to ensure unique key
                      variant="secondary"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => {
                        setSearchTerm(search);
                        handleSearch(undefined, search); // Trigger search with this term
                      }}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center"><TrendingUp className="h-4 w-4 mr-2" /> Trending Now</h3>
              <div className="space-y-1">
                {trendingSearches.map((trend) => (
                  <Link
                    href={`/search?q=${encodeURIComponent(trend)}`}
                    key={trend}
                    className="block text-sm p-2 hover:bg-accent rounded-md"
                    onClick={() => onOpenChange(false)}
                  >
                    {trend}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center"><Hash className="h-4 w-4 mr-2" /> Popular Tags</h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto"> {/* Limit height and allow scroll for tags */}
                {popularTags.map((tag, index) => (
                  <Link href={`/tags/${encodeURIComponent(tag)}`} key={`${tag}-${index}`} onClick={() => onOpenChange(false)}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Browse Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                    <Link href="/search?type=people" onClick={() => onOpenChange(false)} className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm">
                        <Users className="h-4 w-4 text-primary" /> People
                    </Link>
                     <Link href="/search?type=tags" onClick={() => onOpenChange(false)} className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm">
                        <Hash className="h-4 w-4 text-primary" /> Tags
                    </Link>
                    <Link href="/search?type=places" onClick={() => onOpenChange(false)} className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm">
                        <MapPin className="h-4 w-4 text-primary" /> Places
                    </Link>
                     <Link href="/store" onClick={() => onOpenChange(false)} className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-sm">
                        <StoreIcon className="h-4 w-4 text-primary" /> Products in Store
                    </Link>
                </div>
            </div>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;

