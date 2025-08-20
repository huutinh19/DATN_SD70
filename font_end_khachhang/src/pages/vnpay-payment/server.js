const express = require('express');
const https = require('https');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Cấu hình CORS (đặt trước tất cả các route)
app.use(cors({
    origin: 'http://localhost:4000', // Cho phép origin từ frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Xử lý preflight request cho tất cả các route
app.options('*', cors());

app.use(express.json());

// Thông tin cấu hình MoMo
const config = {
    partnerCode: 'MOMO',
    accessKey: 'F8BBA842ECF85',
    secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    endpoint: 'https://test-payment.momo.vn',
    redirectUrl: 'http://localhost:4000/momo-payment',
    ipnUrl: 'http://localhost:8080/api/momo/notify',
};

// Tạo thanh toán MoMo
app.post('/api/momo/create-payment', async (req, res) => {
    try {
        const { amount, orderInfo } = req.body;

        const orderId = config.partnerCode + new Date().getTime();
        const requestId = orderId;
        const extraData = '';

        const rawSignature = `accessKey=${config.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${config.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${config.partnerCode}&redirectUrl=${config.redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
        const signature = crypto.createHmac('sha256', config.secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: config.partnerCode,
            accessKey: config.accessKey,
            requestId: requestId,
            amount: amount.toString(),
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: config.redirectUrl,
            ipnUrl: config.ipnUrl,
            extraData: extraData,
            requestType: 'captureWallet',
            signature: signature,
            lang: 'vi'
        };

        const response = await axios.post(
            `${config.endpoint}/v2/gateway/api/create`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.resultCode === 0) {
            res.json({
                success: true,
                payUrl: response.data.payUrl,
            });
        } else {
            res.status(400).json({
                success: false,
                message: response.data.message,
            });
        }
    } catch (error) {
        console.error('Error creating MoMo payment:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi tạo thanh toán MoMo',
        });
    }
});

// Xử lý callback từ MoMo (IPN)
app.post('/api/momo/notify', (req, res) => {
    const data = req.body;

    const rawSignature = `accessKey=${config.accessKey}&amount=${data.amount}&extraData=${data.extraData}&message=${data.message}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&orderType=${data.orderType}&partnerCode=${data.partnerCode}&payType=${data.payType}&requestId=${data.requestId}&responseTime=${data.responseTime}&resultCode=${data.resultCode}&transId=${data.transId}`;
    const signature = crypto.createHmac('sha256', config.secretKey)
        .update(rawSignature)
        .digest('hex');

    if (signature !== data.signature) {
        console.log('Invalid signature from MoMo');
        return res.status(400).json({ message: 'Invalid signature' });
    }

    if (data.resultCode === 0) {
        console.log('Payment successful:', data);
    } else {
        console.log('Payment failed:', data);
    }

    res.json({ message: 'Notification received' });
});

// Xử lý return URL từ MoMo
app.get('/api/momo/return', (req, res) => {
    const data = req.query;

    if (data.resultCode === '0') {
        console.log('MoMo payment return successful:', data);
        res.redirect('http://localhost:4000/momo-payment');
    } else {
        console.log('MoMo payment return failed:', data);
        res.redirect('http://localhost:4000/payment-failed');
    }
});

// Tạo hóa đơn khi thanh toán MoMo thành công
app.post('/api/bill/create-bill-client-momo/:transId', async (req, res) => {
    const { transId } = req.params;
    const paymentData = req.body;

    try {
        const bill = { id: transId, code: 'MOMO' + Date.now(), data: paymentData };
        res.json({ success: true, data: { data: bill } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});