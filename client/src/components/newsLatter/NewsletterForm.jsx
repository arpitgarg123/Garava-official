import React, { useState } from "react";
import './newsLetter.css'

const NewsletterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate with backend / API
    console.log("Form submitted:", formData);
  };

  return (
    <>
    <div className="w-[38%] mr-[16rem]">
    <div className="h-28">
        <h1 className="font-[bion] text-2xl  ">UNSAID PARIS NEWSLETTER</h1>
        <p className="font-['montserrat]  ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse cumque ex rerum atque unde laborum!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique!
        </p>
    </div>
    <form onSubmit={handleSubmit} className="mt-6 space-y-6 ">
   
      <div>
        <input
          type="email"
          name="email"
          required
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
        />
        <span className="text-xs text-red-500">*Required</span>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <input
            type="text"
            name="firstName"
            required
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            className="input-field"
          />
          <span className="text-xs text-red-500">*Required</span>
        </div>

        <div className="w-1/2">
          <input
            type="text"
            name="country"
            required
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="input-field"
          />
          <span className="text-xs text-red-500">*Required</span>
        </div>
      </div>


   

      <p className="text-xs text-gray-500 leading-5">
        (*) mandatory fields <br />
        You can unsubscribe from the link provided in our newsletter at any
        time. Your personal information will be stored & used in accordance with
        our <a href="/privacy" className="underline">privacy policy</a>.
      </p>

      <button
        type="submit"
        // className= "py-2 bg-[#686868] text-white transition-colors duration-300  hover:bg-[#0c0c0c] hover:text-[#f5e6d7] w-62 "
        className= "btn w-62"
      >
        SUBSCRIBE
      </button>
    </form>
    </div>
    </>
  );
};

export default NewsletterForm;
