import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  answer: {
    type: String,
    required: true,
    trim: true,
    maxLength: 2000
  },
  keywords: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  category: {
    type: String,
    enum: ['general', 'products', 'shipping', 'returns', 'care', 'sizing', 'materials', 'orders'],
    default: 'general'
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  // For tracking FAQ effectiveness
  timesMatched: {
    type: Number,
    default: 0
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  unhelpfulVotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better search performance
faqSchema.index({ keywords: 1 });
faqSchema.index({ category: 1, isActive: 1 });
faqSchema.index({ priority: -1 });
faqSchema.index({ question: 'text', answer: 'text', keywords: 'text' });

// Virtual for relevance score (can be enhanced)
faqSchema.virtual('relevanceScore').get(function() {
  return this.priority + (this.timesMatched * 0.1);
});

// Instance method to increment match count
faqSchema.methods.incrementMatch = function() {
  this.timesMatched += 1;
  return this.save();
};

// Static method to search FAQs
faqSchema.statics.searchFAQs = async function(query, options = {}) {
  const {
    category = null,
    limit = 5,
    minScore = 0
  } = options;

  // Build search pipeline
  const pipeline = [
    // Match active FAQs
    {
      $match: {
        isActive: true,
        ...(category && { category })
      }
    }
  ];

  if (query && query.trim()) {
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
    
    // Add text search stage
    pipeline.push({
      $addFields: {
        score: {
          $add: [
            // Keyword matches (highest priority)
            {
              $multiply: [
                {
                  $size: {
                    $setIntersection: [
                      '$keywords',
                      searchTerms
                    ]
                  }
                },
                10
              ]
            },
            // Question title matches
            {
              $multiply: [
                {
                  $cond: [
                    { $regexMatch: { input: '$question', regex: query, options: 'i' } },
                    5,
                    0
                  ]
                },
                1
              ]
            },
            // Answer content matches
            {
              $multiply: [
                {
                  $cond: [
                    { $regexMatch: { input: '$answer', regex: query, options: 'i' } },
                    2,
                    0
                  ]
                },
                1
              ]
            },
            // Priority boost
            '$priority'
          ]
        }
      }
    });

    // Filter by minimum score
    pipeline.push({
      $match: {
        score: { $gte: minScore }
      }
    });

    // Sort by score and priority
    pipeline.push({
      $sort: {
        score: -1,
        priority: -1,
        timesMatched: -1
      }
    });
  } else {
    // No search query, just sort by priority
    pipeline.push({
      $sort: {
        priority: -1,
        timesMatched: -1
      }
    });
  }

  // Limit results
  pipeline.push({ $limit: limit });

  return this.aggregate(pipeline);
};

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;