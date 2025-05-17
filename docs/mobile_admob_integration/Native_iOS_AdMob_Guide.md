
# Google AdMob Integration Guide for AKmax (Native iOS - Swift)

This document provides a conceptual outline for integrating Google AdMob into a Native iOS application for AKmax using Swift.

## 1. Add Google Mobile Ads SDK

Use CocoaPods (recommended) or manually add the SDK.

**Using CocoaPods:**
Add to your `Podfile`:
```ruby
platform :ios, '12.0' # Or your desired deployment target
target 'YourProjectName' do
  use_frameworks!
  pod 'Google-Mobile-Ads-SDK' 
  # For UMP SDK (Consent)
  pod 'GoogleUserMessagingPlatform' 
  # Firebase Analytics (ensure Firebase is already set up via CocoaPods)
  # pod 'FirebaseAnalytics' 
end
```
Run `pod install --repo-update`. Open the `.xcworkspace` file.

## 2. Configure `Info.plist`

In your `Info.plist` file, add the `GADApplicationIdentifier` key with your AdMob App ID:
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-3177096602952445~5453531839</string> <!-- REAL iOS App ID -->
```
For iOS 14 and later, you also need to add `SKAdNetworkItems`. Refer to the AdMob documentation for the latest list. A common one is Google's:
```xml
<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string>
  </dict>
  <!-- Add other network identifiers as provided by Google -->
</array>
```
Also, ensure App Transport Security settings allow HTTP loads if using mediation or certain ad networks (though AdMob generally uses HTTPS).

## 3. User Messaging Platform (UMP) SDK & AdMob Initialization

In your `AppDelegate.swift`:
```swift
import UIKit
import GoogleMobileAds
import UserMessagingPlatform // For UMP SDK
// import FirebaseCore // If using Firebase

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Optional: Initialize Firebase if you haven't already
        // FirebaseApp.configure()

        // --- UMP SDK Consent Flow ---
        let parameters = UMPRequestParameters()
        // Optional: Set TFUA (Tag for Users under the Age of Consent)
        // parameters.tagForUnderAgeOfConsent = false 
        
        // Optional: For testing specific regions or with a Test Device
        // let debugSettings = UMPDebugSettings()
        // debugSettings.testDeviceIdentifiers = ["YOUR_TEST_DEVICE_HASHED_ID"] // Get from console logs
        // debugSettings.geography = .EEA // Test EEA behavior
        // parameters.debugSettings = debugSettings

        UMPConsentInformation.sharedInstance.requestConsentInfoUpdate(with: parameters) {
            [weak self] (error) in
            if let error = error {
                print("Error requesting consent info update: \(error.localizedDescription)")
                // Handle error, maybe proceed with AdMob init assuming non-personalized
                self?.initializeMobileAds()
                return
            }

            // Check if a consent form is available and if consent is required or unknown.
            if UMPConsentInformation.sharedInstance.isConsentFormAvailable &&
               (UMPConsentInformation.sharedInstance.consentStatus == .required ||
                UMPConsentInformation.sharedInstance.consentStatus == .unknown) {
                
                UMPConsentForm.load { (form, loadError) in
                    if let loadError = loadError {
                        print("Error loading consent form: \(loadError.localizedDescription)")
                        self?.initializeMobileAds()
                        return
                    }
                    
                    if UMPConsentInformation.sharedInstance.consentStatus == .required ||
                       UMPConsentInformation.sharedInstance.consentStatus == .unknown {
                        // Present the form from a valid view controller.
                        // You might need to get the rootViewController differently.
                        if let rootViewController = self?.window?.rootViewController {
                           form?.present(from: rootViewController) { (dismissError) in
                                if let dismissError = dismissError {
                                   print("Error presenting consent form: \(dismissError.localizedDescription)")
                                }
                                // After form is dismissed, initialize MobileAds
                                self?.initializeMobileAds()
                           }
                        } else {
                           self?.initializeMobileAds() // Fallback if no rootVC
                        }
                    } else {
                        self?.initializeMobileAds() // Consent obtained or not required
                    }
                }
            } else {
                // Consent not required or already obtained/unavailable
                self?.initializeMobileAds()
            }
        }
        
        return true
    }
    
    func initializeMobileAds() {
        // Optional: Set request configuration (e.g., for child-directed treatment)
        // GADMobileAds.sharedInstance().requestConfiguration.tagForChildDirectedTreatment = true
        // GADMobileAds.sharedInstance().requestConfiguration.maxAdContentRating = .G // Example rating

        // Initialize Google Mobile Ads SDK
        GADMobileAds.sharedInstance().start(completionHandler: nil)
        print("AdMob SDK Initialized (Post-Consent Check)")
    }
    // ... other app delegate methods
}
```

## 4. Ad Unit IDs

Store your Ad Unit IDs. **Use Test Unit IDs during development.**
```swift
// AdManager.swift
import Foundation
import GoogleMobileAds // For GADTestUnitIDBanner etc.

struct AdManager {
    // Use #if DEBUG for build configuration specific IDs
    #if DEBUG
    static let isDevelopment = true
    #else
    static let isDevelopment = false
    #endif

    static var bannerAdUnitID: String {
        if isDevelopment { return GADTestUnitIDBanner } 
        return "ca-app-pub-3177096602952445/8562926811" // REAL Header Banner
    }

    static var interstitialStoriesAdUnitID: String {
        if isDevelopment { return GADTestUnitIDInterstitial }
        return "ca-app-pub-3177096602952445/3422280774" // REAL Stories Interstitial
    }
    
    static var interstitialArticlesAdUnitID: String { // For standard interstitial in articles
        if isDevelopment { return GADTestUnitIDInterstitial }
        return "ca-app-pub-3177096602952445/6467230600" // REAL Articles Interstitial
    }

    static var rewardedReelsAdUnitID: String {
        if isDevelopment { return GADTestUnitIDRewarded }
        return "ca-app-pub-3177096602952445/3950020117" // REAL Reels Rewarded
    }
    
    static var nativeStoreAdUnitID: String {
        if isDevelopment { return GADTestUnitIDNativeAdvanced }
        return "ca-app-pub-3177096602952445/4224226558" // REAL Store Native
    }
}
```

## 5. Implementing Ad Formats

#### Banner Ad (Header)

In your `UIViewController`:
```swift
import UIKit
import GoogleMobileAds

class ViewController: UIViewController, GADBannerViewDelegate {

    var bannerView: GADBannerView!

    override func viewDidLoad() {
        super.viewDidLoad()

        bannerView = GADBannerView(adSize: GADAdSizeBanner) 
        addBannerViewToView(bannerView)
        
        bannerView.adUnitID = AdManager.bannerAdUnitID 
        bannerView.rootViewController = self
        bannerView.delegate = self
        bannerView.load(GADRequest()) // UMP handles non-personalized ads based on consent
    }

    func addBannerViewToView(_ bannerView: GADBannerView) {
        bannerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(bannerView)
        NSLayoutConstraint.activate([
            bannerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            bannerView.centerXAnchor.constraint(equalTo: view.centerXAnchor)
        ])
    }

    // MARK: - GADBannerViewDelegate methods
    func bannerViewDidReceiveAd(_ bannerView: GADBannerView) { print("bannerViewDidReceiveAd") }
    func bannerView(_ bannerView: GADBannerView, didFailToReceiveAdWithError error: Error) { print("bannerView:didFailToReceiveAdWithError: \(error.localizedDescription)") }
    func bannerViewDidRecordImpression(_ bannerView: GADBannerView) { print("bannerViewDidRecordImpression") }
    func bannerViewWillPresentScreen(_ bannerView: GADBannerView) { print("bannerViewWillPresentScreen") }
    // ... other delegates
}
```

#### Interstitial Ad (Stories or Articles)

```swift
import GoogleMobileAds

class MyContentViewController: UIViewController, GADFullScreenContentDelegate {
    private var storiesInterstitial: GADInterstitialAd?
    private var articlesInterstitial: GADInterstitialAd?

    override func viewDidLoad() {
        super.viewDidLoad()
        loadStoriesInterstitialAd()
        loadArticlesInterstitialAd()
    }

    func loadStoriesInterstitialAd() {
        let request = GADRequest() // UMP handles non-personalized ads
        GADInterstitialAd.load(withAdUnitID: AdManager.interstitialStoriesAdUnitID,
                               request: request,
                               completionHandler: { [weak self] ad, error in
                                guard let self = self else { return }
                                if let error = error { print("Failed to load stories ad: \(error.localizedDescription)"); return }
                                self.storiesInterstitial = ad
                                self.storiesInterstitial?.fullScreenContentDelegate = self
                                print("Stories Interstitial ad loaded.")
                               })
    }
    
    func showStoriesInterstitialAdIfNeeded() {
        if let ad = storiesInterstitial {
            ad.present(fromRootViewController: self)
        } else {
            print("Stories Ad wasn't ready."); loadStoriesInterstitialAd()
        }
    }

    func loadArticlesInterstitialAd() {
        let request = GADRequest() // UMP handles non-personalized ads
        GADInterstitialAd.load(withAdUnitID: AdManager.interstitialArticlesAdUnitID,
                               request: request,
                               completionHandler: { [weak self] ad, error in
                                guard let self = self else { return }
                                if let error = error { print("Failed to load articles ad: \(error.localizedDescription)"); return }
                                self.articlesInterstitial = ad
                                self.articlesInterstitial?.fullScreenContentDelegate = self // Use self as delegate
                                print("Articles Interstitial ad loaded.")
                               })
    }

    func showArticlesInterstitialAdIfNeeded() {
        if let ad = articlesInterstitial {
            ad.present(fromRootViewController: self)
        } else {
            print("Articles Ad wasn't ready."); loadArticlesInterstitialAd()
        }
    }

    // MARK: - GADFullScreenContentDelegate methods
    func adDidDismissFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        print("Ad did dismiss full screen content.")
        // Preload based on which ad was dismissed
        if ad == storiesInterstitial { storiesInterstitial = nil; loadStoriesInterstitialAd() }
        if ad == articlesInterstitial { articlesInterstitial = nil; loadArticlesInterstitialAd() }
    }

    func ad(_ ad: GADFullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        print("Ad did fail to present with error \(error.localizedDescription).")
         if ad == storiesInterstitial { storiesInterstitial = nil; loadStoriesInterstitialAd() }
         if ad == articlesInterstitial { articlesInterstitial = nil; loadArticlesInterstitialAd() }
    }
}
```

Implement `GADRewardedAd` (for Reels) and `GADNativeAd` (for Store) similarly, referring to the official Google Mobile Ads SDK documentation for iOS. Always use `AdManager` to get the correct ad unit IDs. For Native Ads, you'll create a custom `GADNativeAdView`.
*   Rewarded: [https://developers.google.com/admob/ios/rewarded-ads](https://developers.google.com/admob/ios/rewarded-ads)
*   Native: [https://developers.google.com/admob/ios/native](https://developers.google.com/admob/ios/native)

## 6. Firebase Integration, Best Practices, and App Store Submission

*   **Firebase Analytics:** Ensure Firebase SDK (including Analytics) is set up in your Xcode project (e.g., via CocoaPods and `FirebaseApp.configure()`). AdMob events are automatically tracked.
*   **Best Practices & Policies:** Refer to the main `README.md` in this directory (`docs/mobile_admob_integration/README.md`) for Firebase Remote Config ideas, Cloud Functions for advanced control, and crucial best practices for AdMob policy compliance.
*   **App Store Submission:** Generate an Archive via Xcode.

This conceptual guide should help you get started with AdMob in a Native iOS AKmax mobile application.
```