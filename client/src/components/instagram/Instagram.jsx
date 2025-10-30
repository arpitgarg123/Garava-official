import React, { useEffect } from 'react'
import './insta.css' 
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchFeaturedPosts, 
  selectFeaturedPosts, 
  selectFeaturedLoading, 
  selectFeaturedError 
} from '../../features/instagram/slice.js'

const Instagram = ({ 
  title = " on Instagram",
  subtitle = "Follow us on Instagram to see our latest posts and behind-the-scenes content.",
  ctaLabel = "Explore Our Instagram",
}) => {
  const dispatch = useDispatch()
  const featuredPosts = useSelector(selectFeaturedPosts)
  const loading = useSelector(selectFeaturedLoading)
  const error = useSelector(selectFeaturedError)

  // Default fallback images

  useEffect(() => {
    dispatch(fetchFeaturedPosts(4))
  }, [dispatch])

  // Only show real posts, don't fill with dummy images
  const displayPosts = featuredPosts.length > 0 ? featuredPosts : []

  // Handle image click to navigate to Instagram URL
  const handleImageClick = (index) => {
    if (displayPosts[index]?.instagramUrl) {
      window.open(displayPosts[index].instagramUrl, '_blank', 'noopener,noreferrer')
    } else {
      // Default Instagram URL if no specific post URL
      window.open("https://www.instagram.com/garavaofficial?igsh=MTE2MWZrMzU1aGMx", '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) {
    return (
      <section className="w-[90%] mx-auto px-6 py-12">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading Instagram posts...</span>
        </div>
      </section>
    )
  }

  return (
    <section className="w-[90%]  mx-auto px-6 py-12">
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-8 items-center justify-center">
        {/* Left text block */}
        <div className="flex flex-col  justify-center ">
          <h3 className="text-3xl md:text-3xl font-semibold">
            <span className='inline-block text-[#032c6a] '>#Latest Post</span>
            {title}
          </h3>

          <p className="text-gray-600 mb-4 max-w-xl" >{subtitle}</p>

          <a
            className="btn "
            href="https://www.instagram.com/garavaofficial?igsh=MTE2MWZrMzU1aGMx"
            aria-label={ctaLabel}
          >
            {ctaLabel}
          </a>
        </div>

        {/* Dynamic Instagram grid - shows only real posts */}
        {displayPosts.length > 0 && (
          <div className="w-[95%] h-full flex items-center justify-center">
            <div className='flex flex-col items-end justify-end h-full w-[50%]'>
              {displayPosts[0] && (
                <div 
                  className="h-[40%] w-[13vw] self-end cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => handleImageClick(0)}
                >
                  <img 
                    src={displayPosts[0].image.url} 
                    alt={displayPosts[0].image.alt || displayPosts[0].title} 
                    loading="lazy" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              {displayPosts[1] && (
                <div 
                  className="h-[70%] w-[16vw] self-end cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => handleImageClick(1)}
                >
                  <img 
                    src={displayPosts[1].image.url} 
                    alt={displayPosts[1].image.alt || displayPosts[1].title} 
                    loading="lazy" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>
            
            <div className='flex flex-col items-end justify-end h-full w-[50%]'>
              {displayPosts[2] && (
                <div 
                  className="h-[70%] w-[16vw] self-start cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => handleImageClick(2)}
                >
                  <img 
                    src={displayPosts[2].image.url} 
                    alt={displayPosts[2].image.alt || displayPosts[2].title} 
                    loading="lazy" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              {displayPosts[3] && (
                <div 
                  className="h-[40%] w-[13vw] self-start cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => handleImageClick(3)}
                >
                  <img 
                    src={displayPosts[3].image.url} 
                    alt={displayPosts[3].image.alt || displayPosts[3].title} 
                    loading="lazy" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Show message if no posts available */}
        {displayPosts.length === 0 && !loading && (
          <div className="w-[95%] h-full flex items-center justify-center">
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No Instagram posts available yet.</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon for our latest updates!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Instagram