
import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface SponsoredLabelProps {
  className?: string;
}

const SponsoredLabel: FC<SponsoredLabelProps> = ({ className }) => {
  return (
    <span className={cn('text-xs text-muted-foreground opacity-80 font-medium', className)}>
      Sponsored
    </span>
  );
};

export default SponsoredLabel;
