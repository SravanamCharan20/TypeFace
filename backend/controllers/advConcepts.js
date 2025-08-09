// In-memory store to track last request time per IP
const ipRequestMap = {};

export const generateOtp = async (req, res) => {
  const ip = req.ip;

  const currentTime = Date.now();
  const previousTime = ipRequestMap[ip];

  if (previousTime && currentTime - previousTime < 10000) {
    const waitTime = Math.ceil((10000 - (currentTime - previousTime)) / 1000);
    return res.status(429).json({
      error: `Please wait ${waitTime} more second(s) before requesting another OTP.`,
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save this request timestamp
  ipRequestMap[ip] = currentTime;

  return res.status(200).json({ otp });
};