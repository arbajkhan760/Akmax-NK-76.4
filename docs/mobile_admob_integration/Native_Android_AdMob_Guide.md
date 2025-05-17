
# Google AdMob Integration Guide for AKmax (Native Android - Kotlin/Java)

This document provides a conceptual outline for integrating Google AdMob into a Native Android application for AKmax.

## 1. Add Dependency

In your app-level `build.gradle` file:
```gradle
dependencies {
    implementation 'com.google.android.gms:play-services-ads:23.0.0' // Check for the latest version
    // For UMP SDK (Consent)
    implementation 'com.google.android.ump:user-messaging-platform:2.2.0' // Check for latest
    // Firebase Analytics (ensure Firebase is already set up)
    implementation platform('com.google.firebase:firebase-bom:33.0.0') // Or latest BOM
    implementation 'com.google.firebase:firebase-analytics'
}
```
Sync your project.

## 2. Configure `AndroidManifest.xml`

In `src/main/AndroidManifest.xml`:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    <application
        ...>
        <!-- Your Activities and other elements -->

        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3177096602952445~9832902188"/> <!-- REAL Android App ID -->
        
    </application>
</manifest>
```

## 3. User Messaging Platform (UMP) SDK & AdMob Initialization

In your Application class or main Activity's `onCreate` method:
**Kotlin:**
```kotlin
import android.app.Application
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.RequestConfiguration
import com.google.android.ump.ConsentInformation
import com.google.android.ump.ConsentRequestParameters
import com.google.android.ump.UserMessagingPlatform

class MyApplication : Application() {
    private lateinit var consentInformation: ConsentInformation

    override fun onCreate() {
        super.onCreate()

        // --- UMP SDK Consent Flow ---
        consentInformation = UserMessagingPlatform.getConsentInformation(this)
        val params = ConsentRequestParameters.Builder()
            // .setTagForUnderAgeOfConsent(false) // Optional
            .build()
        
        consentInformation.requestConsentInfoUpdate(
            this, // Current activity or application context
            params,
            {
                // Consent information updated successfully.
                // Check if a consent form is available and required.
                if (consentInformation.isConsentFormAvailable) {
                    loadAndShowConsentFormIfRequired()
                } else {
                    initializeMobileAdsSdk()
                }
            },
            { formError ->
                // Handle the error.
                Log.w("MyApplication", String.format("%s: %s", formError.errorCode, formError.message))
                initializeMobileAdsSdk() // Initialize ads even if consent update fails, AdMob will handle non-personalized
            }
        )
    }

    private fun loadAndShowConsentFormIfRequired() {
        if (consentInformation.consentStatus == ConsentInformation.ConsentStatus.REQUIRED) {
            UserMessagingPlatform.loadConsentForm(
                this,
                { consentForm ->
                    consentForm.show(this@MyApplication.mainActivity) { formError -> // Assuming you have a way to get current Activity
                        if (formError != null) {
                             Log.w("MyApplication", String.format("%s: %s", formError.errorCode, formError.message))
                        }
                        // After form is dismissed, re-check or initialize
                        initializeMobileAdsSdk()
                    }
                },
                { loadError ->
                     Log.w("MyApplication", String.format("%s: %s", loadError.errorCode, loadError.message))
                     initializeMobileAdsSdk()
                }
            )
        } else {
            initializeMobileAdsSdk()
        }
    }
    
    private fun initializeMobileAdsSdk() {
        // Optional: Set request configuration (e.g., for child-directed treatment)
        // val requestConfiguration = RequestConfiguration.Builder()
        //     .setTagForChildDirectedTreatment(RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_TRUE)
        //     .setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_PG)
        //     .build()
        // MobileAds.setRequestConfiguration(requestConfiguration)

        MobileAds.initialize(this) { initializationStatus ->
            Log.d("MyApplication", "AdMob SDK Initialized: $initializationStatus")
        }
    }

    // You'll need a way to reference your current foreground activity for the consent form
    // This is a placeholder concept.
    var mainActivity: MainActivity? = null 
}
```
Register `MyApplication` in `AndroidManifest.xml`: `android:name=".MyApplication"`.

## 4. Ad Unit IDs

Store your Ad Unit IDs in `res/values/strings.xml`. **Use test IDs during development.**

`res/values/strings.xml`:
```xml
<resources>
    <!-- REAL Production Ad Unit IDs -->
    <string name="banner_ad_unit_id_header">ca-app-pub-3177096602952445/1840771641</string>
    <string name="interstitial_ad_unit_id_stories">ca-app-pub-3177096602952445/3700648224</string>
    <string name="interstitial_ad_unit_id_articles">ca-app-pub-3177096602952445/8191391729</string>
    <string name="rewarded_ad_unit_id_reels">ca-app-pub-3177096602952445/8738170722</string>
    <string name="native_ad_unit_id_store">ca-app-pub-3177096602952445/5118505829</string>

    <!-- Test Ad Unit IDs for development (from Google's documentation) -->
    <string name="test_banner_ad_unit_id">ca-app-pub-3940256099942544/6300978111</string>
    <string name="test_interstitial_ad_unit_id">ca-app-pub-3940256099942544/1033173712</string>
    <string name="test_rewarded_ad_unit_id">ca-app-pub-3940256099942544/5224354917</string>
    <string name="test_native_ad_unit_id">ca-app-pub-3940256099942544/2247696110</string>
</resources>
```
Get the appropriate ID in your code:
```kotlin
// In your Activity/Fragment (Kotlin)
val isDevelopment = BuildConfig.DEBUG // Or your own debug flag

val bannerAdUnitId = if (isDevelopment) getString(R.string.test_banner_ad_unit_id) else getString(R.string.banner_ad_unit_id_header)
val interstitialStoriesAdUnitId = if (isDevelopment) getString(R.string.test_interstitial_ad_unit_id) else getString(R.string.interstitial_ad_unit_id_stories)
val interstitialArticlesAdUnitId = if (isDevelopment) getString(R.string.test_interstitial_ad_unit_id) else getString(R.string.interstitial_ad_unit_id_articles)
val rewardedReelsAdUnitId = if (isDevelopment) getString(R.string.test_rewarded_ad_unit_id) else getString(R.string.rewarded_ad_unit_id_reels)
val nativeStoreAdUnitId = if (isDevelopment) getString(R.string.test_native_ad_unit_id) else getString(R.string.native_ad_unit_id_store)
```

## 5. Implementing Ad Formats

#### Banner Ad (Header)

**Layout (e.g., `activity_main.xml`):**
```xml
<com.google.android.gms.ads.AdView
    xmlns:ads="http://schemas.android.com/apk/res-auto"
    android:id="@+id/adViewHeader"
    android:layout_width="match_parent" <!-- Or wrap_content -->
    android:layout_height="wrap_content"
    android:layout_alignParentTop="true" <!-- Example placement -->
    ads:adSize="BANNER" /> <!-- Dynamically set AdUnitId in code -->
```

**Activity (Kotlin):**
```kotlin
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdView
// import com.yourpackage.R (ensure R is imported)
// import com.yourpackage.BuildConfig (for debug flag)

class MainActivity : AppCompatActivity() {
    private lateinit var mAdViewHeader : AdView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // setContentView(R.layout.activity_main) // Your layout

        mAdViewHeader = findViewById(R.id.adViewHeader) // Or however you reference it
        
        val adUnitIdForBanner = if (BuildConfig.DEBUG) {
            getString(R.string.test_banner_ad_unit_id)
        } else {
            getString(R.string.banner_ad_unit_id_header)
        }
        mAdViewHeader.adUnitId = adUnitIdForBanner

        val adRequest = AdRequest.Builder().build()
        mAdViewHeader.loadAd(adRequest)
    }
}
```

#### Interstitial Ad (Stories or Articles)

```kotlin
import android.app.Activity
import android.util.Log
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
// import com.yourpackage.R // For string resources
// import com.yourpackage.BuildConfig // For debug flag

object AdMobInterstitialManager {
    private var mStoriesInterstitialAd: InterstitialAd? = null
    private var mArticlesInterstitialAd: InterstitialAd? = null
    private const val TAG = "AdMobInterstitial"

    fun loadStoriesInterstitialAd(activity: Activity) {
        val adUnitId = if (BuildConfig.DEBUG) {
            activity.getString(R.string.test_interstitial_ad_unit_id)
        } else {
            activity.getString(R.string.interstitial_ad_unit_id_stories)
        }
        val adRequest = AdRequest.Builder().build()
        InterstitialAd.load(activity, adUnitId, adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(interstitialAd: InterstitialAd) {
                    mStoriesInterstitialAd = interstitialAd
                    Log.d(TAG, "Stories Interstitial ad loaded.")
                    interstitialAd.fullScreenContentCallback = object: FullScreenContentCallback() {
                        override fun onAdDismissedFullScreenContent() { mStoriesInterstitialAd = null; loadStoriesInterstitialAd(activity) }
                        override fun onAdFailedToShowFullScreenContent(adError: AdError) { mStoriesInterstitialAd = null }
                        override fun onAdShowedFullScreenContent() { Log.d(TAG, "Stories ad showed fullscreen.") }
                    }
                }
                override fun onAdFailedToLoad(loadAdError: LoadAdError) { mStoriesInterstitialAd = null }
            })
    }

    fun showStoriesInterstitialAd(activity: Activity) {
        if (mStoriesInterstitialAd != null) mStoriesInterstitialAd?.show(activity)
        else { Log.d(TAG, "Stories interstitial wasn't ready."); loadStoriesInterstitialAd(activity) }
    }

    fun loadArticlesInterstitialAd(activity: Activity) {
        val adUnitId = if (BuildConfig.DEBUG) {
            activity.getString(R.string.test_interstitial_ad_unit_id)
        } else {
            activity.getString(R.string.interstitial_ad_unit_id_articles)
        }
         val adRequest = AdRequest.Builder().build()
        InterstitialAd.load(activity, adUnitId, adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(interstitialAd: InterstitialAd) {
                    mArticlesInterstitialAd = interstitialAd
                    Log.d(TAG, "Articles Interstitial ad loaded.")
                     interstitialAd.fullScreenContentCallback = object: FullScreenContentCallback() {
                        override fun onAdDismissedFullScreenContent() { mArticlesInterstitialAd = null; loadArticlesInterstitialAd(activity) }
                        override fun onAdFailedToShowFullScreenContent(adError: AdError) { mArticlesInterstitialAd = null }
                        override fun onAdShowedFullScreenContent() { Log.d(TAG, "Articles ad showed fullscreen.") }
                    }
                }
                override fun onAdFailedToLoad(loadAdError: LoadAdError) { mArticlesInterstitialAd = null }
            })
    }
    
    fun showArticlesInterstitialAd(activity: Activity) {
        if (mArticlesInterstitialAd != null) mArticlesInterstitialAd?.show(activity)
        else { Log.d(TAG, "Articles interstitial wasn't ready."); loadArticlesInterstitialAd(activity) }
    }
}

// Call AdMobInterstitialManager.loadStoriesInterstitialAd(this) etc. in onCreate/onResume.
// Call AdMobInterstitialManager.showStoriesInterstitialAd(this) etc. at appropriate points.
```

Implement `RewardedAd` (for Reels) and `NativeAd` (for Store) similarly, following the official Google Mobile Ads SDK documentation for Android. Always use the appropriate ad unit ID (production or test) based on your build configuration.
*   Rewarded (Reels): [https://developers.google.com/admob/android/rewarded-ads](https://developers.google.com/admob/android/rewarded-ads)
*   Native (Store): [https://developers.google.com/admob/android/native](https://developers.google.com/admob/android/native)


## 6. Firebase Integration, Best Practices, and AAB Generation

*   **Firebase Analytics:** Ensure Firebase SDK is set up. AdMob events are automatically tracked. Log custom ad events if needed.
*   **Best Practices & Policies:** Refer to the main `README.md` in this directory (`docs/mobile_admob_integration/README.md`) for Firebase Remote Config ideas, Cloud Functions for advanced control, and crucial best practices for AdMob policy compliance (invalid clicks, content, consent).
*   **AAB Generation:** Build > Generate Signed Bundle / APK... in Android Studio.

This conceptual guide should help you get started with AdMob in a Native Android AKmax mobile application. Always refer to the latest official AdMob documentation.
```