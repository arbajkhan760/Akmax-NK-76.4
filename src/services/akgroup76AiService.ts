
'use client'; // Service interacts with localStorage, ensure client-side context if called directly from client components

const APP_LAUNCH_DATE_KEY = 'akmax_launch_date_akgroup76_ai'; // More specific key
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000; // Approximate

export interface Akgroup76AiStatus {
  phase: 'Observation Mode' | 'Intelligent Update Mode';
  details: string;
  protectionsActive: boolean;
  protectionFeatures: string[];
}

const protectionFeatureDescriptions = [
    "Strict firewall logic to prevent malicious code, spyware, or viruses.",
    "Detection and blocking of fake follower/engagement tools and APIs.",
    "Monitoring and prevention of ad system abuse (fake traffic, UTR fraud).",
    "Auto-sanitization engine for continuous scanning and cleaning of vulnerabilities.",
    "Behavioral anti-spam system to detect and block harmful user actions or automated tools."
];

// Simulate getting the app's "launch date" (first time this runs client-side)
const getAppLaunchDate = (): Date => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const storedDate = localStorage.getItem(APP_LAUNCH_DATE_KEY);
    if (storedDate) {
      const date = new Date(storedDate);
      if (!isNaN(date.getTime())) { // Check if the stored date is valid
        return date;
      }
    }
    // If no valid stored date, set a new one (simulating first launch)
    // For consistent demo, let's set it to a fixed date in the past to show "Intelligent Update Mode"
    // Example: 7 months ago to be in update mode
    const launchDate = new Date();
    launchDate.setMonth(launchDate.getMonth() - 7); 
    localStorage.setItem(APP_LAUNCH_DATE_KEY, launchDate.toISOString());
    return launchDate;
  }
  // Fallback for server-side or non-browser environments (less accurate for demo)
  // Ensure this date makes sense for the demo logic (e.g., puts it into update mode if desired)
  const fallbackLaunchDate = new Date();
  fallbackLaunchDate.setMonth(fallbackLaunchDate.getMonth() - 7);
  return fallbackLaunchDate; 
};


export const initializeAkgroup76AI = (): void => {
  // This function ensures the launch date is set if it's the first time client-side.
  // It can be called from a client component early in the app lifecycle.
  if (typeof window !== 'undefined') {
    getAppLaunchDate(); // Initialize/retrieve launch date
    console.log("AKGROUP76 AI Initialized on client. Current Status:", getAkgroup76AiStatus());
  }
};

export const getAkgroup76AiStatus = (): Akgroup76AiStatus => {
  const launchDate = getAppLaunchDate();
  const now = new Date();
  const timeSinceLaunch = now.getTime() - launchDate.getTime();
  
  // Calculate months more accurately
  let monthsSinceLaunch = (now.getFullYear() - launchDate.getFullYear()) * 12;
  monthsSinceLaunch -= launchDate.getMonth();
  monthsSinceLaunch += now.getMonth();
  if (now.getDate() < launchDate.getDate()) {
    monthsSinceLaunch--;
  }
  monthsSinceLaunch = Math.max(0, monthsSinceLaunch); // Ensure non-negative

  if (timeSinceLaunch < SIX_MONTHS_MS) {
    const totalDaysInObservation = Math.floor(SIX_MONTHS_MS / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.floor(timeSinceLaunch / (1000 * 60 * 60 * 24));
    const progressPercent = Math.min(100, Math.floor((daysElapsed / totalDaysInObservation) * 100));

    return {
      phase: 'Observation Mode',
      details: `Gathering data and learning user patterns. Progress: ${progressPercent}%. Automatic intelligent updates will begin after 6 months.`,
      protectionsActive: true,
      protectionFeatures: protectionFeatureDescriptions,
    };
  } else {
    const monthsIntoUpdateMode = monthsSinceLaunch - 6;
    return {
      phase: 'Intelligent Update Mode',
      details: `Actively enhancing AKmax. ${monthsIntoUpdateMode <= 0 ? 'Just started delivering' : `Delivering`} automatic monthly updates for ${monthsIntoUpdateMode > 0 ? monthsIntoUpdateMode : '<1'} month(s).`,
      protectionsActive: true,
      protectionFeatures: protectionFeatureDescriptions,
    };
  }
};

/**
 * Simulates the AI performing its protection duties.
 * This is conceptual and would be part of backend/infrastructure.
 */
export const akgroup76AiProtect = (actionType: string, data?: any): { safe: boolean; message?: string; details?: string } => {
    console.log(`AKGROUP76 AI: Evaluating [${actionType}] for protection.`, data ? `Data snippet: ${JSON.stringify(data).substring(0,100)}...` : '');
    
    // Example: Simulate blocking a suspicious file upload
    if (actionType === 'file_upload') {
        const fileName = data?.fileName?.toLowerCase();
        if (fileName && (fileName.endsWith('.exe') || fileName.endsWith('.scr') || fileName.includes('malware'))) {
            return { safe: false, message: 'Malicious file upload blocked.', details: 'AKGROUP76 AI detected a potentially harmful file type or name.' };
        }
    }

    // Example: Simulate detecting fake engagement attempt
    if (actionType === 'user_interaction' && data?.type === 'bulk_follow') {
        return { safe: false, message: 'Suspicious bulk follow activity detected and flagged.', details: 'AKGROUP76 AI identified patterns indicative of fake engagement tactics.' };
    }
    
    // Example: Ad system abuse check for UTR
    if (actionType === 'utr_verification' && data?.utr && data.utr.toLowerCase().includes('fraud')) {
        return { safe: false, message: 'Potentially fraudulent UTR detected.', details: 'AKGROUP76 AI flagged the UTR for review due to suspicious patterns.' };
    }

    // Default: Action is considered safe by the AI
    return { safe: true, message: 'AKGROUP76 AI: Action monitored and deemed safe.' };
};
