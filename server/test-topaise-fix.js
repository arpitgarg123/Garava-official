import dotenv from "dotenv";
dotenv.config();

// Test the fixed toPaise function
const toPaise = (amount) => {
  if (amount == null) return 0;
  return Math.round(Number(amount) * 100);
};

console.log("✅ TESTING FIXED toPaise() FUNCTION\n");
console.log("=".repeat(60));

const testCases = [
  { rupees: 300, expectedPaise: 30000, product: "Sayonee 10ml" },
  { rupees: 370, expectedPaise: 37000, product: "Sayonee 10ml + delivery + COD" },
  { rupees: 1000, expectedPaise: 100000, product: "Travel Set" },
  { rupees: 1500, expectedPaise: 150000, product: "Sila 50ml" },
  { rupees: 1009, expectedPaise: 100900, product: "Sample order from DB" },
  { rupees: 2100, expectedPaise: 210000, product: "Gift Set" },
  { rupees: 50.50, expectedPaise: 5050, product: "Decimal test" },
];

testCases.forEach(test => {
  const result = toPaise(test.rupees);
  const isCorrect = result === test.expectedPaise;
  const status = isCorrect ? "✅" : "❌";
  
  console.log(`\n${status} ${test.product}`);
  console.log(`   Rupees: ₹${test.rupees}`);
  console.log(`   Expected Paise: ${test.expectedPaise}`);
  console.log(`   Got Paise: ${result}`);
  console.log(`   PhonePe will charge: ₹${(result / 100).toFixed(2)}`);
  
  if (!isCorrect) {
    console.log(`   ❌ ERROR: Expected ${test.expectedPaise} but got ${result}`);
  }
});

console.log("\n" + "=".repeat(60));
console.log("\n🎯 SUMMARY:");
const allPassed = testCases.every(test => toPaise(test.rupees) === test.expectedPaise);
if (allPassed) {
  console.log("✅ All test cases PASSED! PhonePe will receive correct amounts.");
} else {
  console.log("❌ Some test cases FAILED!");
}
