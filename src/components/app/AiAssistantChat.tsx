
'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAkgroup76AiStatus, type Akgroup76AiStatus } from '@/services/akgroup76AiService'; // Import AI status

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const AiAssistantChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: Date.now(), sender: 'ai', text: "Hello! I'm your expert AI assistant for AKmax. I can help with account access, payments, promotions, and general app usage. How can I assist you today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const supportEmail = "akgroup76.com@gmail.com";
  const [akgroup76AiCurrentStatus, setAkgroup76AiCurrentStatus] = useState<Akgroup76AiStatus | null>(null);

  useEffect(() => {
    // Fetch AKGROUP76 AI status when component mounts client-side
    setAkgroup76AiCurrentStatus(getAkgroup76AiStatus());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAiResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();

    // Check for queries about AKGROUP76 AI or app updates
    if (lowerCaseMessage.includes('akgroup76 ai') || lowerCaseMessage.includes('app update') || lowerCaseMessage.includes('automatic update') || lowerCaseMessage.includes('how does akmax update')) {
        const status = akgroup76AiCurrentStatus || getAkgroup76AiStatus(); // Ensure status is fresh
        let response = `AKGROUP76 AI is our internal intelligent system designed to continuously improve and protect the AKmax application. Its mission is to autonomously enhance the app while ensuring safety, integrity, and modern performance.\n\nCurrently, AKGROUP76 AI is in: **${status.phase}**. \n${status.details}\n\nKey aspects of AKGROUP76 AI include:\n`;
        response += `- **Automatic Monthly Updates (after observation):** New social features, creative tools, performance enhancements, UI/UX improvements, and smart integrations based on analytics and trends.\n`;
        response += `- **Advanced Protection Features:**\n`;
        status.protectionFeatures.forEach(feature => {
            response += `  • ${feature}\n`;
        });
        response += `\nThis system evolves AKmax safely and intelligently, with updates requiring no human approval after the initial observation phase, running silently to keep the app secure and high-performing.`;
        return response;
    }

    // General greeting
    if (lowerCaseMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
        return 'Hello! I\'m here to provide expert assistance. Please let me know how I can help you with account issues, payments, promotions, or general app usage.';
    }

    // Password Reset
    if (lowerCaseMessage.includes('password') || lowerCaseMessage.includes('reset') || lowerCaseMessage.includes('forgot my password')) {
        return `I understand you're having trouble with your password. To reset it, please follow these steps:\n1. Go to the login screen of the application.\n2. Look for a "Forgot Password" or "Reset Password" link and tap on it.\n3. You will be prompted to enter your registered email address or phone number.\n4. Follow the instructions sent to your email/phone to create a new password.\nIf you don't receive the instructions, please check your spam/junk folder. If the issue persists, you can contact our support team at ${supportEmail}.`;
    }

    // Username Issues
    if (lowerCaseMessage.includes('username') || lowerCaseMessage.includes('change name') || lowerCaseMessage.includes('change my username')) {
        return `Regarding your username or display name: \n- Your display name (the name others see on your profile) can typically be changed in the "Edit Profile" section of your account settings. \n- Usernames, which are unique identifiers for login, are often fixed after account creation for security and system integrity. If you have a specific concern about your username, please describe it further, or contact support at ${supportEmail} for more assistance.`;
    }

    // Account Locked/Frozen
    if (lowerCaseMessage.includes('locked') || lowerCaseMessage.includes('frozen') || lowerCaseMessage.includes('account access') || lowerCaseMessage.includes('disabled') || lowerCaseMessage.includes('cannot log in')) {
        return `I'm sorry to hear you're having trouble accessing your account. If your account is locked or disabled, this usually happens for security reasons or due to a violation of our terms. \nTo resolve this, you'll generally need to contact our dedicated support team. Please email them at ${supportEmail} with details of your issue. They can investigate the specific reason and guide you through the recovery process, which may involve identity verification. \nCould you tell me if you received any specific message when trying to log in?`;
    }

    // Payment/UTR/Verification Issues (Promotions, Blue Badge etc.)
    if (lowerCaseMessage.includes('payment') || lowerCaseMessage.includes('utr') || lowerCaseMessage.includes('upi') || lowerCaseMessage.includes('transaction') || lowerCaseMessage.includes('verification') || lowerCaseMessage.includes('blue badge payment') || lowerCaseMessage.includes('ad plan payment')) {
        return `For payment and UTR verification matters, such as for premium features or ad plans, please note the following: \n1. Ensure you have made the payment to the correct UPI ID: \`arbaj00100@fam\`. \n2. Double-check that the UTR/transaction ID you entered is accurate and complete. \n3. Verification can sometimes take a little while to process, typically up to a few hours, but occasionally longer depending on bank processing times. \nIf it has been more than 24 hours and your service isn't active, please have your transaction ID and payment details ready and contact our support team at ${supportEmail} for direct assistance. They can look into the specific transaction for you.`;
    }

    // Ad Promotions / Campaign Issues
    if (lowerCaseMessage.includes('ad') || lowerCaseMessage.includes('promotion') || lowerCaseMessage.includes('promote') || lowerCaseMessage.includes('campaign') || lowerCaseMessage.includes('boost post')) {
        return `I can help with ad promotions. You can create and manage your ad campaigns through the "Promote" section, usually found in your settings or profile. \nTo start: \n1. Choose an ad plan that suits your needs. \n2. Complete the payment as instructed (e.g., via UPI to \`arbaj00100@fam\`). \n3. Submit the UTR/transaction ID for verification. \nOnce your plan is active, you can use the "Create Ad" feature to set up your campaign, define your audience, and upload your creatives. \nIf you're facing a specific issue with an ad, like it not running or a problem with setup, could you describe it in more detail? If the problem is complex, you can email our dedicated support team at ${supportEmail}.`;
    }
    
    // General Help / Issue
    if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('support') || lowerCaseMessage.includes('issue') || lowerCaseMessage.includes('problem')) {
        return `I'm here to help. Please describe the issue you're experiencing with the application in as much detail as possible. For example, what were you trying to do, what happened, and did you see any error messages? This will help me understand the situation better and provide the most relevant solution. If I can't resolve it, I'll guide you on how to contact our support team at ${supportEmail}.`;
    }

    // Polite deflection for sensitive or internal info requests
    if (lowerCaseMessage.includes('internal') || lowerCaseMessage.includes('api') || lowerCaseMessage.includes('code') || lowerCaseMessage.includes('workflow') || lowerCaseMessage.includes('how does akmax work') && !lowerCaseMessage.includes('akgroup76 ai')) { // Allow asking about AKGROUP76 AI's workings
        return 'For security and proprietary reasons, I cannot share specific internal details about the application\'s architecture or code. However, I can certainly help you with how to use features or troubleshoot common problems. If you have a question about a specific task or issue you\'re facing, please let me know!';
    }
    
    // Security-related deflection
     if (lowerCaseMessage.includes('hack') || lowerCaseMessage.includes('crack') || lowerCaseMessage.includes('bypass')) {
        return 'I cannot assist with requests that could compromise security or violate terms of service. My purpose is to help you use the application safely and effectively. If you have a legitimate security concern about your account, please let me know, and I can guide you on protective measures or reporting procedures.';
    }

    // Default fallback for unhandled queries
    return `I've noted your query about "${userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '')}". To best assist you, could you please provide a bit more detail? I can help with topics like account access (usernames, passwords, locked accounts), payment or UTR verification, ad promotions, or general guidance on using the application’s features. If this is a complex issue, feel free to email our support team directly at ${supportEmail}.`;
  };


  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsAiTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiText = getAiResponse(userMessage.text);
      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);
    }, 1000 + Math.random() * 500); // Random delay between 1-1.5 seconds
  };

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-3',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 border flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-lg px-3 py-2 text-sm shadow',
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-muted-foreground rounded-bl-none'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                   <p className="text-xs opacity-70 mt-1 text-right">
                       {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </p>
                </div>
                 {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 border flex-shrink-0">
                    {/* Placeholder for user avatar */}
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isAiTyping && (
                 <div className="flex items-start gap-3 justify-start">
                     <Avatar className="h-8 w-8 border flex-shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                           <Bot className="h-5 w-5" />
                         </AvatarFallback>
                     </Avatar>
                     <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm shadow rounded-bl-none">
                         <div className="flex space-x-1 items-center h-5">
                              <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                              <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                              <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
                         </div>
                     </div>
                 </div>
             )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Describe your issue or question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            disabled={isAiTyping}
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isAiTyping}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AiAssistantChat;
