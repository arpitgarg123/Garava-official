// src/templates/emailTemplates.js

export const emailTemplates = {
  verifyEmail: (user, token) => {
    const url = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;
    return {
      subject: "Verify your email - Garava",
      html: `
        <h1>Welcome to Garava, ${user.name}!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${url}">${url}</a>
      `,
    };
  },
  resetPassword: (user, token) => {
    // 👉 Link to FRONTEND page so user can type a new password there:
    const url = `${process.env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;
    return {
      subject: "Reset your password - Garava",
      html: `
        <p>Hello ${user.name},</p>
        <p>Click the link below to reset your password (valid for 30 minutes):</p>
        <a href="${url}">${url}</a>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    };
  },
    /* ---- Appointments ---- */
  appointmentCreated: (appointment) => {
    return {
      subject: "Your appointment request has been received",
      html: `
        <p>Hi ${appointment.name},</p>
        <p>We received your appointment request for <strong>${appointment.serviceType}</strong> 
        at <strong>${new Date(appointment.appointmentAt).toLocaleString()}</strong>.</p>
        <p>We’ll confirm shortly. Thank you for choosing Garava.</p>
      `,
    };
  },

  appointmentStatusChanged: (appointment) => {
    return {
      subject: `Your appointment is now ${appointment.status}`,
      html: `
        <p>Hi ${appointment.name},</p>
        <p>Your appointment status has been updated to <strong>${appointment.status}</strong>.</p>
        <p>Scheduled time: <strong>${new Date(appointment.appointmentAt).toLocaleString()}</strong></p>
        <p>${appointment.adminNotes ? `<em>Note from admin: ${appointment.adminNotes}</em>` : ""}</p>
      `,
    };
  },

  appointmentCancelled: (appointment) => {
    return {
      subject: "Your appointment has been cancelled",
      html: `
        <p>Hi ${appointment.name},</p>
        <p>Your appointment on <strong>${new Date(appointment.appointmentAt).toLocaleString()}</strong> has been cancelled.</p>
        <p>If this was a mistake, please rebook via our website.</p>
      `,
    };
  },
  // ---- newsletter emails ----
  subscribedToNewsletter: (email) => {
    return {
      subject: "Welcome to Garava Newsletter",
      html: `
        <h2>Thanks for subscribing to Garava!</h2>
        <p>You’ll now receive updates about new fragrances, jewellery, and offers.</p>
        <p>If this wasn’t you, you can <a href="${process.env.CLIENT_URL}/unsubscribe?email=${encodeURIComponent(email)}">unsubscribe here</a>.</p>
      `
    }; 
  },
  // ---- contact form emails ----
contactConfirmation: ({ name, subject }) => {
  return {
    subject: "We received your message - Garava",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for contacting Garava!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message regarding "<strong>${subject}</strong>" and will get back to you within one business day.</p>
        <p>Our team typically responds quickly to inquiries about:</p>
        <ul>
          <li>Orders and shipping</li>
          <li>Ring sizing and customizations</li>
          <li>Product availability</li>
          <li>General support</li>
        </ul>
        <p>If your inquiry is urgent, you can also reach us via:</p>
        <ul>
          <li>Phone: (+91) 98765-43210</li>
          <li>WhatsApp: <a href="https://wa.me/919876543210">Chat now</a></li>
        </ul>
        <p>Thank you for choosing Garava.</p>
        <br>
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The Garava Team<br>
          <a href="${process.env.CLIENT_URL}" style="color: #333;">garava.in</a>
        </p>
      </div>
    `
  };
},
contactAdminNotification: ({ name, email, phone, subject, message, timestamp }) => {
  return {
    subject: `New Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Submitted:</strong> ${timestamp}</p>
        </div>
        <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #333;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #f0f8ff; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Quick Actions:</strong><br>
            • <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}">Reply to ${name}</a><br>
            ${phone ? `• <a href="tel:${phone}">Call ${name}</a><br>` : ''}
            • <a href="https://wa.me/${phone ? phone.replace(/[^0-9]/g, '') : '919876543210'}">WhatsApp ${name}</a>
          </p>
        </div>
      </div>
    `
  };
},

// ---- Order Emails ----
orderConfirmation: (order) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const itemsList = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.productSnapshot.name}</strong><br>
        <span style="color: #666; font-size: 13px;">SKU: ${item.variantSnapshot.sku}</span>
        ${item.variantSnapshot.sizeLabel ? `<br><span style="color: #666; font-size: 13px;">Size: ${item.variantSnapshot.sizeLabel}</span>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.unitPrice.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;"><strong>₹${item.lineTotal.toFixed(2)}</strong></td>
    </tr>
  `).join('');

  return {
    subject: `Order Confirmed #${order.orderNumber} - Garava`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Order #${order.orderNumber}</p>
        </div>

        <div style="padding: 25px 20px; background: #f8f9fa; border-bottom: 3px solid #667eea;">
          <div style="text-align: center;">
            <div style="display: inline-block; background: #ffffff; padding: 15px 30px; border-radius: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <span style="color: #667eea; font-weight: bold; font-size: 16px;">✓ Order ${order.status === 'pending_payment' ? 'Awaiting Payment' : 'Confirmed'}</span>
            </div>
          </div>
          <p style="text-align: center; color: #666; margin: 15px 0 0 0; font-size: 14px;">Placed on ${formattedDate}</p>
        </div>

        <div style="padding: 30px 20px;">
          <h2 style="color: #333; font-size: 20px; margin: 0 0 20px 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Order Items</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 12px; text-align: left; color: #666; font-weight: 600; font-size: 13px;">ITEM</th>
                <th style="padding: 12px; text-align: center; color: #666; font-weight: 600; font-size: 13px;">QTY</th>
                <th style="padding: 12px; text-align: right; color: #666; font-weight: 600; font-size: 13px;">PRICE</th>
                <th style="padding: 12px; text-align: right; color: #666; font-weight: 600; font-size: 13px;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <div style="padding: 8px 0; font-size: 14px;">
              <span style="color: #666; display: inline-block; width: 120px;">Subtotal:</span>
              <span style="color: #333;">₹${order.subtotal.toFixed(2)}</span>
            </div>
            ${order.shippingTotal > 0 ? `
              <div style="padding: 8px 0; font-size: 14px;">
                <span style="color: #666; display: inline-block; width: 120px;">Shipping:</span>
                <span style="color: #333;">₹${order.shippingTotal.toFixed(2)}</span>
              </div>
            ` : ''}
            ${order.codCharge > 0 ? `
              <div style="padding: 8px 0; font-size: 14px;">
                <span style="color: #666; display: inline-block; width: 120px;">COD Charges:</span>
                <span style="color: #333;">₹${order.codCharge.toFixed(2)}</span>
              </div>
            ` : ''}
            ${order.taxTotal > 0 ? `
              <div style="padding: 8px 0; font-size: 14px;">
                <span style="color: #666; display: inline-block; width: 120px;">Tax:</span>
                <span style="color: #333;">₹${order.taxTotal.toFixed(2)}</span>
              </div>
            ` : ''}
            ${order.discountTotal > 0 ? `
              <div style="padding: 8px 0; font-size: 14px; color: #28a745;">
                <span style="display: inline-block; width: 120px;">Discount:</span>
                <span>-₹${order.discountTotal.toFixed(2)}</span>
              </div>
            ` : ''}
            <div style="border-top: 2px solid #ddd; margin-top: 10px; padding-top: 10px;"></div>
            <div style="padding: 8px 0; font-size: 18px; font-weight: bold;">
              <span style="color: #333; display: inline-block; width: 120px;">Total:</span>
              <span style="color: #667eea;">₹${order.grandTotal.toFixed(2)}</span>
            </div>
            <div style="text-align: right; color: #666; font-size: 13px; margin-top: 5px;">
              Payment Method: ${order.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </div>
          </div>

          <div style="margin-top: 30px;">
            <h3 style="color: #333; font-size: 16px; margin: 0 0 15px 0;">Shipping Address</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="margin: 0; line-height: 1.6; color: #333;">
                <strong>${order.shippingAddressSnapshot.fullName}</strong><br>
                ${order.shippingAddressSnapshot.addressLine1}<br>
                ${order.shippingAddressSnapshot.addressLine2 ? `${order.shippingAddressSnapshot.addressLine2}<br>` : ''}
                ${order.shippingAddressSnapshot.city}, ${order.shippingAddressSnapshot.state} - ${order.shippingAddressSnapshot.postalCode}<br>
                ${order.shippingAddressSnapshot.country}<br>
                Phone: ${order.shippingAddressSnapshot.phone}
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/account/orders/${order._id}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 25px; font-weight: bold; font-size: 16px;">
              Track Your Order
            </a>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #fffbf0; border-radius: 8px; border: 1px solid #ffe58f;">
            <p style="margin: 0 0 10px 0; color: #333; font-weight: 600;">Need Help?</p>
            <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
              If you have any questions about your order, please contact us:<br>
              📧 Email: <a href="mailto:${process.env.EMAIL_FROM}" style="color: #667eea;">${process.env.EMAIL_FROM}</a>
            </p>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
            Thank you for shopping with Garava! ✨
          </p>
          <p style="margin: 0; color: #999; font-size: 12px;">
            <a href="${process.env.CLIENT_URL}" style="color: #667eea; text-decoration: none;">Visit our store</a> | 
            <a href="${process.env.CLIENT_URL}/account/orders" style="color: #667eea; text-decoration: none;">My Orders</a> | 
            <a href="${process.env.CLIENT_URL}/contact" style="color: #667eea; text-decoration: none;">Contact Us</a>
          </p>
        </div>
      </div>
    `
  };
},

orderStatusUpdate: (order, previousStatus) => {
  const statusMessages = {
    processing: { title: 'Order is Being Processed', message: 'Your order is now being prepared for shipment.' },
    shipped: { title: 'Order Shipped!', message: 'Your order is on its way to you!' },
    out_for_delivery: { title: 'Out for Delivery', message: 'Your order will be delivered today!' },
    delivered: { title: 'Order Delivered', message: 'Your order has been delivered successfully!' },
    cancelled: { title: 'Order Cancelled', message: 'Your order has been cancelled.' },
    failed: { title: 'Order Failed', message: 'There was an issue with your order.' },
  };

  const statusInfo = statusMessages[order.status] || { title: 'Order Status Updated', message: 'Your order status has been updated.' };

  return {
    subject: `${statusInfo.title} - Order #${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px;">${statusInfo.title}</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Order #${order.orderNumber}</p>
        </div>

        <div style="padding: 30px 20px; text-align: center;">
          <div style="display: inline-block; background: #f0f7ff; padding: 20px 30px; border-radius: 10px; margin-bottom: 20px;">
            <p style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">${statusInfo.message}</p>
          </div>

          ${order.tracking && order.tracking.trackingNumber ? `
            <div style="background: #fffbf0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #666; font-weight: 600;">Tracking Information</p>
              <p style="margin: 0; color: #333; font-size: 16px;">
                <strong>Tracking Number:</strong> ${order.tracking.trackingNumber}
              </p>
              ${order.tracking.courier ? `<p style="margin: 5px 0 0 0; color: #666;">Courier: ${order.tracking.courier}</p>` : ''}
              ${order.tracking.trackingUrl ? `
                <p style="margin: 15px 0 0 0;">
                  <a href="${order.tracking.trackingUrl}" style="color: #667eea; text-decoration: none; font-weight: 600;">
                    Track Package →
                  </a>
                </p>
              ` : ''}
            </div>
          ` : ''}

          <div style="margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/account/orders/${order._id}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 25px; font-weight: bold; font-size: 16px;">
              View Order Details
            </a>
          </div>

          <div style="margin-top: 30px; text-align: left; background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Order Summary</h3>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">Items: ${order.items.length}</p>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">Total: ₹${order.grandTotal.toFixed(2)}</p>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">Payment: ${order.payment.method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</p>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
            Need help? Contact us at <a href="mailto:${process.env.EMAIL_FROM}" style="color: #667eea;">${process.env.EMAIL_FROM}</a>
          </p>
          <p style="margin: 0; color: #999; font-size: 12px;">
            © ${new Date().getFullYear()} Garava. All rights reserved.
          </p>
        </div>
      </div>
    `
  };
},

orderCancelled: (order, reason) => {
  return {
    subject: `Order Cancelled - #${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #dc3545; padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px;">Order Cancelled</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Order #${order.orderNumber}</p>
        </div>

        <div style="padding: 30px 20px;">
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Your order has been cancelled${reason ? `: ${reason}` : '.'}
          </p>

          ${order.payment && order.payment.status === 'paid' ? `
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #155724; font-weight: 600;">💰 Refund Information</p>
              <p style="margin: 10px 0 0 0; color: #155724; font-size: 14px;">
                Your refund of ₹${order.grandTotal.toFixed(2)} will be processed within 5-7 business days.
              </p>
            </div>
          ` : ''}

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Cancelled Order Details</h3>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">Items: ${order.items.length}</p>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">Amount: ₹${order.grandTotal.toFixed(2)}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/products" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 25px; font-weight: bold; font-size: 16px;">
              Continue Shopping
            </a>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
            Questions? Contact us at <a href="mailto:${process.env.EMAIL_FROM}" style="color: #667eea;">${process.env.EMAIL_FROM}</a>
          </p>
        </div>
      </div>
    `
  };
}

};
 