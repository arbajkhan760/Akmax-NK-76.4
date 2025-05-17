
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// --- START URGENT: Firebase Configuration Instructions ---
//
// THIS IS THE MOST LIKELY CAUSE OF YOUR "auth/api-key-not-valid" ERROR.
//
// You MUST replace the placeholder values below with your ACTUAL Firebase project's
// configuration by creating or updating a .env.local file in your project's root.
//
// 1. Create `.env.local` File:
//    If it doesn't exist, create a file named `.env.local` in the ROOT of your project.
//
// 2. Get Your Firebase Config:
//    - Go to your Firebase project console: https://console.firebase.google.com/
//    - Select your project.
//    - Click the gear icon (Project settings) in the sidebar.
//    - In the "General" tab, under "Your apps", find your web app (or add one).
//    - Copy the Firebase SDK configuration object (it looks like `const firebaseConfig = { apiKey: "...", ... };`).
//
// 3. Add Config to `.env.local`:
//    Paste your credentials into `.env.local`, prefixing EACH variable with `NEXT_PUBLIC_`:
//
//    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_ACTUAL_API_KEY_FROM_FIREBASE
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_ACTUAL_AUTH_DOMAIN_FROM_FIREBASE
//    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_ACTUAL_PROJECT_ID_FROM_FIREBASE
//    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_ACTUAL_STORAGE_BUCKET_FROM_FIREBASE
//    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_ACTUAL_MESSAGING_SENDER_ID_FROM_FIREBASE
//    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_ACTUAL_APP_ID_FROM_FIREBASE
//
// 4. IMPORTANT: Restart Your Development Server:
//    Stop your `npm run dev` or `yarn dev` process and restart it.
//    Next.js only reads .env.local files at build/startup time.
//
// --- END URGENT ---

const PLACEHOLDER_API_KEY = "INVALID_API_KEY_REPLACE_ME_NOW_IN_ENV_LOCAL";
const PLACEHOLDER_PROJECT_ID = "YOUR_PROJECT_ID_REPLACE_ME_NOW_IN_ENV_LOCAL";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || PLACEHOLDER_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${PLACEHOLDER_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || PLACEHOLDER_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${PLACEHOLDER_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
  // Critical check for placeholder values
  if (firebaseConfig.apiKey === PLACEHOLDER_API_KEY || firebaseConfig.projectId === PLACEHOLDER_PROJECT_ID) {
    console.error(
      "CRITICAL Firebase Configuration Error:\n" +
      "ACTION REQUIRED: Your Firebase configuration is missing or incorrect.\n" +
      "The application WILL NOT connect to Firebase, leading to authentication and API errors.\n\n" +
      "Follow these steps to fix this:\n" +
      "1. Locate or create the `.env.local` file in the root directory of your project.\n" +
      "2. Open your Firebase project console (https://console.firebase.google.com/).\n" +
      "3. Navigate to Project Settings -> General tab -> Your apps section.\n" +
      "4. Copy your Firebase web app's configuration values.\n" +
      "5. Add these values to your `.env.local` file, ensuring each variable starts with `NEXT_PUBLIC_`:\n" +
      "   Example:\n" +
      "   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_ACTUAL_API_KEY\n" +
      "   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_ACTUAL_AUTH_DOMAIN\n" +
      "   NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_ACTUAL_PROJECT_ID\n" +
      "   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_ACTUAL_STORAGE_BUCKET\n" +
      "   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_ACTUAL_MESSAGING_SENDER_ID\n" +
      "   NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_ACTUAL_APP_ID\n" +
      "6. IMPORTANT: Restart your Next.js development server after saving changes to `.env.local`.\n\n" +
      "The current configuration in `src/lib/firebase.ts` is using placeholder values because the environment variables are not set.\n" +
      "Using API Key: " + firebaseConfig.apiKey + "\n" +
      "Using Project ID: " + firebaseConfig.projectId
    );
    // Assign dummy objects to prevent further SDK errors if config is missing.
    // Features requiring Firebase will not work.
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
  } else {
    // Attempt to initialize Firebase only if actual keys seem present.
    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
        console.log("Firebase app initialized successfully with Project ID:", app.options.projectId);
      } catch (e: any) {
        console.error(
            "Firebase initialization failed with provided credentials:", e.message, "\n" +
            "Double-check your .env.local values and Firebase project settings (API key restrictions, enabled services).\n" +
            "Current Config Used:", JSON.stringify(firebaseConfig, null, 2)
        );
        app = {} as FirebaseApp; // Assign dummy object on failure
      }
    } else {
      app = getApp();
      console.log("Using existing Firebase app instance with Project ID:", app.options.projectId);
    }

    // Get Auth and Firestore instances only if app was successfully initialized.
    if (app && app.name) { // A successfully initialized app will have a name (e.g., '[DEFAULT]')
      try {
        auth = getAuth(app);
        db = getFirestore(app);
      } catch (e: any) {
        console.error("Error getting Auth/Firestore instances:", e.message);
        // Assign dummy objects if getting instances fails, even if app object exists.
        auth = {} as Auth;
        db = {} as Firestore;
      }
    } else {
      // Fallback if app didn't initialize correctly (e.g., due to error caught above)
      console.warn("Firebase app object is not valid. Auth and Firestore will not be available.");
      auth = {} as Auth;
      db = {} as Firestore;
    }
  }
} else {
  // Server-side or non-browser environment, assign dummy objects.
  // Firebase client SDKs are generally not used directly on the server in Next.js App Router.
  // For server-side Firebase Admin SDK, a different setup is used.
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
}

export { app, auth, db };
