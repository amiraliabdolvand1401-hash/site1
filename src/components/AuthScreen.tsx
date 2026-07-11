import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Lock, Mail, Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: (uid: string, name: string) => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const authEmail = phone.includes('@') ? phone.trim() : `${phone.trim()}@sekeh-ramezani.com`;
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, authEmail, password);
        onSuccess(userCred.user.uid, userCred.user.displayName || phone);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, authEmail, password);
        onSuccess(userCred.user.uid, name || phone);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('ورود با شماره موبایل/ایمیل غیرفعال است. لطفا در پنل فایربیس (بخش Authentication) ارائه‌دهنده Email/Password را فعال کنید.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('شماره موبایل/ایمیل یا رمز عبور اشتباه است.');
      } else {
        setError('مشکلی در احراز هویت پیش آمد. لطفا اطلاعات را بررسی کنید.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0f172a 100%) p-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[80px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[80px]"></div>

      <div className="glass-panel p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10 border border-amber-500/30">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/5">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-center text-white mb-2 tracking-tight">
          {isLogin ? 'ورود به سکه رمضانی' : 'ثبت نام در سکه رمضانی'}
        </h2>
        <p className="text-gray-400 text-center mb-8 text-xs font-medium">
          {isLogin ? 'جهت ورود اطلاعات خود را وارد کنید' : 'جهت ایجاد حساب کاربری اطلاعات زیر را تکمیل کنید'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs mb-6 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">نام و نام خانوادگی</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm"
                placeholder="امیرعلی..."
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">شماره موبایل یا ایمیل</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm text-left font-semibold"
              placeholder="09123456789 یا Ramezanigold.1405@gmail.com"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm text-left"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer shadow-lg shadow-amber-500/10 text-sm"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'ورود به حساب کاربری' : 'ثبت نام جدید')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-500/80 hover:text-amber-500 text-sm transition-colors"
          >
            {isLogin ? 'حساب کاربری ندارید؟ ثبت نام کنید' : 'قبلاً ثبت نام کرده‌اید؟ وارد شوید'}
          </button>
        </div>
      </div>
    </div>
  );
}
