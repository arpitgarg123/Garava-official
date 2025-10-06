import Card from '../components/Products/Card'
import jFront from "../assets/images/j-front.jpg";
import jBack from "../assets/images/j-back.jpg";
import j from "../assets/images/jewellry4.png";
import j2 from "../assets/images/j.jpg";
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/header/PageHeader';
import { useEffect, useState } from 'react';
import { listProductsApi } from '../features/product/api';

const Jewellry = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fallback static products (same as before to maintain exact UI)
  const staticProducts = [
    { id: 1, img: jBack, title: "Round Solitaire Ring", price: "₹79,153.0" },
    { id: 2, img: jFront, title: "Classic Necklace", price: "₹129,999.0" },
    { id: 3, img: j, title: "Statement Earrings", price: "₹54,200.0" },
    { id: 4, img: j2, title: "Everyday Band", price: "₹24,500.0" },
  ];

  useEffect(() => {
    const fetchJewelleryProducts = async () => {
      try {
        setLoading(true);
        const { data } = await listProductsApi({
          type: 'jewellery',
          limit: 4,
          page: 1
        });
        
        let apiProducts = [];
        if (Array.isArray(data)) {
          apiProducts = data;
        } else if (data?.products) {
          apiProducts = data.products;
        } else if (data?.items) {
          apiProducts = data.items;
        }

        if (apiProducts && apiProducts.length > 0) {
          // Transform backend data to match UI expectations
          const transformedProducts = apiProducts.slice(0, 4).map(product => ({
            id: product._id || product.id,
            img: product.heroImage?.url || product.heroImage || staticProducts[0].img,
            title: product.name || "Jewellery Product",
            price: `₹${product.defaultVariant?.price?.toLocaleString('en-IN') || product.priceRange?.min?.toLocaleString('en-IN') || '0'}.0`,
            slug: product.slug
          }));
          
          // If we have enough products from API, use them; otherwise mix with static
          if (transformedProducts.length >= 4) {
            setProducts(transformedProducts);
          } else {
            const combined = [...transformedProducts];
            const remaining = 4 - transformedProducts.length;
            combined.push(...staticProducts.slice(0, remaining));
            setProducts(combined);
          }
        } else {
          // Use static products as fallback
          setProducts(staticProducts);
        }
      } catch (error) {
        console.error('Error fetching jewellery products:', error);
        // Use static products as fallback on error
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchJewelleryProducts();
  }, []);
  return (
    <div className='w-full py-6 '>
        <PageHeader title="Jewellery" />
       <section className="bg-gray-50  w-[98%] mx-auto py-10  ">
        <div className="mx-auto  w-[95%] h-[80%]">
      
          <div className="products-grid">
           
             {products.map((p) => (
            
              <Card key={p.id} img={p.img} title={p.title} price={p.price} slug={p.slug} id={p.id} />
            
            ))}
            
          
          </div>

          <div className="flex-center mt-10 text-center ">
           <Link  to='/products/jewellery'>
            <button 
            
              className="btn "
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

export default Jewellry