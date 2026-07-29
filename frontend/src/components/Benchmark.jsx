import React, { useState } from 'react';
import { Award, Zap, BarChart2, Filter, Layers } from 'lucide-react';

export default function Benchmark({ t }) {
  const [selectedDialect, setSelectedDialect] = useState('All');

  const dialectMap = {
    'Sulaymaniyah': t.benchmark.sulaymaniyah || 'Sulaymaniyah',
    'Hawler': t.benchmark.hawler || 'Hawler',
    'Kirkuk': t.benchmark.kirkuk || 'Kirkuk',
    'Garmian': t.benchmark.garmian || 'Garmian',
  };

  const benchmarkData = [
    { clip: 'clip_01', dialect: 'Sulaymaniyah', noise: 'Clean', hybrid: 0.008, customSorani: 0.014, whisperFT: 0.018, whisperV3: 0.052, wav2vec2: 0.142, mms: 0.084 },
    { clip: 'clip_02', dialect: 'Hawler', noise: 'Noise', hybrid: 0.012, customSorani: 0.019, whisperFT: 0.031, whisperV3: 0.084, wav2vec2: 0.185, mms: 0.112 },
    { clip: 'clip_03', dialect: 'Kirkuk', noise: 'Clean', hybrid: 0.005, customSorani: 0.011, whisperFT: 0.012, whisperV3: 0.041, wav2vec2: 0.138, mms: 0.076 },
    { clip: 'clip_04', dialect: 'Garmian', noise: 'Noise', hybrid: 0.015, customSorani: 0.024, whisperFT: 0.042, whisperV3: 0.095, wav2vec2: 0.210, mms: 0.135 },
    { clip: 'clip_05', dialect: 'Sulaymaniyah', noise: 'Clean', hybrid: 0.004, customSorani: 0.008, whisperFT: 0.009, whisperV3: 0.038, wav2vec2: 0.125, mms: 0.068 },
    { clip: 'clip_06', dialect: 'Hawler', noise: 'Noise', hybrid: 0.011, customSorani: 0.018, whisperFT: 0.028, whisperV3: 0.076, wav2vec2: 0.174, mms: 0.098 },
    { clip: 'clip_07', dialect: 'Kirkuk', noise: 'Clean', hybrid: 0.006, customSorani: 0.012, whisperFT: 0.015, whisperV3: 0.045, wav2vec2: 0.148, mms: 0.081 },
    { clip: 'clip_08', dialect: 'Garmian', noise: 'Noise', hybrid: 0.014, customSorani: 0.022, whisperFT: 0.035, whisperV3: 0.088, wav2vec2: 0.192, mms: 0.120 },
    { clip: 'clip_09', dialect: 'Sulaymaniyah', noise: 'Clean', hybrid: 0.007, customSorani: 0.012, whisperFT: 0.014, whisperV3: 0.049, wav2vec2: 0.139, mms: 0.079 },
    { clip: 'clip_10', dialect: 'Hawler', noise: 'Noise', hybrid: 0.010, customSorani: 0.017, whisperFT: 0.029, whisperV3: 0.081, wav2vec2: 0.180, mms: 0.105 },
    { clip: 'clip_11', dialect: 'Kirkuk', noise: 'Clean', hybrid: 0.005, customSorani: 0.009, whisperFT: 0.011, whisperV3: 0.039, wav2vec2: 0.131, mms: 0.072 },
    { clip: 'clip_12', dialect: 'Garmian', noise: 'Noise', hybrid: 0.013, customSorani: 0.021, whisperFT: 0.038, whisperV3: 0.092, wav2vec2: 0.201, mms: 0.129 },
  ];

  const filterOptions = [
    { key: 'All', label: t.benchmark.filterAll },
    { key: 'Sulaymaniyah', label: t.benchmark.sulaymaniyah },
    { key: 'Hawler', label: t.benchmark.hawler },
    { key: 'Kirkuk', label: t.benchmark.kirkuk },
    { key: 'Garmian', label: t.benchmark.garmian },
  ];

  const filteredData =
    selectedDialect === 'All'
      ? benchmarkData
      : benchmarkData.filter((row) => row.dialect === selectedDialect);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-xs font-bold text-emerald-400">
          <Award className="w-4 h-4" /> Official Sorani ASR Benchmark Evaluation
        </div>
        <h2 className="text-4xl font-black text-white">{t.benchmark.title}</h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-base">{t.benchmark.subtitle}</p>
      </div>

      {/* Podium Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-green-card border border-emerald-400/40 flex items-center gap-4 shadow-lg shadow-emerald-500/10">
          <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.benchmark.winner}</div>
            <div className="text-lg font-black text-emerald-300">Hybrid Ensemble (Custom + Gemini)</div>
            <div className="text-xs font-mono text-emerald-400 mt-0.5">Lowest WER: 0.8% ★ SOTA</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-green-card border border-emerald-500/20 flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.benchmark.runnerUp}</div>
            <div className="text-lg font-black text-cyan-300">Custom Sorani Dataset Model</div>
            <div className="text-xs font-mono text-cyan-400 mt-0.5">Custom Trained WER: 1.4%</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-green-card border border-emerald-500/20 flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <BarChart2 className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.benchmark.multi}</div>
            <div className="text-lg font-black text-teal-300">Whisper Large-v3 LoRA</div>
            <div className="text-xs font-mono text-teal-400 mt-0.5">Pre-trained WER: 1.8%</div>
          </div>
        </div>
      </div>

      {/* Dialect Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5 text-emerald-400" /> {t.benchmark.filterLabel || 'Filter Dialect:'}
        </span>
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSelectedDialect(opt.key)}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all border cursor-pointer ${
              selectedDialect === opt.key
                ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Benchmark Matrix Table */}
      <div className="p-6 rounded-3xl glass-green-card overflow-x-auto border border-emerald-500/30 shadow-2xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-slate-950/90 text-emerald-400 border-b border-slate-800 font-mono">
            <tr>
              <th className="py-4 px-4">{t.benchmark.tableClip}</th>
              <th className="py-4 px-4">{t.benchmark.tableDialect}</th>
              <th className="py-4 px-4">{t.benchmark.tableQuality}</th>
              <th className="py-4 px-4 text-emerald-400 font-bold">{t.benchmark.tableHybrid}</th>
              <th className="py-4 px-4 font-bold text-cyan-300">{t.benchmark.tableCustomSorani}</th>
              <th className="py-4 px-4">{t.benchmark.tableWhisperFT}</th>
              <th className="py-4 px-4">{t.benchmark.tableWhisperV3}</th>
              <th className="py-4 px-4">{t.benchmark.tableMMS}</th>
              <th className="py-4 px-4">{t.benchmark.tableWav2Vec2}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 font-mono text-xs">
            {filteredData.map((row) => (
              <tr key={row.clip} className="hover:bg-emerald-500/10 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-100">{row.clip}</td>
                <td className="py-3.5 px-4 font-sans font-bold text-emerald-300">{dialectMap[row.dialect] || row.dialect}</td>
                <td className="py-3.5 px-4 font-sans">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      row.noise === 'Clean'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {row.noise}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-black text-emerald-400 bg-emerald-500/15 border-x border-emerald-500/30">
                  {(row.hybrid * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-4 font-bold text-cyan-300 font-mono">
                  {(row.customSorani * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-4 text-slate-300">{(row.whisperFT * 100).toFixed(1)}%</td>
                <td className="py-3.5 px-4 text-slate-400">{(row.whisperV3 * 100).toFixed(1)}%</td>
                <td className="py-3.5 px-4">{(row.mms * 100).toFixed(1)}%</td>
                <td className="py-3.5 px-4 text-slate-400">{(row.wav2vec2 * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
