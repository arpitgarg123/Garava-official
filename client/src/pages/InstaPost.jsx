import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageHeader from '../components/header/PageHeader'
import { 
  fetchFeaturedPosts, 
  selectFeaturedPosts, 
  selectFeaturedLoading, 
  selectFeaturedError 
} from '../features/instagram/slice.js'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'



const InstaPost = () => {
  const dispatch = useDispatch()
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const featuredPosts = useSelector(selectFeaturedPosts)
  const loading = useSelector(selectFeaturedLoading)
  const error = useSelector(selectFeaturedError)

  // Drag-to-scroll handlers
  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => setIsDragging(false)
  
  const handleMouseMove = (e) => {
    if (!isDragging) return
    const slider = scrollRef.current
    slider.scrollLeft -= e.movementX
  }

  useEffect(() => {
    dispatch(fetchFeaturedPosts(10)) // Fetch more posts for carousel
  }, [dispatch])

  // Transform dynamic posts to match the expected format
  const products = featuredPosts?.length > 0 
    ? featuredPosts.map((post, index) => ({
        id: post._id || index + 1,
        img: post.image.url,
        title: post.title,
        instagramUrl: post.instagramUrl
      }))
    : []

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
      <p className='text-center text-[1.0625rem] w-full'>
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

      <section className="w-full mx-auto py-10">
        {/* 
          Optimized for exactly 5 cards:
          - Container: max-w-[1408px] fits viewport
          - Card width: 260px × 5 = 1,300px
          - Gap: 17px × 4 = 68px
          - Total: 1,368px (fits perfectly)
        */}
        <div className="mx-auto w-full max-w-[1408px] px-4">
          {/* Horizontal scrollable container */}
          <div className="relative group">
            {/* Left Arrow */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:flex items-center justify-center"
              onClick={() => scrollRef.current?.scrollBy({ left: -554, behavior: 'smooth' })}
              aria-label="Scroll left"
            >
              <IoIosArrowBack className="text-2xl text-gray-800" />
            </button>
            
            {/* Right Arrow */}
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:flex items-center justify-center"
              onClick={() => scrollRef.current?.scrollBy({ left: 554, behavior: 'smooth' })}
              aria-label="Scroll right"
            >
              <IoIosArrowForward className="text-2xl text-gray-800" />
            </button>
            
            <div 
              ref={scrollRef}
              className={`overflow-x-auto scrollbar-hide ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <div className="flex gap-[17px] min-w-max py-4">
                {products.map((p) => (
                  <div key={p.id} className="w-[260px] flex-shrink-0">
                    <article 
                      className="card cursor-pointer transform transition-transform hover:scale-105 w-full" 
                      tabIndex="0"
                      onClick={() => handlePostClick(p)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handlePostClick(p)
                        }
                      }}
                    >
                      <div className="card-img-wrapper aspect-square">
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
                        <div className="mt-3 text-center px-2 min-h-[60px] flex flex-col justify-start">
                          <h3 className="card-title leading-5 line-clamp-2">{p.title}</h3>
                        </div>
                      )}
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-center mt-12 text-center">
            <a
              className="btn cursor-pointer"
              href="https://www.instagram.com/garavaofficial?igsh=MTE2MWZrMzU1aGMx"
              target="_blank"
              rel="noopener noreferrer"
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