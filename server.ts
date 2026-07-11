import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Paths to database
const dbPath = path.join(process.cwd(), "src", "db.json");

// Helper to read database
function readDB() {
  try {
    if (!fs.existsSync(dbPath)) {
      return { users: [], transactions: [], sms: [], notifications: [], historicalPrices: [] };
    }
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading DB:", error);
    return { users: [], transactions: [], sms: [], notifications: [], historicalPrices: [] };
  }
}

// Helper to write database
function writeDB(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing DB:", error);
    return false;
  }
}

// ================= API ENDPOINTS =================

// 1. Get live prices from free API
app.get("/api/live-prices", async (req, res) => {
  try {
    const response = await fetch("https://api.brsapi.ir/Market/Gold_Currency.php?key=BDkBcSk1FZXEZTVI3KLeiTPZVsFdcxpL");
    if (!response.ok) {
      throw new Error(`API failed with status ${response.status}`);
    }
    const data: any = await response.json();
    const goldItems = data.gold || [];
    const currencyItems = data.currency || [];
    const cryptoItems = data.cryptocurrency || [];
    
    // Default fallback values
    let imami = 41500000;
    let bahar = 37500000;
    let nim = 23200000;
    let rob = 15200000;
    let gerami = 7000000;
    let gold18 = 3500000;
    let goldMelted = 15000000;
    let usd = 60000;
    let eur = 65000;
    let btc = 60000;
    let eth = 3000;
    let usdt = 1;

    goldItems.forEach((item: any) => {
      const priceToman = item.price;
      if (item.name === "سکه امامی") imami = priceToman;
      if (item.name === "سکه بهار آزادی") bahar = priceToman;
      if (item.name === "نیم سکه") nim = priceToman;
      if (item.name === "ربع سکه") rob = priceToman;
      if (item.name === "سکه یک گرمی") gerami = priceToman;
      if (item.name === "طلای 18 عیار") gold18 = priceToman;
      if (item.name === "طلای آب‌شده نقدی") goldMelted = priceToman;
    });

    currencyItems.forEach((item: any) => {
      if (item.name === "دلار") usd = item.price;
      if (item.name === "یورو") eur = item.price;
    });

    cryptoItems.forEach((item: any) => {
      // crypto price is in USD usually, but the API might return USD. Oh wait, we checked BRS earlier: price for crypto is in "دلار", and price value is a string or number like "63530".
      // But wait! We need its value in Toman, or we can just keep it in USD and multiply by `usd` rate. Or maybe the frontend expects it in Toman? The UI shows everything in Toman. Let's convert crypto to Toman if it's in USD.
      const priceUSD = parseFloat(item.price);
      if (item.name === "بیت‌کوین") btc = priceUSD;
      if (item.name === "اتریوم") eth = priceUSD;
      if (item.name === "تتر") usdt = priceUSD;
    });

    res.json({
      success: true,
      prices: { 
        imami, bahar, nim, rob, gerami, 
        gold18, goldMelted, 
        usd, eur, 
        btc: btc * usd, eth: eth * usd, usdt: usdt * usd 
      }
    });
  } catch (err: any) {
    console.error("Live Prices API Error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch live prices" });
  }
});

// 2. Get entire database state
app.get("/api/db", (req, res) => {
  const db = readDB();
  res.json(db);
});

// 2. Add or modify a user (balance, verification, etc.)
app.post("/api/users/update", (req, res) => {
  const { id, balanceToman, isVerified, inventory, name, phone, nationalCode, cardNumber, cardPhotoUrl, cardPhoto, verificationStatus, kycStatus } = req.body;
  const db = readDB();
  const userIndex = db.users.findIndex((u: any) => u.id === id);

  const isAdminEmail = (phone === "Ramezanigold.1405@gmail.com" || name?.toLowerCase().includes("ramezanigold.1405") || id === "Ramezanigold.1405");

  if (userIndex !== -1) {
    const user = db.users[userIndex];
    if (balanceToman !== undefined) user.balanceToman = balanceToman;
    if (isVerified !== undefined) user.isVerified = isVerified;
    if (inventory !== undefined) user.inventory = { ...user.inventory, ...inventory };
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (nationalCode !== undefined) user.nationalCode = nationalCode;
    if (cardNumber !== undefined) user.cardNumber = cardNumber;
    
    // Support both naming conventions
    const photo = cardPhoto || cardPhotoUrl;
    if (photo !== undefined) {
      user.cardPhoto = photo;
      user.cardPhotoUrl = photo;
    }
    
    const status = kycStatus || verificationStatus;
    if (status !== undefined) {
      user.kycStatus = status;
      user.verificationStatus = status;
      if (status === 'verified') user.isVerified = true;
      if (status === 'unverified' || status === 'rejected') user.isVerified = false;
    }
    
    if (isAdminEmail) {
      user.role = "admin";
      user.isVerified = true;
      user.kycStatus = 'verified';
      user.verificationStatus = 'verified';
    }

    writeDB(db);
    return res.json({ success: true, user });
  }

  // Create new user if not exists
  const status = isAdminEmail ? 'verified' : (kycStatus || verificationStatus || 'unverified');
  const photo = cardPhoto || cardPhotoUrl || "";
  const newUser = {
    id: id || "u_" + Date.now(),
    name: name || "کاربر جدید",
    phone: phone || "09120000000",
    balanceToman: balanceToman || 0,
    inventory: inventory || { imami: 0, bahar: 0, nim: 0, rob: 0, gerami: 0, gold18: 0, goldMelted: 0, usd: 0, eur: 0, btc: 0, eth: 0, usdt: 0 },
    isVerified: isAdminEmail ? true : (isVerified !== undefined ? isVerified : false),
    role: isAdminEmail ? "admin" : "user",
    nationalCode: nationalCode || "",
    cardNumber: cardNumber || "",
    cardPhoto: photo,
    cardPhotoUrl: photo,
    kycStatus: status,
    verificationStatus: status,
    createdAt: new Date().toISOString()
  };
  
  db.users.push(newUser);
  writeDB(db);
  res.json({ success: true, user: newUser });
});

// 3. Request a transaction
app.post("/api/transactions/create", (req, res) => {
  const { userId, type, coinType, coinLabel, amount, pricePerCoin } = req.body;
  const db = readDB();
  
  const user = db.users.find((u: any) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "کاربر یافت نشد" });
  }

  const totalPrice = amount * pricePerCoin;

  // Validation
  if (type === "buy") {
    if (user.balanceToman < totalPrice) {
      return res.status(400).json({ error: "موجودی ریالی شما برای این معامله کافی نیست" });
    }
  } else if (type === "sell") {
    const userCoinAmount = user.inventory[coinType] || 0;
    if (userCoinAmount < amount) {
      return res.status(400).json({ error: `تعداد کافی از ${coinLabel} در سبد دارایی شما وجود ندارد` });
    }
  }

  const newTx = {
    id: "t_" + Date.now(),
    userId,
    userName: user.name,
    type,
    coinType,
    coinLabel,
    amount,
    pricePerCoin,
    totalPrice,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  db.transactions.push(newTx);
  writeDB(db);
  res.json({ success: true, transaction: newTx });
});

// 4. Approve transaction
app.post("/api/transactions/approve", async (req, res) => {
  const { id } = req.body;
  const db = readDB();
  const txIndex = db.transactions.findIndex((t: any) => t.id === id);

  if (txIndex === -1) {
    return res.status(404).json({ error: "معامله یافت نشد" });
  }

  const tx = db.transactions[txIndex];
  if (tx.status !== "pending") {
    return res.status(400).json({ error: "این معامله قبلاً تعیین تکلیف شده است" });
  }

  const user = db.users.find((u: any) => u.id === tx.userId);
  if (!user) {
    return res.status(404).json({ error: "کاربر معامله‌کننده یافت نشد" });
  }

  // Update user balances
  if (tx.type === "buy") {
    if (user.balanceToman < tx.totalPrice) {
      return res.status(400).json({ error: "موجودی کاربر برای نهایی کردن معامله کافی نیست" });
    }
    user.balanceToman -= tx.totalPrice;
    user.inventory[tx.coinType] = (user.inventory[tx.coinType] || 0) + tx.amount;
  } else if (tx.type === "sell") {
    const userCoinAmount = user.inventory[tx.coinType] || 0;
    if (userCoinAmount < tx.amount) {
      return res.status(400).json({ error: "تعداد سکه در کیف دارایی کاربر کافی نیست" });
    }
    user.balanceToman += tx.totalPrice;
    user.inventory[tx.coinType] = userCoinAmount - tx.amount;
  }

  tx.status = "approved";
  
  // Auto-send a simulated or real SMS to the user about transaction approval
  const smsMessage = `معامله ${tx.type === "buy" ? "خرید" : "فروش"} ${tx.amount} عدد ${tx.coinLabel} با موفقیت تایید و اعمال شد. با تشکر، سکه رمضانی`;
  const newSms = {
    id: "s_" + Date.now(),
    recipientName: user.name,
    phone: user.phone,
    message: smsMessage,
    status: "sent",
    createdAt: new Date().toISOString()
  };

  if (process.env.SMS_IR_API_KEY) {
    try {
      const url = `https://api.sms.ir/v1/send`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'X-API-KEY': process.env.SMS_IR_API_KEY,
          'Accept': 'text/plain',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          lineNumber: null,
          messageText: smsMessage,
          mobiles: [user.phone]
        })
      });
      if (response.ok) newSms.status = "sent_real";
    } catch (err) {
      console.error("SMS.ir Auto-SMS Error:", err);
    }
  }

  db.sms.push(newSms);

  writeDB(db);
  res.json({ success: true, transaction: tx });
});

// 5. Reject transaction
app.post("/api/transactions/reject", (req, res) => {
  const { id } = req.body;
  const db = readDB();
  const txIndex = db.transactions.findIndex((t: any) => t.id === id);

  if (txIndex === -1) {
    return res.status(404).json({ error: "معامله یافت نشد" });
  }

  const tx = db.transactions[txIndex];
  if (tx.status !== "pending") {
    return res.status(400).json({ error: "این معامله قبلاً تعیین تکلیف شده است" });
  }

  tx.status = "rejected";
  writeDB(db);
  res.json({ success: true, transaction: tx });
});

// 6. Send/Record SMS (Simulated or Real Kavenegar if key exists)
app.post("/api/sms/send", async (req, res) => {
  const { recipientName, phone, message } = req.body;
  const db = readDB();

  const newSms = {
    id: "s_" + Date.now(),
    recipientName,
    phone,
    message,
    status: "sent",
    createdAt: new Date().toISOString()
  };

  // If we have an SMS.ir API key, let's actually send the SMS
  if (process.env.SMS_IR_API_KEY) {
    try {
      const url = `https://api.sms.ir/v1/send`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'X-API-KEY': process.env.SMS_IR_API_KEY,
          'Accept': 'text/plain',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          lineNumber: null,
          messageText: message,
          mobiles: [phone]
        })
      });
      
      if (!response.ok) {
        throw new Error('SMS.ir API failed');
      }
      
      // Mark as truly sent
      newSms.status = "sent_real";
    } catch (err) {
      console.error("SMS.ir SMS Error:", err);
      newSms.status = "failed_real";
    }
  }

  db.sms.push(newSms);
  writeDB(db);
  res.json({ success: true, sms: newSms });
});

// 7. Send notification
app.post("/api/notifications/send", (req, res) => {
  const { title, body, userId } = req.body;
  const db = readDB();

  const newNotification = {
    id: "n_" + Date.now(),
    title,
    body,
    userId: userId || "all",
    createdAt: new Date().toISOString()
  };

  db.notifications.push(newNotification);
  writeDB(db);
  res.json({ success: true, notification: newNotification });
});

// 8. Gemini AI Gold Coin Market Analyst
app.post("/api/gemini/analysis", async (req, res) => {
  const { prompt, coinContext } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      text: `### تحلیل آزمایشی (کلید هوش مصنوعی تعریف نشده است)

متاسفانه کلید \`GEMINI_API_KEY\` هنوز در تنظیمات برنامه ست نشده است. در حالت آزمایشی پاسخ زیر تقدیم می‌شود:

با توجه به نوسانات قیمت طلای جهانی (انس) و نوسانات نرخ ارز در بازار آزاد، انتظار می‌رود که در روزهای آینده شاهد تقاضای احتیاطی برای خرید **سکه امامی** و **ربع سکه** باشیم. مقایسه حباب ربع سکه نشان می‌دهد که حباب آن همچنان بالاست و ریسک بیشتری دارد، در حالی که خرید طلای آب شده یا سکه بهار آزادی با حباب کمتر گزینه‌های منطقی‌تری برای میان‌مدت هستند.`
    });
  }

  try {
    // Collect pricing context to inject into Gemini system instruction
    const db = readDB();
    const latestPrices = db.historicalPrices[db.historicalPrices.length - 1];
    
    const pricingContextStr = `
سکه امامی: ${latestPrices.imami.toLocaleString("fa-IR")} تومان
سکه بهار آزادی: ${latestPrices.bahar.toLocaleString("fa-IR")} تومان
نیم سکه: ${latestPrices.nim.toLocaleString("fa-IR")} تومان
ربع سکه: ${latestPrices.rob.toLocaleString("fa-IR")} تومان
سکه گرمی: ${latestPrices.gerami.toLocaleString("fa-IR")} تومان
تاریخ آخرین قیمت‌ها: ${latestPrices.date}
`;

    const systemInstruction = `شما یک کارشناس و تحلیل‌گر ارشد و زبده بازار طلا و سکه ایران در یک پلتفرم پیشرفته معاملاتی به نام "سکه رمضانی" هستید.
وظیفه شما ارائه تحلیل‌های بسیار علمی، تکنیکال و فاندامنتال، پاسخ به سوالات سرمایه‌گذاران، مقایسه جذابیت خرید سکه‌های مختلف و پیشنهاد راهبردهای مدیریت ریسک به زبان فارسی است.
قیمت‌های فعلی بازار سکه بدین شرح است:
${pricingContextStr}

قوانین مهم:
۱. همواره از فونت شیک و زبان کاملا محترمانه و حرفه‌ای فارسی استفاده کنید.
۲. پاسخ‌ها را با ساختار شفاف مارک‌داون (سرتیترها، نقاط کلیدی، جداول و نقل‌قول‌ها) تزیین کنید تا خواندن آن برای کاربر جذاب باشد.
۳. در تحلیل‌های خود به مفهوم "حباب سکه" و نرخ برابری دلار بازار آزاد و انس جهانی طلا اشاره کنید.
۴. همواره ریسک‌های سرمایه‌گذاری را گوشزد کرده و اعلام کنید که تحلیل‌ها توصیه مستقیم معاملاتی نیستند بلکه راهنمایی برای تصمیم‌گیری آگاهانه می‌باشند.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "خطا در ارتباط با هوش مصنوعی", details: error.message });
  }
});

// ================= VITE OR PRODUCTION BUILD MIDDLEWARE =================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
