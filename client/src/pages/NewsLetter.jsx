import React from 'react'
import NewsletterModal from '../components/newsLatter/NewsletterModal'
import NewsletterForm from '../components/newsLatter/NewsletterForm'

const NewsLater = () => {
  return (
    <div className='w-full h-screen flex items-center justify-between mx-8 '>
        <NewsletterModal  />
        <NewsletterForm />
    </div>
  )
}

export default NewsLater