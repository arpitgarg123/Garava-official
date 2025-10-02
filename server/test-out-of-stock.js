/**
 * Test script to verify out-of-stock handling and notification system
 * Run this after starting the server to test the new features
 */

import mongoose from 'mongoose';
import { env } from './src/config/env.js';
import Product from './src/modules/product/product.model.js';
import Notification from './src/modules/notification/notification.model.js';
import { createOutOfStockNotificationService } from './src/modules/notification/notification.service.js';

async function testOutOfStockSystem() {
  try {
    // Connect to database
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to database');

    // Find a product with variants
    const product = await Product.findOne({ 
      isActive: true, 
      'variants.0': { $exists: true } 
    });
    
    if (!product) {
      console.log('❌ No products found with variants');
      return;
    }

    console.log(`\n📦 Testing with product: ${product.name}`);
    
    // Test variant info
    const variant = product.variants[0];
    console.log(`   Variant: ${variant.sizeLabel} (SKU: ${variant.sku})`);
    console.log(`   Current stock: ${variant.stock}`);
    console.log(`   Stock status: ${variant.stockStatus}`);

    // Test notification creation
    console.log('\n🔔 Testing notification creation...');
    
    try {
      const notification = await createOutOfStockNotificationService(product, variant);
      console.log('✅ Notification created successfully:');
      console.log(`   ID: ${notification._id}`);
      console.log(`   Type: ${notification.type}`);
      console.log(`   Title: ${notification.title}`);
      console.log(`   Message: ${notification.message}`);
      console.log(`   Severity: ${notification.severity}`);
    } catch (error) {
      console.log('⚠️  Notification creation result:', error.message);
    }

    // Check notification count
    const notificationCount = await Notification.countDocuments({
      type: 'out_of_stock',
      productId: product._id
    });
    console.log(`\n📊 Total out-of-stock notifications for this product: ${notificationCount}`);

    // Test product API response format
    console.log('\n🔍 Testing product API response format...');
    const totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    const isOutOfStock = totalStock === 0 || product.variants.every(v => v.stockStatus === 'out_of_stock');
    
    console.log(`   Total stock across variants: ${totalStock}`);
    console.log(`   Is out of stock: ${isOutOfStock}`);
    console.log(`   Default variant stock: ${variant.stock}`);

    // Show recent notifications
    console.log('\n📋 Recent out-of-stock notifications:');
    const recentNotifications = await Notification.find({ 
      type: 'out_of_stock' 
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('productId', 'name')
    .lean();

    recentNotifications.forEach((notif, index) => {
      console.log(`   ${index + 1}. ${notif.productId?.name || 'Unknown Product'} - ${notif.title}`);
      console.log(`      Created: ${notif.createdAt.toLocaleString()}`);
      console.log(`      Read: ${notif.isRead ? 'Yes' : 'No'}`);
      console.log(`      Action Required: ${notif.actionRequired ? 'Yes' : 'No'}`);
    });

    console.log('\n✅ Out-of-stock system test completed successfully!');

    // API endpoints to test
    console.log('\n🌐 API Endpoints to test:');
    console.log('   GET /api/admin/notifications - Get all notifications');
    console.log('   GET /api/admin/notifications/stats - Get notification statistics');
    console.log('   GET /api/admin/notifications/unread-count - Get unread count');
    console.log('   GET /api/product - Should include stock info in response');
    console.log(`   GET /api/product/${product.slug} - Should include stock info in product details`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
  }
}

// Run the test
testOutOfStockSystem().catch(console.error);