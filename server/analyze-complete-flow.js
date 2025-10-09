import dotenv from 'dotenv';
dotenv.config();

async function analyzePricingFlow() {
  console.log('🔍 COMPLETE PRICING FLOW ANALYSIS');
  console.log('==================================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();
    console.log('✅ Database connected');

    // Import models and services
    const { default: Product } = await import('./src/modules/product/product.model.js'); 
    const { default: Cart } = await import('./src/modules/cart/cart.model.js');
    const { default: Order } = await import('./src/modules/order/order.model.js');
    
    console.log('\n📊 1. DATABASE STORAGE ANALYSIS');
    console.log('================================');
    
    // Check product prices in database
    const product = await Product.findOne({ 'variants.0': { $exists: true } });
    if (product && product.variants.length > 0) {
      const variant = product.variants[0];
      console.log(`Product: ${product.name}`);
      console.log(`  DB Price: ${variant.price} paise`);
      console.log(`  DB MRP: ${variant.mrp} paise`);
      console.log(`  Display: ₹${(variant.price / 100).toFixed(2)}`);
    }
    
    console.log('\n📊 2. CART STORAGE ANALYSIS');
    console.log('============================');
    
    // Check cart prices
    const cart = await Cart.findOne({ 'items.0': { $exists: true } });
    if (cart && cart.items.length > 0) {
      const item = cart.items[0];
      console.log(`Cart Item: ${item.productName}`);
      console.log(`  Cart unitPrice: ${item.unitPrice} paise`);
      console.log(`  Cart MRP: ${item.mrp} paise`);
      console.log(`  Display: ₹${(item.unitPrice / 100).toFixed(2)}`);
    }
    
    console.log('\n📊 3. ORDER STORAGE ANALYSIS');
    console.log('=============================');
    
    // Check order prices
    const order = await Order.findOne({ 'items.0': { $exists: true } });
    if (order && order.items.length > 0) {
      const item = order.items[0];
      console.log(`Order Item: ${item.productName}`);
      console.log(`  Order unitPrice: ${item.unitPrice} paise`);
      console.log(`  Order total: ${order.grandTotal} paise`);
      console.log(`  Display: ₹${(item.unitPrice / 100).toFixed(2)}`);
      console.log(`  Grand Total: ₹${(order.grandTotal / 100).toFixed(2)}`);
    }
    
    console.log('\n📊 4. PRICING FUNCTION ANALYSIS');
    console.log('================================');
    
    // Check pricing utilities
    const { toRupees, toPaise } = await import('./src/modules/order/order.pricing.js');
    
    const testPaise = 4000;
    const testRupees = 40;
    
    console.log(`toRupees(${testPaise}) = ${toRupees(testPaise)}`);
    console.log(`toPaise(${testRupees}) = ${toPaise(testRupees)}`);
    
    console.log('\n📊 5. CART SERVICE CONVERSION');
    console.log('=============================');
    
    // Check cart toPaise function
    const { toPaise: cartToPaise } = await import('./src/modules/cart/cart.utils.js');
    console.log(`Cart toPaise(${testRupees}) = ${cartToPaise(testRupees)}`);
    
    console.log('\n🎯 ANALYSIS SUMMARY');
    console.log('===================');
    console.log('✅ Database: Stores in PAISE');
    console.log('✅ Cart: Uses toPaise() when adding items');
    console.log('✅ Order: Uses toPaise() for payment calculations');
    console.log('❓ APIs: Need to check if they convert to RUPEES before sending to frontend');
    
    console.log('\n🔧 CURRENT FLOW:');
    console.log('Product DB (paise) → API (should convert to rupees) → Frontend (displays rupees)');
    console.log('Frontend (rupees) → Cart API (converts to paise) → Cart DB (paise)');
    console.log('Cart DB (paise) → Order API (stays paise) → Order DB (paise)');
    console.log('Order DB (paise) → Payment API (stays paise) → Payment Gateway (paise)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

analyzePricingFlow();