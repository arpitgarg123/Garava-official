// Check what news events data exists in the database
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Import the model schema (simplified version)
const imageSchema = new mongoose.Schema(
  {
    url: String,
    fileId: String,
    alt: String,
  },
  { _id: false }
);

const newseventsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String },
    cover: imageSchema,
    type: { 
      type: String, 
      enum: ["event", "media-coverage"], 
      required: true, 
      index: true 
    },
    kind: { 
      type: String, 
      enum: ["Event", "News"], 
      required: function() { return this.type === 'event'; }
    },
    date: { type: Date, required: true, index: true },
    city: { type: String },
    location: { type: String },
    rsvpUrl: { type: String },
    outlet: { 
      type: String, 
      required: function() { return this.type === 'media-coverage'; }
    },
    url: { 
      type: String, 
      required: function() { return this.type === 'media-coverage'; }
    },
    status: { 
      type: String, 
      enum: ["draft", "published", "archived"], 
      default: "draft", 
      index: true 
    },
    isActive: { type: Boolean, default: true, index: true },
    publishAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const NewsEvent = mongoose.model("NewsEvent", newseventsSchema);

async function checkData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check total count
    const totalCount = await NewsEvent.countDocuments({});
    console.log(`\n📊 Total news events in database: ${totalCount}`);

    if (totalCount === 0) {
      console.log("❌ No data found in database");
      process.exit(0);
    }

    // Check all data
    const allData = await NewsEvent.find({}).select("title type kind status isActive publishAt date").lean();
    
    console.log("\n📋 All data in database:");
    allData.forEach((item, index) => {
      console.log(`${index + 1}. Title: "${item.title}"`);
      console.log(`   Type: ${item.type}`);
      console.log(`   Kind: ${item.kind || 'N/A'}`);
      console.log(`   Status: ${item.status}`);
      console.log(`   isActive: ${item.isActive}`);
      console.log(`   publishAt: ${item.publishAt || 'null'}`);
      console.log(`   date: ${item.date}`);
      console.log("   ---");
    });

    // Check public filter criteria
    const now = new Date();
    const publicEvents = await NewsEvent.find({
      isActive: true,
      status: "published",
      type: "event",
      $or: [{ publishAt: null }, { publishAt: { $lte: now } }],
    }).countDocuments();

    const publicMedia = await NewsEvent.find({
      isActive: true,
      status: "published", 
      type: "media-coverage",
      $or: [{ publishAt: null }, { publishAt: { $lte: now } }],
    }).countDocuments();

    console.log(`\n🔍 Public filter results:`);
    console.log(`   Events (public criteria): ${publicEvents}`);
    console.log(`   Media Coverage (public criteria): ${publicMedia}`);

    // Check by status
    const statusCounts = await NewsEvent.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    console.log(`\n📈 Count by status:`);
    statusCounts.forEach(item => {
      console.log(`   ${item._id}: ${item.count}`);
    });

    // Check by type
    const typeCounts = await NewsEvent.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    console.log(`\n📈 Count by type:`);
    typeCounts.forEach(item => {
      console.log(`   ${item._id}: ${item.count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkData();