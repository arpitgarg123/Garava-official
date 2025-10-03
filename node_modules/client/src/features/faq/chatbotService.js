// src/features/faq/chatbotService.js
import { searchFAQs, recordFAQMatch, addMessage, setTyping } from './slice.js';

/**
 * Enhanced FAQ Chatbot Service
 * Handles conversation flow, FAQ matching, and response generation
 */
export class FAQChatbotService {
  constructor(dispatch, getState) {
    this.dispatch = dispatch;
    this.getState = getState;
    
    // Intent patterns for better understanding
    this.intents = {
      greeting: [
        /^(hi|hello|hey|good\s+(morning|afternoon|evening)|hola)/i,
        /^(what\'s\s+up|how\s+are\s+you|howdy)/i
      ],
      goodbye: [
        /^(bye|goodbye|see\s+you|thanks?(\s+you)?|thank\s+you)/i,
        /^(that\'s\s+all|i\'m\s+done|no\s+more\s+questions)/i
      ],
      help: [
        /^(help|what\s+can\s+you\s+do|commands)/i,
        /^(how\s+do\s+i|what\s+are\s+my\s+options)/i
      ]
    };
    
    // Fallback responses
    this.fallbackResponses = [
      "I'm sorry, I couldn't find a specific answer to your question. Let me connect you with our support team, or you can try asking about:",
      "I don't have information about that specific topic yet. Here are some popular questions I can help with:",
      "I didn't quite understand that. Could you try rephrasing your question? Here are some topics I know about:"
    ];
    
    // Context memory for follow-up questions
    this.conversationContext = null;
  }
  
  /**
   * Process user message and generate appropriate response
   */
  async processMessage(userMessage) {
    try {
      this.dispatch(setTyping(true));
      
      // Add user message to conversation
      this.dispatch(addMessage({
        role: 'user',
        text: userMessage,
        timestamp: Date.now()
      }));
      
      // Small delay for natural feeling
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Detect intent
      const intent = this.detectIntent(userMessage);
      
      let response;
      switch (intent) {
        case 'greeting':
          response = this.handleGreeting();
          break;
        case 'goodbye':
          response = this.handleGoodbye();
          break;
        case 'help':
          response = this.handleHelp();
          break;
        default:
          response = await this.handleFAQQuery(userMessage);
      }
      
      // Add bot response to conversation
      this.dispatch(addMessage({
        role: 'bot',
        text: response.text,
        faqId: response.faqId || null,
        timestamp: Date.now()
      }));
      
      // Record FAQ match if applicable
      if (response.faqId) {
        this.dispatch(recordFAQMatch(response.faqId));
      }
      
    } catch (error) {
      console.error('Chatbot error:', error);
      this.dispatch(addMessage({
        role: 'bot',
        text: "I'm sorry, I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: Date.now()
      }));
    } finally {
      this.dispatch(setTyping(false));
    }
  }
  
  /**
   * Detect user intent from message
   */
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [intent, patterns] of Object.entries(this.intents)) {
      if (patterns.some(pattern => pattern.test(lowerMessage))) {
        return intent;
      }
    }
    
    return 'query';
  }
  
  /**
   * Handle greeting messages
   */
  handleGreeting() {
    const greetings = [
      "Hello! 👋 I'm your Garava assistant. I'm here to help you with questions about our jewelry, fragrances, shipping, and more. What would you like to know?",
      "Hi there! ✨ Welcome to Garava. I can help you find information about our products, orders, shipping, and policies. How can I assist you today?",
      "Hey! 💎 Great to see you at Garava. I'm here to answer your questions about our luxury jewelry and fragrances. What can I help you with?"
    ];
    
    return {
      text: greetings[Math.floor(Math.random() * greetings.length)]
    };
  }
  
  /**
   * Handle goodbye messages
   */
  handleGoodbye() {
    const goodbyes = [
      "Thank you for visiting Garava! Have a wonderful day! ✨",
      "Goodbye! Feel free to come back anytime if you have more questions. 💎",
      "Thanks for chatting with me! Enjoy exploring our beautiful collections! 🌟"
    ];
    
    return {
      text: goodbyes[Math.floor(Math.random() * goodbyes.length)]
    };
  }
  
  /**
   * Handle help requests
   */
  handleHelp() {
    return {
      text: `I can help you with information about:

🔹 **Products**: Jewelry collections, fragrances, materials, sizing
🔹 **Orders**: Order status, tracking, modifications
🔹 **Shipping**: Delivery times, costs, locations
🔹 **Returns**: Return policy, exchanges, refunds
🔹 **Care**: How to care for your jewelry and fragrances
🔹 **General**: Store information, appointments, contact details

Just ask me anything! For example: "How do I track my order?" or "What materials do you use?"`
    };
  }
  
  /**
   * Handle FAQ queries with intelligent matching
   */
  async handleFAQQuery(userMessage) {
    try {
      // Search for relevant FAQs
      const searchResult = await this.dispatch(searchFAQs({ 
        query: userMessage,
        category: null
      })).unwrap();
      
      const faqs = searchResult.data || [];
      
      if (faqs.length === 0) {
        return this.handleNoMatch();
      }
      
      // Get the best match
      const bestMatch = faqs[0];
      
      // If we have a really good match (would need scoring from backend)
      if (faqs.length === 1 || this.isHighConfidenceMatch(userMessage, bestMatch)) {
        return {
          text: this.formatFAQResponse(bestMatch),
          faqId: bestMatch._id
        };
      }
      
      // Multiple potential matches - present options
      if (faqs.length <= 3) {
        return {
          text: this.formatMultipleOptions(faqs),
          faqId: bestMatch._id
        };
      }
      
      // Too many matches - ask for clarification
      return this.handleTooManyMatches(faqs.slice(0, 3));
      
    } catch (error) {
      console.error('FAQ search error:', error);
      return this.handleNoMatch();
    }
  }
  
  /**
   * Check if we have a high confidence match
   */
  isHighConfidenceMatch(userMessage, faq) {
    const lowerMessage = userMessage.toLowerCase();
    const lowerQuestion = faq.question.toLowerCase();
    
    // If user message contains significant portion of the FAQ question
    const messageWords = lowerMessage.split(/\s+/);
    const questionWords = lowerQuestion.split(/\s+/);
    
    const matchingWords = messageWords.filter(word => 
      word.length > 3 && questionWords.some(qWord => 
        qWord.includes(word) || word.includes(qWord)
      )
    );
    
    return matchingWords.length >= Math.min(3, messageWords.length * 0.4);
  }
  
  /**
   * Format single FAQ response
   */
  formatFAQResponse(faq) {
    const response = faq.answer;
    
    // Add helpful follow-up
    const followUps = [
      "\n\nWas this helpful? Feel free to ask if you need more details! 😊",
      "\n\nI hope this answers your question! Let me know if you need anything else! ✨",
      "\n\nDoes this help? I'm here if you have any other questions! 💎"
    ];
    
    return response + followUps[Math.floor(Math.random() * followUps.length)];
  }
  
  /**
   * Format multiple options response
   */
  formatMultipleOptions(faqs) {
    let response = "I found a few topics that might help you:\n\n";
    
    faqs.forEach((faq, index) => {
      response += `${index + 1}. **${faq.question}**\n`;
      response += `   ${faq.answer.substring(0, 100)}${faq.answer.length > 100 ? '...' : ''}\n\n`;
    });
    
    response += "Would you like me to elaborate on any of these topics?";
    
    return response;
  }
  
  /**
   * Handle too many matches
   */
  handleTooManyMatches(topFaqs) {
    let response = "I found several topics related to your question. Could you be more specific? Here are some options:\n\n";
    
    topFaqs.forEach((faq, index) => {
      response += `• ${faq.question}\n`;
    });
    
    response += "\nJust let me know which one you're most interested in!";
    
    return { text: response };
  }
  
  /**
   * Handle no matches found
   */
  handleNoMatch() {
    const state = this.getState();
    const categories = state.faq.categories.items || [];
    
    let response = this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
    
    if (categories.length > 0) {
      response += "\n\n**Popular Topics:**\n";
      categories.slice(0, 4).forEach(cat => {
        const categoryName = cat.category.charAt(0).toUpperCase() + cat.category.slice(1);
        response += `• ${categoryName} (${cat.count} articles)\n`;
      });
    }
    
    response += "\n💬 You can also contact our support team for personalized help!";
    
    return { text: response };
  }
  
  /**
   * Get conversation summary for context
   */
  getConversationContext() {
    const state = this.getState();
    const messages = state.faq.conversation.messages || [];
    
    // Get last few messages for context
    return messages.slice(-6).map(msg => ({
      role: msg.role,
      text: msg.text.substring(0, 100)
    }));
  }
}