import React, { useState } from "react";
import './newsLetter.css'
import { subscribeToNewsletter } from '../../features/newsletter/api';

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setEmail(e.target.value);
    // Clear message when user starts typing
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await subscribeToNewsletter(email);
      setMessage({ type: 'success', text: 'Successfully subscribed to our newsletter!' });
      setEmail(''); // Clear the form
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="w-[38%] mr-[16rem]">
    <div className="h-28">
        <h1 className="font-[bion] text-2xl  ">GARAVA NEWSLETTER</h1>
        <p className="  ">Subscribe to receive updates on new products, exclusive offers, and special events.
            Stay connected with the latest in luxury jewelry and fragrances!
        </p>
    </div>
    <form onSubmit={handleSubmit} className="mt-6 space-y-6 ">
   
      <div>
        <input
          type="email"
          name="email"
          required
          placeholder="Email address"
          value={email}
          onChange={handleChange}
          disabled={loading}
          className="input-field"
        />
        <span className="text-sm text-red-500">*Required</span>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`p-3 rounded ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <p className="text-sm text-gray-500 leading-5">
        (*) mandatory field <br />
        You can unsubscribe from the link provided in our newsletter at any
        time. Your personal information will be stored & used in accordance with
        our <a href="/privacy" className="underline">privacy policy</a>.
      </p>

      <button
        type="submit"
        disabled={loading}
        className= "btn w-62 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
      </button>
    </form>
    </div>
    </>
  );
};

export default NewsletterForm;
