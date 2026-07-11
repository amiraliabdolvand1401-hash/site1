import React from 'react';
import { HelpCircle, DollarSign, Shield, ArrowRightLeft, BookOpen, Clock, AlertTriangle, Scale } from 'lucide-react';

export default function GuideSection() {
  const faqs = [
    {
      question: "چگونه می‌توانم حساب کاربری خود را شارژ کنم؟",
      answer: "از منوی «سبد دارایی و تاریخچه معامله» در بخش کیف پول، می‌توانید از دکمه‌های واریز شبیه‌سازی شده استفاده کنید. در سیستم واقعی، این دکمه شما را به درگاه پرداخت مستقیم متصل می‌کند."
    },
    {
      question: "حباب سکه به چه معناست و چگونه محاسبه می‌شود؟",
      answer: "حباب سکه تفاوت بین قیمت معاملاتی بازار و ارزش ذاتی طلای به‌کار رفته در آن سکه است. ارزش ذاتی بر اساس نرخ اونس جهانی طلا و نرخ دلار محاسبه می‌شود. هر چه حباب کمتر باشد، خرید آن سکه کم‌ریسک‌تر است."
    },
    {
      question: "مراحل و مدارک مورد نیاز احراز هویت (KYC) چیست؟",
      answer: "برای شروع معاملات کافی است کد ملی ۱۰ رقمی، شماره کارت بانکی معتبر ۱۶ رقمی که هم‌نام دارنده حساب باشد و تصویر واضحی از کارت ملی یا کارت بانکی خود را در تب «احراز هویت» بارگذاری فرمایید."
    },
    {
      question: "کارمزد معاملات در سکه رمضانی چقدر است؟",
      answer: "کارمزد خرید و فروش بر مبنای حجم معاملات متغیر است. برای شروع، کارمزد پایه خرید و فروش ۰.۲۵ درصد در نظر گرفته شده که در حجم‌های بالا تا ۰.۱ درصد کاهش می‌یابد."
    }
  ];

  const steps = [
    {
      id: 1,
      title: "ثبت نام و احراز هویت",
      description: "شماره موبایل خود را وارد کرده و با پر کردن اطلاعات در تب احراز هویت، مدارک خود را ارسال کنید."
    },
    {
      id: 2,
      title: "افزایش موجودی ریالی",
      description: "حساب خود را به میزان دلخواه شارژ کنید تا برای سفارش‌گذاری آماده شوید."
    },
    {
      id: 3,
      title: "سفارش‌گذاری آنی",
      description: "از منوی سفارش سریع، نوع سکه و تعداد آن را مشخص نموده و سفارش خرید یا فروش را ارسال کنید."
    },
    {
      id: 4,
      title: "تایید سفارش توسط صرافی",
      description: "سفارش شما در ثانیه توسط صرافی بررسی، تایید و به صورت آنی در سبد دارایی شما درج می‌شود."
    }
  ];

  return (
    <div className="space-y-8" id="guide-section">
      
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-500" />
          راهنمای جامع صرافی سکه رمضانی
        </h2>
        <p className="text-xs text-gray-400">
          با مطالعه راهنماهای زیر، هوشمندانه، با کمترین کارمزد و با آگاهی کامل از قیمت‌ها اقدام به سرمایه‌گذاری نمایید.
        </p>
      </div>

      {/* 4 Steps Section */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-amber-500 mb-6 flex items-center gap-1.5">
          <ArrowRightLeft className="w-5 h-5" />
          مراحل آغاز معاملات در صرافی
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 font-black text-xs flex items-center justify-center border border-amber-500/20 mb-3">
                  {step.id}
                </span>
                <h4 className="text-xs font-bold text-gray-200">{step.title}</h4>
                <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">{step.description}</p>
              </div>
              {idx < 3 && (
                <div className="hidden md:block absolute top-1/2 left-[-15px] transform -translate-y-1/2 text-slate-800 text-lg font-black font-sans pointer-events-none">
                  ←
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bento Grid layout with other helpful topics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Security Info */}
        <div className="glass-panel rounded-2xl p-6 md:col-span-1 flex flex-col justify-between">
          <div>
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-gray-100">پشتوانه فیزیکی طلا و امنیت دارایی</h4>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
              تمامی معاملات سکه و طلا در صرافی سکه رمضانی دارای ۱۰۰ درصد پشتوانه طلای فیزیکی معتبر و موجود در خزانه اختصاصی صرافی است. کاربران در هر زمان می‌توانند معادل فیزیکی طلای خود را با هماهنگی قبلی تحویل بگیرند.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[9px] text-emerald-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            امنیت و بیمه کامل دارایی کاربران
          </div>
        </div>

        {/* Pricing & Calculators */}
        <div className="glass-panel rounded-2xl p-6 md:col-span-1 flex flex-col justify-between">
          <div>
            <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-gray-100">محاسبه ارزش ذاتی طلا</h4>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
              ارزش هر گرم طلای ۱۸ عیار از فرمول زیر محاسبه می‌شود:
              <br />
              <code className="block bg-slate-950 p-2 text-center text-amber-500 font-mono rounded mt-2 text-[9px]" dir="ltr">
                [(اونس طلا * دلار آزاد) / 31.1] * 0.750
              </code>
              <br />
              هوش مصنوعی پیشرفته صرافی در تب «تحلیل‌گر Gemini» به شما کمک می‌کند حباب تمام سکه‌ها را با دقت ۱۰۰٪ بررسی کنید.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[9px] text-amber-400 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5" />
            محاسبه‌گر خودکار در ابزارهای هوش مصنوعی
          </div>
        </div>

        {/* Risk warning */}
        <div className="glass-panel rounded-2xl p-6 md:col-span-1 flex flex-col justify-between border-red-500/20 bg-red-500/[0.01]">
          <div>
            <div className="p-2 w-fit rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-red-400">ریسک‌ها و نوسانات بازار طلا</h4>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
              بازار طلا و مسکوکات به شدت تحت تاثیر نرخ انس جهانی و نوسانات ارزی داخل کشور است. سرمایه‌گذاران محترم باید آگاهی کامل از مفهوم «حباب قیمتی» به ویژه در سکه‌های ربع و گرمی داشته باشند و همواره با توزیع بهینه دارایی اقدام به خرید کنند.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[9px] text-red-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            سرمایه‌گذاری عاقلانه با تحلیل داده‌های پیشین
          </div>
        </div>
      </div>

      {/* FAQs list accordion */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-200 mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          سوالات متداول کاربران صرافی
        </h3>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
              <h4 className="text-xs font-bold text-amber-400 mb-2">{faq.question}</h4>
              <p className="text-[11px] text-gray-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
