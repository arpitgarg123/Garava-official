import FAQ from './faq.model.js';

// Get all FAQs for chatbot (only active ones)
export const getChatbotFAQsService = async (query = '', category = null) => {
  try {
    const faqs = await FAQ.searchFAQs(query, {
      category,
      limit: 10,
      minScore: query ? 1 : 0
    });

    return {
      faqs,
      total: faqs.length
    };
  } catch (error) {
    throw new Error(`Failed to search FAQs: ${error.message}`);
  }
};

// Get all FAQs for admin
export const getAllFAQsService = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      category = null,
      isActive = null,
      search = ''
    } = filters;

    const query = {};
    
    if (category) query.category = category;
    if (isActive !== null) query.isActive = isActive;
    
    // Text search if provided
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [faqs, total] = await Promise.all([
      FAQ.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      FAQ.countDocuments(query)
    ]);

    return {
      faqs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    };
  } catch (error) {
    throw new Error(`Failed to get FAQs: ${error.message}`);
  }
};

// Create FAQ
export const createFAQService = async (faqData) => {
  try {
    // Process keywords: extract from question/answer if not provided
    if (!faqData.keywords || faqData.keywords.length === 0) {
      const text = `${faqData.question} ${faqData.answer}`.toLowerCase();
      const extractedKeywords = extractKeywords(text);
      faqData.keywords = extractedKeywords;
    }

    const faq = new FAQ(faqData);
    await faq.save();
    
    return faq;
  } catch (error) {
    throw new Error(`Failed to create FAQ: ${error.message}`);
  }
};

// Update FAQ
export const updateFAQService = async (id, updateData) => {
  try {
    // Re-process keywords if question or answer changed
    if (updateData.question || updateData.answer) {
      const faq = await FAQ.findById(id);
      if (!faq) {
        throw new Error('FAQ not found');
      }
      
      const question = updateData.question || faq.question;
      const answer = updateData.answer || faq.answer;
      const text = `${question} ${answer}`.toLowerCase();
      
      if (!updateData.keywords || updateData.keywords.length === 0) {
        updateData.keywords = extractKeywords(text);
      }
    }

    const faq = await FAQ.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!faq) {
      throw new Error('FAQ not found');
    }

    return faq;
  } catch (error) {
    throw new Error(`Failed to update FAQ: ${error.message}`);
  }
};

// Delete FAQ
export const deleteFAQService = async (id) => {
  try {
    const faq = await FAQ.findByIdAndDelete(id);
    
    if (!faq) {
      throw new Error('FAQ not found');
    }

    return { message: 'FAQ deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete FAQ: ${error.message}`);
  }
};

// Get FAQ by ID
export const getFAQByIdService = async (id) => {
  try {
    const faq = await FAQ.findById(id);
    
    if (!faq) {
      throw new Error('FAQ not found');
    }

    return faq;
  } catch (error) {
    throw new Error(`Failed to get FAQ: ${error.message}`);
  }
};

// Record FAQ match (for analytics)
export const recordFAQMatchService = async (id) => {
  try {
    const faq = await FAQ.findById(id);
    
    if (faq) {
      await faq.incrementMatch();
    }
    
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to record FAQ match: ${error.message}`);
  }
};

// Vote on FAQ helpfulness
export const voteFAQService = async (id, isHelpful) => {
  try {
    const updateField = isHelpful ? 'helpfulVotes' : 'unhelpfulVotes';
    
    const faq = await FAQ.findByIdAndUpdate(
      id,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!faq) {
      throw new Error('FAQ not found');
    }

    return faq;
  } catch (error) {
    throw new Error(`Failed to vote on FAQ: ${error.message}`);
  }
};

// Get FAQ categories with counts
export const getFAQCategoriesService = async () => {
  try {
    const categories = await FAQ.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return categories.map(cat => ({
      category: cat._id,
      count: cat.count
    }));
  } catch (error) {
    throw new Error(`Failed to get FAQ categories: ${error.message}`);
  }
};

// Get FAQ analytics
export const getFAQAnalyticsService = async () => {
  try {
    const [
      totalStats,
      categoryStats,
      topMatched,
      helpfulnessStats
    ] = await Promise.all([
      // Total counts
      FAQ.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: ['$isActive', 1, 0] } },
            inactive: { $sum: { $cond: ['$isActive', 0, 1] } },
            totalMatches: { $sum: '$timesMatched' },
            totalHelpful: { $sum: '$helpfulVotes' },
            totalUnhelpful: { $sum: '$unhelpfulVotes' }
          }
        }
      ]),
      
      // Category breakdown
      FAQ.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            matches: { $sum: '$timesMatched' },
            helpful: { $sum: '$helpfulVotes' }
          }
        },
        { $sort: { count: -1 } }
      ]),
      
      // Most matched FAQs
      FAQ.find({ timesMatched: { $gt: 0 } })
        .sort({ timesMatched: -1 })
        .limit(10)
        .select('question timesMatched helpfulVotes unhelpfulVotes'),
      
      // Helpfulness stats
      FAQ.aggregate([
        {
          $match: {
            $or: [
              { helpfulVotes: { $gt: 0 } },
              { unhelpfulVotes: { $gt: 0 } }
            ]
          }
        },
        {
          $group: {
            _id: null,
            avgHelpful: { $avg: '$helpfulVotes' },
            avgUnhelpful: { $avg: '$unhelpfulVotes' },
            totalWithVotes: { $sum: 1 }
          }
        }
      ])
    ]);

    return {
      totals: totalStats[0] || {
        total: 0,
        active: 0,
        inactive: 0,
        totalMatches: 0,
        totalHelpful: 0,
        totalUnhelpful: 0
      },
      categories: categoryStats,
      topMatched,
      helpfulness: helpfulnessStats[0] || {
        avgHelpful: 0,
        avgUnhelpful: 0,
        totalWithVotes: 0
      }
    };
  } catch (error) {
    throw new Error(`Failed to get FAQ analytics: ${error.message}`);
  }
};

// Utility function to extract keywords from text
function extractKeywords(text) {
  // Remove common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'what', 'when', 'where',
    'why', 'how', 'who', 'which', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their'
  ]);

  return text
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter((word, index, array) => array.indexOf(word) === index) // Remove duplicates
    .slice(0, 20); // Limit to 20 keywords
}