const { client } = require('../models/paypal');
const paypal = require('@paypal/checkout-server-sdk');
const Package = require('../models/Package');

async function createPayment(req, res) {
    const { packageId } = req.body;

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
            }]
        });

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

async function capturePayment(req, res) {
    const { orderId } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
        const response = await client.execute(request);
        const { status } = response.result;
        
        if (status === 'COMPLETED') {
            // Lưu trạng thái thanh toán hoặc thực hiện các hành động khác ở đây nếu cần
            res.status(200).json({ message: 'Payment completed successfully' });
        } else {
            res.status(400).json({ error: 'Payment not completed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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
    createPayment, capturePayment, packages, newpackages
};
