"use client";

import { useState, useRef } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const FormPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [captchaToken, setCaptchaToken] = useState("");
  const recaptchaRef = useRef(null); // Ref for reCAPTCHA

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // console.log("Generated captchaToken:", captchaToken); // ✅ Debugging line
  
    if (!captchaToken) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          captchaToken,
        }),
      });
  
      const data = await response.json();
      alert(data.message);
  
      setCaptchaToken(""); // Reset captcha token
      recaptchaRef.current?.reset(); // Reset reCAPTCHA UI
    } catch (error) {
      console.error("Error verifying reCAPTCHA:", error);
      alert("reCAPTCHA verification failed. Please try again.");
    }
  };
  
  return (
    <div className="flex flex-col items-center p-6">
      <form onSubmit={handleSubmit} className="w-96 p-6 border rounded-lg shadow-lg space-y-4">
        <h2 className="text-xl font-bold">Submit Form</h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />

        {/* reCAPTCHA */}
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          ref={recaptchaRef}
          onChange={(token) => setCaptchaToken(token)}
        />

        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormPage;
