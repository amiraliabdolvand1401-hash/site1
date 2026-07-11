import React, { useState } from 'react';
import { ShieldCheck, UserCheck, AlertTriangle, Upload, CreditCard, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { User } from '../types';

interface VerificationTabProps {
  currentUser: User;
  onRefresh: () => void;
  showToast: (title: string, msg: string, type: 'success' | 'warning' | 'error') => void;
}

export default function VerificationTab({ currentUser, onRefresh, showToast }: VerificationTabProps) {
  const [nationalCode, setNationalCode] = useState(currentUser.nationalCode || '');
  const [cardNumber, setCardNumber] = useState(currentUser.cardNumber || '');
  const [photoBase64, setPhotoBase64] = useState(currentUser.cardPhotoUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Formatting credit card number automatically
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleNationalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 10) {
      setNationalCode(val);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('خطا در فایل', 'لطفاً فقط فایل تصویر انتخاب کنید.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalCode.length !== 10) {
      showToast('کد ملی نامعتبر', 'کد ملی باید دقیقاً ۱۰ رقم باشد.', 'error');
      return;
    }
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length !== 16) {
      showToast('شماره کارت نامعتبر', 'شماره کارت بانکی باید دقیقاً ۱۶ رقم باشد.', 'error');
      return;
    }
    if (!photoBase64) {
      showToast('عدم آپلود مدرک', 'لطفاً تصویر کارت ملی یا کارت بانکی خود را بارگذاری کنید.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentUser.id,
          nationalCode,
          cardNumber: cleanCard,
          cardPhoto: photoBase64,
          cardPhotoUrl: photoBase64,
          verificationStatus: 'pending',
          kycStatus: 'pending'
        })
      });

      if (response.ok) {
        showToast('مدارک ثبت شد', 'اطلاعات هویتی شما با موفقیت ثبت گردید و در صف بررسی کارشناسان قرار گرفت.', 'success');
        onRefresh();
      } else {
        showToast('خطا در ثبت', 'مشکلی در ارتباط با سرور رخ داد.', 'error');
      }
    } catch (err) {
      showToast('خطا', 'برقراری ارتباط با سرور ناموفق بود.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const status = currentUser.verificationStatus || (currentUser.isVerified ? 'verified' : 'unverified');

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-amber-500/20 p-8 shadow-xl">
        <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[60px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <h2 className="text-xl font-black text-white flex items-center gap-2 justify-center md:justify-start">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              احراز هویت و ارتقای امنیت حساب کاربری
            </h2>
            <p className="text-xs text-gray-400 mt-2 max-w-xl leading-relaxed">
              با توجه به قوانین بانک مرکزی و مبارزه با پولشویی، جهت انجام کلیه معاملات خرید و فروش طلا و سکه در سامانه سکه رمضانی، تکمیل مدارک هویتی و ثبت شماره کارت بانکی متعلق به خودتان الزامی می‌باشد.
            </p>
          </div>
          <div className="shrink-0">
            {status === 'verified' && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg">
                <UserCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
                حساب کاربری کاملاً تایید شده
              </div>
            )}
            {status === 'pending' && (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg animate-pulse">
                <Clock className="w-5 h-5 text-amber-400" />
                مدارک در انتظار تایید مدیریت
              </div>
            )}
            {status === 'unverified' && (
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 text-gray-300 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                در انتظار ارسال مدارک هویتی
              </div>
            )}
            {status === 'rejected' && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                رد مدارک / لطفاً مجدداً ارسال کنید
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form panel */}
        <div className="lg:col-span-7">
          {status === 'verified' ? (
            <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">تبریک! احراز هویت شما کامل است</h3>
                <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
                  حساب کاربری شما مورد تایید قرار گرفته است. کلیه محدودیت‌های واریز، برداشت و معاملات برای شما حذف شده و شما می‌توانید به آسانی از خدمات سکه رمضانی بهره‌مند شوید.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-right max-w-md mx-auto space-y-3">
                <div className="flex justify-between text-xs text-gray-300 border-b border-slate-800 pb-2">
                  <span>نام کاربری:</span>
                  <span className="font-bold text-gray-100">{currentUser.name}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300 border-b border-slate-800 pb-2">
                  <span>کد ملی ثبت شده:</span>
                  <span className="font-mono font-bold text-amber-500">{currentUser.nationalCode || '---'}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>کارت بانکی ثبت شده:</span>
                  <span className="font-mono font-bold text-amber-500">
                    {currentUser.cardNumber ? currentUser.cardNumber.replace(/(\d{4})/g, '$1 ') : '---'}
                  </span>
                </div>
              </div>
            </div>
          ) : status === 'pending' ? (
            <div className="glass-panel rounded-2xl p-6 text-center space-y-6">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30 mx-auto shadow-lg animate-pulse">
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">مدارک هویتی شما در حال بررسی است</h3>
                <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
                  از صبوری شما سپاسگزاریم. کارشناسان صرافی سکه رمضانی هم‌اکنون در حال تطبیق کد ملی با شماره کارت بانکی و عکس ارسالی شما می‌باشند. این پروسه معمولاً کمتر از ۱۵ دقیقه زمان می‌برد.
                </p>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-right max-w-md mx-auto space-y-3 opacity-70">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>کد ملی ارسالی:</span>
                  <span className="font-mono font-bold">{currentUser.nationalCode}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>کارت بانکی ارسالی:</span>
                  <span className="font-mono font-bold">
                    {currentUser.cardNumber ? currentUser.cardNumber.replace(/(\d{4})/g, '$1 ') : '---'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <h3 className="text-base font-black text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                <CreditCard className="w-5 h-5 text-amber-500" />
                تکمیل اطلاعات احراز هویت
              </h3>

              {status === 'rejected' && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs mb-6 text-right leading-relaxed">
                  <span className="font-bold flex items-center gap-1.5 mb-1 text-red-400">
                    <ShieldAlert className="w-4.5 h-4.5" />
                    مدارک قبلی شما رد صلاحیت شده است:
                  </span>
                  {currentUser.kycRejectReason || 'نام انطباق نام صاحب کارت با کد ملی ارسالی.'} لطفا مدارک معتبر و دقیق را مجدداً وارد و بارگذاری کنید.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">کد ملی ده رقمی</label>
                  <input
                    type="text"
                    required
                    value={nationalCode}
                    onChange={handleNationalCodeChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors text-left font-semibold font-mono"
                    placeholder="مثال: 0012345678"
                  />
                  <p className="text-[10px] text-gray-500 mt-1.5 text-right">کد ملی باید دقیقا ده رقم و متعلق به صاحب حساب کاربری باشد.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">شماره کارت ۱۶ رقمی بانکی</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors text-left font-semibold font-mono"
                    placeholder="6037 9912 3456 7890"
                  />
                  <p className="text-[10px] text-gray-500 mt-1.5 text-right">خرید طلا تنها با کارت‌های بانکی تایید شده در این بخش امکان‌پذیر است.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">عکس کارت ملی یا کارت بانکی</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all ${
                      dragActive ? 'border-amber-500 bg-amber-500/5' : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="file"
                      id="card-photo-upload"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    
                    {photoBase64 ? (
                      <div className="space-y-3 w-full text-center">
                        <img 
                          src={photoBase64} 
                          alt="ID Preview" 
                          className="max-h-36 mx-auto rounded-lg border border-slate-700 shadow-md referrer-policy='no-referrer'" 
                        />
                        <div className="flex justify-center gap-3">
                          <label 
                            htmlFor="card-photo-upload" 
                            className="bg-slate-800 hover:bg-slate-700 text-gray-200 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            تغییر عکس
                          </label>
                          <button 
                            type="button"
                            onClick={() => setPhotoBase64('')}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="card-photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 text-amber-500">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-gray-300 font-bold">عکس کارت بانکی یا کارت ملی خود را انتخاب کنید</span>
                        <span className="text-[10px] text-gray-500">یا فایل را به اینجا بکشید و رها کنید (PNG, JPG)</span>
                      </label>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 text-xs cursor-pointer mt-2"
                >
                  {isSubmitting ? 'در حال ثبت اطلاعات...' : 'ثبت نهایی مدارک جهت تایید'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Live debit card visualization */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h4 className="text-xs font-bold text-gray-400 mb-4 text-right">پیش‌نمایش زنده کارت بانکی متصل:</h4>
            
            {/* Debit Card Mockup */}
            <div className="w-full aspect-[1.586/1] bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 rounded-2xl p-5 shadow-2xl relative text-slate-950 overflow-hidden flex flex-col justify-between">
              {/* Pattern overlays */}
              <div className="absolute inset-0 bg-radial-gradient(circle at 100% 100%, rgba(255,255,255,0.15) 0%, transparent 80%)"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl"></div>

              {/* Card Header */}
              <div className="flex justify-between items-start relative z-10">
                <div className="font-extrabold text-sm tracking-tight text-slate-900">سکه رمضانی</div>
                <div className="text-xs font-black bg-slate-950/10 px-2 py-0.5 rounded border border-slate-950/10">شتاب</div>
              </div>

              {/* Card Chip & Contactless */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-7 bg-gradient-to-tr from-yellow-300 to-yellow-100 rounded-md border border-amber-600/40 shadow"></div>
                <svg className="w-6 h-6 text-slate-900/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12c4.4-4 15.6-4 20 0M5 12c3.3-3 10.7-3 14 0M8 12c2.2-2 5.8-2 8 0" />
                </svg>
              </div>

              {/* Card Number */}
              <div className="font-mono text-base md:text-lg font-black tracking-widest text-slate-950 text-center py-2 relative z-10" dir="ltr">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <div className="text-[8px] text-slate-900/60 uppercase font-bold">صاحب کارت</div>
                  <div className="text-xs font-extrabold text-slate-900">{currentUser.name}</div>
                </div>
                <div className="text-left font-mono">
                  <div className="text-[8px] text-slate-900/60 uppercase font-bold">انقضا</div>
                  <div className="text-xs font-bold text-slate-900">۱۴۰۸/۱۲</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="text-xs font-black text-amber-500 text-right">چرا احراز هویت لازم است؟</h4>
            <ul className="space-y-2.5 text-[11px] text-gray-400 text-right leading-relaxed list-disc list-inside">
              <li>جلوگیری از سوءاستفاده، فیشینگ و خرید با کارت‌های بانکی سرقتی.</li>
              <li>انطباق کامل کد ملی با صاحب کارت جهت واریز و برداشت سریع ریالی.</li>
              <li>انجام معاملات نامحدود در بازار سکه و تحویل ایمن فیزیکی سکه‌ها.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
