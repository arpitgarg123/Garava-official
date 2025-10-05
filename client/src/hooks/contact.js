import { toast } from "react-hot-toast";

export const handleWhatsAppContact = (product, setShowContactOptions, customMessage = null) => {
  const defaultMessage = customMessage || 
    `Hi, I'm interested in the high jewellery piece: ${product.name}. Could you please provide the pricing details?`;
  
  const encodedMessage = encodeURIComponent(defaultMessage);
  const phoneNumber = "917738543881";
  
  // Multiple WhatsApp URL formats for better compatibility
  const whatsappUrls = [
    `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
    `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`,
    `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`
  ];
  
  console.log('Attempting to open WhatsApp with message:', defaultMessage);
  
  let success = false;
  
  // Try each URL format
  for (let i = 0; i < whatsappUrls.length && !success; i++) {
    try {
      console.log(`Trying WhatsApp URL ${i + 1}:`, whatsappUrls[i]);
      
      // Use location.href for better compatibility instead of window.open
      if (i === 0) {
        // First attempt: direct navigation
        window.location.href = whatsappUrls[i];
        success = true;
        toast.success("Opening WhatsApp...");
        break;
      } else {
        // Fallback attempts: window.open
        const opened = window.open(whatsappUrls[i], '_blank');
        if (opened) {
          success = true;
          toast.success("Opening WhatsApp...");
          break;
        }
      }
    } catch (error) {
      console.error(`WhatsApp URL ${i + 1} failed:`, error);
    }
  }
  
  // If all methods fail, provide fallback
  if (!success) {
    console.warn('All WhatsApp methods failed, using fallback');
    
    // Copy message to clipboard
    navigator.clipboard.writeText(defaultMessage).then(() => {
      toast.success("Message copied to clipboard!");
      alert(`WhatsApp couldn't open automatically.\n\nYour message has been copied to clipboard:\n"${defaultMessage}"\n\nPlease open WhatsApp manually and paste this message to: +91 77385 43881`);
    }).catch(() => {
      toast.error("Please contact us manually on WhatsApp");
      alert(`Please contact us on WhatsApp: +91 77385 43881\n\nMessage: ${defaultMessage}`);
    });
  }
  
  if (setShowContactOptions) setShowContactOptions(false);
};

export const handleEmailContact = (product, setShowContactOptions, customMessage = null) => {
  const defaultMessage = customMessage || 
    `Hello,\n\nI'm interested in the high jewellery piece: ${product.name}.\n\nCould you please provide the pricing details and availability?\n\nThank you.`;
  
  const subject = encodeURIComponent(`Inquiry about High Jewellery: ${product.name}`);
  const body = encodeURIComponent(defaultMessage);
  
  // Multiple email opening methods
  const emailUrls = [
    `mailto:info@garava.com?subject=${subject}&body=${body}`,
    `mailto:info@garava.com?subject=${subject}`,
    `mailto:info@garava.com`
  ];
  
  console.log('Attempting to open email client');
  
  let success = false;
  
  // Try each email method
  for (let i = 0; i < emailUrls.length && !success; i++) {
    try {
      console.log(`Trying email method ${i + 1}:`, emailUrls[i]);
      
      if (i === 0) {
        // First attempt: direct navigation with full content
        window.location.href = emailUrls[i];
        success = true;
        toast.success("Opening email client...");
        break;
      } else {
        // Fallback attempts: window.open
        const opened = window.open(emailUrls[i], '_blank');
        if (opened) {
          success = true;
          toast.success("Opening email client...");
          break;
        }
      }
    } catch (error) {
      console.error(`Email method ${i + 1} failed:`, error);
    }
  }
  
  // If email client doesn't open, provide fallback
  if (!success) {
    console.warn('Email client failed to open, using fallback');
    
    const emailContent = `To: info@garava.com\nSubject: Inquiry about High Jewellery: ${product.name}\n\nMessage:\n${defaultMessage}`;
    
    navigator.clipboard.writeText(emailContent).then(() => {
      toast.success("Email content copied to clipboard!");
      alert(`Email client couldn't open automatically.\n\nEmail content has been copied to clipboard:\n\n${emailContent}\n\nPlease paste it in your email client or send manually to: info@garava.com`);
    }).catch(() => {
      toast.error("Please send email manually");
      alert(`Please send an email to: info@garava.com\n\nSubject: Inquiry about High Jewellery: ${product.name}\n\nMessage: ${defaultMessage}`);
    });
  }
  
  if (setShowContactOptions) setShowContactOptions(false);
};

// Enhanced alternative function with better mobile detection
export const handleWhatsAppContactMobile = (product, setShowContactOptions, customMessage = null) => {
  const defaultMessage = customMessage || 
    `Hi, I'm interested in the high jewellery piece: ${product.name}. Could you please provide the pricing details?`;
  
  const encodedMessage = encodeURIComponent(defaultMessage);
  const phoneNumber = "917738543881";
  
  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  let whatsappUrl;
  
  if (isMobile) {
    // Mobile: Use app scheme first, then web fallback
    whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
  } else {
    // Desktop: Use web version
    whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }
  
  console.log('Device type:', isMobile ? 'Mobile' : 'Desktop');
  console.log('Using WhatsApp URL:', whatsappUrl);
  
  try {
    if (isMobile) {
      // On mobile, try app first
      window.location.href = whatsappUrl;
      
      // Fallback to web version after short delay if app doesn't open
      setTimeout(() => {
        const webUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(webUrl, '_blank');
      }, 2000);
    } else {
      // On desktop, open in new tab
      const opened = window.open(whatsappUrl, '_blank');
      if (!opened) {
        throw new Error('Popup blocked');
      }
    }
    
    toast.success("Opening WhatsApp...");
  } catch (error) {
    console.error('WhatsApp failed to open:', error);
    
    // Fallback
    navigator.clipboard.writeText(defaultMessage).then(() => {
      toast.success("Message copied to clipboard!");
      alert(`WhatsApp couldn't open automatically.\n\nMessage copied: "${defaultMessage}"\n\nPlease paste it manually in WhatsApp to: +91 77385 43881`);
    }).catch(() => {
      toast.error("Please contact us manually");
      alert(`Please contact us on WhatsApp: +91 77385 43881\nMessage: ${defaultMessage}`);
    });
  }
  
  if (setShowContactOptions) setShowContactOptions(false);
};

// Utility function for testing different contact methods
export const testContactMethods = () => {
  console.log('Testing contact methods...');
  
  // Test WhatsApp
  const testProduct = { name: 'Test Product' };
  console.log('Testing WhatsApp...');
  handleWhatsAppContact(testProduct, () => {}, 'Test message for WhatsApp');
  
  // Test Email
  setTimeout(() => {
    console.log('Testing Email...');
    handleEmailContact(testProduct, () => {}, 'Test message for Email');
  }, 3000);
};

// Export the enhanced mobile function as default WhatsApp handler
export { handleWhatsAppContactMobile as handleWhatsAppContactEnhanced };