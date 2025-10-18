import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { setFilters, fetchProducts, clearFilters } from "../../features/product/slice";
import SideBar from "../../components/Products/SideBar";
import PageHeader from "../../components/header/PageHeader";
import BackButton from "../../components/BackButton";
import { BiFilterAlt, BiX } from "react-icons/bi";
import Pagination from "../../components/Pagination";
import { buildFilterParams } from "../../shared/utils/filterUtils";
import fBanner  from '../../assets/images/f-banner.jpg'
import jBanner  from '../../assets/images/j-banner.jpg'
import all  from '../../assets/images/allproduct.webp'
import mobileFraganceBanner  from '../../assets/images/display-banner1.jpg'
import mobileJewellryBanner  from '../../assets/images/display-banner.jpg'
import mobileallProdsBanner  from '../../assets/images/mobAllProductsBanner.webp'

import { useToastContext } from "../../layouts/Toast";
import ProductCard from "../../components/Products/ProductCard";

const ProductPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { category: routeCategory } = useParams();
  const { list, filters } = useSelector((s) => s.product);
  const { items, status, error, total } = list;
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [pendingMobileFilters, setPendingMobileFilters] = useState(null);
const [hasInitialLoad, setHasInitialLoad] = useState(false);
const [previousStatus, setPreviousStatus] = useState(null);
const toast = useToastContext();

  const searchParams = new URLSearchParams(location.search);
  const subcategoryFromUrl = searchParams.get('subcategory');
  const categoryFromUrl = searchParams.get('category'); // Add support for navbar query params

  const PRODUCTS_PER_PAGE = 6;

  // Category Banner Configuration
  const getCategoryBanner = () => {
    const lower = routeCategory?.toLowerCase();
    
    const banners = {
      'jewellery': {
      
      desktop: jBanner,
        mobile: mobileJewellryBanner,
      },
      'high-jewellery': {
        desktop: jBanner,
        mobile: mobileJewellryBanner,
      },
      'fragrance': {
        desktop: fBanner,
        mobile: mobileFraganceBanner,
      },
      'all': {
        desktop: all,
        mobile: mobileallProdsBanner,
      }
    };

    return banners[lower] || banners['all'];
  };
 useEffect(() => {
    // Skip notifications on initial load
    if (!hasInitialLoad) {
      if (status !== 'loading') {
        setHasInitialLoad(true);
      }
      return;
    }

    // Handle status transitions with toast notifications
    if (previousStatus !== status) {
      switch (status) {
        case 'succeeded':
          if (previousStatus === 'loading') {
            if (items.length === 0) {
              toast.info(
                'No products match your current filters. Try adjusting your criteria.',
                'No Results Found'
                 );
            } else {
              const productText = items.length === 1 ? 'product' : 'products';
              toast.success(
                `Found ${items.length} ${productText} in ${getPageHeading().toLowerCase()}`,
                'Products Loaded'
              );
            }
          }
          break;
          
        case 'failed':
          if (error) {
            toast.error(
              'Unable to load products. Please check your connection and try again.',
              'Loading Failed'
            );
          }
          break;
          
        default:
          break;
      }
    }
    setPreviousStatus(status);
  }, [status, items.length, error, previousStatus, hasInitialLoad, toast]);

  useEffect(() => {
    if (!routeCategory) return;
    
    const lower = routeCategory.toLowerCase();
    
    // Clear previous filters when navigating to different categories
    if (lower !== filters.type && lower !== "all") {
      dispatch(clearFilters());
    }
    
    // Handle "all" route - show all products without category filter
    if (lower === "all") {
      dispatch(setFilters({ 
        type: "", 
        category: "", 
        page: 1,
        limit: PRODUCTS_PER_PAGE
      }));
      return;
    }
    
    // Handle category from navbar navigation (query parameter)
    if (categoryFromUrl && categoryFromUrl !== 'all') {
      dispatch(setFilters({ 
        type: lower === "high-jewellery" ? "high_jewellery" : lower, 
        category: categoryFromUrl, 
        page: 1,
        limit: PRODUCTS_PER_PAGE
      }));
      return;
    }
    
    // Handle subcategory from navbar navigation (legacy support)
    if (subcategoryFromUrl && subcategoryFromUrl !== 'all') {
      dispatch(setFilters({ 
        type: lower === "high-jewellery" ? "high_jewellery" : lower, 
        category: subcategoryFromUrl, 
        page: 1,
        limit: PRODUCTS_PER_PAGE
      }));
      return;
    }
    
    // Handle main categories including high-jewellery
    if (lower.startsWith("all-")) {
      dispatch(setFilters({ type: lower.replace("all-", ""), category: "", page: 1 }));
    } else if (lower === "jewellery" || lower === "fragrance" || lower === "high-jewellery") {
      dispatch(setFilters({ type: lower === "high-jewellery" ? "high_jewellery" : lower, category: "", page: 1, limit: PRODUCTS_PER_PAGE }));
    } else {
      // treat as subcategory; keep existing type or default jewellery
      const currentType = filters.type || "jewellery";
      dispatch(setFilters({
        type: currentType,
        category: lower,
        page: 1
      }));
    }
  }, [routeCategory, subcategoryFromUrl, categoryFromUrl, dispatch]);

  // Debounced fetch on filter changes
  const [pendingFilters, setPendingFilters] = useState(filters);
  useEffect(() => {
    setPendingFilters({ ...filters, limit: PRODUCTS_PER_PAGE });
  }, [filters]);

  useEffect(() => {
    const h = setTimeout(() => {
      const params = buildFilterParams({
        ...pendingFilters,
        page: pendingFilters.page || 1,
        limit: PRODUCTS_PER_PAGE,
        sort: pendingFilters.sort || "newest"
      });
      
      dispatch(fetchProducts(params));
    }, 200);
    return () => clearTimeout(h);
  }, [pendingFilters, dispatch, routeCategory]);

  const getPageHeading = () => {
    const lower = routeCategory?.toLowerCase();
    
    if (lower === "all") {
      return "All Products";
    }
    
    // Check for category from navbar query parameter first
    if (categoryFromUrl && categoryFromUrl !== 'all') {
      const categoryName = routeCategory === "high-jewellery" ? "High Jewellery" : 
                          routeCategory?.charAt(0).toUpperCase() + routeCategory?.slice(1);
      return `${categoryName} - ${categoryFromUrl.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    }
    
    if (subcategoryFromUrl && subcategoryFromUrl !== 'all') {
      const categoryName = routeCategory === "high-jewellery" ? "High Jewellery" : routeCategory;
      return `${categoryName} - ${subcategoryFromUrl.replace(/-/g, ' ')}`;
    }
    
    if (lower === "high-jewellery") {
      return "High Jewellery Collection";
    }
    
    return routeCategory 
      ? routeCategory.replace(/-/g, " ")
      : (filters.type || "products");
  };

  const handleApplyFilters = () => {
    if (pendingMobileFilters) {
      dispatch(setFilters(pendingMobileFilters));
      setPendingMobileFilters(null);
    }
    setShowMobileFilters(false);
  };

  const handleMobileFilterChange = (newFilters) => {
    setPendingMobileFilters(prev => ({
      ...(prev || filters),
      ...newFilters
    }));
  };

  const handleCancelFilters = () => {
    setPendingMobileFilters(null);
    setShowMobileFilters(false);
  };

  // Determine main category for sidebar
  const getMainCategory = () => {
    const lower = routeCategory?.toLowerCase();
    if (lower === "all") return "all";
    return filters.type || routeCategory || "jewellery";
  };

  // Pagination calculations
  const currentPage = filters.page || 1;
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setFilters({ page: newPage }));
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const banner = getCategoryBanner();

  return (
    <div className="w-full relative mt-0 sm:mt-20 md:mt-24 lg:mt-28 xl:mt-32 2xl:mt-36">
      {/* Responsive Banner Section */}
      <section className="relative w-full overflow-hidden bg-gray-50">
        {/* Responsive Container */}
        <div className="relative w-full h-[25vh] xs:h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh] xl:h-[50vh] 2xl:h-[55vh] min-h-[200px] max-h-[600px]">
          
          {/* Desktop Banner - Hidden on mobile, shown on md+ */}
          <img
            src={banner.desktop}
            className="hidden md:block w-full h-full object-cover object-center"
            alt={`${getPageHeading()} banner`}
            loading="eager"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.backgroundColor = '#f8fafc';
            }}
          />
          
          {/* Mobile Banner - Shown on mobile, hidden on desktop */}
          <img
            src={banner.mobile}
            className="block md:hidden w-full h-full object-cover object-center"
            alt={`${getPageHeading()} mobile banner`}
            loading="eager"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.backgroundColor = '#f8fafc';
            }}
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
      </section>

      {/* Responsive Back Button */}
      <div className="absolute top-3 sm:top-4 md:top-6 lg:top-8 left-2 sm:left-3 md:left-4 lg:left-6 z-30">
        <BackButton className="text-white drop-shadow-lg hover:bg-white/10 transition-all duration-200 rounded-lg p-1 sm:p-2"/>
      </div>

      {/* Responsive Main Content */}
      <div className="w-full py-4 sm:py-6 md:py-8">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-4 2xl:px-0">
          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4 flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              {getPageHeading()}
            </h1>
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <BiFilterAlt size={16} />
              <span>Filters</span>
            </button>
          </div>

          {/* Responsive Mobile Filter Bottom Sheet */}
          <div 
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${
              showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={handleCancelFilters}
          >
            <div 
              className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl transform transition-transform duration-300 ease-out max-h-[85vh] ${
                showMobileFilters ? 'translate-y-0' : 'translate-y-full'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b p-3 sm:p-4 bg-gray-50 rounded-t-2xl">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900">Filter Products</h3>
                <button 
                  onClick={handleCancelFilters} 
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <BiX size={20} className="text-gray-600" />
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4">
                <SideBar 
                  mainCategory={getMainCategory()}
                  onFilterChange={handleMobileFilterChange}
                  isMobile={true}
                  initialValues={filters}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="border-t p-3 sm:p-4 flex gap-3 bg-gray-50">
                <button 
                  onClick={handleCancelFilters}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Responsive Desktop Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-4 md:gap-6 lg:gap-8 items-start">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 bg-white rounded-lg border border-gray-200 p-4">
                <SideBar 
                  mainCategory={getMainCategory()}
                  initialValues={filters}
                />
              </div>
            </div>

            {/* Main Content Area */}
            <main className="w-full min-w-0">
              {/* Desktop Page Header */}
              <div className="hidden md:block mb-6">
                <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-2">
                  {getPageHeading()}
                </h1>
              </div>

              {/* Responsive Sort Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                  {status === "loading" ? "Loading products..." : `Showing ${items.length} of ${total} products`}
                </div>
                
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <label className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">
                    Sort by:
                  </label>
                  <select
                    className="flex-1 sm:flex-none border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm bg-white focus:ring-2 focus:ring-black focus:border-black transition-colors"
                    value={filters.sort || "newest"}
                    onChange={(e) => dispatch(setFilters({ sort: e.target.value, page: 1 }))}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {status === "failed" && (
                <div className="text-red-500 text-sm mb-4">
                  Error: {error}
                  <button 
                    onClick={() => dispatch(fetchProducts({ page: 1, limit: 20 }))}
                    className="ml-2 text-blue-600 underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Responsive Loading State */}
              {status === "loading" && (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-48 sm:h-56 md:h-64 lg:h-72 rounded-lg mb-3"></div>
                      <div className="bg-gray-200 h-3 sm:h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-3 sm:h-4 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Responsive No Products Message */}
              {items.length === 0 && status !== "loading" && (
                <div className="text-center py-8 sm:py-12 md:py-16 px-4">
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🔍</div>
                  <h3 className="text-base sm:text-lg md:text-xl text-gray-900 font-semibold mb-2 sm:mb-3">
                    {routeCategory?.toLowerCase() === "all" 
                      ? "Loading our complete collection..."
                      : "No products found"
                    }
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed">
                    {routeCategory?.toLowerCase() === "all" 
                      ? "Browse through our carefully curated selection of jewellery and fragrances"
                      : "No products match your current filters. Try adjusting your criteria or search terms."
                    }
                  </p>
                  {routeCategory?.toLowerCase() !== "all" && (
                    <button
                      onClick={() => {
                        dispatch(setFilters({ 
                          type: "", 
                          category: "", 
                          priceMin: null, 
                          priceMax: null, 
                          page: 1,
                          limit: PRODUCTS_PER_PAGE
                        }));
                      }}
                      className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}

              {/* Responsive Product Grid */}
              {items.length > 0 && (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {items.map((p, i) => (
                    <ProductCard key={p.id || p._id || `p-${i}`} product={p} />
                  ))}
                </div>
              )}
              
              {/* Responsive Pagination */}
              <div className="mt-8 sm:mt-10 md:mt-12">
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  onChange={handlePageChange}
                />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

