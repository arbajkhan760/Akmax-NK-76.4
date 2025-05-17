
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// To use Google AI models (like Gemini), ensure you have the GOOGLE_API_KEY environment variable set.
// You can add this to your .env.local file:
// GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
//
// The googleAI() plugin will automatically pick it up.
// For more details on authentication, refer to the Genkit and Google AI SDK documentation.

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
