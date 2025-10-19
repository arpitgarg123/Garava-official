import React, { useState } from 'react' 
import  './newsLetter.css'
import { subscribeToNewsletter } from '../../features/newsletter/api'

const NewsletterInline = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [touched, setTouched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!isEmailValid(email)) {
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      await subscribeToNewsletter(email);
      setStatus('success');
      setEmail('');
      setTouched(false);
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMsg(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
     <section className='container' aria-labelledby="newsletter-heading">
      <h3 id="newsletter-heading" className='heading'>
        Subscribe to our newsletter
      </h3>

      <form className='form' onSubmit={handleSubmit} noValidate aria-describedby="newsletter-status">
        <label htmlFor="ni-email" className="sr-only">Email address</label>

        <input
          id="ni-email"
          name="email"
          type="email"
          inputMode="email"
          placeholder="Email"
          className='input'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          disabled={status === 'loading'}
          aria-invalid={touched && !isEmailValid(email) ? "true" : "false"}
          aria-required="true"
        />

        <button
          type="submit"
          className='button'
          disabled={status === "loading"}
          aria-busy={status === "loading"}
        >
          {status === "loading" ? "Joining..." : "Subscribe"}
        </button>
      </form>

      <div id="newsletter-status" className={status} aria-live="polite">
        {touched && !isEmailValid(email) && <span className="text-red-500 text-sm">Enter a valid email</span>}
        {status === "success" && <span className="text-green-600 text-sm">Subscribed ✓</span>}
        {status === "error" && <span className="text-red-500 text-sm">{errorMsg || "Something went wrong"}</span>}
      </div>
    </section>
  )
}

export default NewsletterInline