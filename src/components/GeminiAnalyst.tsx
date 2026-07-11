import React, { useState } from 'react';
import { Sparkles, Send, Loader2, BookOpen, AlertTriangle, HelpCircle } from 'lucide-react';
import { CoinType, COIN_DETAILS } from '../types';

interface GeminiAnalystProps {
  currentPrices: Record<CoinType, number>;
}

// Simple custom markdown renderer to format Gemini's rich Persian response beautifully
function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    
    // Header 3 (###)
    if (trimmed.startsWith('###')) {
      return (
        <h4 key={idx} className="text-base font-bold text-amber-400 mt-4 mb-2 border-b border-amber-500/10 pb-1">
          {trimmed.replace(/^###\s*/, '')}
        </h4>
      );
    }
    
    // Header 2 (##)
    if (trimmed.startsWith('##')) {
      return (
        <h3 key={idx} className="text-lg font-bold text-amber-500 mt-5 mb-3 border-b border-amber-500/20 pb-1">
          {trimmed.replace(/^##\s*/, '')}
        </h3>
      );
    }

    // Bullet points (-)
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const cleanContent = trimmed.replace(/^[-*]\s*/, '');
      return (
        <li key={idx} className="mr-4 list-disc text-xs text-gray-300 leading-relaxed my-1">
          {formatBoldText(cleanContent)}
        </li>
      );
    }

    // Blockquotes (>)
    if (trimmed.startsWith('>')) {
      return (
        <blockquote key={idx} className="border-r-4 border-amber-500 bg-slate-900/80 px-4 py-2 my-2 text-xs italic text-gray-400 rounded-l">
          {formatBoldText(trimmed.replace(/^>\s*/, ''))}
        </blockquote>
      );
    }

    // Standard paragraph
    if (trimmed.length > 0) {
      return (
        <p key={idx} className="text-xs text-gray-200 leading-relaxed mb-3">
          {formatBoldText(trimmed)}
        </p>
      );
    }

    return <div key={idx} className="h-2" />;
  });
}

// Formatter to handle bold inline markers **text**
function formatBoldText(text: string): React.ReactNode {
  const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="text-amber-300 font-bold">{part}</strong>;
    }
    return part;
  });
}

export default function GeminiAnalyst({ currentPrices }: GeminiAnalystProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const presets = [
    {
      label: 'تحلیل حباب و توجیه خرید ربع سکه',
      text: 'با توجه به نرخ دلار بازار آزاد و انس طلا، تحلیل حباب قیمت ربع سکه چیست؟ آیا در حال حاضر خرید ربع سکه توجیه اقتصادی دارد یا خیر؟'
    },
    {
      label: 'مقایسه بازدهی سکه امامی و بهار آزادی',
      text: 'مقایسه کامل بین سکه امامی (طرح جدید) و سکه بهار آزادی (طرح قدیم) انجام دهید و بگویید کدام‌یک برای سرمایه‌گذاری بلند مدت امن‌تر است؟'
    },
    {
      label: 'پیش‌بینی روند کوتاه مدت بازار سکه',
      text: 'با توجه به قیمت‌های کنونی بازار سکه، سناریوهای صعودی و نزولی قیمت‌ها را برای یک هفته آینده ترسیم کنید.'
    }
  ];

  const handleAsk = async (promptText: string) => {
    if (!promptText.trim()) return;
    setIsLoading(true);
    setResponse('');
    
    try {
      const res = await fetch('/api/gemini/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data.text || 'خطایی در دریافت پاسخ رخ داد.');
      } else {
        setResponse(`خطا در ارتباط با سرور: ${data.error || 'ناشناخته'}`);
      }
    } catch (err: any) {
      setResponse(`خطا در برقراری ارتباط با سرور: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel gold-glow-hover rounded-2xl p-6 shadow-xl flex flex-col h-full" id="gemini-analyst-panel">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-amber-500 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            تحلیل‌گر هوشمند بازار سکه (Gemini AI)
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            مشاوره تخصصی طلا، مقایسه حباب سکه‌ها و استراتژی خرید و فروش به کمک هوش مصنوعی گوگل
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/15 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          مشاور طلایی فعال
        </div>
      </div>

      {/* Warning Alert */}
      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
        <p className="leading-relaxed">
          <strong>سلب مسئولیت:</strong> تحلیل‌های ارائه شده توسط هوش مصنوعی، صرفاً جنبه آموزشی و اطلاع‌رسانی دارند. بازارهای مالی طلا و سکه دارای ریسک بالایی هستند؛ قبل از هر معامله حتماً تحلیل شخصی خود را ملاک قرار دهید.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow">
        
        {/* Left Column: Preset Queries and Input */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              پرسش‌های پرکاربرد سرمایه‌گذاران:
            </h3>
            <div className="flex flex-col gap-2.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(preset.text);
                    handleAsk(preset.text);
                  }}
                  disabled={isLoading}
                  className="text-right text-xs bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/30 text-gray-300 p-3.5 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Form */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-400 mb-2">
              پرسش دلخواه خود را در مورد طلا و سکه بنویسید:
            </label>
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="مثلاً: سکه گرمی بخرم یا ربع سکه؟..."
                rows={3}
                className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <button
                id="btn-ask-gemini"
                onClick={() => handleAsk(query)}
                disabled={isLoading || !query.trim()}
                className="absolute left-3 bottom-3 bg-amber-600 hover:bg-amber-700 text-white p-2.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:hover:bg-amber-600 flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 transform rotate-180" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Response Display */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950/60 rounded-xl border border-slate-800 p-5 min-h-[300px] overflow-y-auto max-h-[480px]">
          <h3 className="text-xs font-bold text-amber-500 mb-3 tracking-wider uppercase border-b border-slate-800 pb-2">
            نتیجه تحلیل و گزارش فنی:
          </h3>
          
          <div className="flex-grow flex flex-col justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                <span className="text-xs text-gray-400 animate-pulse">در حال تحلیل پارامترهای بازار و نگارش گزارش...</span>
              </div>
            ) : response ? (
              <div className="text-right whitespace-pre-wrap">
                {parseMarkdown(response)}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-2">
                <Sparkles className="w-10 h-10 text-slate-800" />
                <p className="text-xs">جهت شروع، روی یکی از پرسش‌های کلیدی کلیک کنید یا سوال خود را مطرح کنید تا ربات هوش مصنوعی بازار را تحلیل کند.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
