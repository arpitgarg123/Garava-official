import React, { useEffect, useState } from 'react'
import Card from '../components/Products/Card'
import hj1 from "../assets/images/jewellry4.png";
import hj2 from "../assets/images/j-front.webp";
import hj3 from "../assets/images/j-back.webp";
import hj4 from "../assets/images/j.webp";
import { Link } from 'react-router-dom';
import PageHeader from '../components/header/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/product/slice';

const HighJewellery = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  
  // Fallback static products to maintain exact UI
  const staticProducts = [
    { id: 1, img: hj1, title: "Diamond Solitaire Ring", price: "₹2,50,000.0" },
    { id: 2, img: hj2, title: "Platinum Necklace", price: "₹5,00,000.0" },
    { id: 3, img: hj3, title: "Diamond Studs", price: "₹1,80,000.0" },
    { id: 4, img: hj4, title: "Premium Band", price: "₹3,20,000.0" },
  ];

  const productList = useSelector(state => state.product.list);

  useEffect(() => {
    // Fetch high jewellery products
    dispatch(fetchProducts({
      type: 'high_jewellery',
      limit: 4,
      page: 1
    }));
  }, [dispatch]);

  useEffect(() => {
    if (productList.items && productList.items.length > 0) {
      // Transform backend data to match UI expectations
      const transformedProducts = productList.items.slice(0, 4).map(product => {
        // Check if product is price on request
        const isPriceOnDemand = product.isPriceOnDemand || product.defaultVariant?.isPriceOnDemand;
        const price = isPriceOnDemand 
          ? "Price on Request" 
          : `₹${product.defaultVariant?.price?.toLocaleString('en-IN') || product.priceRange?.min?.toLocaleString('en-IN') || '0'}.0`;
          
        return {
          id: product._id || product.id,
          img: product.heroImage?.url || product.heroImage || staticProducts[0].img,
          title: product.name || "High Jewellery Product",
          price: price,
          slug: product.slug
        };
      });
      
      // If we have products from API, use them; otherwise use static
      if (transformedProducts.length >= 4) {
        setProducts(transformedProducts);
      } else {
        // Mix API data with static fallback to always show 4 products
        const combined = [...transformedProducts];
        const remaining = 4 - transformedProducts.length;
        combined.push(...staticProducts.slice(0, remaining));
        setProducts(combined);
      }
    } else {
      // Use static products as fallback
      setProducts(staticProducts);
    }
  }, [productList.items]);

  return (
     <div className='w-full py-6'>
       <PageHeader title="High Jewellery" />
         <section className="bg-gray-50 w-[98%] mx-auto py-10 ">
        <div className="mx-auto w-[95%] h-[80%] ">
      
          <div className="products-grid">
            {products.map((p) => (
              <Card key={p.id} img={p.img} title={p.title} price={p.price} slug={p.slug} id={p.id} type="high_jewellery" />
            ))}
          </div>

          <div className="flex-center mt-12 text-center cursor-pointer">
             <Link to='/products/high-jewellery'>
            <button 
              className="btn"
              aria-label="View more products"
            >
              View More..
            </button>
           </Link>
          </div>
        </div>
      </section>

     
    </div>
  )
}

export default HighJewellery