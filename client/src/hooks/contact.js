export  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in the high jewellery piece: ${product.name}. Could you please provide the pricing details?`
    );
    const phoneNumber = "919876543210"; // Replace with your actual WhatsApp number
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setShowContactOptions(false);
  };

 export const handleEmailContact = () => {
    const subject = encodeURIComponent(`Inquiry about High Jewellery: ${product.name}`);
    const body = encodeURIComponent(
      `Hello,\n\nI'm interested in the high jewellery piece: ${product.name}.\n\nCould you please provide the pricing details and availability?\n\nThank you.`
    );
    window.open(`mailto:info@garava.com?subject=${subject}&body=${body}`, '_blank'); // Replace with your email
    setShowContactOptions(false);
  };