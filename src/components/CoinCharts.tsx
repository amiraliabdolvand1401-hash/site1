import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { HistoricalPrice, CoinType, COIN_DETAILS } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Award, Percent } from 'lucide-react';

interface CoinChartsProps {
  historicalData: HistoricalPrice[];
  currentPrices: Record<CoinType, number>;
}

export default function CoinCharts({ historicalData, currentPrices }: CoinChartsProps) {
  const [selectedCoin, setSelectedCoin] = useState<CoinType | 'all'>('all');

  // Colors for each coin type in the charts
  const coinColors: Record<CoinType, string> = {
    imami: '#f59e0b', // Amber
    bahar: '#fbbf24', // Yellow 400
    nim: '#34d399',   // Emerald 400
    rob: '#60a5fa',   // Blue 400
    gerami: '#f472b6',// Pink 400
    gold18: '#fb923c', // Orange 400
    goldMelted: '#ea580c', // Orange 600
    usd: '#10b981', // Emerald 500
    eur: '#3b82f6', // Blue 500
    btc: '#f59e0b', // Amber 500
    eth: '#6366f1', // Indigo 500
    usdt: '#14b8a6' // Teal 500
  };

  const formatPrice = (val: number) => {
    return ((val || 0) / 1000000).toFixed(1) + ' م.ت';
  };

  const formatFullPrice = (val: number) => {
    return (val || 0).toLocaleString('fa-IR') + ' تومان';
  };

  // Calculate some basic stats for the selected coin
  const getStats = () => {
    if (selectedCoin === 'all') {
      return {
        name: 'گزارش کل بازار',
        highest: currentPrices.imami || 0,
        lowest: currentPrices.gerami || 0,
        change: '+۳.۸٪',
        isPositive: true,
        premium: 'متوسط ۱۵٪'
      };
    }

    const prices = historicalData.map(d => d[selectedCoin]);
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const latest = prices[prices.length - 1];
    const initial = prices[0];
    const changePct = (((latest - initial) / initial) * 100).toFixed(1);
    
    // Simulate bubble calculation (approximate gold weight value vs market price)
    // 18k Gold Gram is approx ~3,400,000, 24k is ~4,500,000.
    // Coin purity is 22ct (0.900).
    const goldValuePerGram = 3500000; // base value representation
    const weight = selectedCoin === 'imami' || selectedCoin === 'bahar' ? 8.133 
                 : selectedCoin === 'nim' ? 4.066 
                 : selectedCoin === 'rob' ? 2.033 
                 : 1.012;
    const intrinsicValue = weight * goldValuePerGram * (900 / 750);
    const premiumVal = (((latest - intrinsicValue) / intrinsicValue) * 100).toFixed(0);

    return {
      name: COIN_DETAILS[selectedCoin].label,
      highest: max,
      lowest: min,
      change: `${changePct > '0' ? '+' : ''}${Number(changePct).toLocaleString('fa-IR')}٪`,
      isPositive: Number(changePct) >= 0,
      premium: `${Number(premiumVal).toLocaleString('fa-IR')}٪ حباب`
    };
  };

  const stats = getStats();

  return (
    <div className="glass-panel gold-glow-hover rounded-2xl p-6 shadow-xl" id="market-charts-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-amber-500 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            نمودار مقایسه و تغییرات قیمت سکه
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            روند نوسانات قیمت سکه در روزهای اخیر (قیمت‌ها به میلیون تومان)
          </p>
        </div>

        {/* Coin Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            id="tab-all"
            onClick={() => setSelectedCoin('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
              selectedCoin === 'all'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            همه دارایی‌ها
          </button>
          {(Object.keys(COIN_DETAILS) as CoinType[]).map(key => (
            <button
              id={`tab-${key}`}
              key={key}
              onClick={() => setSelectedCoin(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                selectedCoin === key
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {COIN_DETAILS[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            نماد انتخابی
          </div>
          <div className="text-base font-bold text-gray-100">{stats.name}</div>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            بیشترین قیمت بازه
          </div>
          <div className="text-base font-bold text-emerald-400">
            {formatFullPrice(stats.highest)}
          </div>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            کمترین قیمت بازه
          </div>
          <div className="text-base font-bold text-red-400">
            {formatFullPrice(stats.lowest)}
          </div>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-blue-400" />
            میزان تغییرات / حباب
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${stats.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {stats.change}
            </span>
            <span className="text-xs text-amber-500 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded">
              {stats.premium}
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-80 w-full" style={{ direction: 'ltr' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={historicalData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
              tickLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              stroke="#94a3b8"
              tickFormatter={formatPrice}
              tick={{ fontSize: 10 }}
              tickLine={{ stroke: '#1e293b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #d97706',
                borderRadius: '8px',
                color: '#f8fafc',
                textAlign: 'right',
                direction: 'rtl'
              }}
              formatter={(value: any, name: any) => {
                const coinKey = name as CoinType;
                return [
                  `${(Number(value) || 0).toLocaleString('fa-IR')} تومان`,
                  COIN_DETAILS[coinKey]?.label || name
                ];
              }}
              labelFormatter={(label) => `تاریخ: ${label}`}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
            
            {(Object.keys(COIN_DETAILS) as CoinType[]).map(key => {
              if (selectedCoin !== 'all' && selectedCoin !== key) return null;
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={coinColors[key]}
                  strokeWidth={selectedCoin === key ? 3 : 1.5}
                  activeDot={{ r: 6 }}
                  dot={{ r: 3 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
