import React, { useState } from 'react';
import { FileText, Sparkles, CheckCircle, Copy, Check, Wand2, ArrowLeftRight } from 'lucide-react';

export default function NormalizerTool({ t }) {
  const textPresets = [
    {
      id: 'ex1',
      title: 'ي / ك Variational Unification',
      raw: 'ئامادەكردنی فایلی دەنگی لە شارستانی سلێمانی بۆ بەراوردكاریـی مۆدێلەکە...',
    },
    {
      id: 'ex2',
      title: 'Tatweel (ـ) Removal',
      raw: 'سیــستەمی ژیــری دەســتکرد بۆ وەرگێــڕانی دەنگی سۆرانیـی...',
    },
    {
      id: 'ex3',
      title: 'Arabic Diacritics & Harakat Stripping',
      raw: 'پَاشْ مُوسْلِمَانْ بُوونِی بـِڕْیَارِی دَا بـەرْگِی بَاڵَاپۆشـِیشْ لَه بـەر بـکَات.',
    },
    {
      id: 'ex4',
      title: 'Digit & Space Standardization',
      raw: 'ژمارەی 12 فایلی دەنگی لە 4 شێوەزاری سەرەکی ئامادە کراوە 2026.',
    },
    {
      id: 'ex5',
      title: 'Punctuation Clean-up',
      raw: 'باشترین مۆدێلی ASR؛ بۆ زمانی کوردی (سۆرانی)... بە بەراوردکاری ٥ مۆدێل!',
    },
  ];

  const [inputText, setInputText] = useState(textPresets[0].raw);
  const [copied, setCopied] = useState(false);

  // Sorani Normalizer logic
  const normalizeSorani = (str) => {
    if (!str) return '';
    let result = str;
    // Unify Arabic letter variants (ي -> ی, ك -> ک)
    result = result.replace(/ي/g, 'ی').replace(/ك/g, 'ک');
    // Remove Tatweel (ـ)
    result = result.replace(/ـ/g, '');
    // Remove Harakat (diacritics)
    result = result.replace(/[\u064B-\u0652]/g, '');
    // Strip trailing/leading extra whitespace
    result = result.replace(/\s+/g, ' ').trim();
    return result;
  };

  const normalizedOutput = normalizeSorani(inputText);

  const handleCopy = () => {
    navigator.clipboard.writeText(normalizedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black text-white">
          {t.normalizer.title}
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto text-base">{t.normalizer.desc}</p>
      </div>

      {/* Preset Selection Buttons */}
      <div className="p-6 rounded-3xl glass-green-card border border-emerald-500/30 space-y-3">
        <label className="text-sm font-bold text-emerald-400 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-emerald-400" />
          {t.normalizer.presetsTitle}
        </label>
        <div className="flex flex-wrap gap-2">
          {textPresets.map((p) => (
            <button
              key={p.id}
              onClick={() => setInputText(p.raw)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                inputText === p.raw
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-emerald-500/40'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tool Container */}
      <div className="p-8 rounded-3xl glass-green-card space-y-6 border border-emerald-500/30">
        {/* Input Text Box */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-emerald-400 flex items-center justify-between">
            <span>{t.normalizer.inputLabel}</span>
            <span className="text-xs text-slate-400 font-mono">{inputText.length} {t.normalizer.chars || 'chars'}</span>
          </label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-5 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-100 font-bold text-xl dir-rtl text-right focus:border-emerald-400 focus:outline-none transition-colors leading-relaxed shadow-inner"
          />
        </div>

        {/* Output Text Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-teal-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              {t.normalizer.outputLabel}
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-black rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/40 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
          <div className="p-6 rounded-2xl bg-slate-950/95 border border-teal-500/40 text-teal-200 text-2xl font-bold dir-rtl text-right leading-relaxed min-h-[110px] shadow-lg shadow-teal-500/10">
            {normalizedOutput}
          </div>
        </div>

        {/* Normalization Features Checklist */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.normalizer.featuresTitle}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t.normalizer.feat1}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t.normalizer.feat2}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t.normalizer.feat3}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t.normalizer.feat4}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
