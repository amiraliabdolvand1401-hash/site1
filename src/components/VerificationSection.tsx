import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, AlertCircle, FileText, CreditCard, Upload, Image, Loader2, CheckCircle2 } from 'lucide-react';

interface VerificationSectionProps {
  currentUser: User;
  onRefresh: () => void;
  showToast: (title: string, msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function VerificationSection({ currentUser, onRefresh, showToast }: VerificationSectionProps) {
  const [nationalCode, setNationalCode] = useState(currentUser.nationalCode || '');
  const [cardNumber, setCardNumber] = useState(currentUser.cardNumber || '');
  const [previewImage, setPreviewImage] = useState<string | null>(currentUser.cardPhotoUrl || null);
  const [loading, setLoading] = useState(false);

  const status = currentUser.verificationStatus || 'unverified';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast("خطای اندازه فایل", "حداکثر حجم مجاز تصویر ۳ مگابایت است.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!/^\d{10}$/.test(nationalCode)) {
      showToast("کد ملی نامعتبر", "کد ملی باید دقیقاً ۱۰ رقم باشد.", "error");
      return;
    }
    if (!/^\d{16}$/.test(cardNumber)) {
      showToast("شماره کارت نامعتبر", "شماره کارت بانکی باید دقیقاً ۱۶ رقم باشد.", "error");
      return;
    }
    if (!previewImage) {
      showToast("تصویر کارت الزامی است", "لطفاً تصویر کارت ملی یا کارت بانکی خود را بارگذاری کنید.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentUser.id,
          nationalCode,
          cardNumber,
          cardPhotoUrl: previewImage,
          verificationStatus: 'pending'
        })
      });

      if (res.ok) {
        showToast("ثبت موفق مدارک", "مدارک هویتی شما با موفقیت ثبت شد و در صف بررسی مدیریت قرار گرفت.", "success");
        onRefresh();
      } else {
        showToast("خطا در ثبت مدارک", "خطایی در ثبت مدارک رخ داد. لطفاً مجدداً تلاش کنید.", "error");
      }
    } catch {
      showToast("خطای اتصال", "خطا در برقراری ارتباط با سرور صرافی.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl max-w-2xl mx-auto" id="kyc-verification-section">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">سامانه احراز هویت و ارزیابی مشتریان (KYC)</h2>
          <p className="text-xs text-gray-400 mt-0.5">طبق قوانین بانک مرکزی، جهت انجام خرید و فروش طلا و سکه، تایید هویت الزامی است.</p>
        </div>
      </div>

      {/* Status Alert Banner */}
      {status === 'verified' && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-start gap-3 mb-6 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-emerald-300">حساب کاربری شما تایید شده است</h4>
            <p className="text-xs text-emerald-400/80 mt-1 leading-relaxed">
              هویت و کارت بانکی شما با موفقیت تایید شده است. هم اکنون دسترسی کامل به تمامی امکانات پلتفرم معاملاتی سکه رمضانی دارید.
            </p>
          </div>
        </div>
      )}

      {status === 'pending' && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl flex items-start gap-3 mb-6 animate-pulse">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-amber-300">مدارک شما در حال بررسی است</h4>
            <p className="text-xs text-amber-400/80 mt-1 leading-relaxed">
              مدارک ارسالی شما (کد ملی و کارت بانکی) ثبت شده و توسط کارشناسان در دست ارزیابی و انطباق است. فرآیند تایید معمولاً کمتر از ۲ ساعت طول می‌کشد.
            </p>
          </div>
        </div>
      )}

      {status === 'rejected' && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 mb-6 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-red-300">مدارک هویتی شما رد شده است</h4>
            <p className="text-xs text-red-400/80 mt-1 leading-relaxed">
              {currentUser.kycRejectReason || "مدارک هویتی یا تصویر کارت ارسالی نامعتبر است یا با اطلاعات حساب تطابق ندارد. لطفاً اطلاعات صحیح را وارد کرده و دوباره ارسال نمایید."}
            </p>
          </div>
        </div>
      )}

      {status === 'unverified' && (
        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-xl flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-blue-300">اقدام جهت احراز هویت اولیه</h4>
            <p className="text-xs text-blue-400/80 mt-1 leading-relaxed">
              جهت فعال‌سازی قابلیت برداشت ریالی و تایید سفارشات معلق خود، لطفاً اطلاعات زیر را با دقت بالا ثبت کنید.
            </p>
          </div>
        </div>
      )}

      {/* Main KYC Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* National Code field */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-500" />
              کد ملی ده رقمی
            </label>
            <input
              type="text"
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value.replace(/\D/g, ''))}
              disabled={status === 'verified' || status === 'pending'}
              required
              maxLength={10}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors font-mono tracking-widest text-left"
              placeholder="مثال: 0012345678"
              dir="ltr"
            />
          </div>

          {/* Card Number field */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-amber-500" />
              شماره ۱۶ رقمی کارت بانکی (همانند حساب کاربری)
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
              disabled={status === 'verified' || status === 'pending'}
              required
              maxLength={16}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors font-mono tracking-widest text-left"
              placeholder="مثال: 6037991234567890"
              dir="ltr"
            />
          </div>
        </div>

        {/* Card Photo Uploader */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
            <Image className="w-4 h-4 text-amber-500" />
            بارگذاری تصویر کارت ملی یا کارت بانکی
          </label>

          {(status === 'unverified' || status === 'rejected') ? (
            <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/40 rounded-xl p-6 text-center cursor-pointer relative bg-slate-950/50 hover:bg-slate-950 transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 text-gray-500 mx-auto mb-2" />
              <p className="text-xs text-gray-300 font-bold">برای انتخاب تصویر، کلیک کنید یا فایل را اینجا رها کنید</p>
              <p className="text-[10px] text-gray-500 mt-1">فرمت‌های مجاز: JPG, PNG. حداکثر حجم: ۳ مگابایت</p>
            </div>
          ) : null}

          {/* Image Preview Box */}
          {previewImage && (
            <div className="mt-4 border border-slate-800 rounded-xl p-4 bg-slate-950/40 flex flex-col items-center">
              <div className="relative w-full max-w-sm h-48 bg-gradient-to-tr from-amber-600/20 to-yellow-500/10 rounded-xl border border-amber-500/30 shadow-lg overflow-hidden flex flex-col justify-between p-5 text-white font-mono">
                {/* Simulated Bank Card Layout */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-amber-400 font-semibold font-sans">سکه رمضانی</span>
                    <span className="text-[7px] text-gray-400 font-sans">کارت احراز هویت شده</span>
                  </div>
                  <div className="w-10 h-8 bg-amber-500/10 rounded-md border border-amber-500/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                  </div>
                </div>

                <div className="text-center my-3 tracking-widest text-base font-bold text-gray-100">
                  {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-gray-400 font-sans">دارنده کارت</span>
                    <span className="text-xs font-sans text-gray-200">{currentUser.name}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[8px] text-gray-400 font-sans">کد ملی</span>
                    <span className="text-xs text-gray-200">{nationalCode || '••••••••••'}</span>
                  </div>
                </div>

                {/* Actual Uploaded Image backdrop overlay */}
                <img 
                  src={previewImage} 
                  alt="Uploaded Credit Card" 
                  className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {(status === 'unverified' || status === 'rejected') && (
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="mt-3 text-[10px] text-red-400 hover:text-red-300 font-bold"
                >
                  حذف و بارگذاری مجدد تصویر
                </button>
              )}
            </div>
          )}
        </div>

        {/* Submit Actions */}
        {(status === 'unverified' || status === 'rejected') && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer shadow-lg shadow-amber-600/10 mt-4"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            ثبت اطلاعات و ارسال جهت بررسی هویت
          </button>
        )}
      </form>
    </div>
  );
}
