import React, { useState } from 'react';
import { BookOpen, Coins, ShieldCheck, HelpCircle, ChevronDown, CheckCircle, Smartphone, MapPin } from 'lucide-react';

export default function GuideTab() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'آیا قیمت‌ها در سکه رمضانی واقعی و بر لحظه است؟',
      a: 'بله، نرخ‌های نمایش‌داده‌شده در پنل به صورت کاملاً لحظه‌ای از بازار طلای تهران همگام‌سازی می‌گردند و معاملات در بستر امن و با نرخ دقیق زمان ثبت نهایی انجام می‌شوند.'
    },
    {
      q: 'پروسه واریز ریالی و خرید سکه چقدر زمان می‌برد؟',
      a: 'واریز ریالی از طریق کارت‌های عضو شتاب پس از احراز هویت بلافاصله اعمال می‌شود. شما می‌توانید بلافاصله پس از واریز، سکه دلخواه خود را در سبد دارایی ثبت و خریداری نمایید.'
    },
    {
      q: 'آیا امکان تحویل فیزیکی سکه‌ها وجود دارد؟',
      a: 'بله، شما هر زمان که مایل باشید می‌توانید از طریق پنل کاربری درخواست تحویل فیزیکی ثبت کنید و با مراجعه حضوری به دفتر مرکزی صرافی رمضانی در تهران، سکه‌های خود را با پلمپ معتبر و هولوگرام امنیتی دریافت نمایید.'
    },
    {
      q: 'چگونه می‌توانم به امنیت حساب خود اطمینان داشته باشم؟',
      a: 'سکه رمضانی مجهز به سیستم احراز هویت هوشمند بانکی، همگام‌سازی دو مرحله‌ای و زیرساخت رمزنگاری‌شده فایربیس است که امنیت دارایی‌های ریالی و طلای شما را تضمین می‌کند.'
    }
  ];

  const steps = [
    {
      title: 'ثبت‌نام و احراز هویت',
      desc: 'ابتدا حساب کاربری خود را ساخته و سپس در تب احراز هویت، کد ملی و کارت شتاب خود را ثبت کنید.',
      icon: Smartphone
    },
    {
      title: 'شارژ کیف پول ریالی',
      desc: 'از بخش سبد دارایی، گزینه افزایش موجودی ریالی را زده و حساب خود را با کارت تایید شده شارژ کنید.',
      icon: CheckCircle
    },
    {
      title: 'خرید سکه و سوددهی',
      desc: 'سکه دلخواه (امامی، بهار آزادی، ربع سکه و...) را خریداری کرده و دارایی خود را به صورت آنلاین مدیریت کنید.',
      icon: Coins
    },
    {
      title: 'تحویل فیزیکی یا فروش آنلاین',
      desc: 'هر زمان خواستید سکه‌ها را به نرخ روز صرافی بفروشید و ریال دریافت کنید یا درخواست تحویل فیزیکی دهید.',
      icon: MapPin
    }
  ];

  const coinSpecs = [
    { name: 'سکه امامی (تصویر امام)', weight: '۸.۱۳۳ گرم', purity: '۲۲ عیار (۹۰۰ از ۱۰۰۰)', size: '۲۲ میلی‌متر' },
    { name: 'سکه تمام بهار آزادی', weight: '۸.۱۳۳ گرم', purity: '۲۲ عیار (۹۰۰ از ۱۰۰۰)', size: '۲۲ میلی‌متر' },
    { name: 'نیم سکه بهار آزادی', weight: '۴.۰۶۶ گرم', purity: '۲۲ عیار (۹۰۰ از ۱۰۰۰)', size: '۱۹ میلی‌متر' },
    { name: 'ربع سکه بهار آزادی', weight: '۲.۰۳۳ گرم', purity: '۲۲ عیار (۹۰۰ از ۱۰۰۰)', size: '۱۶ میلی‌متر' },
    { name: 'سکه گرمی', weight: '۱.۰۱ گرم', purity: '۲۲ عیار (۹۰۰ از ۱۰۰۰)', size: '۱۳.۳ میلی‌متر' }
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/20 p-8 shadow-xl">
        <div className="absolute top-[-30%] right-[-10%] w-[350px] h-[350px] rounded-full bg-amber-500/5 blur-[80px]"></div>
        <div className="relative z-10 text-center md:text-right space-y-2">
          <h2 className="text-xl font-black text-white flex items-center gap-2 justify-center md:justify-start">
            <BookOpen className="w-6 h-6 text-amber-500" />
            راهنمای گام‌به‌گام معاملات سکه رمضانی
          </h2>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
            در این بخش با نحوه کارکرد سامانه, استانداردهای وزنی مسکوکات طلا در بازار ایران و پاسخ به سوالات رایج کاربران آشنا خواهید شد.
          </p>
        </div>
      </div>

      {/* Guide Steps */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-amber-500 flex items-center gap-1.5 border-r-4 border-amber-500 pr-2.5">
          مراحل شروع به کار در سامانه
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500 font-bold mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-black text-gray-200 mb-1.5">{step.title}</h4>
                  <p className="text-[10px] text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
                <div className="text-[10px] text-gray-600 font-bold mt-4 self-end">
                  مرحله {idx + 1} از ۴
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coin Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-black text-amber-500 flex items-center gap-1.5 border-r-4 border-amber-500 pr-2.5">
            جدول عیار و مشخصات استاندارد مسکوکات طلا
          </h3>
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-gray-400 font-bold">
                  <th className="p-3.5">نوع سکه</th>
                  <th className="p-3.5">وزن دقیق</th>
                  <th className="p-3.5">عیار</th>
                  <th className="p-3.5">قطر سکه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-gray-300">
                {coinSpecs.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                    <td className="p-3.5 font-bold text-gray-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      {spec.name}
                    </td>
                    <td className="p-3.5 font-mono">{spec.weight}</td>
                    <td className="p-3.5">{spec.purity}</td>
                    <td className="p-3.5 font-mono">{spec.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-black text-amber-500 flex items-center gap-1.5 border-r-4 border-amber-500 pr-2.5">
            پرسش‌های متداول (FAQ)
          </h3>
          <div className="space-y-2.5">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-panel rounded-xl border border-slate-800 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-right flex items-center justify-between gap-3 text-xs font-bold text-gray-200 hover:bg-slate-900/40 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4.5 h-4.5 text-gray-500 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 bg-slate-950/40 border-t border-slate-800 text-[11px] text-gray-400 leading-relaxed font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
