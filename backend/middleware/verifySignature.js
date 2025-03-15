const crypto = require('crypto');

/**
 * Middleware to verify Razorpay payment signature
 * Place this before the payment verification controller
 */
exports.verifyRazorpaySignature = (req, res, next) => {
  try {
    console.log('Verifying Razorpay signature');
    
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature 
    } = req.body;
    
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ 
        message: 'Missing required payment verification parameters',
        details: 'All of razorpay_payment_id, razorpay_order_id, and razorpay_signature are required'
      });
    }
    
    // Generate signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    
    // Compare signatures
    const isSignatureValid = generatedSignature === razorpay_signature;
    
    if (!isSignatureValid) {
      console.error('Signature verification failed');
      console.error('Expected:', generatedSignature);
      console.error('Received:', razorpay_signature);
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
    
    console.log('Razorpay signature verified successfully');
    next();
  } catch (error) {
    console.error('Error verifying Razorpay signature:', error);
    res.status(500).json({ message: 'Error verifying payment signature' });
  }
};
