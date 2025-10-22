import React, { useEffect } from 'react'
import './insta.css' 
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchFeaturedPosts, 
  selectFeaturedPosts, 
  selectFeaturedLoading, 
  selectFeaturedError 
} from '../../features/instagram/slice.js'
// Default fallback images
import insta1 from '../../assets/images/insta.jpg'
import insta2 from '../../assets/images/insta1.jpg'
import insta3 from '../../assets/images/insta2.jpg'
import insta4 from '../../assets/images/insta3.jpg'

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
  const defaultImages = [insta1, insta2, insta3, insta4]

  useEffect(() => {
    dispatch(fetchFeaturedPosts(4))
  }, [dispatch])

  // Use dynamic posts or fallback to default images
  const displayImages = featuredPosts.length > 0 
    ? featuredPosts.map(post => post.image.url)
    : defaultImages

  // Ensure we always have 4 images
  const imgs = [...displayImages].slice(0, 4)
  while (imgs.length < 4) {
    imgs.push(defaultImages[imgs.length] || "/assets/placeholder-1x1.png")
  }

  // Handle image click to navigate to Instagram URL
  const handleImageClick = (index) => {
    if (featuredPosts[index]?.instagramUrl) {
      window.open(featuredPosts[index].instagramUrl, '_blank', 'noopener,noreferrer')
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

        <div className="w-[95%] h-full flex  items-center justify-center">
         <div className='flex flex-col items-end justify-end h-full w-[50%] '>
          <div 
            className="h-[40%] w-[13vw] self-end cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handleImageClick(0)}
          >
            <img 
              src={imgs[0]} 
              alt={featuredPosts[0]?.image.alt || featuredPosts[0]?.title || "Instagram 1"} 
              loading="lazy" 
              className="w-full h-full object-cover" 
            />
          </div>

          <div 
            className={`h-[70%] w-[16vw] self-end cursor-pointer transform transition-transform hover:scale-105`}
            onClick={() => handleImageClick(1)}
          >
            <img 
              src={imgs[1]} 
              alt={featuredPosts[1]?.image.alt || featuredPosts[1]?.title || "Instagram 2"} 
              loading="lazy" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        <div className='flex flex-col items-end justify-end h-full w-[50%]'>
          <div 
            className="h-[70%] w-[16vw] self-start cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handleImageClick(2)}
          >
            <img 
              src={imgs[2]} 
              alt={featuredPosts[2]?.image.alt || featuredPosts[2]?.title || "Instagram 3"} 
              loading="lazy" 
              className="w-full h-full object-cover" 
            />
          </div>

          <div 
            className="h-[40%] w-[13vw] self-start cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handleImageClick(3)}
          >
            <img 
              src={imgs[3]} 
              alt={featuredPosts[3]?.image.alt || featuredPosts[3]?.title || "Instagram 4"} 
              loading="lazy" 
              className="w-full h-full object-cover" 
            />
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Instagram