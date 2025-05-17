
# Google AdMob Integration Guide for AKmax Mobile App

This document outlines the steps to integrate Google AdMob into a mobile application for AKmax, for example, if you were building it with React Native. AdMob, as described with native App IDs and Ad Unit IDs, is intended for native mobile applications.

## 1. Prerequisites

*   A Google AdMob account.
*   Your mobile application project (e.g., React Native, Flutter, native Android/iOS).
*   Your App IDs and Ad Unit IDs. **It is CRITICAL to use Test Ad Units during development and your real Ad Unit IDs only in production.**

    **App IDs (Real - Use only in Production):**
    *   Android App ID: `ca-app-pub-3177096602952445~9832902188`
    *   iOS App ID: `ca-app-pub-3177096602952445~5453531839`

    **Ad Unit IDs (Real - Use only in Production):**
    *   **Banner Ads (Header):**
        *   Android: `ca-app-pub-3177096602952445/1840771641`
        *   iOS: `ca-app-pub-3177096602952445/8562926811`
    *   **Interstitial Ads (Stories):**
        *   Android: `ca-app-pub-3177096602952445/3700648224`
        *   iOS: `ca-app-pub-3177096602952445/3422280774`
    *   **Interstitial Ads (Articles):**
        *   Android: `ca-app-pub-3177096602952445/8191391729`
        *   iOS: `ca-app-pub-3177096602952445/6467230600`
    *   **Rewarded Ads (Reels):**
        *   Android: `ca-app-pub-3177096602952445/8738170722`
        *   iOS: `ca-app-pub-3177096602952445/3950020117`
    *   **Native Ads (Store):**
        *   Android: `ca-app-pub-3177096602952445/5118505829`
        *   iOS: `ca-app-pub-3177096602952445/4224226558`
    *   **Note:** The Ad Unit IDs `ca-app-pub-3177096602952445/8191391729` (Android) and `ca-app-pub-3177096602952445/6467230600` (iOS) were previously referred to as "Rewarded Interstitial (Articles)". The latest request specifies "Interstitial (Article)". This guide will treat them as standard Interstitial ads.

## 2. Integration Example (React Native)

This example uses the `react-native-google-mobile-ads` library.

### 2.1. Installation

```bash
npm install react-native-google-mobile-ads
# or
yarn add react-native-google-mobile-ads
```
After installation, run `cd ios && pod install && cd ..` for iOS.

### 2.2. Configuration

**Android:**
Add your AdMob App ID to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <application>
        <!-- Your other tags -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3177096602952445~9832902188"/> <!-- REAL Android App ID -->
    </application>
</manifest>
```

**iOS:**
Add your AdMob App ID to `ios/YourProjectName/Info.plist`:

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-3177096602952445~5453531839</string> <!-- REAL iOS App ID -->
```
For iOS 14 and later, you also need to add `SKAdNetworkItems`. Refer to the AdMob documentation for the latest list.
```xml
<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string> <!-- Example, Google's identifier -->
  </dict>
  <!-- Add other network identifiers as provided by Google -->
</array>
```
Also, update your `Podfile` (`ios/Podfile`) if not already done to set the platform version, e.g., `platform :ios, '12.0'`, and run `pod install`.

### 2.3. Initializing the SDK

Initialize the SDK when your app starts, typically in your main `App.js` or `index.js` file.

```javascript
// App.js or index.js
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

mobileAds()
  .setRequestConfiguration({
    // Update all future requests suitable for parental guidance.
    maxAdContentRating: MaxAdContentRating.PG,
    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment: false, // Set to true if your app is primarily child-directed
    // Indicates that you want the ad request to be handled in a manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: false, // Set to true if you targeting users under the age of consent
  })
  .then(() => {
    // Request config successfully set!
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('AdMob SDK Initialized:', adapterStatuses);
      });
  });
```

### 2.4. Platform-Specific Ad Unit IDs

Create a utility file to manage ad unit IDs. **Use `TestIds` during development.**

```javascript
// adsConfig.js
import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

const REAL_AD_UNITS = {
  banner: Platform.select({
    ios: 'ca-app-pub-3177096602952445/8562926811',
    android: 'ca-app-pub-3177096602952445/1840771641',
  }),
  interstitialStories: Platform.select({
    ios: 'ca-app-pub-3177096602952445/3422280774',
    android: 'ca-app-pub-3177096602952445/3700648224',
  }),
  interstitialArticles: Platform.select({ // Renamed from rewardedInterstitial
    ios: 'ca-app-pub-3177096602952445/6467230600',
    android: 'ca-app-pub-3177096602952445/8191391729',
  }),
  rewardedReels: Platform.select({ // Renamed from rewarded
    ios: 'ca-app-pub-3177096602952445/3950020117',
    android: 'ca-app-pub-3177096602952445/8738170722',
  }),
  nativeStore: Platform.select({ // Renamed from native
    ios: 'ca-app-pub-3177096602952445/4224226558',
    android: 'ca-app-pub-3177096602952445/5118505829',
  }),
};

// Use __DEV__ global variable (available in React Native) to switch between test and real IDs.
export const AD_UNITS = {
  banner: __DEV__ ? TestIds.BANNER : REAL_AD_UNITS.banner,
  interstitialStories: __DEV__ ? TestIds.INTERSTITIAL : REAL_AD_UNITS.interstitialStories,
  interstitialArticles: __DEV__ ? TestIds.INTERSTITIAL : REAL_AD_UNITS.interstitialArticles,
  rewardedReels: __DEV__ ? TestIds.REWARDED : REAL_AD_UNITS.rewardedReels,
  nativeStore: __DEV__ ? TestIds.NATIVE : REAL_AD_UNITS.nativeStore,
  // Note: react-native-google-mobile-ads uses TestIds.REWARDED_INTERSTITIAL for Rewarded Interstitial ads.
  // If the "InterstitialArticles" units are truly for standard interstitials, TestIds.INTERSTITIAL is correct.
  // If they are for Rewarded Interstitials, use TestIds.REWARDED_INTERSTITIAL for development.
};
```

### 2.5. Displaying Ads

#### Banner Ad (e.g., in Header)

```javascript
import React from 'react';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNITS } from './adsConfig'; // Your ad config file

function AppHeaderWithBanner() {
  return (
    <>
      {/* Your App Header Content */}
      <BannerAd
        unitId={AD_UNITS.banner} // Automatically uses test ID in DEV, real ID in PROD
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Example option for GDPR compliance
        }}
        onAdLoaded={() => console.log('Banner Ad loaded')}
        onAdFailedToLoad={(error) => console.error('Banner Ad failed to load', error)}
        onAdOpened={() => console.log('Banner Ad opened')}
        onAdClosed={() => console.log('Banner Ad closed')}
        // onAdImpression is available if needed
      />
    </>
  );
}
export default AppHeaderWithBanner;
```

#### Interstitial Ad (e.g., between Stories or Articles)

```javascript
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AD_UNITS } from './adsConfig'; // Your ad config file

// For Stories
const interstitialStoriesAd = InterstitialAd.createForAdRequest(AD_UNITS.interstitialStories, {
  requestNonPersonalizedAdsOnly: true,
});

// For Articles
const interstitialArticlesAd = InterstitialAd.createForAdRequest(AD_UNITS.interstitialArticles, {
  requestNonPersonalizedAdsOnly: true,
});

// Function to show interstitial for Stories
export function showStoriesInterstitialAd() {
  if (interstitialStoriesAd.loaded) {
    interstitialStoriesAd.show();
  } else {
    // Ad not loaded, try to load it. You might want to preload ads.
    console.log('Stories Interstitial not loaded yet, loading...');
    interstitialStoriesAd.load();
  }
}

// Function to show interstitial for Articles
export function showArticlesInterstitialAd() {
  if (interstitialArticlesAd.loaded) {
    interstitialArticlesAd.show();
  } else {
    console.log('Articles Interstitial not loaded yet, loading...');
    interstitialArticlesAd.load();
  }
}

// It's good practice to load ads in advance, e.g., in a useEffect hook or when a screen loads.
// And subscribe to events.
// Example for Stories interstitial:
// useEffect(() => {
//   const unsubscribeLoaded = interstitialStoriesAd.addAdEventListener(AdEventType.LOADED, () => {
//     console.log('Stories Interstitial loaded');
//   });
//   const unsubscribeError = interstitialStoriesAd.addAdEventListener(AdEventType.ERROR, (error) => {
//     console.error('Stories Interstitial failed to load', error);
//   });
//   const unsubscribeClosed = interstitialStoriesAd.addAdEventListener(AdEventType.CLOSED, () => {
//     console.log('Stories Interstitial ad closed');
//     interstitialStoriesAd.load(); // Preload the next one
//   });
//   // Start loading the ad
//   interstitialStoriesAd.load();
//   // Unsubscribe from events on unmount
//   return () => {
//     unsubscribeLoaded();
//     unsubscribeError();
//     unsubscribeClosed();
//   };
// }, []);
// Repeat similar loading logic for interstitialArticlesAd
```

#### Rewarded Ad (e.g., after watching Reels)

```javascript
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { AD_UNITS } from './adsConfig';

const rewardedReelsAd = RewardedAd.createForAdRequest(AD_UNITS.rewardedReels, {
  requestNonPersonalizedAdsOnly: true,
});

export function showRewardedReelsAd(onRewardEarned) {
  if (rewardedReelsAd.loaded) {
    rewardedReelsAd.show();
  } else {
    console.log('Rewarded Reels ad not loaded yet, loading...');
    rewardedReelsAd.load();
  }
}

// Example for Rewarded Reels ad events:
// useEffect(() => {
//   const unsubscribeLoaded = rewardedReelsAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
//     console.log('Rewarded Reels ad loaded.');
//   });
//   const unsubscribeEarnedReward = rewardedReelsAd.addAdEventListener(
//     RewardedAdEventType.EARNED_REWARD,
//     reward => {
//       console.log('User earned reward of ', reward);
//       // onRewardEarned(reward); // Call your reward function
//     },
//   );
//    const unsubscribeError = rewardedReelsAd.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
//     console.error('Rewarded Reels Ad failed to load', error);
//   });
//   const unsubscribeClosed = rewardedReelsAd.addAdEventListener(RewardedAdEventType.CLOSED, () => {
//     console.log('Rewarded Reels ad closed');
//     rewardedReelsAd.load(); // Preload the next one
//   });
//   // Start loading the ad
//   rewardedReelsAd.load();
//   // Unsubscribe from events on unmount
//   return () => {
//     unsubscribeLoaded();
//     unsubscribeEarnedReward();
//     unsubscribeError();
//     unsubscribeClosed();
//   };
// }, []);
```

#### Native Ad (e.g., in Store feed)

Native ads require custom UI rendering. Refer to the `react-native-google-mobile-ads` documentation for detailed implementation of a `NativeAdView`. It typically involves creating a custom component to display ad assets (headline, image, CTA, etc.) fetched from the SDK. The `AD_UNITS.nativeStore` would be used as the `adUnitID`.

### 2.6. User Messaging Platform (UMP) SDK for Consent

For GDPR compliance, you **must** integrate the UMP SDK to manage user consent.

**Installation (if not already part of `react-native-google-mobile-ads` core, check their docs):**
Generally, UMP functionalities are accessed via the `react-native-google-mobile-ads` library itself.

**Implementation:**

```javascript
// Somewhere early in your app, e.g., App.js
import mobileAds, { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';

async function requestConsentInfoUpdate() {
  try {
    await AdsConsent.requestInfoUpdate();
    const consentInfo = await AdsConsent.getConsentInfo();
    console.log('Consent Info:', consentInfo);

    if (consentInfo.isConsentFormAvailable && consentInfo.status === AdsConsentStatus.REQUIRED) {
      const { status } = await AdsConsent.showForm();
      console.log('Consent Form Status:', status);
      // After form is shown, status will be OBTAINED, NOT_REQUIRED, or UNKNOWN
      // You can then initialize MobileAds or load ads.
    } else if (consentInfo.status === AdsConsentStatus.NOT_REQUIRED || consentInfo.status === AdsConsentStatus.OBTAINED) {
      // Consent already obtained or not required, initialize ads.
      initializeMobileAdsSDK();
    }
  } catch (error) {
    console.error('Consent Error:', error);
    // Handle error, maybe initialize ads with non-personalized settings as fallback
    initializeMobileAdsSDK(true); // Example: true for non-personalized
  }
}

function initializeMobileAdsSDK(requestNonPersonalizedAdsOnly = false) {
  mobileAds()
    .setRequestConfiguration({
      // ... your existing request config ...
      // This might be automatically handled by UMP, but set as fallback
      requestNonPersonalizedAdsOnly: requestNonPersonalizedAdsOnly,
    })
    .then(() => {
      mobileAds()
        .initialize()
        .then(adapterStatuses => {
          console.log('AdMob SDK Initialized (after consent check):', adapterStatuses);
          // Now it's safe to load ads
        });
    });
}

// Call this when your app starts
requestConsentInfoUpdate();
```

*   **Important:** Call `requestConsentInfoUpdate` *before* initializing the Mobile Ads SDK and loading ads.
*   Configure your UMP settings in the AdMob console (Privacy & messaging tab).
*   Refer to the official `react-native-google-mobile-ads` documentation for the most up-to-date UMP implementation details.

## 3. Firebase Integration for Tracking and Control

*   **Google Analytics for Firebase:**
    *   Automatically tracks ad impressions and clicks if the Google Mobile Ads SDK is linked with Firebase.
    *   **Ensure Firebase SDK is set up in your React Native project (`@react-native-firebase/app`, `@react-native-firebase/analytics`).**
    *   Log custom events for ad interactions (e.g., `ad_reward_earned`, `ad_cta_clicked`) for deeper insights using Firebase Analytics.
    *   Analyze ad performance data in the Firebase console (Analytics -> Events, or link to BigQuery). Ad revenue data from AdMob will also appear in Firebase if linked.

*   **Firebase Remote Config:**
    *   Control ad placements, frequency, and even enable/disable certain ad units remotely without an app update.
    *   Example: Store `adUnitIds`, `adFrequencyPerSession`, `showAdsInRegionX` parameters in Remote Config. Fetch these values at app start and use them to configure your ad logic.

*   **Firebase Cloud Functions (Optional Advanced Control):**
    *   **Ad Event Logging & Analytics:** Create HTTP callable Cloud Functions that your app calls to log detailed ad events (impressions, clicks, view duration, reward earned) to Firestore or directly to Google Analytics/BigQuery for custom analysis beyond the default AdMob-Firebase linking.
    *   **Server-Side Reward Verification (for Rewarded Ads):** For enhanced security, you can use server-to-server (SS2S) callbacks from AdMob to a Cloud Function to verify that a user legitimately earned a reward before granting it in your app. This is more complex to set up.
    *   **Dynamic Ad Control via Firestore:** Use Firestore to store rules for ad display (e.g., `ad_rules/{placementId}` with fields like `ad_enabled`, `target_user_segment`). Your app can listen to these Firestore documents in real-time or fetch them periodically. Cloud Functions can update these rules based on admin actions or other triggers.

## 4. Best Practices for Firebase-Compatible AdMob Integration

*   **Initialize Early & Correctly:** Initialize the UMP SDK first, then the AdMob SDK as early as possible.
*   **Load Ads in Advance:** Pre-load interstitial, rewarded, and native ads before they are needed.
*   **Handle Load Errors:** Always implement `onAdFailedToLoad` listeners and provide a fallback experience.
*   **User Experience:**
    *   Do not overload users with ads. Follow AdMob's placement guidelines.
    *   Ensure CTAs are clear and ads are distinguishable from app content.
*   **Policy Compliance & Revenue Safety:**
    *   Strictly adhere to all Google AdMob policies.
    *   **Invalid Clicks & Impressions:** Do not encourage accidental clicks. Avoid placing ads too close to interactive elements. Never click your own live ads.
    *   **Content Policies:** Ensure your app content complies with AdMob's content restrictions. Firebase can help manage user-generated content.
    *   **Child-Directed Apps (COPPA):** Configure AdMob requests appropriately if your app is child-directed (see `tagForChildDirectedTreatment` in SDK initialization).
    *   **Transparent Data Usage & Consent (GDPR/CCPA):** Use the UMP SDK. Clearly inform users about data collection in your privacy policy.
*   **Testing:** **Crucially, use Test Ad Units provided by `react-native-google-mobile-ads` (e.g., `TestIds.BANNER`) during all stages of development and testing.** Only switch to your real Ad Unit IDs for production builds submitted to the app stores. Using real ads during development can lead to account suspension.
*   **Monitor Performance:** Regularly use Firebase Analytics and AdMob reporting to monitor ad performance, identify issues, and optimize your ad strategy. Linking AdMob to Firebase is key for this.

## 5. Generating AAB for Play Store / IPA for App Store

Once your mobile application is complete and AdMob is integrated:

*   **React Native (Android):** Navigate to the `android` directory and run `./gradlew bundleRelease`.
*   **React Native (iOS):** Use Xcode to archive and build your app for App Store submission.

Ensure your builds are signed with your release keys/certificates. The Firebase configurations (`google-services.json` for Android, `GoogleService-Info.plist` for iOS) must be correctly placed in your native project folders.

This guide provides a starting point. Refer to the official documentation for `react-native-google-mobile-ads`, Google AdMob, and Firebase for more detailed instructions and advanced configurations for your mobile apps.
```