require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static(__dirname));

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

function generateSerial(packageCode) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const code = packageCode || 'ALL';
    
    return `STR-${year}${month}-${code}-${random}`;
}

async function sendTelegramNotification(orderData, imagePath) {
    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
        console.log('📱 Telegram notification skipped (no config)');
        return false;
    }

    const message = `⚽ *New Football Subscription Order*\n\n` +
        `*Serial:* \`${orderData.serial}\`\n` +
        `*Package:* ${orderData.package}\n` +
        `*Amount:* ${orderData.amount} ETB\n` +
        `*Customer:* ${orderData.customerName}\n` +
        `*Phone:* ${orderData.phone}\n` +
        `*Access:* All Leagues\n` +
        `*Date:* ${new Date().toLocaleString()}`;

    try {
        if (imagePath && fs.existsSync(imagePath)) {
            const FormData = require('form-data');
            const form = new FormData();
            form.append('chat_id', ADMIN_CHAT_ID);
            form.append('caption', message);
            form.append('parse_mode', 'Markdown');
            form.append('photo', fs.createReadStream(imagePath));

            await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
                headers: form.getHeaders()
            });
        } else {
            await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                chat_id: ADMIN_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            });
        }
        console.log('✅ Telegram notification sent:', orderData.serial);
        return true;
    } catch (error) {
        console.error('❌ Telegram send error:', error.response?.data || error.message);
        return false;
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/order', upload.single('screenshot'), async (req, res) => {
    console.log('📨 Received order request');
    console.log('   Body:', req.body);
    console.log('   File:', req.file ? req.file.path : 'NONE');
    
    try {
        const { serial, package: packageName, packageCode, amount, customerName, phone } = req.body;
        
        if (!serial || !packageName || !amount || !customerName || !phone) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        if (!req.file) {
            console.log('❌ Missing payment screenshot');
            return res.status(400).json({ 
                success: false, 
                message: 'Payment screenshot is required' 
            });
        }
        
        const orderData = {
            serial,
            package: packageName,
            amount: parseInt(amount),
            customerName,
            phone
        };
        
        console.log('📤 Sending Telegram notification...');
        const telegramSent = await sendTelegramNotification(orderData, req.file.path);
        console.log('📱 Telegram sent:', telegramSent);
        
        setTimeout(() => {
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                fs.unlink(req.file.path, () => {});
            }
        }, 5000);
        
        res.json({ 
            success: true, 
            serial: orderData.serial,
            telegramSent
        });
        
    } catch (error) {
        console.error('❌ Order error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error processing order' 
        });
    }
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal server error' 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📋 API endpoint: http://localhost:${PORT}/api/order`);
});

module.exports = app;