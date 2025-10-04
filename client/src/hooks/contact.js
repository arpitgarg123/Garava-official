import { toast } from "react-hot-toast";

export const handleEmailContact = (product, setShowContactOptions, customMessage = null) => {
  const defaultMessage = customMessage || 
    `Hello,\n\nI'm interested in the high jewellery piece: ${product.name}.\n\nCould you please provide the pricing details and availability?\n\nThank you.`;
  
  // FIXED: Directly use default message without user input
  const subject = encodeURIComponent(`Inquiry about High Jewellery: ${product.name}`);
  const body = encodeURIComponent(defaultMessage);
  const emailUrl = `mailto:info@garava.com?subject=${subject}&body=${body}`;
  
  console.log('Opening Email URL:', emailUrl);
  
  try {
    const opened = window.open(emailUrl, '_blank');
    if (!opened) {
      throw new Error('Email client not available');
    }
    toast.success("Opening email client...");
  } catch (error) {
    console.error('Error opening email client:', error);
    
    // Enhanced fallback with default message
    navigator.clipboard.writeText(`Subject: Inquiry about High Jewellery: ${product.name}\n\n${defaultMessage}`).then(() => {
      toast.success("Email content copied to clipboard!");
      alert(`Email client couldn't open automatically.\nEmail content has been copied to clipboard.\n\nPlease send manually to: info@garava.com`);
    }).catch(() => {
      toast.error("Please send email manually");
      alert(`Please send an email to: info@garava.com\nSubject: Inquiry about High Jewellery: ${product.name}\nMessage: ${defaultMessage}`);
    });
  }
  
  if (setShowContactOptions) setShowContactOptions(false);
};

export const handleWhatsAppContact = (product, setShowContactOptions, customMessage = null) => {
  // Default ya custom message
  const defaultMessage = customMessage || 
    `Hi, I'm interested in the high jewellery piece: ${product.name}. Could you please provide the pricing details?`;

  // Encode message taaki WhatsApp URL me special characters issue na kare
  const encodedMessage = encodeURIComponent(defaultMessage);

  // WhatsApp number (country code ke sath, bina + ke)
  const phoneNumber = "917738543881";

  // WhatsApp URL (recommended way)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  // Alternate: `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`

  try {
    const opened = window.open(whatsappUrl, "_blank");
    if (!opened) throw new Error("Popup blocked");
  } catch (error) {
    console.error("Error opening WhatsApp:", error);

    // Fallback: message clipboard me copy kar do
    navigator.clipboard.writeText(defaultMessage).then(() => {
      alert(`WhatsApp couldn't open automatically.\nMessage copied to clipboard.\nPaste it manually in WhatsApp: +91 77385 43881`);
    });
  }

  if (setShowContactOptions) setShowContactOptions(false);
};
