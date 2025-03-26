// middleware/verifyCaptcha.js
import fetch from 'node-fetch'; // Make sure node-fetch is installed

const verifyCaptcha = async (req, res, next) => {
  const { captchaToken } = req.body;

//   console.log("Received captchaToken:", captchaToken); // ✅ Debugging step

  if (!captchaToken) {
    return res.status(400).json({ message: "Captcha token is missing." });
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error("reCAPTCHA secret key is missing!");
      return res.status(500).json({ message: "Server misconfiguration." });
    }

    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";

    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey,
        response: captchaToken,
      }),
    });

    const data = await response.json();
    console.log("Google reCAPTCHA Response:", data); // ✅ Debugging step

    if (data.success) {
      // If verification succeeds, call next to continue to the next middleware or route handler
      return next();
    } else {
      return res.status(400).json({ message: "reCAPTCHA verification failed.", errors: data["error-codes"] });
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    res.status(500).json({ message: "Server error during reCAPTCHA verification." });
  }
};

export default verifyCaptcha;
