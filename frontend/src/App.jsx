import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, TrendingUp, Globe, Sparkles, Mic, Zap } from 'lucide-react';
import { translations } from './i18n';
import Studio from './components/Studio';
import Benchmark from './components/Benchmark';
import NormalizerTool from './components/NormalizerTool';
import DatasetExplorer from './components/DatasetExplorer';
import CentralOrb from './components/CentralOrb';

export default function App() {
  const [lang, setLang] = useState('ckb'); // Default Sorani Kurdish
  const [activeModule, setActiveModule] = useState('studio');

  const t = translations[lang] || translations.ckb;

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  return (
    <div className="min-h-screen bg-[#050806] text-slate-100 font-sans relative overflow-x-hidden selection:bg-emerald-400 selection:text-slate-950">
      {/* Background Fluid SVG Neon Green Ribbon Curve Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 800 -100 Q 1200 200 900 450 T 100 800 T 700 1300 T 300 1800"
          fill="none"
          stroke="#00E676"
          strokeWidth="2.5"
          strokeOpacity="0.35"
          strokeDasharray="8 8"
          className="animate-pulse"
        />
      </svg>

      {/* Navigation Header */}
      <header className="relative z-50 max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Brand Logo: ASO Sorani AI */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveModule('studio')}>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
            <span className="text-emerald-400">ASO</span> Sorani <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">AI</span>
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-base font-bold text-slate-300">
          <button
            onClick={() => setActiveModule('studio')}
            className={`hover:text-emerald-400 transition-colors cursor-pointer ${activeModule === 'studio' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1' : ''}`}
          >
            {t.nav.services}
          </button>
          <button
            onClick={() => setActiveModule('benchmark')}
            className={`hover:text-emerald-400 transition-colors cursor-pointer ${activeModule === 'benchmark' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1' : ''}`}
          >
            {t.nav.models}
          </button>
          <button
            onClick={() => setActiveModule('normalizer')}
            className={`hover:text-emerald-400 transition-colors cursor-pointer ${activeModule === 'normalizer' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1' : ''}`}
          >
            {t.nav.process}
          </button>
          <button
            onClick={() => setActiveModule('datasets')}
            className={`hover:text-emerald-400 transition-colors cursor-pointer ${activeModule === 'datasets' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1' : ''}`}
          >
            {t.nav.whyUs}
          </button>
        </nav>

        {/* Right Language Switcher & CTA Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-full border border-slate-800 shadow-inner">
            <Globe className="w-4 h-4 text-emerald-400 ml-2 mr-1" />
            {[
              { code: 'ckb', label: 'کوردی' },
              { code: 'ar', label: 'العربية' },
              { code: 'en', label: 'EN' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-3 py-1 text-xs font-black rounded-full transition-all cursor-pointer ${
                  lang === l.code ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveModule('studio')}
            className="px-6 py-2.5 rounded-full border border-emerald-400/50 text-emerald-400 hover:bg-emerald-500/20 text-xs font-black transition shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            {t.nav.contact}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text & CTAs */}
        <div className="lg:col-span-7 space-y-8">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            {t.hero.titleStart}
            <span className="green-circle-highlight text-emerald-400">{t.hero.titleHighlight}</span>
            {t.hero.titleEnd}
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-xl leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveModule('studio')}
              className="px-8 py-4 rounded-full btn-green-glow flex items-center gap-3 text-base cursor-pointer"
            >
              <span>{t.hero.getStarted}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveModule('benchmark')}
              className="px-6 py-4 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>{t.benchmark.title}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Standalone 3D Wireframe Microphone Visualizer */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          <CentralOrb t={t} activeTab={activeModule} setActiveTab={setActiveModule} />
        </div>
      </section>

      {/* Partner Logos Row */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-8 text-slate-400 text-xs font-mono font-bold tracking-widest opacity-75">
          <span className="hover:text-emerald-400 transition-colors">ASOSOFT NLP LAB</span>
          <span className="hover:text-emerald-400 transition-colors">GOOGLE FLEURS</span>
          <span className="hover:text-emerald-400 transition-colors">OPENAI WHISPER V3</span>
          <span className="hover:text-emerald-400 transition-colors">META MMS-1B</span>
          <span className="hover:text-emerald-400 transition-colors">NVIDIA NEMO</span>
          <span className="hover:text-emerald-400 transition-colors">HUGGINGFACE</span>
        </div>
      </section>

      {/* "What do we offer?" Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">{t.offer.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => setActiveModule('benchmark')}
            className="cursor-pointer p-8 rounded-3xl glass-green-card glass-green-card-hover space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              {t.offer.card1Title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{t.offer.card1Desc}</p>
          </div>

          <div
            onClick={() => setActiveModule('studio')}
            className="cursor-pointer p-8 rounded-3xl glass-green-card glass-green-card-hover space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              {t.offer.card2Title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{t.offer.card2Desc}</p>
          </div>

          <div
            onClick={() => setActiveModule('normalizer')}
            className="cursor-pointer p-8 rounded-3xl glass-green-card glass-green-card-hover space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              {t.offer.card3Title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{t.offer.card3Desc}</p>
          </div>
        </div>
      </section>

      {/* Main Interactive Studio / Benchmark Module Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {activeModule === 'studio' && <Studio t={t} />}
        {activeModule === 'benchmark' && <Benchmark t={t} />}
        {activeModule === 'normalizer' && <NormalizerTool t={t} />}
        {activeModule === 'datasets' && <DatasetExplorer t={t} />}
      </section>

      {/* Clean Minimalist Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-10 mt-16 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 ASO Sorani AI Speech Recognition Suite.</div>
          <div className="flex gap-4 text-emerald-400/80 font-mono font-bold">
            <span>Sulaymaniyah</span>
            <span>•</span>
            <span>Hawler</span>
            <span>•</span>
            <span>Kirkuk</span>
            <span>•</span>
            <span>Garmian</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
