import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ExternalLink, ThumbsUp } from 'lucide-react';

export default function ContactTab() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('پشتیبانی عمومی');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
      setName('');
      setPhone('');
      setMessage('');
      setTimeout(() => setIsSent(false), 8000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/20 p-8 shadow-xl">
        <div className="absolute top-[-30%] left-[-10%] w-[350px] h-[350px] rounded-full bg-amber-500/5 blur-[80px]"></div>
        <div className="relative z-10 text-center md:text-right space-y-2">
          <h2 className="text-xl font-black text-white flex items-center gap-2 justify-center md:justify-start">
            <MessageSquare className="w-6 h-6 text-amber-500" />
            ارتباط با صرافی سکه رمضانی
          </h2>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
            ما به صورت ۲۴ ساعته در شبانه‌روز آماده پاسخگویی به سوالات، تایید مدارک هویتی، هماهنگی تحویل حضوری مسکوکات طلا و پشتیبانی فنی شما کاربران گرامی هستیم.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-5">
            <h3 className="text-xs font-black text-amber-500 border-b border-slate-800 pb-3 uppercase tracking-wider">
              دفتر مرکزی و اطلاعات تماس
            </h3>

            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-200">آدرس مراجعه حضوری:</h4>
                  <p className="text-gray-400 mt-1 leading-relaxed">
                    تهران، بازار بزرگ، سبزه میدان، مجتمع تجاری فروردین، طبقه اول، واحد ۱۲ - صرافی طلا و سکه رمضانی
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 shrink-0">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-200">تلفن‌های تماس پشتیبانی:</h4>
                  <p className="text-gray-400 mt-1 leading-relaxed font-mono" dir="ltr">
                    ۰۲۱-۵۵۶۶۷۷۸۸
                  </p>
                  <p className="text-gray-400 mt-0.5 leading-relaxed font-mono" dir="ltr">
                    ۰۹۱۲-۰۰۰۰۰۰۰ (ویژه پشتیبانی تلگرام و واتس‌اپ)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-200">ساعات کاری صرافی:</h4>
                  <p className="text-gray-400 mt-1 leading-relaxed">
                    شنبه تا چهارشنبه: از ساعت ۱۰:۰۰ صبح الی ۱۸:۰۰ عصر
                  </p>
                  <p className="text-gray-400 mt-0.5 leading-relaxed">
                    پشتیبانی آنلاین تیکت و تلگرام: ۲۴ ساعته، ۷ روز هفته
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social connections */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3.5">
            <h3 className="text-xs font-black text-amber-500">ارتباط در شبکه‌های اجتماعی</h3>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              جهت هماهنگی سریع‌تر و ارسال اسناد می‌توانید با پشتیبانی ما در شبکه‌های اجتماعی معتبر در ارتباط باشید:
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1.5">
              <a 
                href="https://t.me/sekeh_ramezani" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 p-2.5 rounded-xl font-bold text-[10px] cursor-pointer transition-colors"
              >
                کانال تلگرام سکه رمضانی
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://wa.me/989120000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 p-2.5 rounded-xl font-bold text-[10px] cursor-pointer transition-colors"
              >
                واتس‌اپ پشتیبانی
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-black text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Mail className="w-4.5 h-4.5 text-amber-500" />
              ارسال تیکت مستقیم به پشتیبانی صرافی
            </h3>

            {isSent ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-xl text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <ThumbsUp className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">پیام شما با موفقیت ثبت گردید</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed max-w-sm mx-auto">
                    از پیام شما سپاسگزاریم. تیکت شما به بخش مربوطه ارجاع شد و کارشناسان ما تا حداکثر ۱ ساعت آینده با شماره همراه شما تماس خواهند گرفت.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">نام و نام خانوادگی شما</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="مثال: علی رمضانی"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">شماره موبایل جهت پاسخگویی</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors text-left font-mono"
                      placeholder="09123456789"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">بخش مربوطه</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="پشتیبانی عمومی">پشتیبانی عمومی و سوالات فنی</option>
                    <option value="بررسی تایید مدارک هویتی">پیگیری تایید مدارک هویتی / بانکی</option>
                    <option value="هماهنگی تحویل فیزیکی طلا">هماهنگی مراجعه حضوری و تحویل فیزیکی سکه‌ها</option>
                    <option value="تراکنش‌های ریالی و مالی">تراکنش‌های ریالی، واریز و برداشت وجه</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">متن پیام یا پرسش شما</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors leading-relaxed"
                    placeholder="پیام یا شرح درخواست خود را به تفصیل بنویسید..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 text-xs cursor-pointer"
                >
                  <Send className="w-4.5 h-4.5" />
                  {loading ? 'در حال ارسال پیام...' : 'ارسال پیام به صرافی'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
