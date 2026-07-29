import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, TrendingUp, Globe, Sparkles, Mic, Zap, Key, X } from 'lucide-react';
import { translations } from './i18n';
import Studio from './components/Studio';
import Benchmark from './components/Benchmark';
import NormalizerTool from './components/NormalizerTool';
import DatasetExplorer from './components/DatasetExplorer';
import CentralOrb from './components/CentralOrb';
import AgentWidget from './components/AgentWidget';

export default function App() {
  const [lang, setLang] = useState('ckb'); // Default Sorani Kurdish
  const [activeModule, setActiveModule] = useState('studio');

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [nvKeyInput, setNvKeyInput] = useState('');
  const [gemKeyInput, setGemKeyInput] = useState('');
  const [keySaveStatus, setKeySaveStatus] = useState('');

  const t = translations[lang] || translations.ckb;

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  const handleSaveKeys = async () => {
    if (!nvKeyInput.trim() && !gemKeyInput.trim()) return;
    setKeySaveStatus(t.apiKeys.saving);
    try {
      const res = await fetch('http://localhost:8000/api/v1/agent/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nvidia_api_key: nvKeyInput.trim() || undefined,
          gemini_api_key: gemKeyInput.trim() || undefined,
        }),
      });
      if (res.ok) {
        setKeySaveStatus(t.apiKeys.saved);
        setTimeout(() => {
          setShowKeyModal(false);
          setKeySaveStatus('');
        }, 1200);
      } else {
        setKeySaveStatus(t.apiKeys.error);
      }
    } catch (err) {
      setKeySaveStatus(t.apiKeys.netError);
    }
  };

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
      <header className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 h-24 flex items-center justify-between gap-4">
        {/* Brand Logo: ASO Sorani AI */}
        <div className="flex items-center gap-3 cursor-pointer group shrink-0" onClick={() => setActiveModule('studio')}>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-emerald-400">ASO</span> Sorani <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">AI</span>
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm xl:text-base font-bold text-slate-300">
          <button
            onClick={() => setActiveModule('studio')}
            className={`hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap ${activeModule === 'studio' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1' : ''}`}
          >
            {t.nav.services}
          </button>
          <button
            onClick={() => setActiveModule('benchmark')}
            className={`hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap ${activeModule === 'benchmark' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1' : ''}`}
          >
            {t.nav.models}
          </button>
          <button
            onClick={() => setActiveModule('normalizer')}
            className={`hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap ${activeModule === 'normalizer' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1' : ''}`}
          >
            {t.nav.process}
          </button>
          <button
            onClick={() => setActiveModule('datasets')}
            className={`hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap ${activeModule === 'datasets' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1' : ''}`}
          >
            {t.nav.whyUs}
          </button>
        </nav>

        {/* Right Controls: API Keys Button + Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* API Keys Configuration Button */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer hover:scale-105 whitespace-nowrap"
          >
            <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-pulse" />
            <span>{t.apiKeys.btnLabel}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 sm:p-1.5 rounded-full border border-slate-800 shadow-inner">
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 mx-1 shrink-0" />
            {[
              { code: 'ckb', label: 'کوردی' },
              { code: 'ar', label: 'العربية' },
              { code: 'en', label: 'EN' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2.5 py-1 text-[11px] sm:text-xs font-black rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  lang === l.code ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Global API Key Modal Dialog */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-950 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t.apiKeys.title}</h3>
                <p className="text-xs text-slate-400">{t.apiKeys.subtitle}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-1.5">{t.apiKeys.nvidiaLabel}</label>
                <input
                  type="password"
                  placeholder="nvapi-..."
                  value={nvKeyInput}
                  onChange={(e) => setNvKeyInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-emerald-500/30 text-xs text-emerald-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-300 block mb-1.5">{t.apiKeys.geminiLabel}</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={gemKeyInput}
                  onChange={(e) => setGemKeyInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-emerald-500/30 text-xs text-emerald-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>

            {keySaveStatus && (
              <p className="text-xs font-mono text-center text-emerald-400 animate-pulse">{keySaveStatus}</p>
            )}

            <button
              onClick={handleSaveKeys}
              className="w-full py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
            >
              {t.apiKeys.saveBtn}
            </button>
          </div>
        </div>
      )}

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

      {/* Floating Kurdish Voice Agent Widget */}
      <AgentWidget />
    </div>
  );
}
