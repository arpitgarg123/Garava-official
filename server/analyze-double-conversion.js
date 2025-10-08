// Test to identify the double conversion issue
// Import the backend conversion functions
import { toRupees, toPaise } from './src/modules/order/order.pricing.js'

console.log('=== Backend Double Conversion Analysis ===\n')

// Test scenarios based on our database analysis
const databaseValues = {
  'Order 1 grandTotal': 13018,  // Database shows this value
  'Order 2 grandTotal': 37000, // Database shows this value  
  'Order 3 grandTotal': 999,   // Database shows this value
  'Order 4 grandTotal': 3999   // Database shows this value
}

console.log('Database values (what we found in check-order-pricing.js):')
Object.entries(databaseValues).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`)
})

console.log('\n=== Testing toRupees() function ===')
console.log('If database stores RUPEES but toRupees() treats them as PAISE:')
Object.entries(databaseValues).forEach(([key, value]) => {
  const result = toRupees(value)
  console.log(`  ${key}: ${value} → toRupees() → ${result}`)
  if (value === 13018) {
    console.log(`    💡 ${value} should display as ₹13,018 but shows as ₹${result}`)
  }
})

console.log('\n=== Problem Identification ===')
console.log('1. Database stores: 13018 (meaning ₹13,018 in rupees)')
console.log('2. Backend applies: toRupees(13018) = 13018/100 = 130.18')
console.log('3. Frontend displays: ₹130.18')
console.log('4. Expected display: ₹13,018')

console.log('\n=== Solution Options ===')
console.log('Option 1: Database actually stores paise → Fix database schema')
console.log('Option 2: Database stores rupees → Remove toRupees() conversion')
console.log('Option 3: Check order creation logic to see intended format')

// Test what happens if we don't convert
console.log('\n=== Without Conversion (formatCurrency only) ===')
Object.entries(databaseValues).forEach(([key, value]) => {
  // Simulate frontend formatCurrency that just formats without conversion
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
  
  console.log(`  ${key}: ${value} → Direct format → ${formatted}`)
})

console.log('\n=== Recommendation ===')
console.log('Based on database values (13018, 37000, 999, 3999):')
console.log('- These look like RUPEES amounts (₹13,018, ₹37,000, ₹999, ₹3,999)')
console.log('- NOT paise amounts (₹130.18, ₹370, ₹9.99, ₹39.99)')
console.log('- Remove toRupees() conversion in convertOrderPricing function')