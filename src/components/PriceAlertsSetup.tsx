import React, { useState } from 'react';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { CoinType, COIN_DETAILS } from '../types';

interface PriceAlertsSetupProps {
  currentPrices: Record<CoinType, number>;
  showToast: (title: string, msg: string, type: 'success' | 'error' | 'info') => void;
}

interface Alert {
  id: string;
  coinType: CoinType;
  condition: 'above' | 'below';
  targetPrice: number;
  active: boolean;
}

export default function PriceAlertsSetup({ currentPrices, showToast }: PriceAlertsSetupProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [coin, setCoin] = useState<CoinType>('imami');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [priceStr, setPriceStr] = useState<string>('');

  const handleAddAlert = () => {
    const numericPrice = Number(priceStr.replace(/,/g, ''));
    if (!numericPrice || isNaN(numericPrice) || numericPrice <= 0) {
      showToast('خطا', 'لطفاً مبلغ معتبر وارد کنید.', 'error');
      return;
    }

    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      coinType: coin,
      condition,
      targetPrice: numericPrice,
      active: true
    };

    setAlerts([newAlert, ...alerts]);
    setPriceStr('');
    showToast('هشدار جدید ثبت شد', `سیستم در صورت رسیدن قیمت به مبلغ مورد نظر به شما اطلاع می‌دهد.`, 'success');
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="glass-panel gold-glow-hover rounded-2xl p-6 border border-slate-800 h-full flex flex-col">
      <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mb-4">
        <Bell className="w-4 h-4" />
        تنظیم هشدارهای هوشمند قیمت
      </h3>
      
      <div className="flex flex-col gap-3 mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">نوع سکه</label>
            <select 
              value={coin} 
              onChange={e => setCoin(e.target.value as CoinType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-gray-200"
            >
              {Object.keys(COIN_DETAILS).map(k => (
                <option key={k} value={k}>{COIN_DETAILS[k as CoinType].label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-1 block">شرط قیمتی</label>
            <select 
              value={condition} 
              onChange={e => setCondition(e.target.value as 'above' | 'below')}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 text-gray-200"
            >
              <option value="above">بیشتر از (صعود)</option>
              <option value="below">کمتر از (نزول)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-gray-400 mb-1 block">قیمت هدف (تومان)</label>
          <div className="relative">
            <input 
              type="text" 
              value={priceStr}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val) {
                  setPriceStr(Number(val).toLocaleString('en-US'));
                } else {
                  setPriceStr('');
                }
              }}
              placeholder={`مثال: ${((currentPrices[coin] || 0) + 1000000).toLocaleString('en-US')}`}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono p-2 text-amber-500 focus:outline-none focus:border-amber-500/50 transition-colors pl-12"
            />
            <button 
              onClick={handleAddAlert}
              className="absolute left-1.5 top-1.5 bottom-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-900 rounded-md px-2 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
        {alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 opacity-50">
            <Bell className="w-8 h-8" />
            <span className="text-xs">هیچ هشداری ثبت نشده است</span>
          </div>
        ) : (
          alerts.map(alert => {
            const currentPrice = currentPrices[alert.coinType];
            const diff = ((alert.targetPrice - currentPrice) / currentPrice * 100).toFixed(2);
            
            return (
              <div key={alert.id} className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${alert.condition === 'above' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {alert.condition === 'above' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-200">
                      {COIN_DETAILS[alert.coinType].label} {alert.condition === 'above' ? '≥' : '≤'} {alert.targetPrice.toLocaleString('fa-IR')}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      فاصله تا هدف: {diff}٪
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeAlert(alert.id)}
                  className="p-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}
