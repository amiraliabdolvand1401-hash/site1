import React, { useState } from 'react';
import { User, CoinType, COIN_DETAILS } from '../types';
import { ShoppingCart, ArrowLeftRight, CheckCircle, AlertOctagon, HelpCircle, ShieldAlert } from 'lucide-react';

interface OrderDeskProps {
  currentUser: User;
  currentPrices: Record<CoinType, number>;
  onTransactionCreated: () => void;
  showToast: (title: string, msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function OrderDesk({ currentUser, currentPrices, onTransactionCreated, showToast }: OrderDeskProps) {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [coinType, setCoinType] = useState<CoinType>('imami');
  const [amount, setAmount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricePerCoin = currentPrices[coinType];
  const totalPrice = pricePerCoin * amount;

  // Validation conditions
  const isVerified = currentUser.isVerified;
  const hasEnoughFunds = currentUser.balanceToman >= totalPrice;
  const userCoinAmount = currentUser.inventory[coinType] || 0;
  const hasEnoughCoins = userCoinAmount >= amount;

  const handleTradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      showToast(
        "خطا در ثبت سفارش",
        "حساب شما احراز هویت نشده است. لطفاً منتظر تایید ادمین باشید یا درخواست احراز هویت دهید.",
        "error"
      );
      return;
    }

    if (tradeType === 'buy' && !hasEnoughFunds) {
      showToast("خطا در خرید", "موجودی ریالی حساب شما کافی نیست.", "error");
      return;
    }

    if (tradeType === 'sell' && !hasEnoughCoins) {
      showToast("خطا در فروش", "موجودی سکه انتخابی شما در کیف دارایی کافی نیست.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/transactions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          type: tradeType,
          coinType,
          coinLabel: COIN_DETAILS[coinType].label,
          amount,
          pricePerCoin
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(
          "سفارش ثبت شد",
          `درخواست ${tradeType === 'buy' ? 'خرید' : 'فروش'} شما برای ${amount} عدد ${COIN_DETAILS[coinType].label} ثبت شد و به صف تایید ادمین ارسال گردید.`,
          "success"
        );
        onTransactionCreated();
      } else {
        showToast("خطای سرور", data.error || "خطایی رخ داده است.", "error");
      }
    } catch (err: any) {
      showToast("خطای شبکه", "ارتباط با سرور برقرار نشد.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel gold-glow-hover rounded-2xl p-6 shadow-xl flex flex-col h-full" id="order-desk-panel">
      <div className="flex items-center gap-2.5 mb-5 border-b border-slate-800 pb-4">
        <div className="p-2 rounded-lg bg-amber-500/15 text-amber-500">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-100">میز معامله و ثبت سفارش</h2>
          <p className="text-xs text-gray-400 mt-1">
            خرید و فروش امن انواع مسکوکات به صورت آنلاین (نیاز به احراز هویت دارد)
          </p>
        </div>
      </div>

      {/* Verification Warning banner */}
      {!isVerified && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-4 py-3 rounded-xl mb-5 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-500" />
          <div>
            <strong>احراز هویت ناقص:</strong> جهت انجام معاملات خرید و فروش، حساب شما ابتدا باید توسط مدیریت تایید و احراز هویت شود.
          </div>
        </div>
      )}

      <form onSubmit={handleTradeSubmit} className="flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          {/* Trade Type Selection */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
            <button
              id="trade-buy-tab"
              type="button"
              onClick={() => setTradeType('buy')}
              className={`py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                tradeType === 'buy'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              خرید (از پلتفرم)
            </button>
            <button
              id="trade-sell-tab"
              type="button"
              onClick={() => setTradeType('sell')}
              className={`py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                tradeType === 'sell'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/10'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              فروش (به پلتفرم)
            </button>
          </div>

          {/* Coin Selector */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">نوع دارایی مورد معامله:</label>
            <select
              id="select-coin-type"
              value={coinType}
              onChange={(e) => setCoinType(e.target.value as CoinType)}
              className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl py-3 px-3 text-gray-100 focus:outline-none focus:border-amber-500"
            >
              {(Object.keys(COIN_DETAILS) as CoinType[]).map(key => (
                <option key={key} value={key}>
                  {COIN_DETAILS[key].label} ({currentPrices[key]?.toLocaleString('fa-IR') || 0} تومان)
                </option>
              ))}
            </select>
          </div>

          {/* Details Card */}
          <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80 text-xs text-gray-300">
            <p className="font-semibold text-amber-400 mb-1">{COIN_DETAILS[coinType].label}</p>
            <p className="text-gray-400 leading-relaxed text-[11px] mb-2">{COIN_DETAILS[coinType].description}</p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>واحد/وزن: <span className="font-semibold text-gray-200">{COIN_DETAILS[coinType].weight}</span></div>
              <div>ویژگی/عیار: <span className="font-semibold text-gray-200">{COIN_DETAILS[coinType].purity}</span></div>
            </div>
          </div>

          {/* Amount and Rate inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-2">تعداد / مقدار:</label>
              <input
                id="input-trade-amount"
                type="number"
                min="1"
                max="1000"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl py-3 px-3 text-gray-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">نرخ هر واحد (تومان):</label>
              <div className="w-full text-xs bg-slate-900/60 border border-slate-800/60 rounded-xl py-3 px-3 text-gray-400 font-bold select-none">
                {pricePerCoin?.toLocaleString('fa-IR') || 0}
              </div>
            </div>
          </div>

          {/* Calculator Output */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>هزینه کل معامله:</span>
              <span className="text-gray-300 font-medium">{amount} × {pricePerCoin.toLocaleString('fa-IR')}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold border-t border-slate-800/80 pt-2.5">
              <span className="text-gray-200">مجموع پرداختی:</span>
              <span className="text-amber-500 text-base">{totalPrice.toLocaleString('fa-IR')} تومان</span>
            </div>
          </div>
        </div>

        {/* Buttons and Validation state */}
        <div className="mt-5 space-y-3">
          {tradeType === 'buy' ? (
            <div className="flex items-center justify-between text-xs px-2">
              <span className="text-gray-400">موجودی ریالی شما:</span>
              <span className={`font-semibold ${hasEnoughFunds ? 'text-gray-300' : 'text-red-400'}`}>
                {currentUser.balanceToman.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs px-2">
              <span className="text-gray-400">دارایی شما از این سکه:</span>
              <span className={`font-semibold ${hasEnoughCoins ? 'text-emerald-400' : 'text-red-400'}`}>
                {userCoinAmount.toLocaleString('fa-IR')} عدد
              </span>
            </div>
          )}

          <button
            id="btn-submit-order"
            type="submit"
            disabled={isSubmitting || !isVerified || (tradeType === 'buy' && !hasEnoughFunds) || (tradeType === 'sell' && !hasEnoughCoins)}
            className={`w-full py-3.5 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 ${
              !isVerified
                ? 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700/50'
                : tradeType === 'buy'
                ? hasEnoughFunds
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
                  : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                : hasEnoughCoins
                ? 'bg-red-600 hover:bg-red-700 shadow-red-600/10'
                : 'bg-slate-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              "در حال ارسال سفارش..."
            ) : !isVerified ? (
              "غیرمجاز (احراز هویت نشده)"
            ) : tradeType === 'buy' ? (
              hasEnoughFunds ? "ثبت درخواست خرید" : "کافی نبودن موجودی ریالی"
            ) : (
              hasEnoughCoins ? "ثبت درخواست فروش" : "کافی نبودن موجودی سکه"
            )}
          </button>
          
          <div className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3 text-amber-500" />
            تایید نهایی معامله پس از ثبت، برعهده مدیریت صرافی سکه رمضانی می‌باشد.
          </div>
        </div>
      </form>
    </div>
  );
}
