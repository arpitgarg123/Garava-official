# Customer Management Feature - Quick Testing Guide

## 🚀 Quick Start Testing (5 Minutes)

### Prerequisites
- Backend server running on port 5000
- Frontend dev server running (or production build)
- Admin user logged in
- At least 1 user with orders in database

---

## 📋 Test Scenarios

### 1. Basic Functionality Test (2 minutes)

#### Step 1: Access Customers Tab
```bash
1. Login to admin dashboard
2. Look for "Customers" tab (between "Bookings" and "Reviews")
3. Click on "Customers" tab
```

**Expected Result**: 
- Statistics cards display with numbers
- Customer list appears below
- No console errors

---

#### Step 2: Verify Statistics Cards
```bash
Check 4 cards at the top:
- Total Customers (blue)
- New This Month (green)
- Active Customers (purple)
- Newsletter Subscribers (orange)
```

**Expected Result**:
- All cards show numbers (even if 0)
- Icons display correctly
- Colors match description

---

#### Step 3: Test Search
```bash
1. Type a customer name in search box
2. Click search button (or press Enter)
```

**Expected Result**:
- Customer list filters to matching results
- "No customers found" message if no matches
- Search persists on pagination

---

#### Step 4: Test Filters
```bash
1. Select "1-5 orders" from Order Filter dropdown
2. Click search button
```

**Expected Result**:
- Only customers with 1-5 orders appear
- Filter can be combined with search

```bash
1. Select "Subscribed" from Newsletter Filter
2. Click search button
```

**Expected Result**:
- Only newsletter subscribers appear

---

#### Step 5: Test CSV Export
```bash
1. Click "Export CSV" button
```

**Expected Result**:
- CSV file downloads automatically
- Filename: `customers_YYYY-MM-DD.csv`
- File opens in Excel/Google Sheets
- 9 columns present: Name, Email, Phone, Total Orders, Total Spent, Last Order Date, Registration Date, Newsletter Subscriber, Verified

---

#### Step 6: Test Pagination
```bash
1. If more than 20 customers exist, click "Next" button
```

**Expected Result**:
- Next page of customers loads
- Page number updates
- "Previous" button becomes active

---

### 2. Responsive Design Test (1 minute)

#### Desktop View (> 1024px)
```bash
1. View on desktop browser (full width)
```

**Expected Result**:
- Table layout with 7 columns
- All data visible without scrolling horizontally
- Statistics cards in 4-column grid

---

#### Mobile View (< 768px)
```bash
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 Pro or similar
```

**Expected Result**:
- Statistics cards stack vertically (2 per row)
- Customer list shows cards instead of table
- Each card shows: name, email, phone, orders, spent
- Mobile filter panel slides in from bottom

---

### 3. Error Handling Test (1 minute)

#### Test Empty State
```bash
1. Search for non-existent customer (e.g., "zzzzz")
2. Click search
```

**Expected Result**:
- "No customers found" message displays
- Statistics cards still visible
- No console errors

---

#### Test Network Error
```bash
1. Stop backend server
2. Refresh Customers tab
```

**Expected Result**:
- Error message displays
- Loading spinner stops
- No app crash

---

### 4. Security Test (1 minute)

#### Test Admin-Only Access
```bash
1. Logout from admin account
2. Login as regular user (non-admin)
3. Try to access /admin/customers endpoint directly via browser console:

fetch('/api/admin/customers', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(res => res.json())
.then(console.log)
```

**Expected Result**:
- 403 Forbidden error
- Message: "Admin access required" or similar

---

## 🔍 Detailed Test Cases

### TC-01: Customer List Display
**Precondition**: Database has at least 5 customers with orders

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Customers tab | List displays with up to 20 customers |
| 2 | Check customer data | Name, email, phone visible |
| 3 | Check order data | Total orders count visible |
| 4 | Check spending data | Total spent amount in ₹ visible |
| 5 | Check dates | Last order date and registration date formatted |

---

### TC-02: Search Functionality
**Precondition**: Customer "John Doe" exists with email "john@example.com"

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type "john" in search box | No action yet |
| 2 | Click search button | Only "John Doe" appears |
| 3 | Clear search | All customers reappear |
| 4 | Type "john@example.com" | No action yet |
| 5 | Click search | Only "John Doe" appears |
| 6 | Type "+1234567890" (John's phone) | No action yet |
| 7 | Click search | Only "John Doe" appears |

---

### TC-03: Order Count Filter
**Precondition**: Customers exist with varying order counts

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select "0 orders" from dropdown | |
| 2 | Click search | Only customers with 0 orders appear |
| 3 | Select "1-5 orders" | |
| 4 | Click search | Only customers with 1-5 orders appear |
| 5 | Select "6-10 orders" | |
| 6 | Click search | Only customers with 6-10 orders appear |
| 7 | Select "11+ orders" | |
| 8 | Click search | Only customers with 11+ orders appear |
| 9 | Select "All orders" | |
| 10 | Click search | All customers appear |

---

### TC-04: Newsletter Filter
**Precondition**: Some customers subscribed to newsletter, some not

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select "Subscribed" from dropdown | |
| 2 | Click search | Only newsletter subscribers appear |
| 3 | Verify badge | Green "Newsletter" badge visible |
| 4 | Select "Not Subscribed" | |
| 5 | Click search | Only non-subscribers appear |
| 6 | Verify no badge | No "Newsletter" badge visible |
| 7 | Select "All" | |
| 8 | Click search | All customers appear |

---

### TC-05: Combined Filters
**Precondition**: Diverse customer data exists

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Type "a" in search (common letter) | Multiple results |
| 2 | Select "1-5 orders" | |
| 3 | Select "Subscribed" | |
| 4 | Click search | Only matching customers appear |
| 5 | Click "Clear Filters" | All filters reset |
| 6 | Verify | All customers reappear |

---

### TC-06: CSV Export Content
**Precondition**: At least 2 customers with different data

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Export CSV" | File downloads |
| 2 | Open CSV in Excel | 9 columns visible |
| 3 | Check header row | Name,Email,Phone,Total Orders,Total Spent (₹),Last Order Date,Registration Date,Newsletter Subscriber,Verified |
| 4 | Check data row 1 | All fields populated correctly |
| 5 | Check currency format | Spending amount has 2 decimal places |
| 6 | Check date format | Dates in MM/DD/YYYY format |
| 7 | Check boolean values | "Yes" or "No" (not true/false) |
| 8 | Check special characters | Commas in names/emails escaped properly |

---

### TC-07: Pagination
**Precondition**: More than 20 customers exist in database

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Customers tab | Page 1 shows first 20 customers |
| 2 | Check pagination controls | "Page 1 of X" visible |
| 3 | Check Previous button | Disabled on page 1 |
| 4 | Click Next button | Page 2 loads |
| 5 | Verify URL/state | Page number updated to 2 |
| 6 | Check Previous button | Now enabled |
| 7 | Click Previous | Back to page 1 |
| 8 | Apply filter (e.g., "1-5 orders") | |
| 9 | Click search | Pagination resets to page 1 |
| 10 | Verify | Only filtered results with pagination |

---

### TC-08: Mobile Responsive Cards
**Precondition**: View on mobile device or DevTools mobile view

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open Customers tab on mobile | Cards layout (not table) |
| 2 | Check card components | Name, email, phone, orders, spent visible |
| 3 | Check avatar | Blue circle with user icon |
| 4 | Check badges | Newsletter/verified badges if applicable |
| 5 | Scroll cards | Smooth scrolling |
| 6 | Click filter icon | Mobile filter panel slides up |
| 7 | Apply filter | Panel closes, results update |
| 8 | Check statistics cards | 2 per row on mobile |

---

### TC-09: Loading States
**Precondition**: Network throttling enabled (Chrome DevTools > Network > Fast 3G)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Customers tab | Loading spinner appears |
| 2 | Wait for data load | Spinner disappears, data appears |
| 3 | Click search with filter | Loading state shows briefly |
| 4 | Change page | Loading state shows briefly |

---

### TC-10: Statistics Accuracy
**Precondition**: Known customer counts in database

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Count total customers in DB | Note count (e.g., 50) |
| 2 | Check "Total Customers" card | Matches DB count |
| 3 | Count customers created this month | Note count (e.g., 5) |
| 4 | Check "New This Month" card | Matches count |
| 5 | Count customers with orders in last 30d | Note count (e.g., 20) |
| 6 | Check "Active Customers" card | Matches count |
| 7 | Count newsletter subscribers | Note count (e.g., 35) |
| 8 | Check "Newsletter Subscribers" card | Matches count |

---

## 🐛 Common Issues & Solutions

### Issue 1: "Customers tab not visible"
**Cause**: Redux store not configured
**Solution**:
```bash
1. Check client/src/app/store.js
2. Verify customerAdminReducer imported
3. Verify customerAdmin added to rootReducer
4. Restart dev server: npm run dev
```

---

### Issue 2: "Statistics showing 0"
**Cause**: Backend aggregation issue or no data
**Solution**:
```bash
1. Check MongoDB has customer data
2. Test API directly: curl http://localhost:5000/api/admin/customers/stats
3. Check server logs: pm2 logs garava-backend
4. Verify date calculations in user.admin.service.js
```

---

### Issue 3: "CSV export empty"
**Cause**: No customers in current view or filter
**Solution**:
```bash
1. Clear all filters
2. Verify customer list has data
3. Check browser console for errors
4. Test with at least 1 customer visible
```

---

### Issue 4: "Search not working"
**Cause**: Backend query parameter not parsed
**Solution**:
```bash
1. Open Network tab in DevTools
2. Click search and check request URL
3. Verify query parameter "q" is present
4. Check server logs for MongoDB query errors
```

---

### Issue 5: "Mobile view broken"
**Cause**: CSS not loading or breakpoint issue
**Solution**:
```bash
1. Hard refresh: Ctrl+Shift+R
2. Check Tailwind CSS classes in Customers.jsx
3. Verify responsive classes: hidden md:block, block md:hidden
4. Test different screen widths
```

---

## 📊 Performance Benchmarks

### Expected Load Times
| Action | Expected Time | Acceptable Range |
|--------|---------------|------------------|
| Initial load | < 1 second | 0.5s - 2s |
| Search | < 500ms | 200ms - 1s |
| Filter apply | < 500ms | 200ms - 1s |
| Pagination | < 500ms | 200ms - 1s |
| CSV export | < 1 second | 0.5s - 2s |
| Stats refresh | < 1 second | 0.5s - 2s |

---

## ✅ Testing Sign-Off

### Tester Information
- **Tester Name**: _________________
- **Date Tested**: _________________
- **Environment**: [ ] Local Dev [ ] Staging [ ] Production
- **Device**: [ ] Desktop [ ] Tablet [ ] Mobile

### Test Results
- [ ] All basic functionality tests passed
- [ ] Responsive design tests passed
- [ ] Error handling tests passed
- [ ] Security tests passed
- [ ] CSV export format correct
- [ ] No console errors
- [ ] Performance acceptable

### Issues Found
| Issue # | Description | Severity | Status |
|---------|-------------|----------|--------|
| 1 | | [ ] High [ ] Medium [ ] Low | [ ] Open [ ] Fixed |
| 2 | | [ ] High [ ] Medium [ ] Low | [ ] Open [ ] Fixed |
| 3 | | [ ] High [ ] Medium [ ] Low | [ ] Open [ ] Fixed |

### Approval
- [ ] **APPROVED FOR DEPLOYMENT**
- [ ] **REQUIRES FIXES BEFORE DEPLOYMENT**

**Notes**: _______________________________________________

---

**Document Version**: 1.0
**Last Updated**: November 20, 2024
