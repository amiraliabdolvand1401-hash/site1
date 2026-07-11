import React, { useState, useEffect, useRef } from 'react';
import AuthScreen from './components/AuthScreen';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { DatabaseState, User, CoinType, Transaction, COIN_DETAILS } from './types';
import CoinCharts from './components/CoinCharts';
import GeminiAnalyst from './components/GeminiAnalyst';
import OrderDesk from './components/OrderDesk';
import AdminDashboard from './components/AdminDashboard';
import PriceAlertsSetup from './components/PriceAlertsSetup';
import TransactionsHistory from './components/TransactionsHistory';
import VerificationSection from './components/VerificationSection';
import GuideSection from './components/GuideSection';
import ContactSection from './components/ContactSection';
import { 
  Coins, 
  TrendingUp, 
  Sparkles, 
  Bell, 
  User as UserIcon, 
  History, 
  Settings, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeftRight, 
  Lock,
  Wallet,
  ShieldCheck,
  UserCheck,
  BookOpen,
  MessageSquare,
  Shield,
  Mail,
  Phone
} from 'lucide-react';

interface ToastState {
  show: boolean;
  title: string;
  msg: string;
  type: 'success' | 'error' | 'info';
}

const LOCAL_FALLBACK_DB: DatabaseState = {
  users: [
    {
      id: "u1",
      name: "امیرعلی عبدالملکی",
      phone: "09121112233",
      balanceToman: 150000000,
      inventory: { imami: 2, bahar: 3, nim: 5, rob: 8, gerami: 12 },
      isVerified: true,
      role: "admin",
      createdAt: "2026-06-01T10:00:00Z"
    },
    {
      id: "u2",
      name: "سارا کریمی",
      phone: "09183456789",
      balanceToman: 45000000,
      inventory: { imami: 1, bahar: 0, nim: 2, rob: 4, gerami: 5 },
      isVerified: true,
      role: "user",
      createdAt: "2026-06-15T14:30:00Z"
    },
    {
      id: "u3",
      name: "محمد حسینی",
      phone: "09359876543",
      balanceToman: 12000000,
      inventory: { imami: 0, bahar: 1, nim: 0, rob: 1, gerami: 2 },
      isVerified: false,
      role: "user",
      createdAt: "2026-07-01T09:15:00Z"
    },
    {
      id: "u4",
      name: "مریم احمدی",
      phone: "09012345678",
      balanceToman: 85000000,
      inventory: { imami: 3, bahar: 2, nim: 4, rob: 10, gerami: 15 },
      isVerified: true,
      role: "user",
      createdAt: "2026-07-04T18:45:00Z"
    }
  ],
  transactions: [
    {
      id: "t1",
      userId: "u2",
      userName: "سارا کریمی",
      type: "buy",
      coinType: "rob",
      coinLabel: "ربع سکه",
      amount: 2,
      pricePerCoin: 15200000,
      totalPrice: 30400000,
      status: "approved",
      createdAt: "2026-07-04T11:20:00Z"
    },
    {
      id: "t2",
      userId: "u3",
      userName: "محمد حسینی",
      type: "sell",
      coinType: "bahar",
      coinLabel: "سکه بهار آزادی",
      amount: 1,
      pricePerCoin: 37500000,
      totalPrice: 37500000,
      status: "approved",
      createdAt: "2026-07-05T09:40:00Z"
    }
  ],
  historicalPrices: [
    { "date": "1405/04/10", "imami": 40300000, "bahar": 36400000, "nim": 22100000, "rob": 14300000, "gerami": 6600000, "gold18": 3300000, "goldMelted": 14000000, "usd": 59000, "eur": 64000, "btc": 58000 * 59000, "eth": 2900 * 59000, "usdt": 59000 },
    { "date": "1405/04/11", "imami": 40500000, "bahar": 36600000, "nim": 22300000, "rob": 14500000, "gerami": 6700000, "gold18": 3350000, "goldMelted": 14200000, "usd": 59200, "eur": 64200, "btc": 58500 * 59200, "eth": 2950 * 59200, "usdt": 59200 },
    { "date": "1405/04/12", "imami": 40800000, "bahar": 36800000, "nim": 22500000, "rob": 14700000, "gerami": 6800000, "gold18": 3400000, "goldMelted": 14400000, "usd": 59500, "eur": 64500, "btc": 59000 * 59500, "eth": 3000 * 59500, "usdt": 59500 },
    { "date": "1405/04/13", "imami": 40700000, "bahar": 36700000, "nim": 22400000, "rob": 14600000, "gerami": 6800000, "gold18": 3380000, "goldMelted": 14300000, "usd": 59400, "eur": 64400, "btc": 58800 * 59400, "eth": 2980 * 59400, "usdt": 59400 },
    { "date": "1405/04/14", "imami": 41100000, "bahar": 37100000, "nim": 22800000, "rob": 14900000, "gerami": 6900000, "gold18": 3450000, "goldMelted": 14600000, "usd": 59800, "eur": 64800, "btc": 59500 * 59800, "eth": 3050 * 59800, "usdt": 59800 },
    { "date": "1405/04/15", "imami": 41300000, "bahar": 37300000, "nim": 23000000, "rob": 15000000, "gerami": 6950000, "gold18": 3480000, "goldMelted": 14800000, "usd": 59900, "eur": 64900, "btc": 59800 * 59900, "eth": 3080 * 59900, "usdt": 59900 },
    { "date": "1405/04/16", "imami": 41500000, "bahar": 37500000, "nim": 23200000, "rob": 15200000, "gerami": 7000000, "gold18": 3500000, "goldMelted": 15000000, "usd": 60000, "eur": 65000, "btc": 60000 * 60000, "eth": 3100 * 60000, "usdt": 60000 }
  ],
  notifications: [
    {
      id: "n1",
      title: "به سکه رمضانی خوش آمدید",
      body: "حساب کاربری شما با موفقیت ایجاد شد. از هم اکنون می‌توانید قیمت‌ها را مقایسه کرده و اقدام به خرید و فروش نمایید.",
      userId: "all",
      createdAt: "2026-07-01T08:00:00Z"
    }
  ],
  sms: []
};

export default function App() {
  const [dbState, setDbState] = useState<DatabaseState | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // Uses Firebase Auth
  const [currentPrices, setCurrentPrices] = useState<Record<CoinType, number>>({
    imami: 41500000,
    bahar: 37500000,
    nim: 23200000,
    rob: 15200000,
    gerami: 7000000,
    gold18: 3500000,
    goldMelted: 15000000,
    usd: 60000,
    eur: 65000,
    btc: 60000 * 60000,
    eth: 3000 * 60000,
    usdt: 60000
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis' | 'portfolio' | 'verification' | 'guide' | 'contact' | 'admin'>('dashboard');
  const [syncStatus, setSyncStatus] = useState<'connecting' | 'success' | 'simulated'>('connecting');
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  
  // Custom Toast System
  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    msg: '',
    type: 'success'
  });

  // Floating notifications feed check
  const seenNotificationIds = useRef<Set<string>>(new Set());
  const [activeAlerts, setActiveAlerts] = useState<{ id: string; title: string; body: string }[]>([]);
  const [pricesSeeded, setPricesSeeded] = useState(false);
  const isFirstFetchRef = useRef<boolean>(true);

  // Synchronize state values to refs to avoid effect re-triggers
  const currentUserIdRef = useRef(currentUserId);
  const pricesSeededRef = useRef(pricesSeeded);
  const syncStatusRef = useRef(syncStatus);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        // Sync user to db on login
        try {
          // If the user's display name is empty, we fall back to phone or email prefix
          // Here we just pass the uid, the backend handles creating if not exists
          await fetch('/api/users/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.uid,
              name: user.displayName || user.email?.split('@')[0] || "کاربر"
            })
          });
        } catch (err) {
          console.error("Failed to sync user to backend", err);
        }
      } else {
        setCurrentUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    pricesSeededRef.current = pricesSeeded;
  }, [pricesSeeded]);

  useEffect(() => {
    syncStatusRef.current = syncStatus;
  }, [syncStatus]);

  // Function to trigger elegant toast notifications
  const showToast = (title: string, msg: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, title, msg, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  // Sync with real Pricing API from BRS Network (via proxy)
  const syncRealPrices = async () => {
    setSyncStatus('connecting');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('/api/live-prices', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.prices) {
          setCurrentPrices({
            imami: data.prices.imami,
            bahar: data.prices.bahar,
            nim: data.prices.nim,
            rob: data.prices.rob,
            gerami: data.prices.gerami,
            gold18: data.prices.gold18,
            goldMelted: data.prices.goldMelted,
            usd: data.prices.usd,
            eur: data.prices.eur,
            btc: data.prices.btc,
            eth: data.prices.eth,
            usdt: data.prices.usdt
          });
          setSyncStatus('success');
          setLastSyncTime(new Date());
          
          // only show toast if it's not the initial fetch or if we really want to
          // Let's keep the toast but less frequent
          if (isFirstFetchRef.current) {
            showToast("بروزرسانی آنلاین", "نرخ طلا و سکه با موفقیت از سرور BRS دریافت شد.", "success");
          }
          return;
        }
      }
      throw new Error("Invalid API response format");
    } catch (err) {
      console.log("Pricing API sync failed, falling back to local simulation", err);
      setSyncStatus('simulated');
      setLastSyncTime(new Date());
    }
  };

  // Fetch data from Server database
  const fetchDB = async (silent = false) => {
    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const data: DatabaseState = await res.json();
        setDbState(data);

        // Seed price from historical prices on first load
        if (!pricesSeededRef.current && data.historicalPrices && data.historicalPrices.length > 0) {
          const latest = data.historicalPrices[data.historicalPrices.length - 1];
          setCurrentPrices({
            imami: latest.imami,
            bahar: latest.bahar,
            nim: latest.nim,
            rob: latest.rob,
            gerami: latest.gerami,
            gold18: latest.gold18,
            goldMelted: latest.goldMelted,
            usd: latest.usd,
            eur: latest.eur,
            btc: latest.btc,
            eth: latest.eth,
            usdt: latest.usdt
          });
          setPricesSeeded(true);
        }
        
        // Handle floating system notifications
        if (data.notifications && data.notifications.length > 0) {
          const newAlerts: { id: string; title: string; body: string }[] = [];
          
          if (isFirstFetchRef.current) {
            // Seed notifications seen list on mount to avoid historical popups
            data.notifications.forEach(notif => {
              seenNotificationIds.current.add(notif.id);
            });
            isFirstFetchRef.current = false;
          } else {
            data.notifications.forEach(notif => {
              const isTargeted = notif.userId === 'all' || notif.userId === currentUserIdRef.current;
              if (isTargeted && !seenNotificationIds.current.has(notif.id)) {
                newAlerts.push({ id: notif.id, title: notif.title, body: notif.body });
                seenNotificationIds.current.add(notif.id);
              }
            });

            if (newAlerts.length > 0 && !silent) {
              setActiveAlerts(prevActive => {
                const existingActiveIds = new Set(prevActive.map(a => a.id));
                const filteredNew = newAlerts.filter(a => !existingActiveIds.has(a.id));
                return [...prevActive, ...filteredNew];
              });
            }
          }
        }
      } else {
        throw new Error("سرویس بانک اطلاعاتی پاسخ نداد");
      }
    } catch (err) {
      console.warn("Using local in-memory fallback database:", err);
      setDbState(prev => {
        if (prev) return prev;
        return LOCAL_FALLBACK_DB;
      });
      if (!pricesSeededRef.current) {
        setCurrentPrices({
          imami: 41500000,
          bahar: 37500000,
          nim: 23200000,
          rob: 15200000,
          gerami: 7000000
        });
        setPricesSeeded(true);
      }
    }
  };

  // Initialize and poll state every 5 seconds using refs to simulate real-time updates safely
  useEffect(() => {
    fetchDB();
    syncRealPrices();

    const dbInterval = setInterval(() => {
      fetchDB(true);
    }, 5000);

    const onlineRateInterval = setInterval(() => {
      if (syncStatusRef.current !== 'connecting') {
        syncRealPrices();
      }
    }, 45000);

    const tickInterval = setInterval(() => {
      if (syncStatusRef.current !== 'connecting') {
        // Simulate real-time coin price minor fluctuations (+/- 15,000 Toman)
        setCurrentPrices(prev => {
          const keys = Object.keys(prev) as CoinType[];
          const updated = { ...prev };
          keys.forEach(key => {
            const change = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) * 5000);
            updated[key] = Math.max(1000000, prev[key] + change);
          });
          return updated;
        });
      }
    }, 6000);

    return () => {
      clearInterval(dbInterval);
      clearInterval(onlineRateInterval);
      clearInterval(tickInterval);
    };
  }, []);

  if (!dbState) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-amber-500 gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-amber-600 border-t-transparent animate-spin"></div>
        <span className="text-xs font-bold animate-pulse">در حال اتصال به سامانه معاملات صرافی سکه رمضانی...</span>
      </div>
    );
  }

  if (!currentUserId) {
    return <AuthScreen onSuccess={async (uid, name) => {
      setCurrentUserId(uid);
      try {
        await fetch('/api/users/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: uid, name: name, phone: name })
        });
      } catch (err) {}
    }} />;
  }

  // Find active simulation user
  const currentUser = dbState.users.find(u => u.id === currentUserId);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <p>در حال بارگذاری اطلاعات کاربر...</p>
      </div>
    );
  }

  const userTransactions = dbState.transactions.filter(t => t.userId === currentUser.id);

  // Close a live floating alert
  const dismissAlert = (id: string) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-100 flex flex-col font-sans relative overflow-x-hidden" id="app-root-container">
      
      {/* Decorative Glowing Orbs for Luxury Look */}
      <div className="glow-orb top-[-100px] left-[-100px] w-[500px] h-[500px] bg-amber-500/10"></div>
      <div className="glow-orb top-[40%] right-[-100px] w-[600px] h-[600px] bg-amber-500/5"></div>
      <div className="glow-orb bottom-[-100px] left-[20%] w-[500px] h-[500px] bg-amber-500/5"></div>

      {/* 1. TOP TICKER BAR (Live gold coin prices scrolling) */}
      <div className="bg-slate-950/80 backdrop-blur border-b border-amber-500/10 py-3 px-4 overflow-hidden select-none relative z-10" id="ticker-bar">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Prices ticker */}
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-500 shrink-0 text-[11px] bg-amber-500/10 px-2 py-1 rounded border border-amber-500/25">
              <Coins className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              نرخ‌های زنده طلا و مسکوکات (تومان):
            </div>
            
            <div className="flex-grow overflow-hidden relative">
              <div className="flex gap-8 whitespace-nowrap animate-marquee">
                {(Object.keys(COIN_DETAILS) as CoinType[]).map(key => (
                  <div key={key} className="inline-flex items-center gap-1.5 bg-slate-900/50 py-1 px-2.5 rounded-lg border border-slate-800">
                    <span className="text-gray-400 font-semibold">{COIN_DETAILS[key].label}:</span>
                    <span className="text-amber-400 font-mono font-bold">
                      {(currentPrices[key] || 0).toLocaleString('fa-IR')}
                    </span>
                    <span className="text-emerald-400 text-[10px] font-bold">▲ ۰.۴٪</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing API Connection Status Widget */}
          <div className="flex items-center gap-2.5 shrink-0 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              {syncStatus === 'success' ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-extrabold">شبکه متصل زنده (BRS)</span>
                </>
              ) : syncStatus === 'simulated' ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-extrabold">بازار موازی (شبیه‌ساز زنده)</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-spin absolute inline-flex h-full w-full rounded-full border-t border-blue-400"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-[10px] text-blue-400 font-extrabold">استعلام نرخ...</span>
                </>
              )}
            </div>

            <div className="h-4 w-px bg-slate-800"></div>

            <button 
              onClick={syncRealPrices}
              disabled={syncStatus === 'connecting'}
              className="text-[10px] font-black text-amber-500 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title="همگام‌سازی مجدد با شبکه قیمت‌گذاری"
            >
              به‌روزرسانی آنلاین
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER AND SIMULATION PANEL */}
      <header className="bg-slate-950/60 border-b border-slate-900 backdrop-blur-xl sticky top-0 z-40 relative z-20">
        <div className="max-w-7xl mx-auto px-4 py-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-600/10">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                صرافی سکه رمضانی
              </h1>
              <p className="text-[10px] text-gray-400 font-semibold">پلتفرم تخصصی خرید و فروش طلا، سکه و تحلیل هوشمند بازار</p>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <button
              onClick={() => signOut(auth)}
              className="text-xs bg-red-900/50 hover:bg-red-800/80 border border-red-800/50 rounded-lg py-1.5 px-3.5 text-red-200 transition-colors"
            >
              خروج از حساب
            </button>
          </div>

          {/* Quick Portfolio Stats */}
          <div className="flex items-center gap-4 bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-2 shrink-0">
            <div className="text-right">
              <div className="text-[9px] text-gray-400">اعتبار ریالی شما:</div>
              <div className="text-sm font-black text-amber-500">
                {currentUser.balanceToman.toLocaleString('fa-IR')} <span className="text-[10px] font-normal text-gray-300">تومان</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-right">
              <div className="text-[9px] text-gray-400">وضعیت حساب شما:</div>
              <div className="flex items-center gap-1.5 text-xs font-bold mt-0.5">
                {currentUser.isVerified ? (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    احراز هویت شده
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-0.5 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5" />
                    نیاز به احراز
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* 3. PLATFORM PRIMARY TABS */}
        <div className="border-t border-slate-800/60 bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-y-1">
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 text-xs font-black transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'text-amber-500 border-amber-500 bg-amber-500/5' : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              داشبورد سکه
            </button>
            
            <button
              id="tab-analysis"
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-3 text-xs font-black transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'analysis' ? 'text-amber-500 border-amber-500 bg-amber-500/5' : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              تحلیل هوشمند (Gemini)
            </button>
            
            <button
              id="tab-portfolio"
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-3 text-xs font-black transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'portfolio' ? 'text-amber-500 border-amber-500 bg-amber-500/5' : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <History className="w-4 h-4" />
              سبد دارایی و معاملات
            </button>

            <button
              id="tab-verification"
              onClick={() => setActiveTab('verification')}
              className={`px-4 py-3 text-xs font-black transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'verification' ? 'text-amber-500 border-amber-500 bg-amber-500/5' : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              احراز هویت مدارک
            </button>

            <button
              id="tab-guide"
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-3 text-xs font-black transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'guide' ? 'text-amber-500 border-amber-500 bg-amber-500/5' : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              راهنمای صرافی
            </button>

            <button
              id="tab-contact"
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-3 text-xs font-black transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'contact' ? 'text-amber-500 border-amber-500 bg-amber-500/5' : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              <Phone className="w-4 h-4 text-amber-500" />
              ارتباط با ما
            </button>

            {/* Admin tab (Show always for simulation, but with simulated locks if not admin) */}
            <button
              id="tab-admin"
              onClick={() => {
                if (currentUser.role !== 'admin') {
                  showToast("عدم دسترسی مدیریت", "تنها کاربران با نقش ادمین (مانند Ramezanigold.1405@gmail.com) به این پنل دسترسی دارند.", "error");
                  return;
                }
                setActiveTab('admin');
              }}
              className={`px-4 py-3 text-xs font-black transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin' ? 'text-amber-500 border-amber-500 bg-amber-500/5' : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              {currentUser.role === 'admin' ? (
                <span className="text-amber-500 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-amber-500" />
                  پنل مدیریت ارشد
                </span>
              ) : (
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  مدیریت (قفل)
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        
        {/* TAB 1: DASHBOARD & LIVE TRADES */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6" id="dashboard-tab-view">
            
            {/* Live rates grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(Object.keys(COIN_DETAILS) as CoinType[]).map(key => (
                <div key={key} className="glass-panel rounded-xl p-4 border border-slate-800 shadow-lg flex flex-col justify-between hover:scale-[1.02] transition-transform">
                  <div>
                    <span className="text-[10px] bg-slate-800 text-amber-500 font-bold px-2 py-0.5 rounded-full">
                      دارایی
                    </span>
                    <h3 className="text-xs font-bold text-gray-200 mt-2">{COIN_DETAILS[key].label}</h3>
                    <p className="text-[9px] text-gray-400 font-mono mt-0.5">واحد: {COIN_DETAILS[key].weight}</p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-800/80">
                    <div className="text-xs text-gray-400">نرخ روز:</div>
                    <div className="text-sm font-extrabold text-amber-500 mt-1">
                      {currentPrices[key]?.toLocaleString('fa-IR') || 0} T
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart and Trading section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: Line Charts */}
              <div className="lg:col-span-8">
                <CoinCharts historicalData={dbState.historicalPrices} currentPrices={currentPrices} />
              </div>

              {/* Right Column: Instant Order Desk */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <OrderDesk 
                  currentUser={currentUser} 
                  currentPrices={currentPrices} 
                  onTransactionCreated={() => fetchDB()} 
                  showToast={showToast}
                />
                
                {/* Price Alerts panel */}
                <PriceAlertsSetup 
                  currentPrices={currentPrices} 
                  showToast={showToast} 
                />
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: AI MARKET ANALYST */}
        {activeTab === 'analysis' && (
          <div className="h-full" id="analysis-tab-view">
            <GeminiAnalyst currentPrices={currentPrices} />
          </div>
        )}

        {/* TAB 3: USER PORTFOLIO & HISTORIC TRADES */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6" id="portfolio-tab-view">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Asset Allocation Card */}
              <div className="lg:col-span-4 glass-panel rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-bold text-amber-500 flex items-center gap-1.5 mb-4">
                  <Wallet className="w-5 h-5" />
                  موجودی و ارزش روز دارایی‌های طلا
                </h3>

                <div className="space-y-4">
                  {/* Rial Balance representation */}
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-gray-400">ریالی (تومان)</div>
                    <div className="text-lg font-black text-amber-500 mt-1 mb-3">
                      {currentUser.balanceToman.toLocaleString('fa-IR')} تومان
                    </div>
                    
                    {/* Simulated Deposit/Withdraw Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={async () => {
                          const newBalance = currentUser.balanceToman + 10000000;
                          try {
                            const res = await fetch('/api/users/update', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: currentUser.id, balanceToman: newBalance })
                            });
                            if (res.ok) {
                              showToast("افزایش موجودی موفق", "مبلغ ۱۰ میلیون تومان به صورت شبیه‌سازی به حساب شما واریز شد.", "success");
                              fetchDB(true);
                            }
                          } catch (err) {
                            showToast("خطا", "ارتباط با سرور برقرار نشد.", "error");
                          }
                        }}
                        className="flex-1 text-xs font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        + واریز ۱۰م
                      </button>
                      <button 
                        onClick={async () => {
                          if (currentUser.balanceToman < 10000000) {
                            showToast("خطا", "موجودی ریالی برای برداشت کافی نیست.", "error");
                            return;
                          }
                          const newBalance = currentUser.balanceToman - 10000000;
                          try {
                            const res = await fetch('/api/users/update', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: currentUser.id, balanceToman: newBalance })
                            });
                            if (res.ok) {
                              showToast("برداشت موفق", "مبلغ ۱۰ میلیون تومان با موفقیت برداشت شد.", "info");
                              fetchDB(true);
                            }
                          } catch (err) {
                            showToast("خطا", "ارتباط با سرور برقرار نشد.", "error");
                          }
                        }}
                        className="flex-1 text-xs font-bold text-gray-300 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg transition-colors cursor-pointer border border-slate-700"
                      >
                        - برداشت ۱۰م
                      </button>
                    </div>
                  </div>

                  {/* Coins Inventory Allocation list */}
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400 px-1 mb-2">تعداد و نرخ دارایی‌های شما:</div>
                    {(Object.keys(COIN_DETAILS) as CoinType[]).filter(key => currentUser.inventory[key] > 0).length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-xs">
                        شما در حال حاضر هیچ دارایی ندارید.
                      </div>
                    )}
                    {(Object.keys(COIN_DETAILS) as CoinType[]).map(key => {
                      const amount = currentUser.inventory[key] || 0;
                      if (amount === 0) return null; // Only show assets the user actually owns
                      const value = amount * (currentPrices[key] || 0);
                      return (
                        <div key={key} className="flex items-center justify-between bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs">
                          <div>
                            <span className="font-bold text-gray-200">{COIN_DETAILS[key].label}</span>
                            <span className="text-[10px] text-gray-400 mr-2 bg-slate-900 px-1.5 py-0.5 rounded">
                              {amount} واحد
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-amber-500">{value.toLocaleString('fa-IR')} تومان</div>
                            <div className="text-[9px] text-gray-500">ارزش لحظه‌ای کل</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Transactions History Table */}
              <div className="lg:col-span-8">
                <TransactionsHistory transactions={userTransactions} />
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: ADMIN CONTROLS (Only render for admin users) */}
        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <div className="h-full" id="admin-tab-view">
            <AdminDashboard dbState={dbState} onRefresh={() => fetchDB()} showToast={showToast} />
          </div>
        )}

        {/* TAB 5: KYC VERIFICATION SECTION */}
        {activeTab === 'verification' && (
          <div className="h-full" id="verification-tab-view">
            <VerificationSection 
              currentUser={currentUser} 
              onRefresh={() => fetchDB()} 
              showToast={showToast} 
            />
          </div>
        )}

        {/* TAB 6: USER GUIDES AND FAQ */}
        {activeTab === 'guide' && (
          <div className="h-full" id="guide-tab-view">
            <GuideSection />
          </div>
        )}

        {/* TAB 7: CONTACT AND TICKET SUPPORT */}
        {activeTab === 'contact' && (
          <div className="h-full" id="contact-tab-view">
            <ContactSection showToast={showToast} />
          </div>
        )}

      </main>

      {/* 5. FLOATING REAL-TIME SYSTEM NOTIFICATION POPUPS */}
      {activeAlerts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full space-y-3" id="live-notif-center">
          {activeAlerts.map(alert => (
            <div 
              key={alert.id}
              className="bg-slate-900 border-2 border-amber-500 text-white p-4.5 rounded-xl shadow-2xl flex items-start gap-3.5 animate-slide-in relative"
            >
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-500 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h4 className="text-xs font-bold text-amber-500 flex items-center justify-between">
                  {alert.title}
                  <button 
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-white font-bold text-[14px] px-1 cursor-pointer"
                  >
                    ×
                  </button>
                </h4>
                <p className="text-[11px] text-gray-300 mt-1.5 leading-relaxed">{alert.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. TOAST ELEMENT (Self-dismissing message panel) */}
      {toast.show && (
        <div className="fixed bottom-5 left-5 z-50 max-w-xs w-full bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-2xl animate-fade-in flex items-center gap-3" id="toast-panel">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
          )}
          <div>
            <h5 className="text-xs font-bold text-gray-100">{toast.title}</h5>
            <p className="text-[10px] text-gray-400 mt-1 leading-normal">{toast.msg}</p>
          </div>
        </div>
      )}

      {/* 7. PLATFORM FOOTER */}
      <footer className="bg-slate-950/80 border-t border-slate-900 py-6 mt-12 text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>سامانه سکه رمضانی - تمامی حقوق مادی و معنوی محفوظ است. سال ۱۴۰۵</p>
          <p className="text-[10px] text-gray-600">پشتیبانی شده توسط مدل زبانی پیشرفته هوش مصنوعی گوگل Gemini 3.5</p>
        </div>
      </footer>

    </div>
  );
}
