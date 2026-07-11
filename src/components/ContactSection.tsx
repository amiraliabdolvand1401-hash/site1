import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send, HelpCircle, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';

interface ContactSectionProps {
  showToast: (title: string, msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function ContactSection({ showToast }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      showToast("ارسال پیام موفقیت‌آمیز", "پیام پشتیبانی شما ثبت شد. کارشناسان ما به زودی با شما تماس می‌گیرند.", "success");
      setName('');
      setPhone('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="contact-section">
      
      {/* Left side: Contact Info Card */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Contact Numbers, Hours, Info */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-amber-500 flex items-center gap-2 border-b border-slate-800 pb-3">
            <MessageSquare className="w-5 h-5" />
            اطلاعات تماس صرافی سکه رمضانی
          </h3>

          <div className="space-y-4 text-xs">
            {/* Phone support */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-gray-200">تلفن پشتیبانی مستقیم</h4>
                <p className="text-gray-400 font-mono text-[11px] mt-0.5" dir="ltr">۰۲۱-۸۸۸۸۴۴۴۴</p>
                <p className="text-[10px] text-gray-500">پاسخگویی سریع برای راهنمایی معاملات</p>
              </div>
            </div>

            {/* Email support */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-gray-200">پست الکترونیکی رسمی</h4>
                <p className="text-gray-400 font-mono text-[11px] mt-0.5" dir="ltr">info@sekeh-ramezani.com</p>
                <p className="text-[10px] text-gray-500">ارسال مستندات اداری و پیشنهادات</p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-gray-200">ساعات کاری صرافی</h4>
                <p className="text-gray-400 mt-0.5">شنبه تا چهارشنبه: ۹:۰۰ الی ۱۸:۰۰</p>
                <p className="text-gray-400">پنجشنبه‌ها: ۹:۰۰ الی ۱۴:۰۰</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                  هم‌اکنون آماده پاسخگویی به شما هستیم
                </p>
              </div>
            </div>

            {/* Location Address */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-gray-200">دفتر مرکزی تهران</h4>
                <p className="text-gray-400 leading-relaxed mt-1">
                  تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۴۰۵، مجتمع صرافی‌های رمضانی
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security / FAQ hint */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl bg-gradient-to-tr from-amber-600/5 to-yellow-500/0 border border-slate-800">
          <h4 className="text-xs font-bold text-amber-500 flex items-center gap-1.5 mb-2">
            <HelpCircle className="w-4.5 h-4.5" />
            نیاز به پاسخ فوری دارید؟
          </h4>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            پیش از ارسال پیام، می‌توانید بخش «راهنما» را مطالعه کنید. در اکثر موارد سوالات مشابه شما توسط کاربران پرسیده شده و پاسخ داده شده است. همچنین می‌توانید با هوش مصنوعی Gemini در بخش تحلیل‌گر صحبت کنید.
          </p>
        </div>

      </div>

      {/* Right side: Active Inquiry Form */}
      <div className="lg:col-span-8">
        <div className="glass-panel rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
              <Send className="w-5 h-5 text-amber-500 transform rotate-180" />
              فرم ارسال تیکت و پیام به پشتیبانی صرافی
            </h3>

            {success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-8 rounded-xl text-center space-y-4 my-auto flex flex-col items-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h4 className="font-bold text-lg text-emerald-300">پیام شما با موفقیت دریافت شد!</h4>
                <p className="text-xs text-emerald-400/80 max-w-md mx-auto leading-relaxed">
                  از تماس شما سپاسگزاریم. تیکت شما با کد پیگیری <span className="font-mono font-bold bg-slate-950 px-2 py-0.5 rounded text-white">SR-{(Math.floor(Math.random() * 90000) + 10000)}</span> ثبت شد. کارشناسان پشتیبانی بخش معاملات سکه رمضانی در کمتر از یک ساعت آینده از طریق شماره موبایل با شما تماس خواهند گرفت.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 bg-slate-800 hover:bg-slate-750 text-gray-300 border border-slate-700 py-2 px-6 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  ارسال پیام جدید
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sender Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">نام و نام خانوادگی:</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none transition-colors"
                      placeholder="امیرعلی..."
                    />
                  </div>

                  {/* Sender Mobile */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">شماره همراه تماس:</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none transition-colors font-mono text-left"
                      placeholder="09123456789"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Inquiry Subject */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">موضوع پیام:</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none transition-colors"
                    placeholder="مثال: سوال در رابطه با ثبت مدرک بانکی"
                  />
                </div>

                {/* Inquiry message body */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">متن پیام یا شرح سوال:</label>
                  <textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none transition-colors"
                    placeholder="پرسش خود را در این بخش با دقت یادداشت نمایید..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer shadow-lg shadow-amber-600/10"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 transform rotate-180" />}
                  ارسال تیکت به واحد پشتیبانی صرافی
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
