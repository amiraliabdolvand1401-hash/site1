import React from 'react';
import { History, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Transaction, COIN_DETAILS } from '../types';

interface TransactionsHistoryProps {
  transactions: Transaction[];
}

export default function TransactionsHistory({ transactions }: TransactionsHistoryProps) {
  return (
    <div className="glass-panel gold-glow-hover rounded-2xl p-6 shadow-xl border border-slate-800 h-full">
      <h3 className="text-base font-bold text-gray-200 flex items-center gap-1.5 mb-6">
        <History className="w-5 h-5 text-amber-500" />
        تاریخچه تراکنش‌های اخیر
      </h3>
      
      {transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          تراکنشی یافت نشد.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-gray-400 text-xs">
                <th className="py-3 px-2 font-medium">نوع</th>
                <th className="py-3 px-2 font-medium">دارایی</th>
                <th className="py-3 px-2 font-medium">تعداد</th>
                <th className="py-3 px-2 font-medium">فی (تومان)</th>
                <th className="py-3 px-2 font-medium">ارزش کل (تومان)</th>
                <th className="py-3 px-2 font-medium">زمان</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {transactions.map(t => (
                <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-2 font-bold">
                    {t.type === 'buy' ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        خرید
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        فروش
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-gray-200">{COIN_DETAILS[t.coinType].label}</td>
                  <td className="py-3 px-2 text-gray-300 font-mono">{t.amount}</td>
                  <td className="py-3 px-2 text-gray-400 font-mono">{t.pricePerCoin.toLocaleString('fa-IR')}</td>
                  <td className="py-3 px-2 text-amber-500 font-bold font-mono">
                    {t.totalPrice.toLocaleString('fa-IR')}
                  </td>
                  <td className="py-3 px-2 text-gray-500 text-[10px]" dir="ltr">
                    {new Date(t.createdAt).toLocaleString('fa-IR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
