# Order Email Testing Guide

## Quick Test Scenarios

### 1. Test Order Confirmation Email

**Steps**:
1. Create a new order through the frontend (either COD or online payment)
2. Check the user's email inbox

**Expected Result**:
- Email received with subject: "Order Confirmed #ORD-XXXXXXXXXX - Garava"
- Email contains complete order details, items, pricing, and shipping address
- "Track Your Order" button works and links to frontend

**What to Check**:
- ✅ Order number matches
- ✅ All items listed correctly
- ✅ Prices display in rupees (₹)
- ✅ Shipping address is correct
- ✅ Payment method shows correctly
- ✅ No formatting issues

---

### 2. Test Order Status Update Email

**Steps**:
1. Login to admin panel
2. Navigate to Orders section
3. Select an order and change status to "Shipped"
4. Add tracking information (optional):
   - Tracking Number: TEST123456
   - Courier: BlueDart
   - Tracking URL: https://example.com/track/TEST123456
5. Save changes
6. Check customer's email

**Expected Result**:
- Email received with subject: "Order Shipped! - Order #ORD-XXXXXXXXXX"
- Email shows shipping message
- Tracking information displayed (if provided)
- "View Order Details" button works

**Test All Statuses**:
- [ ] Processing
- [ ] Shipped (with tracking)
- [ ] Shipped (without tracking)
- [ ] Out for Delivery
- [ ] Delivered
- [ ] Failed

---

### 3. Test Order Cancellation Email

**Steps**:
1. Login to admin panel
2. Select an order
3. Change status to "Cancelled"
4. Check customer's email

**Expected Result**:
- Email received with subject: "Order Cancelled - #ORD-XXXXXXXXXX"
- Shows cancellation message
- If order was paid, shows refund information
- "Continue Shopping" button works

---

### 4. Test Refund Email

**Steps**:
1. Login to admin panel
2. Select a paid order
3. Initiate refund with reason: "Product out of stock"
4. Check customer's email

**Expected Result**:
- Email received about cancellation/refund
- Refund reason displayed
- Refund amount and timeline shown

---

### 5. Test Email Failure Resilience

**Steps**:
1. Temporarily break email configuration (wrong SMTP password)
2. Create a new order
3. Check backend logs
4. Verify order still created successfully

**Expected Result**:
- Error logged to console: "Failed to send order confirmation email"
- Order creation succeeds
- No error shown to user
- Frontend receives success response

---

## Email Client Compatibility Testing

### Test in Multiple Clients
- [ ] Gmail (web)
- [ ] Gmail (mobile app)
- [ ] Outlook (web)
- [ ] Outlook (desktop)
- [ ] Apple Mail
- [ ] Yahoo Mail
- [ ] Mobile email apps

### What to Check
- Email renders correctly
- No broken layout
- Links are clickable
- Buttons work
- Images load (if any)
- Text is readable
- No horizontal scrolling

---

## Console Logs to Monitor

When testing, check server console for:

```
✅ Success:
(No email logs means success - emails send silently)

❌ Errors (should not break operations):
Failed to send order confirmation email for order ORD-XXXXXXXXXX: [error details]
Failed to send order status update email for order ORD-XXXXXXXXXX: [error details]
Failed to send refund email: [error details]
```

---

## Quick Email Content Verification

### Order Confirmation Email Checklist
- [ ] Subject line includes order number
- [ ] Header shows "Thank You for Your Order!"
- [ ] Order status shows correctly (Awaiting Payment or Confirmed)
- [ ] Order date formatted correctly
- [ ] Items table displays all products
- [ ] SKUs shown for each item
- [ ] Quantities correct
- [ ] Unit prices in rupees
- [ ] Line totals calculated correctly
- [ ] Subtotal matches
- [ ] Shipping charges shown (if applicable)
- [ ] COD charges shown (if COD order)
- [ ] Tax shown (if applicable)
- [ ] Discount shown (if applicable)
- [ ] Grand total highlighted in purple
- [ ] Payment method correct
- [ ] Shipping address complete
- [ ] Track Order button visible
- [ ] Support contact info shown
- [ ] Footer links work

### Status Update Email Checklist
- [ ] Subject matches status
- [ ] Status message appropriate
- [ ] Tracking info shown (when available)
- [ ] Tracking number copyable
- [ ] Courier name shown
- [ ] Track Package link works (if URL provided)
- [ ] Order summary accurate
- [ ] View Order Details button works

### Cancellation Email Checklist
- [ ] Subject shows "Order Cancelled"
- [ ] Reason displayed (if provided)
- [ ] Refund info shown for paid orders
- [ ] Refund amount correct
- [ ] Refund timeline mentioned
- [ ] Order details summary present
- [ ] Continue Shopping button works

---

## Testing with Real Orders

### Test Order 1: COD Order
```javascript
{
  items: 1-2 products,
  paymentMethod: "cod",
  shippingAddress: Valid address,
  expectedEmails: [
    "Order Confirmation (status: processing)"
  ]
}
```

### Test Order 2: Online Payment Order
```javascript
{
  items: 2-3 products,
  paymentMethod: "online",
  shippingAddress: Valid address,
  expectedEmails: [
    "Order Confirmation (status: pending_payment)",
    "Status Update (when payment confirmed)"
  ]
}
```

### Test Order 3: Order with Discount
```javascript
{
  items: 2 products,
  couponCode: "SAVE10",
  paymentMethod: "cod",
  expectedEmails: [
    "Order Confirmation (shows discount line)"
  ]
}
```

---

## Common Issues & Fixes

### Email Not Received
1. Check spam/junk folder
2. Verify SMTP credentials in `.env`
3. Check server console for errors
4. Verify `EMAIL_FROM` matches SMTP account
5. Test with `server/test-email.js` script

### Broken Links in Email
1. Verify `CLIENT_URL` in `.env` is correct
2. Check frontend routes exist:
   - `/account/orders/:id`
   - `/account/orders`
   - `/products`
   - `/contact`

### Formatting Issues
1. Email clients have varying CSS support
2. All styles are inline for compatibility
3. Test in problematic client
4. Adjust template if needed

### Missing Order Data
1. Ensure order includes all snapshots
2. Check user is populated before sending
3. Verify order.toObject() works correctly
4. Check for undefined fields in template

---

## Production Monitoring

### Metrics to Track
- Email delivery rate
- Email open rate (if tracking added)
- Link click rate
- Customer support inquiries about orders (should decrease)
- Email bounce rate

### Regular Checks
- Monitor SMTP service health
- Check email sending logs
- Review customer feedback
- Verify email content stays current

---

## Emergency Rollback

If emails cause issues:

1. **Quick Disable**: Comment out email sending lines
```javascript
// try {
//   await sendOrderConfirmationEmail(orderWithUser);
// } catch (emailError) {
//   console.error('Failed to send order confirmation email:', emailError);
// }
```

2. **Test Fix**: Fix issue in development
3. **Redeploy**: Deploy corrected version
4. **Monitor**: Watch for successful email delivery

---

## Success Criteria

✅ **Email system is working correctly when**:
- All order confirmation emails send successfully
- Status update emails trigger on admin changes
- Cancellation/refund emails deliver properly
- No orders fail due to email errors
- Customers receive professional, accurate emails
- Email content displays correctly across clients
- All links in emails work
- Email delivery doesn't slow down order operations

---

**Testing Date**: _______________
**Tested By**: _______________
**Status**: ⬜ Pending | ⬜ In Progress | ⬜ Passed | ⬜ Failed
**Notes**: _____________________________________________________
