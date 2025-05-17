
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, ExternalLink } from 'lucide-react'; // Added ExternalLink

interface AdCtaButtonProps {
  ctaText: string;
  ctaLink: string;
  onClick?: (link: string) => void; // Optional click handler
  className?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: 'arrow' | 'external' | 'none'; // Control which icon to show
}

const AdCtaButton: FC<AdCtaButtonProps> = ({
  ctaText,
  ctaLink,
  onClick,
  className,
  variant = "default",
  size = "default",
  icon = 'arrow', // Default to arrow icon
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicks bubbling up (e.g., pausing story viewer)
    if (onClick) {
      onClick(ctaLink);
    } else {
      // Default behavior: open link in new tab
      window.open(ctaLink, '_blank', 'noopener,noreferrer');
    }
    console.log(`CTA Clicked: ${ctaText} -> ${ctaLink}`);
    // TODO: Add analytics tracking for CTA click
  };

  const IconComponent = icon === 'arrow' ? ArrowRight : icon === 'external' ? ExternalLink : null;

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("flex items-center justify-center gap-2", className)} // Ensure icon spacing
      onClick={handleClick}
    >
      <span>{ctaText}</span>
      {IconComponent && <IconComponent className="h-4 w-4" />}
    </Button>
  );
};

export default AdCtaButton;
