import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const productSchema = new mongoose.Schema({}, { collection: 'products', strict: false });
const Product = mongoose.model('Product', productSchema);

async function checkProductStructure() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const products = await Product.find({}).limit(5).lean();
    
    console.log('Sample Product Structure:\n');
    products.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name}`);
      console.log(`   Fields: ${Object.keys(p).join(', ')}\n`);
      if (index === 0) {
        console.log('   Full structure:');
        console.log(JSON.stringify(p, null, 2).substring(0, 1000));
        console.log('\n...\n');
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkProductStructure();
