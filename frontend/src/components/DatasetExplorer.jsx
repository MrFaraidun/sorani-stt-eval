import React, { useState } from 'react';
import { Database, Play, Volume2, Globe, Tag, Clock, Sparkles, Pause } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function DatasetExplorer({ t }) {
  const [activeTab, setActiveTab] = useState('test');
  const [playingClip, setPlayingClip] = useState(null);

  const testClips = [
    { clip: 'clip_01', dialect: 'Sulaymaniyah', speed: 'normal', noise: 'Clean', duration: '9.78s', text: 'هەروەها بەشداربووە لە هەڵکەندنی قاڵبی دراو بۆ چەندان وڵات نمونەی کارەکانی وەکو وێنەی سەرۆک وەزیران لەناو دراوی 5 دۆلاری و 100 دۆلاریی کەنەدیدا' },
    { clip: 'clip_02', dialect: 'Hawler', speed: 'fast', noise: 'Noise', duration: '12.30s', text: 'دار بە دەستی ناوەراست ساچین تەندولکار و راهول دراڤید زۆر باش یاریان کرد و هاوبەشێتیەکی ڕراکردنی سەدییان کرد' },
    { clip: 'clip_03', dialect: 'Kirkuk', speed: 'slow', noise: 'Clean', duration: '16.92s', text: 'سوندەربەن به سایتی که له پووری جیهانی یونسکۆ ڕاگه یەندراوە ئەو بەشەی دارستانی ناو خاکی هیندستانە کە پێی دەوترێت پارکی نەتەوەیی سەندەربانس' },
    { clip: 'clip_04', dialect: 'Garmian', speed: 'normal', noise: 'Noise', duration: '12.00s', text: 'ئاسانترین سەرچاوەی ڕووەکی پرۆتینەکانی گەڵا و پاقلەمەنیکانن بەڵام ئەمانە بۆ شیردەرەکانی وەک ئێمە هەرسکردنیان قورسە مەگەر بکوڵێنرێن' },
    { clip: 'clip_05', dialect: 'Sulaymaniyah', speed: 'fast', noise: 'Clean', duration: '13.26s', text: 'دەتوانیت بۆدا بۆدا تاکسی ماتۆرسکیل بەکاربێنیت بۆ گەڕان بە ناو گۆما نرخی ئاسایی ناوخۆیی بریتیە لە ~500 فرانکی کۆنگۆلی بۆ گەشتێکی کورت' },
    { clip: 'clip_06', dialect: 'Hawler', speed: 'slow', noise: 'Noise', duration: '9.06s', text: 'ژمارەی لێ بڕینەکانی دانەناوە وتی ئەو ژمارانە لەسەر بنەمای زانیاریە ئابوریەکانی چین دادەنرێن' },
    { clip: 'clip_07', dialect: 'Kirkuk', speed: 'normal', noise: 'Clean', duration: '16.74s', text: 'چەندان کاری هەویری ئەڵمانی بادام و بندق و چەرەساتی تری بەری درەختیان تێدایە کێکە بەناوبانگەکان زۆرجار تامێکی نایاب دەبەخشن لەگەڵ کوپێک قاوەی تاڵدا' },
    { clip: 'clip_08', dialect: 'Garmian', speed: 'fast', noise: 'Noise', duration: '8.22s', text: 'پێش هاتنی سوپا هایتی لەوەتەی ساڵی 1800ەوە تووشی کێشەی پەیوەست بە نەخۆشیەکە نەبووبوو' },
    { clip: 'clip_09', dialect: 'Sulaymaniyah', speed: 'slow', noise: 'Clean', duration: '14.16s', text: 'ئەوروپا کێشوەرێکە کە لەچاوخۆیدا بچوکە بەڵام چەندان وڵاتی سەربەخۆی تێدایە لە هەلومەرجی ئاساییدا گەشتکردن بە چەند وڵاتێکدا واتە هێندەی ئەو گەشتانە داواکردنی ڤیزا و خاڵی پشکنینی پاسپۆرت' },
    { clip: 'clip_10', dialect: 'Hawler', speed: 'normal', noise: 'Noise', duration: '8.82s', text: 'بە شێوەیەکی گشتی تۆ گشت کاتێک گوێت لە دەنگی گەشتیار و فرۆشیارەکان دەبێت چیرۆکی دەنگ و ڕووناکی وەک کتێبی چیرۆک وایە' },
    { clip: 'clip_11', dialect: 'Kirkuk', speed: 'fast', noise: 'Clean', duration: '19.08s', text: 'جیمناستیکی ویلایەتە یەکگرتووەکانی ئەمریکا پشتیوانی لە نووسراوی لێژنەی ئۆلیمپی ویلایەتە یەکگرتووەکانی ئەمریکا دەکات و پەسەندی تەواوی پێویستی خێزانی ئۆلیمپی دەکات بۆ برەودان بە ژینگەیەکی سەلامەت بۆ گشت وەرزشوانمان' },
    { clip: 'clip_12', dialect: 'Garmian', speed: 'slow', noise: 'Noise', duration: '10.98s', text: 'زۆربەی دورگە بچوکترەکان نەتەوەی سەربەخۆن یان هاوپەیمانن لەگەڵ فەرەنسادا وە بە هاوینەهەواری کەناراویی خۆشگوزەرانی ناسراون' },
  ];

  const trainingSummary = [
    { name: 'AsoSoft Sorani Speech Corpus', provider: 'AsoSoft Kurdish NLP Lab', count: '300 Audio Clips', status: 'Extracted Locally' },
    { name: 'Google FLEURS Sorani (ckb_iq)', provider: 'Google AI Research', count: '300 Audio Clips', status: 'Extracted Locally' },
    { name: 'Mozilla Common Voice Sorani (ckb)', provider: 'Mozilla Foundation', count: '100+ Hours Speech', status: 'Remote Dataset' },
  ];

  const playClipAudio = (item) => {
    if (playingClip === item.clip) {
      audioEngine.stop();
      setPlayingClip(null);
    } else {
      setPlayingClip(item.clip);
      audioEngine.playSpeech(item.text, item.clip, () => {
        setPlayingClip(null);
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black text-white">{t.datasets.title}</h2>
        <p className="text-slate-300 max-w-xl mx-auto text-base">{t.datasets.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setActiveTab('test')}
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'test'
              ? 'btn-green-glow text-slate-950 shadow-lg'
              : 'bg-slate-950/70 text-slate-300 border border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          {t.datasets.testSetTab}
        </button>
        <button
          onClick={() => setActiveTab('train')}
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'train'
              ? 'btn-green-glow text-slate-950 shadow-lg'
              : 'bg-slate-950/70 text-slate-300 border border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          {t.datasets.trainSetTab}
        </button>
      </div>

      {activeTab === 'test' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testClips.map((item) => (
            <div key={item.clip} className="p-6 rounded-3xl glass-green-card space-y-3 border border-emerald-500/30">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-400 text-sm">{item.clip}</span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                    {item.dialect}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 text-xs font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.duration}
                  </span>
                  <button
                    onClick={() => playClipAudio(item)}
                    className="p-2 rounded-full bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition cursor-pointer flex items-center gap-1 text-xs font-mono font-bold shadow-lg shadow-emerald-500/20"
                  >
                    {playingClip === item.clip ? (
                      <Pause className="w-4 h-4 text-slate-950 animate-pulse" />
                    ) : (
                      <Play className="w-4 h-4 text-slate-950" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-white dir-rtl text-right text-lg font-bold leading-relaxed">
                {item.text}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainingSummary.map((corpus, i) => (
            <div key={i} className="p-7 rounded-3xl glass-green-card space-y-4 border border-emerald-500/30">
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 w-fit">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-100">{corpus.name}</h4>
                <p className="text-xs text-slate-400 mt-1 font-medium">{corpus.provider}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-emerald-400 font-mono font-bold">{corpus.count}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  {corpus.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
