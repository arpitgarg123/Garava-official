// Fix publishAt dates to make items visible on public pages
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

async function fixPublishDates() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Update all items to have null publishAt (immediate publication)
    const result = await NewsEvent.updateMany(
      {}, // Update all documents
      { $unset: { publishAt: "" } } // Remove publishAt field (sets to null)
    );

    console.log(`✅ Updated ${result.modifiedCount} items`);
    console.log("📅 All items now have null publishAt dates (immediately published)");

    // Verify the fix
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

    console.log(`\n🎉 After fix - Public filter results:`);
    console.log(`   Events (public criteria): ${publicEvents}`);
    console.log(`   Media Coverage (public criteria): ${publicMedia}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixPublishDates();