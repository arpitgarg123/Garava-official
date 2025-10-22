import React from 'react' 
import  './newsLetter.css'
import PageHeader from '../header/PageHeader'

const NewsletterInline = () => {
  return (
     <section className='container' aria-labelledby="newsletter-heading">
      <h1 className='head-text mb-6'>
                Subscribe to our newsletter

      </h1>
      <form className='form'  noValidate aria-describedby="newsletter-status">
        <label htmlFor="ni-email" className="sr-only">Email address</label>

        <input
          id="ni-email"
          name="email"
          type="email"
          inputMode="email"
          placeholder="Email"
          className='input'
        //   value={email}
        //   onChange={(e) => setEmail(e.target.value)}
        //   onBlur={() => setTouched(true)}
        //   aria-invalid={touched && !isEmailValid(email) ? "true" : "false"}
        //   aria-required="true"
        />

        <button
          type="submit"
          className='button'
        //   disabled={status === "loading"}
        //   aria-busy={status === "loading"}
        >
          {/* {status === "loading" ? "Joining..." : "Subscribe"} */}
          Subscribe
        </button>
      </form>

      {/* <div id="newsletter-status" className={status} aria-live="polite">
        {touched && !isEmailValid(email) && <span className={error}>Enter a valid email</span>}
        {status === "success" && <span className={success}>Subscribed ✓</span>}
        {status === "error" && <span className={error}>{error || "Something went wrong"}</span>}
      </div> */}
    </section>
  )
}

export default NewsletterInline