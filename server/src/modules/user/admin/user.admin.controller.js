import * as service from "./user.admin.service.js";

/**
 * GET /api/admin/customers
 * List all customers with pagination and filters
 */
export const listCustomersAdmin = async (req, res, next) => {
  try {
    const { page, limit, search, orderCountMin, orderCountMax, newsletter } = req.query;
    
    const result = await service.listCustomersAdminService({
      page,
      limit,
      search,
      orderCountMin,
      orderCountMax,
      newsletter
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/customers/stats
 * Get customer statistics
 */
export const getCustomerStats = async (req, res, next) => {
  try {
    const stats = await service.getCustomerStatsService();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/customers/:id
 * Get single customer details
 */
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await service.getCustomerByIdAdminService(req.params.id);
    res.json({
      success: true,
      customer
    });
  } catch (error) {
    next(error);
  }
};
