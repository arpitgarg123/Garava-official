import mongoose from 'mongoose';

async function checkDatabases() {
  try {
    await mongoose.connect('mongodb://localhost:27017/garava');
    console.log('Connected to MongoDB\n');

    const admin = mongoose.connection.db.admin();
    const { databases } = await admin.listDatabases();
    
    console.log('Available databases:');
    databases.forEach(db => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabases();
