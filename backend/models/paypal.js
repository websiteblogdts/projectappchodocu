const paypal = require('@paypal/checkout-server-sdk');
const dotenv = require('dotenv');
dotenv.config();

const environment = process.env.PAYPAL_MODE === 'sandbox' 
    ? new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET)
    : new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);
  
    // console.log('PayPal Configuration:', {
    //     clientId: process.env.PAYPAL_CLIENT_ID,
    //     secret: process.env.PAYPAL_SECRET,
    //     mode: process.env.PAYPAL_MODE
    // });
    
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = { client };


