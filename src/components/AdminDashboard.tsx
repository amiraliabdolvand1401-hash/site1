import React, { useState } from 'react';
import { DatabaseState, User, Transaction, CoinType, COIN_DETAILS } from '../types';
import { Users, CheckCircle, XCircle, Phone, Bell, DollarSign, FileText, Send, Settings, Server, CreditCard, Key, ShieldCheck } from 'lucide-react';

interface AdminDashboardProps {
  dbState: DatabaseState;
  onRefresh: () => void;
  showToast: (title: string, msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function AdminDashboard({ dbState, onRefresh, showToast }: AdminDashboardProps) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'users' | 'trades' | 'kyc' | 'broadcast' | 'settings'>('users');
  const { users, transactions, sms, notifications } = dbState;

  // Selected state for modifying user balances
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [balanceChangeAmount, setBalanceChangeAmount] = useState<number>(0);

  // SMS Simulator inputs
  const [smsRecipientPhone, setSmsRecipientPhone] = useState<string>('');
  const [smsRecipientName, setSmsRecipientName] = useState<string>('');
  const [smsTemplate, setSmsTemplate] = useState<string>('custom');
  const [smsMessage, setSmsMessage] = useState<string>('');

  // Notification inputs
  const [notifTargetUser, setNotifTargetUser] = useState<string>('all');
  const [notifTitle, setNotifTitle] = useState<string>('');
  const [notifBody, setNotifBody] = useState<string>('');

  // Trigger balance update
  const handleModifyBalance = async (type: 'add' | 'subtract') => {
    if (!selectedUserId) {
      showToast("خطا", "لطفاً ابتدا یک کاربر را انتخاب نمایید.", "error");
      return;
    }
    const user = users.find(u => u.id === selectedUserId);
    if (!user) return;

    let newBalance = user.balanceToman;
    if (type === 'add') {
      newBalance += balanceChangeAmount;
    } else {
      if (user.balanceToman < balanceChangeAmount) {
        showToast("خطا", "موجودی ریالی کاربر کافی نیست.", "error");
        return;
      }
      newBalance -= balanceChangeAmount;
    }

    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedUserId, balanceToman: newBalance })
      });
      if (res.ok) {
        showToast("بروزرسانی موفق", `موجودی حساب ${user.name} با موفقیت بروزرسانی شد.`, "success");
        setBalanceChangeAmount(0);
        setSelectedUserId('');
        onRefresh();
      }
    } catch {
      showToast("خطا", "ارتباط با سرور برقرار نشد.", "error");
    }
  };

  // Toggle user verification status
  const handleToggleVerify = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, isVerified: !currentStatus, verificationStatus: !currentStatus ? 'verified' : 'unverified' })
      });
      if (res.ok) {
        showToast(
          "تغییر وضعیت احراز هویت",
          `وضعیت احراز هویت کاربر به ${!currentStatus ? 'تایید شده' : 'تایید نشده'} تغییر یافت.`,
          "success"
        );
        onRefresh();
      }
    } catch {
      showToast("خطا", "خطا در برقراری ارتباط با سرور.", "error");
    }
  };

  // Verify User KYC
  const handleVerifyKYC = async (userId: string, status: 'verified' | 'rejected', reason?: string) => {
    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: userId, 
          verificationStatus: status, 
          isVerified: status === 'verified',
          kycRejectReason: reason || ''
        })
      });
      if (res.ok) {
        showToast(
          "تغییر وضعیت احراز هویت",
          status === 'verified' ? "مدارک کاربر با موفقیت تایید و حساب کاربری او فعال شد." : "مدارک کاربر رد شد و علت آن ثبت گردید.",
          status === 'verified' ? "success" : "info"
        );
        onRefresh();
      }
    } catch {
      showToast("خطا", "ارتباط با سرور صرافی برقرار نشد.", "error");
    }
  };

  // Approve a transaction
  const handleApproveTrade = async (id: string) => {
    try {
      const res = await fetch('/api/transactions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("تایید معامله", "معامله با موفقیت تایید و کیف دارایی بروزرسانی شد.", "success");
        onRefresh();
      } else {
        showToast("خطا در تایید", data.error || "خطایی رخ داد.", "error");
      }
    } catch {
      showToast("خطا", "ارتباط با سرور قطع شد.", "error");
    }
  };

  // Reject a transaction
  const handleRejectTrade = async (id: string) => {
    try {
      const res = await fetch('/api/transactions/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showToast("معامله رد شد", "معامله لغو و از صف تایید خارج شد.", "info");
        onRefresh();
      }
    } catch {
      showToast("خطا", "ارتباط با سرور قطع شد.", "error");
    }
  };

  // Handle template selection in SMS Simulator
  const handleTemplateChange = (templateKey: string, phone: string, name: string) => {
    setSmsTemplate(templateKey);
    const targetName = name || "کاربر گرامی";
    if (templateKey === 'verify') {
      setSmsMessage(`کاربر گرامی ${targetName}، مدارک احراز هویت شما با موفقیت تایید گردید. هم اکنون می‌توانید معاملات طلا و سکه را آغاز کنید. سکه رمضانی`);
    } else if (templateKey === 'price') {
      setSmsMessage(`نرخ فوری سکه در بازار: حباب ربع سکه در حال کاهش است. فرصت مناسب خرید را از دست ندهید. سکه رمضانی`);
    } else if (templateKey === 'promo') {
      setSmsMessage(`کاربر گرامی ${targetName}، با واریز وجه و افزایش موجودی بیش از ۵۰ میلیون تومان، اولین معامله خود را بدون کارمزد انجام دهید!`);
    } else {
      setSmsMessage('');
    }
  };

  // Send simulated SMS
  const handleSendSMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsRecipientPhone || !smsMessage) {
      showToast("خطا", "لطفاً تلفن همراه و متن پیام را وارد کنید.", "error");
      return;
    }

    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: smsRecipientName || "مخاطب آزاد",
          phone: smsRecipientPhone,
          message: smsMessage
        })
      });
      if (res.ok) {
        showToast("پیامک ارسال شد", `پیام کوتاه شبیه‌سازی شده به شماره ${smsRecipientPhone} ارسال گردید.`, "success");
        setSmsMessage('');
        setSmsRecipientPhone('');
        setSmsRecipientName('');
        onRefresh();
      }
    } catch {
      showToast("خطا", "ارتباط با سرور برقرار نشد.", "error");
    }
  };

  // Send system notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifBody) {
      showToast("خطا", "لطفاً عنوان و متن اعلان را بنویسید.", "error");
      return;
    }

    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notifTitle,
          body: notifBody,
          userId: notifTargetUser
        })
      });
      if (res.ok) {
        showToast("اعلان ارسال شد", "نوتیفیکیشن با موفقیت به صورت زنده منتشر گردید.", "success");
        setNotifTitle('');
        setNotifBody('');
        onRefresh();
      }
    } catch {
      showToast("خطا", "ارتباط با سرور برقرار نشد.", "error");
    }
  };

  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  return (
    <div className="glass-panel-accent gold-glow-hover rounded-2xl p-6 shadow-2xl" id="admin-dashboard-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700 pb-5 mb-6 gap-4">
        <div>
          <span className="text-xs bg-amber-600/20 text-amber-500 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            کنترل پنل مدیریت ارشد
          </span>
          <h2 className="text-xl font-extrabold text-gray-100 mt-2">سامانه نظارت، تایید معاملات و ابزار اطلاع‌رسانی</h2>
        </div>
        
        {/* Admin Subtabs */}
        <div className="flex gap-2">
          <button
            id="admin-subtab-users"
            onClick={() => setActiveAdminSubTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeAdminSubTab === 'users' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/10' : 'bg-slate-800 text-gray-300 hover:bg-slate-750'
            }`}
          >
            <Users className="w-4 h-4" />
            کاربران ({users.length})
          </button>
          <button
            id="admin-subtab-trades"
            onClick={() => setActiveAdminSubTab('trades')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer relative transition-all ${
              activeAdminSubTab === 'trades' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/10' : 'bg-slate-800 text-gray-300 hover:bg-slate-750'
            }`}
          >
            <FileText className="w-4 h-4" />
            تایید معاملات
            {pendingTransactions.length > 0 && (
              <span className="absolute -top-1.5 -left-1.5 bg-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {pendingTransactions.length}
              </span>
            )}
          </button>
          <button
            id="admin-subtab-kyc"
            onClick={() => setActiveAdminSubTab('kyc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer relative transition-all ${
              activeAdminSubTab === 'kyc' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/10' : 'bg-slate-800 text-gray-300 hover:bg-slate-750'
            }`}
          >
            <ShieldCheck className="w-4 h-4 animate-pulse" />
            بررسی هویت (KYC)
            {users.filter(u => u.verificationStatus === 'pending').length > 0 && (
              <span className="absolute -top-1.5 -left-1.5 bg-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {users.filter(u => u.verificationStatus === 'pending').length}
              </span>
            )}
          </button>
          <button
            id="admin-subtab-broadcast"
            onClick={() => setActiveAdminSubTab('broadcast')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeAdminSubTab === 'broadcast' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/10' : 'bg-slate-800 text-gray-300 hover:bg-slate-750'
            }`}
          >
            <Bell className="w-4 h-4" />
            پیامک و نوتیفیکیشن
          </button>
          <button
            id="admin-subtab-settings"
            onClick={() => setActiveAdminSubTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeAdminSubTab === 'settings' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/10' : 'bg-slate-800 text-gray-300 hover:bg-slate-750'
            }`}
          >
            <Settings className="w-4 h-4" />
            پیکربندی انتشار
          </button>
        </div>
      </div>

      {/* SUBTAB 1: USER MANAGEMENT */}
      {activeAdminSubTab === 'users' && (
        <div className="space-y-6" id="admin-users-view">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* User List Table */}
            <div className="lg:col-span-8 bg-slate-900/60 rounded-xl border border-slate-800/80 p-5 overflow-x-auto">
              <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-500" />
                فهرست معامله‌گران و کیف دارایی
              </h3>
              
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-gray-400">
                    <th className="pb-3 px-2 font-semibold">نام معامله‌گر</th>
                    <th className="pb-3 px-2 font-semibold">شماره تماس</th>
                    <th className="pb-3 px-2 font-semibold text-left">موجودی ریالی</th>
                    <th className="pb-3 px-2 font-semibold">ذخیره طلا و سکه</th>
                    <th className="pb-3 px-2 font-semibold text-center">وضعیت احراز</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {users.map(u => (
                    <tr key={u.id} className="text-gray-200 hover:bg-slate-850/50">
                      <td className="py-3 px-2 font-bold flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-amber-500 font-bold flex items-center justify-center">
                          {u.name.charAt(0)}
                        </div>
                        {u.name}
                        {u.role === 'admin' && <span className="bg-red-500/10 text-red-400 border border-red-500/15 text-[9px] px-1 rounded">ادمین</span>}
                      </td>
                      <td className="py-3 px-2 text-gray-400 font-mono">{u.phone}</td>
                      <td className="py-3 px-2 text-left font-bold text-amber-500">{u.balanceToman.toLocaleString('fa-IR')} تومان</td>
                      <td className="py-3 px-2 text-[11px] text-gray-300">
                        {Object.keys(COIN_DETAILS).map(key => {
                          const amt = u.inventory[key as CoinType] || 0;
                          if (amt === 0) return null;
                          return (
                            <span key={key} className="inline-block mx-1">
                              {COIN_DETAILS[key as CoinType].label}: <span className="font-bold text-gray-100">{amt}</span>
                            </span>
                          );
                        })}
                        {Object.values(u.inventory).every(val => !val) && <span>بدون دارایی</span>}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          id={`btn-verify-${u.id}`}
                          onClick={() => handleToggleVerify(u.id, u.isVerified)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                            u.isVerified 
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25'
                              : 'bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25'
                          }`}
                        >
                          {u.isVerified ? "تایید هویت شده" : "نیاز به احراز هویت"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Balance Modifier */}
            <div className="lg:col-span-4 bg-slate-900/60 rounded-xl border border-slate-800/80 p-5">
              <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-500" />
                تعدیل شارژ ریالی حساب کاربر
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1.5">انتخاب کاربر:</label>
                  <select
                    id="select-admin-user"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl py-3 px-3 text-gray-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- انتخاب معامله‌گر --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} (بالانس: {u.balanceToman.toLocaleString('fa-IR')} ت)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1.5">مبلغ به تومان:</label>
                  <input
                    id="input-balance-amount"
                    type="number"
                    value={balanceChangeAmount || ''}
                    onChange={(e) => setBalanceChangeAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="مثال: ۵,۰۰۰,۰۰۰"
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl py-3 px-3 text-gray-100 focus:outline-none focus:border-amber-500"
                  />
                  {balanceChangeAmount > 0 && (
                    <span className="text-[10px] text-amber-500 mt-1 block">
                      معادل: {(balanceChangeAmount).toLocaleString('fa-IR')} تومان
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    id="btn-add-balance"
                    onClick={() => handleModifyBalance('add')}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    واریز / شارژ حساب
                  </button>
                  <button
                    id="btn-sub-balance"
                    onClick={() => handleModifyBalance('subtract')}
                    className="py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    برداشت / کسر وجه
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB KYC: USER IDENTITY REVIEWS */}
      {activeAdminSubTab === 'kyc' && (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 p-5" id="admin-kyc-view">
          <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            بررسی مدارک هویتی و احراز هویت کاربران (KYC)
          </h3>

          {users.filter(u => u.verificationStatus === 'pending').length === 0 ? (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-2">
              <CheckCircle className="w-10 h-10 text-emerald-500/20" />
              <p className="text-xs">هیچ کاربری در انتظار تایید هویت قرار ندارد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.filter(u => u.verificationStatus === 'pending').map(user => (
                <div key={user.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-gray-100">{user.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{user.phone}</p>
                    </div>
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/15 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                      در انتظار بررسی
                    </span>
                  </div>

                  <div className="space-y-2 text-xs border-t border-b border-slate-900 py-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">کد ملی ده رقمی:</span>
                      <span className="font-mono font-semibold text-gray-200">{user.nationalCode || 'ثبت نشده'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">شماره کارت بانکی:</span>
                      <span className="font-mono font-semibold text-gray-200">{user.cardNumber ? user.cardNumber.replace(/(\d{4})/g, '$1 ').trim() : 'ثبت نشده'}</span>
                    </div>
                  </div>

                  {user.cardPhotoUrl && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400">تصویر بارگذاری شده:</span>
                      <div className="relative border border-slate-800 rounded-lg overflow-hidden h-36 bg-slate-900 flex items-center justify-center">
                        <img 
                          src={user.cardPhotoUrl} 
                          alt="ID Card Upload" 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-1">
                    <button
                      onClick={() => handleVerifyKYC(user.id, 'verified')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
                    >
                      <CheckCircle className="w-4 h-4" />
                      تایید هویت و مدارک
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt("لطفاً علت رد مدارک را بنویسید:") || "مدارک هویتی نامعتبر است یا با اطلاعات حساب کاربری همخوانی ندارد.";
                        handleVerifyKYC(user.id, 'rejected', reason);
                      }}
                      className="flex-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      رد مدارک
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: TRANSACTION APPROVALS */}
      {activeAdminSubTab === 'trades' && (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 p-5" id="admin-trades-view">
          <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-500" />
            تایید نهایی سفارشات طلا و سکه کاربران
          </h3>

          {pendingTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-2">
              <CheckCircle className="w-10 h-10 text-emerald-500/20" />
              <p className="text-xs">هیچ معامله معلقی در صف انتظار جهت بررسی وجود ندارد.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-gray-400">
                    <th className="pb-3 px-2 font-semibold">مشتری</th>
                    <th className="pb-3 px-2 font-semibold text-center">نوع درخواست</th>
                    <th className="pb-3 px-2 font-semibold">دارایی انتخابی</th>
                    <th className="pb-3 px-2 font-semibold text-center">مقدار (واحد)</th>
                    <th className="pb-3 px-2 font-semibold text-left">مجموع قیمت (تومان)</th>
                    <th className="pb-3 px-2 font-semibold text-center">عملیات مدیریت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {pendingTransactions.map(tx => (
                    <tr key={tx.id} className="text-gray-200 hover:bg-slate-850/50">
                      <td className="py-3 px-2 font-bold">{tx.userName}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {tx.type === 'buy' ? 'خرید' : 'فروش'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-300">{tx.coinLabel}</td>
                      <td className="py-3 px-2 text-center font-bold">{tx.amount}</td>
                      <td className="py-3 px-2 text-left font-bold text-amber-500">{tx.totalPrice.toLocaleString('fa-IR')} تومان</td>
                      <td className="py-3 px-2 text-center flex items-center justify-center gap-1.5">
                        <button
                          id={`btn-approve-${tx.id}`}
                          onClick={() => handleApproveTrade(tx.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          تایید معامله
                        </button>
                        <button
                          id={`btn-reject-${tx.id}`}
                          onClick={() => handleRejectTrade(tx.id)}
                          className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          رد معامله
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: CONTACT SMS AND SYSTEM NOTIFICATION BROADCASTS */}
      {activeAdminSubTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="admin-broadcast-view">
          
          {/* SMS Contact Simulator */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 p-5 flex flex-col justify-between">
            <form onSubmit={handleSendSMS}>
              <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Phone className="w-4.5 h-4.5 text-amber-500" />
                شبیه‌ساز ارسال پیامک کوتاه به مخاطبین همراه
              </h3>

              <div className="space-y-3.5">
                {/* Select Quick Contact */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">انتخاب سریع از دفترچه تلفن:</label>
                  <select
                    id="select-sms-contact"
                    onChange={(e) => {
                      const uid = e.target.value;
                      if (!uid) {
                        setSmsRecipientPhone('');
                        setSmsRecipientName('');
                        return;
                      }
                      const user = users.find(u => u.id === uid);
                      if (user) {
                        setSmsRecipientPhone(user.phone);
                        setSmsRecipientName(user.name);
                        handleTemplateChange(smsTemplate, user.phone, user.name);
                      }
                    }}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-gray-100 focus:outline-none"
                  >
                    <option value="">-- انتخاب از دفترچه مخاطبین --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.phone})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">نام مخاطب:</label>
                    <input
                      id="input-sms-name"
                      type="text"
                      value={smsRecipientName}
                      onChange={(e) => setSmsRecipientName(e.target.value)}
                      placeholder="امیرعلی..."
                      className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">شماره همراه:</label>
                    <input
                      id="input-sms-phone"
                      type="text"
                      value={smsRecipientPhone}
                      onChange={(e) => setSmsRecipientPhone(e.target.value)}
                      placeholder="09121112233"
                      className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-gray-100 font-mono text-left"
                    />
                  </div>
                </div>

                {/* Templates Selection */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">قالب پیام‌های پیش‌فرض:</label>
                  <select
                    id="select-sms-template"
                    value={smsTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value, smsRecipientPhone, smsRecipientName)}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-gray-100 focus:outline-none"
                  >
                    <option value="custom">متن سفارشی (دستی)</option>
                    <option value="verify">اعلام تایید هویت حساب کاربری</option>
                    <option value="price">اعلام نوسان قیمت فوری و حباب بازار</option>
                    <option value="promo">ارسال پیامک تخفیف کارمزد واریز وجه</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">متن پیامک ارسالی:</label>
                  <textarea
                    id="input-sms-message"
                    rows={4}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="متن پیام خود را بنویسید..."
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-gray-100 focus:outline-none"
                  />
                </div>
              </div>
            </form>

            <button
              id="btn-send-sms"
              onClick={handleSendSMS}
              className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 transform rotate-180" />
              ارسال پیام کوتاه شبیه‌سازی شده
            </button>
          </div>

          {/* System Notification Broadcaster */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 p-5 flex flex-col justify-between">
            <form onSubmit={handleSendNotification}>
              <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Bell className="w-4.5 h-4.5 text-amber-500" />
                ارسال اعلان‌های زنده سیستمی (نوتیفیکیشن بازار)
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">گیرنده اعلان زنده:</label>
                  <select
                    id="select-notif-target"
                    value={notifTargetUser}
                    onChange={(e) => setNotifTargetUser(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-gray-100 focus:outline-none"
                  >
                    <option value="all">اعلان همگانی (پخش زنده برای تمام کاربران)</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">عنوان اعلان:</label>
                  <input
                    id="input-notif-title"
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="مثال: تغییر فوری نرخ ربع سکه"
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">متن بدنه اعلان:</label>
                  <textarea
                    id="input-notif-body"
                    rows={4}
                    value={notifBody}
                    onChange={(e) => setNotifBody(e.target.value)}
                    placeholder="متن اعلان را به طور کامل تشریح نمایید..."
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-gray-100 focus:outline-none"
                  />
                </div>
              </div>
            </form>

            <button
              id="btn-send-notif"
              onClick={handleSendNotification}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              انتشار اعلان زنده سیستمی
            </button>
          </div>

        </div>
      )}
      {/* SUBTAB 4: SYSTEM DEPLOYMENT CONFIG */}
      {activeAdminSubTab === 'settings' && (
        <div className="space-y-6" id="admin-settings-view">
          <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 p-5">
            <h3 className="text-sm font-bold text-gray-200 mb-2 flex items-center gap-1.5">
              <Settings className="w-5 h-5 text-amber-500" />
              راهنمای راه‌اندازی و انتشار عمومی (Production Setup)
            </h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              برای تبدیل این سامانه از نسخه دمو به یک اپلیکیشن کاملاً عملیاتی و عمومی، نیاز به فعال‌سازی و تهیه سرویس‌های زیر دارید. موارد زیر را تهیه کرده و کلیدهای API آن‌ها را در محیط سرور (فایل `.env`) قرار دهید.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Database */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Server className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-gray-200 text-sm">۱. پایگاه داده (دیتابیس واقعی)</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                  در حال حاضر سیستم از یک فایل JSON محلی برای ذخیره‌سازی استفاده می‌کند. برای امنیت و پایداری در محیط واقعی باید از یک دیتابیس ابری استفاده شود.
                </p>
                <ul className="text-[10px] text-gray-300 space-y-1 list-disc list-inside">
                  <li>پیشنهاد: Cloud SQL (PostgreSQL) یا Firebase Firestore</li>
                  <li>نیاز به تعریف متغیرهای محیطی دیتابیس (مثلاً `DATABASE_URL`)</li>
                </ul>
              </div>

              {/* Payment Gateway */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-gray-200 text-sm">۲. درگاه پرداخت اینترنتی</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                  برای واریز و برداشت وجه واقعی (شارژ حساب کاربران)، نیازمند اتصال به درگاه‌های پرداخت بانکی هستید.
                </p>
                <ul className="text-[10px] text-gray-300 space-y-1 list-disc list-inside">
                  <li>پیشنهاد: زرین‌پال، آیدی‌پی، زیبال یا درگاه‌های مستقیم بانکی</li>
                  <li>تهیه توکن: ثبت نام در زرین‌پال و دریافت `ZARINPAL_MERCHANT_ID`</li>
                </ul>
              </div>

              {/* SMS Gateway */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-5 h-5 text-purple-400" />
                  <h4 className="font-bold text-gray-200 text-sm">۳. سامانه پیام کوتاه (SMS)</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                  در نسخه دمو پیامک‌ها فقط در دیتابیس ذخیره می‌شوند (شبیه‌سازی). برای ارسال واقعی کد OTP و رسید تراکنش‌ها باید پنل پیامکی تهیه کنید.
                </p>
                <ul className="text-[10px] text-gray-300 space-y-1 list-disc list-inside">
                  <li>پیشنهاد: کاوه‌نگار (Kavenegar) یا فراز اس‌ام‌اس (FarazSMS)</li>
                  <li>تهیه توکن: `KAVENEGAR_API_KEY` و خط اختصاصی</li>
                </ul>
              </div>

              {/* Real-time Pricing APIs */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-gray-200 text-sm">۴. وب‌سرویس قیمت زنده (TGJU)</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                  سیستم هم‌اکنون به یک وب‌سرویس رایگان (BRS API) متصل است. برای دریافت لحظه‌ای و ۱۰۰٪ پایدار قیمت طلا و سکه داخلی، نیاز به اشتراک رسمی دارید.
                </p>
                <ul className="text-[10px] text-gray-300 space-y-1 list-disc list-inside">
                  <li>پیشنهاد: سرویس API شبکه اطلاع رسانی طلا و ارز (TGJU) یا شبکه نوبیتکس برای کریپتو</li>
                  <li>توکن قیمت: `TGJU_API_KEY`</li>
                </ul>
              </div>
              
              {/* AI & eKYC */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-colors md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-red-400" />
                  <h4 className="font-bold text-gray-200 text-sm">۵. هوش مصنوعی و احراز هویت</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                  جهت استفاده از مشاور هوش مصنوعی، تنظیم کلید <code>GEMINI_API_KEY</code> الزامی است. همچنین برای بخش احراز هویت (eKYC)، در یک سیستم عمومی نیاز به آپلود و پردازش مدارک هویتی (کارت ملی، سلفی) می‌باشد که نیازمند اتصال به سرویس‌های استعلام ثبت احوال یا سیستم‌های پردازش تصویر ابری است.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
