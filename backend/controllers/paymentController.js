const { client } = require('../models/paypal');
const paypal = require('@paypal/checkout-server-sdk');
const Package = require('../models/Package');
const vipController = require('../controllers/vipController'); // Import vipcontroller.js

async function createPayment(req, res) {
    const { packageId, userId } = req.body;  // Nhận userId từ request body

    try {
        // Tìm gói dịch vụ từ cơ sở dữ liệu
        const package = await Package.findById(packageId);
        if (!package) {
            return res.status(404).json({ error: 'Package not found' });
        }
        // Tạo yêu cầu thanh toán với thông tin gói dịch vụ
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: package.price.toFixed(2)  // Chuyển đổi giá thành chuỗi định dạng "xx.xx"
                },
                description: package.description
            }],
            application_context: {
                return_url: `http://appchodocutest.ddns.net:3000/payments/success?userId=${userId}&packageId=${packageId}`,  // Thêm packageId vào URL
                cancel_url: 'http://appchodocutest.ddns.net:3000/payments/cancel'
            }
        });

        console.log("userId laaa:", userId); // Ghi log để kiểm tra userId
        console.log("package", package);
        const response = await client.execute(request);

        // Lấy approval URL từ phản hồi của PayPal
        const approvalUrl = response.result.links.find(link => link.rel === 'approve').href;

        // Trả về orderId và approval URL cho client
        res.status(200).json({ orderId: response.result.id, approvalUrl: approvalUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


async function cancelPayment(req, res) {
    return res.status(400).json({ 
        error: 'Payment was not completed', 
        success: false,
    });
    // res.redirect('exp://127.0.0.1:8081/package/cancel');  // Redirect về app Expo khi hủy thanh toán
}

// async function paymentSuccess(req, res) {
//     const { token, PayerID, userId, packageId } = req.query;  // Nhận packageId từ query params
//     console.log('Received parameters:', { token, PayerID, userId, packageId });  // Log các tham số nhận được

//     if (!token || !PayerID || !userId || !packageId) {
//         console.log('Missing token, PayerID, userId, or packageId');
//         return res.status(400).json({ error: 'Missing token, PayerID, userId, or packageId' });
//     }

//     const request = new paypal.orders.OrdersCaptureRequest(token); 
//     request.requestBody({}); 

//     try {
//         const response = await client.execute(request);

//         console.log('Capture Payment Response:', JSON.stringify(response.result, null, 2));

//         const { status } = response.result;

//         if (status === 'COMPLETED') {
//             console.log('Received packageId in paymentSuccess:', packageId);  // Log packageId

//             const package = await Package.findById(packageId);
//             if (!package) {
//                 console.log('Package not found with ID:', packageId);
//                 return res.status(404).json({ error: 'Package not found' });
//             } else {
//                 console.log('Package found:', package);  // Log gói dịch vụ tìm thấy
//             }            
//                 // Thực hiện nâng cấp VIP
//                 console.log('Upgrading VIP for user:', userId, 'with package:', package);
//                 const result = await vipController.upgradeToVip({ userId, package });
//                 console.log('Payment was successful with Order ID:', response.result.id);

//             if (result.message === 'User not found') {
//                 return res.status(404).json({ error: 'User not found' });
//             }

//             if (result.message === 'Internal server error') {
//                 return res.status(500).json({ error: 'Internal server error' });
//             }
//             console.log('Payment was successful with Order ID:', response.result.id);
//             // return res.redirect(`exp://127.0.0.1:8081/payments/success?userId=${userId}`);
//         } else {
//             console.log('Payment was not completed. Status:', status);
//             return res.redirect('exp://127.0.0.1:8081/package/cancel');
//         }

//     } catch (error) {
//         console.error('Error capturing payment:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// }



async function paymentSuccess(req, res) {
    const { token, PayerID, userId, packageId } = req.query;  // Nhận packageId từ query params
    // console.log('Received parameters:', { token, PayerID, userId, packageId });  // Log các tham số nhận được

    if (!token || !PayerID || !userId || !packageId) {
        console.log('Missing token, PayerID, userId, or packageId');
        return res.status(400).json({ error: 'Missing token, PayerID, userId, or packageId' });
    }

    const request = new paypal.orders.OrdersCaptureRequest(token); 
    request.requestBody({}); 

    try {
        const response = await client.execute(request);
        console.log('Payment was successful with Order ID:', response.result.id);

        // console.log('Capture Payment Response:', JSON.stringify(response.result, null, 2));
        const { status } = response.result;
        // if (orderDetails.status === 'COMPLETED' || orderDetails.status === 'CAPTURED') {
        //     console.log('Order already captured.');
        if (status === 'COMPLETED') {
            // console.log('Received packageId in paymentSuccess:', packageId);  // Log packageId

            const package = await Package.findById(packageId);
            if (!package) {
                console.log('Package not found with ID:', packageId);
                return res.status(404).json({ error: 'Package not found' });
            } else { 
                console.log('Package found:', package);  // Log gói dịch vụ tìm thấy
            }            
                
            // Thực hiện nâng cấp VIP
            // console.log('Upgrading VIP for user:', userId, 'with package:', package);
            const result = await vipController.upgradeToVip({ userId, package });
            console.log('message', result.message );
            // Trả về thông tin nâng cấp VIP cho frontend
            return res.status(200).json({
                // success: true,
                message: result.message,
                vipExpiryDate: result.vipExpiryDate,
                rewardPoints: result.rewardPoints,
            });
            //             // return res.redirect(`exp://127.0.0.1:8081/payments/success?userId=${userId}`)
        } else {
            console.log('Payment was not completed. Status:', status);
            return res.status(400).json({ 
            error: 'Payment was not completed', 
            success: false,
            message: result.message,
        });
            //             return res.redirect('exp://127.0.0.1:8081/package/cancel');
        }

    } catch (error) {
        console.error('Error capturing payment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function packages(req, res) {
    try {
        const packages = await Package.find();
        res.status(200).json(packages);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function newpackages(req, res) {
    try {
        const { name, description, price, duration, points } = req.body;

        // Tạo một gói sản phẩm mới trong cơ sở dữ liệu
        const newPackage = await Package.create({
            name,
            description,
            price,
            duration, // Sẽ bị bỏ qua nếu đây là gói tích điểm
            points,   // Sẽ bị bỏ qua nếu đây là gói VIP
        });

        res.status(201).json(newPackage); // Trả về thông tin của gói sản phẩm mới
    } catch (error) {
        console.error('Error creating package:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {
    createPayment,  packages, newpackages,  paymentSuccess, cancelPayment
};
