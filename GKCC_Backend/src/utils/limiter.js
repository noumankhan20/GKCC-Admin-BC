// Basic rate limiter middleware
const globalLimiter = (req, res, next) => {
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 500; // Max requests per IP in the time window
    const ip = req.ip; // Get client IP
    const now = Date.now();

    // Initialize the in-memory store for tracking requests
    if (!global.rateLimiter) {
        global.rateLimiter = {};
    }

    // Get or initialize data for the current IP
    const user = global.rateLimiter[ip] || { count: 0, startTime: now };

    // Check if the window has expired
    if (now - user.startTime > windowMs) {
        user.count = 1;
        user.startTime = now;
    } else {
        user.count += 1;
    }

    // Update the global rateLimiter object
    global.rateLimiter[ip] = user;

    // Check if the user exceeded the request limit
    if (user.count > maxRequests) {
        return res.status(429).json({ message: "Too many requests, please try again later." });
    }

    next();
};

export { globalLimiter };
