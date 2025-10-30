// Migration script to drop old postId index from Instagram posts collection
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropPostIdIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('instagramposts');

    // List existing indexes
    console.log('\n📋 Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    // Drop the postId_1 index if it exists
    try {
      await collection.dropIndex('postId_1');
      console.log('\n✅ Successfully dropped postId_1 index');
    } catch (error) {
      if (error.code === 27 || error.message.includes('index not found')) {
        console.log('\n⚠️  postId_1 index does not exist (already removed)');
      } else {
        throw error;
      }
    }

    // List indexes after removal
    console.log('\n📋 Remaining indexes:');
    const remainingIndexes = await collection.indexes();
    remainingIndexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

dropPostIdIndex();
