import type { AdPlan, UserAdStatus, UtrVerificationResult } from '@/types/ads';

const MOCK_DELAY = 500; // ms

// Mock Database for Ad Plans
const mockAdPlans: AdPlan[] = [
  { id: 'onetime', name: 'One-Time Ad', description: 'Promote a single post for 7 days.', price: 49, durationDays: 7, adsAllowed: 1, features: ['All Ad Formats', 'Basic Targeting', 'Basic Analytics'] },
  { id: 'daily', name: 'Daily Plan', description: 'Run one ad per day.', price: 99, durationDays: 1, adsAllowed: 1, features: ['All Ad Formats', 'Standard Targeting', 'Standard Analytics'] },
  { id: 'weekly', name: 'Weekly Plan', description: 'Consistent daily promotion for a week.', price: 299, durationDays: 7, adsAllowed: 7, features: ['All Ad Formats', 'Standard Targeting', 'Standard Analytics'] }, // Assuming 1 ad/day = 7 total
  { id: 'monthly', name: 'Monthly Plan', description: 'Run up to 30 ads throughout the month.', price: 999, durationDays: 30, adsAllowed: 30, features: ['All Ad Formats', 'Advanced Targeting', 'Detailed Analytics'] },
  { id: 'premium_monthly', name: 'Premium Monthly', description: 'Unlimited ads for maximum reach.', price: 1499, durationDays: 30, adsAllowed: null, isPremium: true, features: ['Unlimited Ads', 'All Ad Formats', 'Advanced Targeting', 'Priority Support', 'Detailed Analytics'] },
  { id: 'yearly', name: 'Yearly Plan', description: 'Long-term promotion with one ad per day.', price: 8999, durationDays: 365, adsAllowed: 365, features: ['All Ad Formats', 'Advanced Targeting', 'Yearly Analytics Report'] },
  { id: 'premium_yearly', name: 'Premium Yearly', description: 'Unlimited ads all year round.', price: 12999, durationDays: 365, adsAllowed: null, isPremium: true, features: ['Unlimited Ads', 'All Ad Formats', 'Advanced Targeting', 'Dedicated Support', 'Yearly Analytics Report'] },
];

// Mock Database for User Ad Status (Map<userId, UserAdStatus>)
const mockUserAdStatuses = new Map<string, UserAdStatus>();

// Simulate some initial status - User 'user123' has an active 'Monthly Plan'
mockUserAdStatuses.set('user123', {
  userId: 'user123',
  activePlanId: 'monthly',
  planName: 'Monthly Plan',
  planExpiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // Expires in 15 days
  adsRemaining: 25,
  isVerified: true,
});

/**
 * Fetches all available ad promotion plans.
 * @returns Promise resolving to an array of AdPlan objects.
 */
export const getAdPlans = async (): Promise<AdPlan[]> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  console.log("Fetching Ad Plans");
  return [...mockAdPlans]; // Return a copy
};

/**
 * Fetches the current advertising status for a given user.
 * @param userId The ID of the user.
 * @returns Promise resolving to the UserAdStatus object or null if no active/verified plan.
 */
export const getUserAdStatus = async (userId: string): Promise<UserAdStatus | null> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY / 2));
  console.log(`Fetching Ad Status for User: ${userId}`);
  const status = mockUserAdStatuses.get(userId);

  // Optionally check expiry date here if needed before returning
  if (status && status.planExpiryDate && new Date(status.planExpiryDate) < new Date()) {
      console.log(`Plan for user ${userId} expired. Clearing status.`);
      mockUserAdStatuses.delete(userId); // Remove expired plan
      return null;
  }

  return status ? { ...status } : null; // Return a copy or null
};

/**
 * Submits a UTR code for verification and potential plan activation.
 * In a real app, this would call a backend endpoint that verifies the UTR against payment records.
 * @param userId The ID of the user activating the plan.
 * @param planId The ID of the plan being activated.
 * @param utrCode The UTR code submitted by the user.
 * @returns Promise resolving to a UtrVerificationResult.
 */
export const submitUtrForPlan = async (userId: string, planId: string, utrCode: string): Promise<UtrVerificationResult> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY * 2)); // Simulate verification delay
    console.log(`Verifying UTR: ${utrCode} for Plan: ${planId}, User: ${userId}`);

    // --- MOCK VERIFICATION LOGIC ---
    // In a real backend, you'd query your payment logs for this UTR + expected amount.
    // For demo, let's simulate success most of the time if UTR looks vaguely correct.
    const isValidUtrFormat = /^UTR\d{12,}$/i.test(utrCode) || utrCode.length > 10; // Basic check
    const paymentVerified = isValidUtrFormat && Math.random() > 0.1; // 90% success for valid-ish UTRs

    if (!paymentVerified) {
        return { success: false, error: 'UTR code not found or payment mismatch.' };
    }

    const plan = mockAdPlans.find(p => p.id === planId);
    if (!plan) {
        return { success: false, error: 'Selected plan not found.' };
    }

    // Check if user already has an active plan (should ideally be checked before showing payment step)
    const currentStatus = mockUserAdStatuses.get(userId);
    if (currentStatus?.activePlanId && new Date(currentStatus.planExpiryDate!) > new Date()) {
        // If we are reactivating the *same* plan, allow it (e.g. daily plan renewal)
        // Or if it's a new plan after previous one expired.
        // This logic could be more complex (e.g. disallow switching mid-plan)
        // For now, let's allow override if UTR is valid for a new plan, or if plan is same.
        if (currentStatus.activePlanId !== planId) {
           console.warn(`User ${userId} already has active plan ${currentStatus.activePlanId}, but is activating ${planId}. Overriding for demo.`);
        }
    }

    // --- Activate Plan (Mock) ---
    const expiryDate = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);
    const newStatus: UserAdStatus = {
        userId: userId,
        activePlanId: plan.id,
        planName: plan.name,
        planExpiryDate: expiryDate.toISOString(),
        adsRemaining: plan.adsAllowed, // Set initial ads allowed
        isVerified: true,
    };
    mockUserAdStatuses.set(userId, newStatus);
    console.log(`Plan ${planId} activated for user ${userId}. Expires: ${expiryDate.toISOString()}`);

    return {
        success: true,
        expiryDate: newStatus.planExpiryDate,
        adsRemaining: newStatus.adsRemaining,
    };
};

// --- TODO: Add functions for Ad Creation, Management, Analytics ---
// Example placeholders:
// export const createAdCampaign = async (userId: string, campaignData: Omit<AdCampaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdCampaign> => { ... }
// export const getAdAnalytics = async (userId: string, campaignId: string): Promise<AdAnalyticsSummary> => { ... }
