import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

async function testPaymentFlow() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get a real order to test
    const order = await mongoose.connection.db.collection("orders").findOne({
      "payment.method": "phonepe"
    });

    if (order) {
      console.log("📦 ORDER FOUND:");
      console.log("Order Number:", order.orderNumber);
      console.log("Subtotal (as stored):", order.subtotal);
      console.log("Grand Total (as stored):", order.grandTotal);
      console.log("Currency:", order.currency);
      console.log("\n");

      // Simulate toPaise conversion (FIXED VERSION)
      const toPaise = (amount) => {
        if (amount == null) return 0;
        // Always convert rupees to paise
        return Math.round(Number(amount) * 100);
      };

      const amountPaise = toPaise(order.grandTotal);
      
      console.log("💰 PHONEPE CALCULATION (FIXED):");
      console.log("Input: order.grandTotal =", order.grandTotal, "rupees");
      console.log("\nConversion Logic (FIXED):");
      console.log("  → Always converts to paise:", order.grandTotal, "* 100 =", order.grandTotal * 100);
      console.log("\nFinal amountPaise sent to PhonePe:", amountPaise);
      console.log("PhonePe will charge: ₹" + (amountPaise / 100).toFixed(2));
      console.log("Expected charge: ₹" + order.grandTotal.toFixed(2));
      console.log("\n");
      
      if (amountPaise !== order.grandTotal * 100) {
        console.log("❌ MISMATCH DETECTED!");
        console.log("Expected:", order.grandTotal * 100, "paise");
        console.log("Got:", amountPaise, "paise");
        console.log("\n🔍 ROOT CAUSE:");
        console.log("Order.grandTotal is stored as RUPEES:", order.grandTotal);
        console.log("But toPaise() thinks values > 1000 are already PAISE");
        console.log("Since", order.grandTotal, "> 1000, it returns as-is without conversion");
      } else {
        console.log("✅ Calculation is correct!");
      }
    }

    // Check cart item pricing for comparison
    const cart = await mongoose.connection.db.collection("carts").findOne();
    if (cart && cart.items && cart.items.length > 0) {
      console.log("\n🛒 CART COMPARISON:");
      const item = cart.items[0];
      console.log("Cart item unitPrice:", item.unitPrice, "(stored as PAISE)");
      console.log("Order stores prices as:", order.items[0]?.unitPrice, "(RUPEES)");
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testPaymentFlow();
