import React, { useId, useState } from "react";
import Field from "../components/contact/Field";
import Infotile from "../components/contact/Infotile";
import Summary from "../components/contact/Summary";
import BackButton from "../components/BackButton";
import { submitContactForm } from "../shared/api/contact.api.js";
import PageHeader from "../components/header/PageHeader.jsx";

const Contact = () => {
  const formId = useId();
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "", // honeypot
  });

  const [touched, setTouched] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const emailOk = /.+@.+\..+/.test(values.email);
  const phoneOk = values.phone === "" || /^[0-9()+\-\s]{7,16}$/.test(values.phone);
  const nameOk = values.name.trim().length >= 2;
  const subjectOk = values.subject.trim().length >= 2;
  const msgOk = values.message.trim().length >= 10;
  const canSubmit = emailOk && phoneOk && nameOk && subjectOk && msgOk && status.type !== "submitting";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.website) return; // honeypot triggered
    if (!canSubmit) {
      setStatus({ type: "error", message: "Please fill all required fields correctly." });
      return;
    }
    
    try {
      setStatus({ type: "submitting", message: "" });
      
      // Submit contact form via API following shared/api pattern
      const result = await submitContactForm({
        name: values.name,
        email: values.email,
        phone: values.phone,
        subject: values.subject,
        message: values.message,
        website: values.website // honeypot field
      });
      
      setStatus({ type: "success", message: result.message || "Thanks! We received your message and will get back to you soon." });
      setValues({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
      setTouched({});
    } catch (err) {
      console.error("Contact form submission error:", err);
      const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
      setStatus({ type: "error", message: errorMessage });
    }
  };

  return (
    <div className="mt-36 max-md:mt-0">
      <div className="sticky top-44 left-24 w-1/2 z-10 max-md:top-0 max-md:left-0">
        <BackButton />
      </div>  
        {/* <div className="w-full text-center  mb-7">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
             Got a Questions?
            </h1>
           
          </div> */}
          <PageHeader title="Got a Questions?" />
      <section className="mx-auto  grid max-w-6xl gap-18   lg:grid-cols-12 ">     
        
        <div className="lg:col-span-7 ">
            {/* Form Section */}
        <p className="my-3 text-muted-foreground ">
              We would love to hear from you to assist you with your orders, style advice, gift ideas, and more. 
              Please select your preferred method of contact below.
            </p>
          <form onSubmit={handleSubmit} noValidate className="mr-16 max-sm:mr-0 max-md:mr-0 max-lg:mr-0">

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                id={`${formId}-name`}
                label="Full Name"
                name="name"
                value={values.name}
                onChange={onChange}
                onBlur={onBlur}
                required
                placeholder="Your name"
                error={touched.name && !nameOk ? "Please enter at least 2 characters." : ""}
              />

              <Field
                id={`${formId}-email`}
                type="email"
                label="Email"
                name="email"
                value={values.email}
                onChange={onChange}
                onBlur={onBlur}
                required
                placeholder="you@example.com"
                error={touched.email && !emailOk ? "Enter a valid email." : ""}
              />

              <Field
                id={`${formId}-phone`}
                label="Phone (optional)"
                name="phone"
                value={values.phone}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="+91 98765 43210"
                error={touched.phone && !phoneOk ? "Enter a valid phone number." : ""}
              />

              <Field
                id={`${formId}-subject`}
                label="Subject"
                name="subject"
                value={values.subject}
                onChange={onChange}
                onBlur={onBlur}
                required
                placeholder="What's this about?"
                error={touched.subject && !subjectOk ? "Please enter at least 2 characters." : ""}
              />

              <div className="sm:col-span-2">
                <Field
                  id={`${formId}-message`}
                  as="textarea"
                  rows={6}
                  label="Message"
                  name="message"
                  value={values.message}
                  onChange={onChange}
                  onBlur={onBlur}
                  required
                  placeholder="Tell us about your query..."
                  error={touched.message && !msgOk ? "Please enter at least 10 characters." : ""}
                />
              </div>

              {/* Honeypot */}
              <div className="hidden">
                <label htmlFor={`${formId}-website`} className="text-[1.0625rem]">Website</label>
                <input 
                  id={`${formId}-website`} 
                  name="website" 
                  value={values.website} 
                  onChange={onChange} 
                  className="mt-1 w-full  border bg-background px-3 py-2" 
                />
              </div>
            </div>

            {status.type !== "idle" && status.message && (
              <p
                className={`mt-4 text-[1.0625rem] ${
                  status.type === "success" ? "text-green-600" : 
                  status.type === "error" ? "text-red-600" : "text-muted-foreground"
                }`}
              >
                {status.message}
              </p>
            )}

            <div className="mt-4 flex h-16 items-center gap-3">
              <button
                type="submit"
                disabled={!canSubmit}
                className="btn-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status.type === "submitting" ? "Sending…" : "Send message"}
              </button>
            </div>
          </form>
        </div>
        {/* Sidebar Section - Fixed structure */}
        <aside className="lg:col-span-5 space-y-6 ">
         

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-medium">Get in touch</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Infotile title="Email" value="info@garava.in" href="mailto:info@garava.in" />
              <Infotile title="Phone" value="(+91) 7738543881" href="tel:+917738543881" />
              <Infotile title="WhatsApp" value="Chat now" href="https://wa.me/917738543881" />
              <Infotile title="Instagram" value="@garava.in" href="https://www.instagram.com/garavaofficial?igsh=MTE2MWZrMzU1aGMx" />
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h3 className="text-[1.0625rem] font-semibold">FAQ</h3>
            <ul className="mt-3 space-y-3 text-[1.0625rem]">
              <li>
                <Summary title="Do you work with natural gemstones? ">
Yes, we use only natural and ethically sourced gemstones.                </Summary>
              </li>
              <li>
                <Summary title="Can I resize my ring?">
                  Yes, we offer complimentary resizing for select styles within 30 days of purchase.
                </Summary>
              </li>
            </ul>
          </div>
        </aside>
      </section> 
    </div>
  );
};

export default Contact;