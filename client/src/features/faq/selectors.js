// src/features/faq/selectors.js
export const selectFAQSearchResults = (state) => state.faq.searchResults;
export const selectFAQCategories = (state) => state.faq.categories;
export const selectConversation = (state) => state.faq.conversation;

// Derived selectors
export const selectIsSearching = (state) => state.faq.searchResults.status === 'loading';
export const selectHasSearchResults = (state) => state.faq.searchResults.faqs.length > 0;
export const selectIsTyping = (state) => state.faq.conversation.isTyping;
export const selectMessages = (state) => state.faq.conversation.messages;
export const selectCurrentContext = (state) => state.faq.conversation.currentContext;