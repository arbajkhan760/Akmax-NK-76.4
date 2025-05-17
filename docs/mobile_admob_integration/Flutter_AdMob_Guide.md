
# Google AdMob Integration Guide for AKmax (Flutter)

This document provides a conceptual outline for integrating Google AdMob into a Flutter application for AKmax.

## 1. Add Dependency

Add the `google_mobile_ads` package to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  google_mobile_ads: ^<latest_version> # Check pub.dev for the latest version
```

Then run `flutter pub get`.

## 2. Platform Configuration

**Android:**
Update `android/app/src/main/AndroidManifest.xml`:
```xml
<manifest>
    <application>
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3177096602952445~9832902188"/> <!-- REAL Android App ID -->
    </application>
</manifest>
```

**iOS:**
Update `ios/Runner/Info.plist`:
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-3177096602952445~5453531839</string> <!-- REAL iOS App ID -->
<!-- Add SKAdNetworkItems for iOS 14+ if needed, refer to AdMob docs -->
<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string> <!-- Example, Google's identifier -->
  </dict>
  <!-- Add other network identifiers as provided by Google -->
</array>
```

## 3. User Messaging Platform (UMP) SDK for Consent (GDPR)

It's crucial to handle user consent, especially for users in the EEA and UK.

In your `main.dart` or an early initialization point:
```dart
import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

void main() async { // Make main async
  WidgetsFlutterBinding.ensureInitialized();
  
  // --- UMP SDK Consent Flow ---
  finalUMPController umpController = ConsentInformation.instance;
  var consentRequestParameters = ConsentRequestParameters(
    // Optional: Set TFUA (Tag for Users under the Age of Consent)
    // tagForUnderAgeOfConsent: true,
  );

  // Request consent information update
  await umpController.requestConsentInfoUpdate(consentRequestParameters);

  // Check if the consent form is available and if consent is required.
  if (await umpController.isConsentFormAvailable() &&
      await umpController.getConsentStatus() == ConsentStatus.required) {
    await umpController.loadConsentForm(); // Load the form
    // Show the consent form
    // You might want to gate AdMob initialization on this.
    // This is a simplified show; check official docs for full handling.
    ConsentForm.show(
      (FormError? error) {
        if (error != null) {
          print('Consent form error: ${error.message}');
        }
        // After form is dismissed, check status again or proceed with initialization
        initializeAdMob();
      },
    );
  } else {
     // Consent not required or already obtained/unavailable
     initializeAdMob();
  }
  
  runApp(MyApp());
}

void initializeAdMob() {
  // Configure AdMob settings (optional but recommended)
  MobileAds.instance.updateRequestConfiguration(
    RequestConfiguration(
      // tagForChildDirectedTreatment: TagForChildDirectedTreatment.yes, // If app is child-directed
      // tagForUnderAgeOfConsent: TagForUnderAgeOfConsent.yes, // If targeting users under age of consent
      maxAdContentRating: MaxAdContentRating.pg, // Example: Set max ad content rating
    ),
  );
  // Initialize AdMob
  MobileAds.instance.initialize(); 
  print("AdMob SDK Initialized (Post-Consent Check)");
}

class MyApp extends StatelessWidget {
  // ... your app code
}
```
**Note:** This is a simplified UMP flow. Refer to the `google_mobile_ads` package documentation for complete examples, including how to handle different consent statuses and error scenarios. Configure your UMP settings in the AdMob console.

## 4. Ad Unit IDs

Manage your Ad Unit IDs. **Use `TestAdUnits` during development.**

```dart
// lib/ads_config.dart
import 'dart:io' show Platform;
import 'package:google_mobile_ads/google_mobile_ads.dart'; // For TestAdUnits
import 'package:flutter/foundation.dart'; // For kDebugMode

class AdManager {
  // Use kDebugMode to switch between test and real IDs.
  static final bool _isDevelopment = kDebugMode;

  static String get bannerAdUnitId {
    if (_isDevelopment) return TestAdUnits.banner;
    if (Platform.isAndroid) {
      return 'ca-app-pub-3177096602952445/1840771641';
    } else if (Platform.isIOS) {
      return 'ca-app-pub-3177096602952445/8562926811';
    }
    throw UnsupportedError('Unsupported platform for Banner Ad');
  }

  static String get interstitialStoriesAdUnitId {
    if (_isDevelopment) return TestAdUnits.interstitial;
    if (Platform.isAndroid) {
      return 'ca-app-pub-3177096602952445/3700648224';
    } else if (Platform.isIOS) {
      return 'ca-app-pub-3177096602952445/3422280774';
    }
    throw UnsupportedError('Unsupported platform for Interstitial Stories Ad');
  }

  static String get interstitialArticlesAdUnitId { // For standard interstitial in articles
    if (_isDevelopment) return TestAdUnits.interstitial;
    if (Platform.isAndroid) {
      return 'ca-app-pub-3177096602952445/8191391729';
    } else if (Platform.isIOS) {
      return 'ca-app-pub-3177096602952445/6467230600';
    }
    throw UnsupportedError('Unsupported platform for Interstitial Articles Ad');
  }

  static String get rewardedReelsAdUnitId {
    if (_isDevelopment) return TestAdUnits.rewarded;
    if (Platform.isAndroid) {
      return 'ca-app-pub-3177096602952445/8738170722';
    } else if (Platform.isIOS) {
      return 'ca-app-pub-3177096602952445/3950020117';
    }
    throw UnsupportedError('Unsupported platform for Rewarded Reels Ad');
  }
  
  static String get nativeStoreAdUnitId {
    if (_isDevelopment) return TestAdUnits.nativeAd; // Or TestAdUnits.nativeAdvanced if using that style
    if (Platform.isAndroid) {
      return 'ca-app-pub-3177096602952445/5118505829';
    } else if (Platform.isIOS) {
      return 'ca-app-pub-3177096602952445/4224226558';
    }
    throw UnsupportedError('Unsupported platform for Native Store Ad');
  }
}
```

## 5. Implementing Ad Formats

#### Banner Ad (Header)

```dart
import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
// import 'ads_config.dart'; // Your AdManager class

class BannerAdWidget extends StatefulWidget {
  @override
  _BannerAdWidgetState createState() => _BannerAdWidgetState();
}

class _BannerAdWidgetState extends State<BannerAdWidget> {
  BannerAd? _bannerAd;
  bool _isBannerAdLoaded = false;

  @override
  void initState() {
    super.initState();
    _loadBannerAd();
  }

  void _loadBannerAd() {
    _bannerAd = BannerAd(
      adUnitId: AdManager.bannerAdUnitId, // Uses test ID in dev, real ID in prod
      request: AdRequest(), // Add nonPersonalizedAds: true if consent indicates
      size: AdSize.banner, 
      listener: BannerAdListener(
        onAdLoaded: (Ad ad) {
          print('BannerAd loaded.');
          setState(() {
            _isBannerAdLoaded = true;
          });
        },
        onAdFailedToLoad: (Ad ad, LoadAdError error) {
          print('BannerAd failed to load: $error');
          ad.dispose();
        },
        onAdOpened: (Ad ad) => print('BannerAd opened.'),
        onAdClosed: (Ad ad) => print('BannerAd closed.'),
        onAdImpression: (Ad ad) => print('BannerAd impression.'),
      ),
    )..load();
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _isBannerAdLoaded && _bannerAd != null
        ? Container(
            alignment: Alignment.center,
            width: _bannerAd!.size.width.toDouble(),
            height: _bannerAd!.size.height.toDouble(),
            child: AdWidget(ad: _bannerAd!),
          )
        : SizedBox.shrink(); // Or a placeholder
  }
}
```

#### Interstitial Ad (Stories or Articles)

```dart
import 'package:google_mobile_ads/google_mobile_ads.dart';
// import 'ads_config.dart'; // Your AdManager class

InterstitialAd? _storiesInterstitialAd;
InterstitialAd? _articlesInterstitialAd;

// Load Interstitial Ad for Stories
void loadStoriesInterstitialAd() {
  InterstitialAd.load(
    adUnitId: AdManager.interstitialStoriesAdUnitId,
    request: AdRequest(), // Add nonPersonalizedAds: true if consent indicates
    adLoadCallback: InterstitialAdLoadCallback(
      onAdLoaded: (InterstitialAd ad) {
        _storiesInterstitialAd = ad;
        _storiesInterstitialAd!.fullScreenContentCallback = FullScreenContentCallback(
          onAdDismissedFullScreenContent: (InterstitialAd ad) {
            ad.dispose();
            loadStoriesInterstitialAd(); // Preload next
          },
          onAdFailedToShowFullScreenContent: (InterstitialAd ad, AdError error) {
            print('$ad onAdFailedToShowFullScreenContent: $error');
            ad.dispose();
            loadStoriesInterstitialAd();
          },
        );
        print('Stories Interstitial Ad loaded.');
      },
      onAdFailedToLoad: (LoadAdError error) {
        print('Stories InterstitialAd failed to load: $error');
        _storiesInterstitialAd = null;
      },
    ),
  );
}

// Show Interstitial Ad for Stories
void showStoriesInterstitial() {
  if (_storiesInterstitialAd != null) {
    _storiesInterstitialAd!.show();
  } else {
    print('Stories Interstitial ad is not ready yet.');
    loadStoriesInterstitialAd(); // Attempt to load if not ready
  }
}

// Load Interstitial Ad for Articles
void loadArticlesInterstitialAd() {
  InterstitialAd.load(
    adUnitId: AdManager.interstitialArticlesAdUnitId,
    request: AdRequest(), // Add nonPersonalizedAds: true if consent indicates
    adLoadCallback: InterstitialAdLoadCallback(
      onAdLoaded: (InterstitialAd ad) {
        _articlesInterstitialAd = ad;
        _articlesInterstitialAd!.fullScreenContentCallback = FullScreenContentCallback(
          onAdDismissedFullScreenContent: (InterstitialAd ad) {
            ad.dispose();
            loadArticlesInterstitialAd(); // Preload next
          },
          onAdFailedToShowFullScreenContent: (InterstitialAd ad, AdError error) {
            print('$ad onAdFailedToShowFullScreenContent: $error');
            ad.dispose();
            loadArticlesInterstitialAd();
          },
        );
        print('Articles Interstitial Ad loaded.');
      },
      onAdFailedToLoad: (LoadAdError error) {
        print('Articles InterstitialAd failed to load: $error');
        _articlesInterstitialAd = null;
      },
    ),
  );
}

// Show Interstitial Ad for Articles
void showArticlesInterstitial() {
  if (_articlesInterstitialAd != null) {
    _articlesInterstitialAd!.show();
  } else {
    print('Articles Interstitial ad is not ready yet.');
    loadArticlesInterstitialAd(); // Attempt to load if not ready
  }
}

// Call loadStoriesInterstitialAd() and loadArticlesInterstitialAd() 
// early in your app or when the relevant screens are initialized.
// Call showStoriesInterstitial() or showArticlesInterstitial() at appropriate transition points.
```

Implement `RewardedAd` (for Reels) and `NativeAd` (for Store) similarly, referring to the official `google_mobile_ads` package documentation on pub.dev for detailed examples and event handling. Remember to use `AdManager` to get the appropriate Ad Unit IDs. For Native Ads, you'll need to build a custom UI to display the ad assets.

## 6. Firebase Integration, Best Practices, and AAB Generation

*   **Firebase Analytics:** Ensure you have `firebase_core` and `firebase_analytics` packages in your `pubspec.yaml`. Initialize Firebase in `main.dart`. AdMob events will automatically be tracked by Firebase Analytics if linked. You can log custom ad-related events as well.
*   **Best Practices & Policies:** Refer to the main `README.md` in this directory (`docs/mobile_admob_integration/README.md`) for Firebase Remote Config ideas, Cloud Functions for advanced control, and crucial best practices for AdMob policy compliance (invalid clicks, content, consent).
*   **AAB Generation:** `flutter build appbundle`

This conceptual guide should help you get started with AdMob in a Flutter-based AKmax mobile application. Always refer to the official Google Mobile Ads SDK documentation for Flutter.
```