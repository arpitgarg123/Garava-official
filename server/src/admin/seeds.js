import connectDb from '../shared/db.js';
import User from '../modules/user/user.model.js';
import { logger } from '../shared/logger.js';
import { env } from '../config/env.js';
import { seedFAQs } from './faqSeeds.js';
import dotenv from 'dotenv';
dotenv.config();
 
const admin = async () => {
  await connectDb();

  const exist = await User.findOne({ email: env.ADMIN_EMAIL });
  if (exist) {
    logger.info('Admin already exists');
  } else {
    const admin = new User({
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      role: 'admin',
    });
    await admin.save();
    logger.info('Admin user created successfully');
  }

  // Seed FAQs
  try {
    await seedFAQs();
    logger.info('FAQ seeding completed successfully');
  } catch (error) {
    logger.error('FAQ seeding failed:', error);
  }

  process.exit(0);
};
admin();
