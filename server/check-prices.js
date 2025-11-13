import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function checkPrices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get sample products with variant prices (only those with actual prices set)
    const products = await mongoose.connection.db.collection('products').aggregate([
      { $unwind: '$variants' },
      { $match: { 
        'variants.price': { $exists: true, $ne: null, $gt: 0 }
      }},
      { $project: {
          productName: '$name',
          variantSku: '$variants.sku',
          price: '$variants.price',
          mrp: '$variants.mrp',
          stock: '$variants.stock',
          isPriceOnDemand: '$variants.isPriceOnDemand'
      }},
      { $limit: 20 }
    ]).toArray();
    
    console.log('\n📊 SAMPLE PRODUCT PRICES FROM DATABASE:');
    console.log('='.repeat(80));
    
    products.forEach((p, idx) => {
      console.log(`\n${idx + 1}. ${p.productName}`);
      console.log(`   SKU: ${p.variantSku}`);
      console.log(`   Price (raw): ${p.price}`);
      console.log(`   MRP (raw): ${p.mrp || 'N/A'}`);
      console.log(`   Stock: ${p.stock}`);
      
      // Analysis
      if (p.price > 1000) {
        console.log(`   💡 Analysis: Likely PAISE (₹${(p.price / 100).toFixed(2)})`);
      } else {
        console.log(`   💡 Analysis: Likely RUPEES (₹${p.price})`);
      }
    });
    
    // Statistics
    const allPrices = products.map(p => p.price).filter(p => p > 0);
    const avgPrice = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;
    const pricesAbove1000 = allPrices.filter(p => p > 1000).length;
    const pricesBelow1000 = allPrices.filter(p => p <= 1000).length;
    
    console.log('\n\n📈 STATISTICS:');
    console.log('='.repeat(80));
    console.log(`Total samples: ${allPrices.length}`);
    console.log(`Average price: ${avgPrice.toFixed(2)}`);
    console.log(`Prices > 1000 (likely paise): ${pricesAbove1000}`);
    console.log(`Prices ≤ 1000 (likely rupees): ${pricesBelow1000}`);
    
    console.log('\n\n🎯 CONCLUSION:');
    console.log('='.repeat(80));
    if (pricesAbove1000 > pricesBelow1000) {
      console.log('✅ Prices appear to be stored in PAISE');
      console.log('   Example: 5000 in DB = ₹50.00');
    } else {
      console.log('⚠️  Prices appear to be stored in RUPEES');
      console.log('   Example: 50 in DB = ₹50.00');
    }
    
    // Check one cart for comparison
    const cart = await mongoose.connection.db.collection('carts').findOne();
    if (cart && cart.items && cart.items.length > 0) {
      console.log('\n\n🛒 CART SAMPLE (for comparison):');
      console.log('='.repeat(80));
      console.log(`Cart Total Amount: ${cart.totalAmount}`);
      cart.items.slice(0, 3).forEach((item, idx) => {
        console.log(`\n${idx + 1}. Product: ${item.product}`);
        console.log(`   Variant SKU: ${item.variantSku}`);
        console.log(`   Unit Price: ${item.unitPrice}`);
        console.log(`   Quantity: ${item.quantity}`);
        console.log(`   Line Total: ${item.unitPrice * item.quantity}`);
      });
    }
    
    // Check one order for comparison
    const order = await mongoose.connection.db.collection('orders').findOne();
    if (order) {
      console.log('\n\n📦 ORDER SAMPLE (for comparison):');
      console.log('='.repeat(80));
      console.log(`Order Number: ${order.orderNumber}`);
      console.log(`Subtotal: ${order.subtotal}`);
      console.log(`Grand Total: ${order.grandTotal}`);
      console.log(`Currency: ${order.currency}`);
      if (order.items && order.items.length > 0) {
        order.items.slice(0, 2).forEach((item, idx) => {
          console.log(`\n${idx + 1}. Product: ${item.productSnapshot?.name}`);
          console.log(`   Unit Price: ${item.unitPrice}`);
          console.log(`   Quantity: ${item.quantity}`);
          console.log(`   Line Total: ${item.lineTotal}`);
        });
      }
    }
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkPrices();
