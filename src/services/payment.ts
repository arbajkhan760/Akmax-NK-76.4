
/**
 * Represents the details required to process a payment.
 */
export interface PaymentDetails {
  /**
   * The amount to be paid, likely in the smallest currency unit (e.g., paise for INR).
   */
  amount: number;
  /**
   * The currency of the payment (e.g., 'INR').
   */
  currency: string;
  /**
   * A description of the payment.
   */
  description: string;
  /**
   * The chosen payment method type.
   */
  paymentMethod: 'card' | 'upi' | 'cod' | 'paypal' | 'bank' | 'paytm';
  /**
   * Card details, required if paymentMethod is 'card'.
   * Should ideally contain a tokenized representation or minimal details needed for backend processing.
   */
  cardDetails?: {
    number?: string; // Masked or tokenized ideally
    expiry?: string;
    cvv?: string; // Should not be stored
    // Add card token if using a gateway like Stripe/Razorpay
  };
  /**
   * UPI ID, required if paymentMethod is 'upi'.
   */
  upiId?: string;
  /**
   * PayPal email, required if paymentMethod is 'paypal'.
   */
  paypalEmail?: string;
  /**
   * Bank details, potentially required if paymentMethod is 'bank'.
   * This might involve showing instructions rather than collecting details upfront.
   */
  bankDetails?: {
    accountNumber?: string;
    ifsc?: string;
    holderName?: string;
  };
  /**
   * Paytm registered number, required if paymentMethod is 'paytm'.
   */
  paytmNumber?: string;
   /**
    * Any additional metadata required by the payment processor.
    */
   metadata?: Record<string, any>;
}


/**
 * Represents the result of a payment processing attempt.
 */
export interface PaymentResult {
  /**
   * Indicates whether the payment was successful.
   */
  success: boolean;
  /**
   * An optional transaction ID if the payment was successful.
   */
  transactionId?: string;
  /**
   * An optional error message if the payment failed.
   */
  error?: string;
   /**
    * Optional: Status of the payment (e.g., pending, requires_action, succeeded).
    */
   status?: string;
    /**
    * Optional: Data needed for next steps (e.g., redirect URL for PayPal).
    */
   nextAction?: {
       type: 'redirect' | 'manual_transfer' | 'otp';
       data?: any;
   };
}

/**
 * Processes a payment using the provided payment details.
 * This is a MOCK function. Replace with actual API calls to your payment gateway.
 *
 * @param paymentDetails The details of the payment to be processed.
 * @returns A promise that resolves to a PaymentResult indicating the success or failure of the payment.
 */
export async function processPayment(
  paymentDetails: PaymentDetails
): Promise<PaymentResult> {
  console.log(`Processing payment for ${paymentDetails.amount} ${paymentDetails.currency} via ${paymentDetails.paymentMethod}`);
  console.log('Payment Details:', paymentDetails);

  // --- MOCK IMPLEMENTATION ---
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate different outcomes based on method (for testing)
  const isSuccess = Math.random() > 0.15; // 85% success rate

  if (!isSuccess) {
    return {
      success: false,
      error: 'Payment failed due to a simulated error.',
      status: 'failed',
    };
  }

  // Simulate success scenarios based on method
  switch (paymentDetails.paymentMethod) {
    case 'card':
    case 'upi':
    case 'paytm':
      return {
        success: true,
        transactionId: `txn_${Date.now()}`,
        status: 'succeeded',
      };
    case 'paypal':
       // PayPal often requires redirection
       return {
           success: true, // Indicate initiation success
           status: 'requires_action',
           nextAction: {
               type: 'redirect',
               data: { url: `https://www.paypal.com/checkoutnow?token=mock_token_${Date.now()}` } // Mock redirect URL
           },
           transactionId: `pp_txn_${Date.now()}`, // Provisional ID
       };
    case 'bank':
       // Bank transfer usually requires manual action
        return {
            success: true, // Order placed, awaiting payment
            status: 'pending_payment',
            nextAction: {
                type: 'manual_transfer',
                data: { // Bank details to show the user
                    accountName: 'AK Reels Store',
                    accountNumber: '1234567890',
                    ifsc: 'HDFC0001234',
                    bankName: 'HDFC Bank',
                    amount: paymentDetails.amount,
                    currency: paymentDetails.currency,
                    reference: `order_${Date.now()}` // Unique reference for the user
                }
            },
             transactionId: `bank_ord_${Date.now()}`, // Order ID
        };
     case 'cod':
         return {
             success: true,
             status: 'pending', // Payment pending on delivery
             transactionId: `cod_ord_${Date.now()}`, // Order ID
         };
    default:
      return {
        success: false,
        error: 'Unsupported payment method in mock.',
        status: 'failed',
      };
  }
}
