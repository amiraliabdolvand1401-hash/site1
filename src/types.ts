export interface CoinInventory {
  imami: number;
  bahar: number;
  nim: number;
  rob: number;
  gerami: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  balanceToman: number;
  inventory: CoinInventory;
  isVerified: boolean;
  role: 'admin' | 'user';
  createdAt: string;
  nationalCode?: string;
  cardNumber?: string;
  cardPhotoUrl?: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  kycRejectReason?: string;
}

export type CoinType = 'imami' | 'bahar' | 'nim' | 'rob' | 'gerami' | 'gold18' | 'goldMelted' | 'usd' | 'eur' | 'btc' | 'eth' | 'usdt';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'buy' | 'sell';
  coinType: CoinType;
  coinLabel: string;
  amount: number;
  pricePerCoin: number;
  totalPrice: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface SMSLog {
  id: string;
  recipientName: string;
  phone: string;
  message: string;
  status: 'sent' | 'failed';
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  body: string;
  userId: string; // 'all' or specific user ID
  createdAt: string;
}

export interface HistoricalPrice {
  date: string;
  imami: number;
  bahar: number;
  nim: number;
  rob: number;
  gerami: number;
  gold18: number;
  goldMelted: number;
  usd: number;
  eur: number;
  btc: number;
  eth: number;
  usdt: number;
}

export interface DatabaseState {
  users: User[];
  transactions: Transaction[];
  sms: SMSLog[];
  notifications: SystemNotification[];
  historicalPrices: HistoricalPrice[];
}

export const COIN_DETAILS: Record<CoinType, { label: string; description: string; weight: string; purity: string }> = {
  imami: {
    label: "سکه امامی",
    description: "سکه طرح جدید ضرب سال ۱۳۸۶ به بعد با تقاضای بالا در بازار ایران",
    weight: "۸.۱۳۳ گرم",
    purity: "۹۰۰ (۲۲ عیار)"
  },
  bahar: {
    label: "سکه بهار آزادی",
    description: "سکه طرح قدیم ضرب سال‌های ۱۳۵۸ تا ۱۳۸۶ با حباب کمتر",
    weight: "۸.۱۳۳ گرم",
    purity: "۹۰۰ (۲۲ عیار)"
  },
  nim: {
    label: "نیم سکه",
    description: "نیم سکه بهار آزادی، مناسب برای سرمایه‌گذاری‌های میان‌رده",
    weight: "۴.۰۶۶ گرم",
    purity: "۹۰۰ (۲۲ عیار)"
  },
  rob: {
    label: "ربع سکه",
    description: "ربع سکه بهار آزادی با حباب قیمتی نسبتاً بالا و نقدشوندگی عالی",
    weight: "۲.۰۳۳ گرم",
    purity: "۹۰۰ (۲۲ عیار)"
  },
  gerami: {
    label: "سکه گرمی",
    description: "کوچک‌ترین قطع سکه رسمی بانک مرکزی، مناسب هدیه و بودجه‌های خرد",
    weight: "۱.۰۱۲ گرم",
    purity: "۹۰۰ (۲۲ عیار)"
  },
  gold18: {
    label: "طلای ۱۸ عیار",
    description: "طلای استاندارد بازار ایران، مناسب برای ساخت زیورآلات",
    weight: "۱ گرم",
    purity: "۷۵۰ (۱۸ عیار)"
  },
  goldMelted: {
    label: "طلای آب‌شده",
    description: "طلای مذاب و قالب‌گیری شده بدون اجرت ساخت، ایده‌آل برای سرمایه‌گذاری",
    weight: "۱ مثقال (حدود ۴.۳ گرم)",
    purity: "متغیر (معمولاً ۱۸ عیار)"
  },
  usd: {
    label: "دلار آمریکا",
    description: "ارز معتبر جهانی و معیار اصلی قیمت‌گذاری در بازارهای داخلی",
    weight: "اسکناس",
    purity: "حواله/نقدی"
  },
  eur: {
    label: "یورو",
    description: "ارز رسمی اتحادیه اروپا، دومین ارز پرکاربرد جهانی",
    weight: "اسکناس",
    purity: "حواله/نقدی"
  },
  btc: {
    label: "بیت‌کوین (BTC)",
    description: "اولین و معتبرترین ارز دیجیتال جهان",
    weight: "دیجیتال",
    purity: "شبکه Bitcoin"
  },
  eth: {
    label: "اتریوم (ETH)",
    description: "بزرگترین شبکه قراردادهای هوشمند و دومین رمزارز ارزشمند",
    weight: "دیجیتال",
    purity: "شبکه Ethereum"
  },
  usdt: {
    label: "تتر (USDT)",
    description: "استیبل‌کوین معادل دلار آمریکا در دنیای ارزهای دیجیتال",
    weight: "دیجیتال",
    purity: "شبکه‌های مختلف"
  }
};
