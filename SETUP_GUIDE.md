# ✅ Complete Setup Guide - Order System with Telegram Notifications

## 🎯 What This Does
Customer visits your website → selects receiver → selects package → enters their serial number → uploads Telebirr payment screenshot → submits → **YOU get Telegram notification** with all details + screenshot.

This is a simple, effective order management system perfect for selling server packages, digital products, or any service where you need instant Telegram notifications with payment proof.

---

## 📋 Files in This Project

```
mudin/
├── index.html        → Order form UI (responsive, mobile-friendly)
├── bot.js           → Express server + Telegram bot logic
├── package.json     → Node.js dependencies
├── .env.example     → Environment variables template
├── README.md        → Project overview
└── SETUP_GUIDE.md   → This file
```

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Your Telegram Bot (@BotFather)

1. **Open Telegram** and search for **@BotFather**
2. Start a chat and send: `/newbot`
3. Choose a name for your bot (e.g., `Server Orders Bot`)
4. Choose a username (must end in `bot`, e.g., `MyServerOrdersBot`)
5. **BotFather will give you a token** – copy it (looks like: `1234567890:ABCdefGHI-jklMNOpqrsTUVwxyz`)
6. Save this token securely

### Step 2: Get Your Chat ID (@userinfobot)

1. **Open Telegram** and search for **@userinfobot** OR **@getmyid_bot**
2. Start the bot and send any message (or it may show your ID automatically)
3. **Note your Chat ID** (a number like `123456789` or negative for groups)
4. This is where you'll receive all order notifications

> **Pro Tip:** Start a chat with YOUR bot first, then send a message to it. Then use @userinfobot to get your chat ID. This ensures your bot can message you.

### Step 3: Configure Environment

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Open .env and fill in:
# - BOT_TOKEN=your_actual_token_from_step_1
# - ADMIN_CHAT_ID=your_chat_id_from_step_2
# - PORT=3000 (keep default unless you change it)
```

### Step 4: Run & Test

```bash
npm start
```

Expected output:
```
📱 Starting Server Package Order System...
Server running on http://localhost:3000
✅ Telegram bot configured
```

Open **http://localhost:3000** in your browser and test the form.

---

## 🌐 Deploy to Internet (Free)

### Option A: Railway.app **(Recommended)**

1. **Push code to GitHub** (create new repository)
2. Sign up at [railway.app](https://railway.app) (use GitHub login)
3. Click **"New Project"** → **"Deploy from GitHub"**
4. Select your repository
5. Railway detects it's a Node.js app automatically
6. Go to **Variables** tab → add:
   - `BOT_TOKEN` → your bot token
   - `ADMIN_CHAT_ID` → your chat ID
   - `PORT` → `3000` (or Railway's default `$PORT`)
7. Deploy! Your URL will be: `https://your-project.up.railway.app`

✅ **Pros:** Easy, free (500 hours/month), automatic HTTPS, persistent storage

### Option B: Render.com

1. Push to GitHub
2. Sign up at [render.com](https://render.com)
3. Click **New Web Service**
4. Connect your GitHub repo
5. Settings:
   - Name: any name
   - Environment: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add Environment Variables:
   - `BOT_TOKEN` → your token
   - `ADMIN_CHAT_ID` → your chat ID
   - `PORT` → `10000`
7. Create Web Service

⚠️ **Note:** Render free tier sleeps after 15 mins of inactivity (first request wakes it up – may cause delay in Telegram notification).

### Option C: Local with ngrok (Temporary Testing)

```bash
# 1. Download and install ngrok from https://ngrok.com
# 2. Run your server:
npm start

# 3. In another terminal, expose port 3000:
ngrok http 3000

# 4. ngrok gives you a public URL like: https://abc123.ngrok.io
# 5. Share that URL with customers temporarily
```

❌ **Not recommended for production** – URL changes each time, limited features.

---

## 📱 How It Works (Customer Flow)

```
Step 1: Select Receiver
└─ Customer chooses their bank (Ethio Telecom / CBE / Dashen / Awash)

Step 2: Select Package
└─ Customer views and selects package tier
   └─ Basic: 5,000 ETB
   └─ Pro: 12,000 ETB
   └─ Enterprise: 25,000 ETB

Step 3: Enter Details
└─ Customer enters:
   ├─ Serial number (auto-generated format allowed but manual entry)
   ├─ Full name
   ├─ Phone number
   └─ Uploads Telebirr payment screenshot

Step 4: Submit
└─ Form validates → sends data to server → server:
   ├─ Saves screenshot to `/uploads` folder
   ├─ Generates unique serial (if not provided)
   ├─ Sends Telegram notification to YOUR chat with:
   │  ├─ Order details (name, package, amount, receiver, phone, date)
   │  └─ Payment screenshot photo
   └─ Shows success page to customer
```

---

## 🔧 Customization

### Change Package Names / Prices
**File:** `index.html` lines **380-392**

```html
<div class="option" data-value="Basic" data-price="5000">
    <span class="option-name">Basic</span>
    <span class="option-price">5,000 ETB</span>
</div>
```

Edit `data-value` (internal identifier) and `data-price` (amount in ETB). Keep in sync with `bot.js` if you want auto-generated serial codes to match.

### Change Receivers (Banks/Providers)
**File:** `index.html` lines **362-373**

```html
<div class="option" data-value="Ethio Telecom">...</div>
```

Also update `bot.js` lines **53-58** for serial code generation:

```javascript
const receiverCode = {
    'Ethio Telecom': 'ET',
    'CBE': 'CB',
    'Dashen': 'DS',
    'Awash': 'AW'
}[receiver] || 'XX';
```

### Change Serial Format
**File:** `bot.js` lines **46-67**

The `generateSerial()` function creates format: `SRV-YYMMDD-RECEIVER-PACKAGE-RANDOM`

Example: `SRV-240420-ET-BAS-AB12`

Customize the structure by editing:
```javascript
return `SRV-${year}${month}${day}-${receiverCode}-${packageCode}-${random}`;
```

### Change Colors
**File:** `index.html` lines **15-26** (CSS variables)

```css
:root {
    --primary: #2563eb;        /* Main blue */
    --primary-dark: #1d4ed8;   /* Hover/active */
    --success: #10b981;        /* Green */
    --error: #ef4444;          /* Red */
    --gray-100: #f3f4f6;       /* Background */
    --gray-200: #e5e7eb;       /* Borders */
    --gray-300: #d1d5db;       /* Disabled */
    --gray-500: #6b7280;       /* Muted text */
    --gray-700: #374151;       /* Headers */
    --gray-900: #111827;       /* Dark text */
}
```

### Add More Fields (e.g., Email)

1. Add input in `index.html` inside the form (step 3, ~line 420):

```html
<div class="form-group">
    <label>Email Address</label>
    <input type="email" id="email" placeholder="your@email.com" required>
</div>
```

2. Add to `bot.js` validation (around line 115 where form data is parsed):

```javascript
const email = req.body.email || 'Not provided';
```

3. Include in Telegram message (around line 75):

```javascript
`*Email:* ${orderData.email}\n` +
```

---

## ❓ Troubleshooting

### Bot Not Sending Messages
**Causes & Fixes:**
1. **Bot token incorrect** → Re-check token from @BotFather (no spaces)
2. **Chat ID wrong** → Use @userinfobot to confirm your ID
3. **Bot blocked you** → Unblock your bot in Telegram and send `/start`
4. **Bot hasn't been started** → Send `/start` to your bot first

**Quick test:**
```
curl -X POST http://localhost:3000/test -H "Content-Type: application/json" -d "{\"chatId\": \"YOUR_CHAT_ID\"}"
```

### "Module not found" Error
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Image Upload Fails
**Check:** File size max is **10MB** (bot.js line 14). Larger images fail.

**Fix:** Compress screenshots before upload or increase limit:
```javascript
limits: { fileSize: 20 * 1024 * 1024 }  // 20MB
```

### Form Submits But No Telegram
**Check server logs** – server should show:
```
✅ Telegram notification sent: SRV-...
```

If you see: `📱 Telegram notification skipped` → `.env` not configured correctly.

### Port 3000 In Use
Change port in `.env`:
```
PORT=4000
```

Then access at `http://localhost:4000`

### Deployment Fails on Railway
**Common fixes:**
1. **No package.json** → Ensure all files committed to GitHub
2. **Missing start script** → package.json must have `"start": "node bot.js"`
3. **Build fails** → Check `node --version` locally matches Railway (Node 18+)

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│   Customer      │
│   Browser       │
└────────┬────────┘
         │ 1. Fill form
         │ 2. Upload image
         ▼
┌─────────────────────────────────────────┐
│  index.html (Frontend)                  │
│  - Client-side validation               │
│  - Preview screenshot                   │
│  - Captures form data                   │
└────────┬────────────────────────────────┘
         │ 3. POST /submit
         │    ├─ form fields (JSON)
         │    └─ image (multipart)
         ▼
┌─────────────────────────────────────────┐
│  bot.js (Express Server)                │
│  POST /submit:                          │
│  1. Multer saves image to /uploads/     │
│  2. Generate serial number              │
│  3. sendTelegramNotification()          │
│     └─ bot.sendPhoto(chat_id, image)    │
│  4. Respond with success                │
└────────┬────────────────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Telegram Bot API    │
│  (bot.telegram.org)  │
└─────────┬────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  YOUR Telegram Chat                      │
│  📸 Screenshot + Order Details           │
└─────────────────────────────────────────┘
```

---

## 🔐 Security Considerations (Basic for Now)

⚠️ **This is a starter system. For production, add:**

1. **Rate Limiting** – Prevent spam submissions (use `express-rate-limit`)
2. **Input Validation** – Already basic, strengthen regex for phone/serial
3. **File Sanitization** – Generate random filenames (currently uses original name via multer)
4. **Environment Variables** – Already using `.env` (good!)
5. **HTTPS** – Railway/Render provide free SSL automatically
6. **Admin Authentication** – Add login to view orders web interface
7. **Database** – Store orders for backup/search (SQLite / PostgreSQL)

---

## 📈 Scaling (When You Get Busy)

### Phase 1: Add Database (Next Step)
Export order data to SQLite or PostgreSQL instead of just Telegram.

**Schema example:**
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    serial VARCHAR(50) UNIQUE,
    package VARCHAR(50),
    amount DECIMAL,
    receiver VARCHAR(50),
    customer_name VARCHAR(100),
    phone VARCHAR(20),
    screenshot_path VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Phase 2: Automated Delivery
Auto-email serial numbers after Telegram confirmation.

### Phase 3: Admin Dashboard
Simple web panel at `/admin` to:
- View all orders
- Mark as delivered
- Export to CSV
- Search by serial/name/phone

### Phase 4: Email Notifications
Send order confirmation to customer email + daily summary to you.

---

## 🎯 Ready to Launch Checklist

Before going live, verify:

- [ ] Telegram bot token is correct and working
- [ ] Your chat ID is correct
- [ ] `.env` file is uploaded to deployment (NOT committed to GitHub)
- [ ] Screenshot upload is tested (image appears in Telegram)
- [ ] Serial number format is correct
- [ ] All three package options have correct prices
- [ ] All four receiver options are correct
- [ ] Form validation works (try submitting empty)
- [ ] Success page displays after submission
- [ ] Public URL loads (if deployed)
- [ ] Mobile version tested (responsive)
- [ ] Port number is correct for deployment platform
- [ ] `package.json` includes all dependencies
- [ ] Telegram bot receives message with photo within 5 seconds

---

## 💡 Tips for Success

1. **Test thoroughly** – Submit 3–5 test orders with different packages
2. **Use professional names** – E.g., "Enterprise Plan" sounds more premium
3. **Add logo** – Put your company logo in `index.html` header
4. **Set phone format hint** – Add placeholder: `+251 91 123 4567`
5. **Keep bot active** – If using Railway/Render, they stay online 24/7 free
6. **Backup screenshots** – Periodically download `/uploads` folder to your PC
7. **Set up Telegram notifications on multiple devices** – Add bot to group chat with team
8. **Monitor logs** – Railway/Render provide log streaming to catch errors
9. **Rename "Serial Number" to "Serial Code"** if auto-generated (less confusion)
10. **Add order number prefix** like `ORD-001` for easier tracking

---

## 🆘 Need Help?

| Issue | Solution |
|---|---|
| No Telegram notification | Verify `.env` vars, send `/start` to bot |
| Image not arriving | Check file size <10MB, check uploads/ folder permissions |
| Form stuck on loading | Check network tab, server may have crashed |
| Colors look wrong | Edit CSS variables in `index.html` |
| Change package names | Edit `index.html` lines 380-392 AND `bot.js` lines 60-64 |
| Bot stops working after hours | Railway/Render free tier keeps alive; local ngrok stops |
| Duplicate serial numbers | Increase random chars or add timestamp milliseconds |

### Common Fixes

**Reset bot token:**
```bash
# In Telegram, send /token to @BotFather, then /revoke, get new token
# Update .env and redeploy
```

**Clear uploads folder:**
```bash
rm -rf uploads/*
mkdir uploads
```

**Restart server:**
```bash
# If running locally
Ctrl+C → npm start

# If on Railway/Render
Use dashboard → "Restart" button
```

---

## 📞 Next Steps After Setup

1. **Share URL** – Send the live link to first customers
2. **Monitor Telegram** – Watch for incoming orders, confirm receipt
3. **Deliver packages** – Serial number + package access credentials
4. **Collect feedback** – Ask first 5 customers for improvements
5. **Add more packages** – Expand options as you grow
6. **Consider automation** – Auto-email serial numbers upon order
7. **Add order history** – Simple table in admin panel
8. **Set up backup** – Daily AWS S3 or Google Drive backup of uploads

---

## 🆓 Advanced (Optional)

**Want these features? Add yourself:**

- ✅ **Admin login** → sessions + JWT
- ✅ **Order history page** → list all submitted orders
- ✅ **CSV export** → download all orders spreadsheet
- ✅ **Email receipts** → nodemailer + SMTP/Gmail
- ✅ **Multiple admins** → group chat already works
- ✅ **Discount codes** → add promo field, validate before submit
- ✅ **Payment verification** → integrate Telebirr API to check payment status
- ✅ **Webhook instead of polling** → more efficient bot.js

---

## 📚 Resources

- **Node.js docs:** https://nodejs.org/docs
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Express docs:** https://expressjs.com/
- **Multer docs:** https://github.com/expressjs/multer
- **Railway guide:** https://docs.railway.app/
- **Render docs:** https://render.com/docs

---

**You're all set! 🎉** Your order system is ready to accept payments and send you Telegram notifications instantly.

Need help? Check the troubleshooting table above or review the console logs (`railway logs` or local terminal).
