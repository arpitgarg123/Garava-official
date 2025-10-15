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
import fBanner  from '../../assets/images/new_banner_2.jpg'
import jBanner  from '../../assets/images/new_banner_1.jpg'
import all  from '../../assets/images/allproduct.webp'
import mobileFraganceBanner  from '../../assets/images/display-banner1.webp'
import mobileJewellryBanner  from '../../assets/images/display-banner.webp'
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
    <div className="w-full relative pt-20 max-md:pt-14">
      <section className="relative h-[45vh] lg:h-[64vh] overflow-hidden">

       <img
          src={banner.desktop}
          className="w-full h-full object-cover  block md:block"
          alt={`${getPageHeading()} banner`}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        
        {/* Mobile Banner Image - Hidden on desktop, shown on mobile */}
        <img
          src={banner.mobile}
          className="w-full h-full object-cover block md:hidden absolute inset-0"
          alt={`${getPageHeading()} mobile banner`}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </section>


      {/* Back Button - Positioned over banner */}
      <div className="absolute top-24 max-md:top-16 left-4 max-md:left-2 z-20">
        <BackButton className="text-white"/>
      </div>

      {/* Main Content */}
      <div className="w-full py-6">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-0">
          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4 flex justify-end items-center">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="hidden max-md:flex  items-center gap-2 px-4 py-2 border rounded-md bg-white shadow-sm"
            >
              <BiFilterAlt />
              <span>Filters</span>
            </button>
          </div>

          {/* Mobile Filter Bottom Sheet */}
          <div 
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${
              showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={handleCancelFilters}
          >
            <div 
              className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl transform transition-transform duration-300 ease-out ${
                showMobileFilters ? 'translate-y-0' : 'translate-y-full'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button onClick={handleCancelFilters} className="p-1 rounded-full hover:bg-gray-50">
                  <BiX size={24} />
                </button>
              </div>
              
              <div className="max-h-[70vh] overflow-y-auto p-4">
                <SideBar 
                  mainCategory={getMainCategory()}
                  onFilterChange={handleMobileFilterChange}
                  isMobile={true}
                  initialValues={filters}
                />
              </div>
              
              <div className="border-t p-4 flex gap- justify-between">
                <button 
                  onClick={handleCancelFilters}
                  className="btn-small  px-4 py-1 border"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApplyFilters}
                  className="btn-black btn-small"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
            {/* Desktop Sidebar - Always show, but different content for "all" */}
            <div className="hidden md:block">
              <SideBar 
                mainCategory={getMainCategory()}
                initialValues={filters}
              />
            </div>

            <main className="ml-0 md:ml-10 w-full">
              {/* Desktop Sort Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                  {status === "loading" ? "Loading..." : `Showing ${items.length} products`}
                </div>
                
                <select
                  className="border px-3 py-1 rounded text-sm"
                  value={filters.sort || "newest"}
                  onChange={(e) => dispatch(setFilters({ sort: e.target.value, page: 1 }))}
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price Low → High</option>
                  <option value="price_desc">Price High → Low</option>
                  <option value="popularity">Popular</option>
                  <option value="rating">Rating</option>
                </select>
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

              {/* Loading State */}
              {status === "loading" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* No products message */}
              {items.length === 0 && status !== "loading" && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-500 text-lg mb-4">
                    {routeCategory?.toLowerCase() === "all" 
                      ? "Loading our complete collection..."
                      : "No products found matching your criteria"
                    }
                  </p>
                  <p className="text-gray-400 mb-6">
                    {routeCategory?.toLowerCase() === "all" 
                      ? "Browse through our carefully curated selection of jewellery and fragrances"
                      : "Try adjusting your filters or search terms"
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
                      className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}

              {/* Product Grid */}
              {items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {items.map((p, i) => (
                    <ProductCard key={p.id || p._id || `p-${i}`} product={p} />
                  ))}
                </div>
              )}
              
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

