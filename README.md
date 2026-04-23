# Server Package Order System

## What is this?
A complete website + backend that:
- Customers select receiver (Ethio Telecom, CBE, Dashen, Awash)
- Select package (Basic/Pro/Enterprise)
- Enter serial number (auto-generated)
- Upload Telebirr payment screenshot
- Submit order
- **You receive Telegram notification** with serial + screenshot

## Setup (5 minutes)

### Step 1: Create Telegram Bot
1. Open Telegram, search for **@BotFather**
2. Send `/newbot`
3. Name it: `Server Orders Bot` (or any name)
4. Username: `YourNameOrdersBot` (must end with "bot")
5. **Copy the token** (format: `123456:ABC-xxxxx`)

### Step 2: Get Your Chat ID
1. Search for **@userinfobot** on Telegram
2. Send `/start` (if not started)
3. **Copy your Chat ID** (number like `123456789`)

### Step 3: Configure
```bash
# Copy example env file
copy .env.example .env

# Edit .env and add:
BOT_TOKEN=123456:ABC-xxxxx (from step 1)
ADMIN_CHAT_ID=123456789 (from step 2)
```

### Step 4: Install & Run
```bash
npm install
npm start
```

### Step 5: Open Website
Visit: `http://localhost:3000`

## Deployment Options (Free)

### Option A: Railway (Recommended - All-in-one)
1. Push code to GitHub
2. Go to [railway.app](https://railway.app), sign in with GitHub
3. New Project → Deploy from GitHub repo
4. Add Environment Variables:
   - `BOT_TOKEN` = your token
   - `ADMIN_CHAT_ID` = your chat ID
5. Deploy
6. Your site URL: `https://your-app.railway.app`

### Option B: Vercel (Frontend) + Railway (Backend) - Separate
**Backend (Railway):**
```bash
# In project root
git init
git add .
git commit -m "initial"
# Create new Railway project, connect GitHub
# Add env vars BOT_TOKEN and ADMIN_CHAT_ID
# Get URL: https://order-api.up.railway.app
```

**Frontend (Vercel):**
```bash
# Create new folder for frontend OR use same repo
# In index.html, change API endpoint:
# const API_URL = 'https://order-api.up.railway.app';
# Deploy to Vercel
```

### Option C: Render.com
1. Create account on [render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add Environment Variables
6. Deploy

## Testing

1. Start server: `npm start`
2. Open `http://localhost:3000`
3. Select receiver → Select package → Fill form → Upload any image
4. Submit
5. **Check your Telegram** - you should receive order notification with screenshot

## How It Works

```
Customer (Website)
    ↓ POST /api/order (form data + image)
Backend (Node.js)
    ↓ Sends to Telegram Bot API
Your Telegram (@YourBot)
    ↓ Receives message with:
       - Serial number
       - Package, Amount, Receiver
       - Customer name & phone
       - Payment screenshot (photo)
```

## File Structure

```
├── index.html      # Frontend (all-in-one HTML+CSS+JS)
├── bot.js          # Backend API + Telegram bot
├── package.json    # Dependencies
├── .env           # Your secrets (not in git)
└── .env.example   # Template
```

## Customization

### Change Packages
Edit `index.html` line 380-392 (package options) and adjust prices

### Change Receivers
Edit `index.html` line 362-373 (receiver options)

### Add More Banks
Add to both receiver selection and the code

### Custom Serial Format
Modify `generateSerial()` function in `bot.js` (lines 46-67)

## Troubleshooting

**Bot not sending messages:**
- Check BOT_TOKEN is correct
- Ensure ADMIN_CHAT_ID is your numeric chat ID (not @username)
- Start a chat with your bot first: `https://t.me/YourBotUsername?start=1`

**Image not uploading:**
- Check file size < 10MB
- Must be JPG, PNG, GIF, or WebP

**Local server not starting:**
- Run `npm install` first
- Ensure port 3000 is free

**"Module not found" errors:**
```bash
npm install
```

## Support

Email: your-email@example.com
Telegram: @YourTelegramUsername

## License

Free to use for your business.
