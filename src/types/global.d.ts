
import type { RecaptchaVerifier } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    recaptchaVerifierOtpLogin?: RecaptchaVerifier; // Separate instance for login if needed
    grecaptcha?: {
        reset: (widgetId?: number) => void;
        // Add other grecaptcha methods if used directly
    };
  }
}

// This export is needed to make the file a module
export {};
