
'use client';

import { useEffect } from 'react';
import { initializeAkgroup76AI as initAiService } from '@/services/akgroup76AiService';

export default function Akgroup76AiInitializer() {
  useEffect(() => {
    // This ensures initializeAkgroup76AI (and thus localStorage access)
    // only runs on the client side after hydration.
    initAiService();
  }, []);

  return null; // This component does not render anything to the DOM
}
