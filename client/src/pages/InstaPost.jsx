import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageHeader from '../components/header/PageHeader'
import { 
  fetchFeaturedPosts, 
  selectFeaturedPosts, 
  selectFeaturedLoading, 
  selectFeaturedError 
} from '../features/instagram/slice.js'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
// Default fallback images
import insta1 from '../assets/images/insta.jpg'
import insta2 from '../assets/images/insta1.jpg'
import insta3 from '../assets/images/insta2.jpg'
import insta4 from '../assets/images/insta3.jpg'


const InstaPost = () => {
  const dispatch = useDispatch()
  const scrollRef = useRef(null)
  const featuredPosts = useSelector(selectFeaturedPosts)
  const loading = useSelector(selectFeaturedLoading)
  const error = useSelector(selectFeaturedError)

  // Default fallback data
  const defaultProducts = [
    { id: 1, img: insta1 },
    { id: 2, img: insta2 },
    { id: 3, img: insta3 },
    { id: 4, img: insta4 },
  ]

  useEffect(() => {
    dispatch(fetchFeaturedPosts(4))
  }, [dispatch])

  // Transform dynamic posts to match the expected format
  const products = featuredPosts.length > 0 
    ? featuredPosts.map((post, index) => ({
        id: post._id || index + 1,
        img: post.image.url,
        title: post.title,
        instagramUrl: post.instagramUrl
      }))
    : defaultProducts

  // Handle click to open Instagram URL
  const handlePostClick = (product) => {
    if (product.instagramUrl) {
      window.open(product.instagramUrl, '_blank', 'noopener,noreferrer')
    } else {
      // Default Instagram URL
      window.open("https://www.instagram.com/garavaofficial?igsh=MTE2MWZrMzU1aGMx", '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className='w-full py-6'>
      <PageHeader title="#Posts" />
      <p className='text-center w-full'>
        Check how GARAVA shares beauty — from sparkling diamonds to signature perfumes — <br /> 
        in our latest Instagram posts.
      </p>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading Instagram posts...</span>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">Failed to load Instagram posts</p>
          <p className="text-gray-600">Showing default content</p>
        </div>
      ) : null}

      <section className="w-[98%] mx-auto py-10">
        <div className="mx-auto w-[95%] max-w-7xl">
          {/* Horizontal scrollable container */}
          <div className="relative group">
            {/* Left Arrow */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
            >
              <IoIosArrowBack size={20} />
            </button>
            
            {/* Right Arrow */}
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
            >
              <IoIosArrowForward size={20} />
            </button>
            
            <div 
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
            >
              <div className="flex gap-6 sm:gap-8 md:gap-10 min-w-max px-4 py-4">
                {products.map((p) => (
                  <div key={p.id} className="w-[250px] sm:w-[280px] md:w-[300px] flex-shrink-0">
                    <article 
                      className="card cursor-pointer transform transition-transform hover:scale-105 w-full h-full" 
                      tabIndex="0"
                      onClick={() => handlePostClick(p)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handlePostClick(p)
                        }
                      }}
                    >
                      <div className="card-img-wrapper">
                        <img
                          className="card-img"
                          src={p.img}
                          alt={p.title || `Instagram post ${p.id}`}
                          loading="lazy"
                          width="800"
                          height="800"
                        />
                      </div>

                      {p.title && (
                        <div className="mt-2 sm:mt-3 text-center px-1">
                          <h3 className="card-title line-clamp-2">{p.title}</h3>
                        </div>
                      )}
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-center mt-12 text-center cursor-pointer">
            <a
              className="btn"
              href="https://www.instagram.com/garavaofficial?igsh=MTE2MWZrMzU1aGMx"
              aria-label="Explore Our Instagram"
            >
              Explore Our Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InstaPost