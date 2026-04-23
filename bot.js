require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

let bot;
if (BOT_TOKEN) {
    bot = new TelegramBot(BOT_TOKEN, { polling: false });
}

if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.log('⚠️  Warning: BOT_TOKEN or ADMIN_CHAT_ID not configured!');
    console.log('   Get BOT_TOKEN from @BotFather on Telegram');
    console.log('   Get ADMIN_CHAT_ID from @userinfobot on Telegram');
    console.log('   Create a .env file with these variables\n');
}

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
    if (!bot || !ADMIN_CHAT_ID) {
        console.log('📱 Telegram notification skipped (no config):', orderData);
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
            await bot.sendPhoto(ADMIN_CHAT_ID, imagePath, { caption: message, parse_mode: 'Markdown' });
        } else {
            await bot.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'Markdown' });
        }
        console.log('✅ Telegram notification sent:', orderData.serial);
        return true;
    } catch (error) {
        console.error('❌ Telegram error:', error.message);
        return false;
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/order', upload.single('screenshot'), async (req, res) => {
    try {
        const { serial, package: packageName, packageCode, amount, customerName, phone } = req.body;
        
        if (!serial || !packageName || !amount || !customerName || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        if (!req.file) {
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
        
        const telegramSent = await sendTelegramNotification(orderData, req.file.path);
        
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
        console.error('Order error:', error);
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