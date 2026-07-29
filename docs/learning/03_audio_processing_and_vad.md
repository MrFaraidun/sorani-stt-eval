# Learning Module 03: Audio Preprocessing & Voice Activity Detection (VAD)

> **Sub-Plan Reference:** Sub-Plan 03 — End-to-End Audio Preprocessing & VAD Service  
> **Target Mastery:** Audio Resampling, Stereo Downmixing, Peak Normalization, Voice Activity Detection (Silero VAD), and Preventing Hallucinations.

---

## 1. The Audio Preprocessing Pipeline

To prepare raw, unconstrained real-world audio (e.g. YouTube videos, phone calls, podcasts) for Automatic Speech Recognition models, audio signals must undergo a standardized preprocessing pipeline.

```
Raw Media (MP4/MP3/WAV)
       │
       ▼ (Downmix Channels)
  Mono Audio [1, N]
       │
       ▼ (Resample to 16 kHz)
16 kHz Resampled Signal
       │
       ▼ (Peak Normalization to -1 dBFS)
Normalized Float32 Waveform
       │
       ▼ (Silero VAD Segmentation)
Speech Intervals (start_ms, end_ms) ──► ASR Model Batch
```

### 1.1 Channel Downmixing (Stereo $\rightarrow$ Mono)
Acoustic speech models are trained on single-channel (mono) audio. Multi-channel audio (stereo) contains two distinct channels $x_L[n]$ and $x_R[n]$. Averaging channels ensures equal representation:

$$x_{\text{mono}}[n] = \frac{x_L[n] + x_R[n]}{2}$$

> **Beginner Mistake:** Discarding channel 1 and keeping only channel 0 (`waveform[0, :]`). If a podcast microphone is panned entirely to the right channel, taking channel 0 results in complete silence.

---

## 2. Voice Activity Detection (VAD) & Silero VAD

### 2.1 Why VAD is Essential for ASR
Autoregressive seq2seq models (such as **OpenAI Whisper**) and CTC models suffer from specific failure modes when given long silent intervals, background music, or non-speech noise:

1. **Hallucinations:** Whisper's decoder emits repeated phantom phrases or hallucinated subtitles during extended silence.
2. **Compute Waste:** Processing silent audio through deep Transformer encoders wastes GPU floating-point operations (FLOPs).
3. **Segmentation Alignment:** Splitting long 30-minute files into 5–15 second speech chunks dramatically improves throughput and transcription accuracy.

### 2.2 Silero VAD Architecture
**Silero VAD** is a lightweight Deep Neural Network trained on over 6,000 languages. Unlike legacy energy-thresholding or Gaussian Mixture Model (GMM) detectors (e.g. WebRTC VAD), Silero VAD operates on raw 16 kHz audio chunks and produces per-frame speech probabilities $p(\text{speech} \mid x_t) \in [0.0, 1.0]$.

---

## 3. Key Engineering Questions & Trade-offs

1. **Q: Why normalize peak amplitude to $-1\text{ dBFS}$ rather than $0\text{ dBFS}$?**  
   *A:* Peak normalizing to $-1\text{ dBFS}$ ($\approx 0.891$ magnitude) leaves a $1\text{ dB}$ safety headroom to prevent inter-sample clipping when applying resampling filters or FFT windowing.

2. **Q: Should aggressive noise reduction always be applied before ASR?**  
   *A:* **No.** Aggressive noise reduction (e.g. heavy spectral subtraction) artifacts distort subtle phonetic cues (such as unvoiced fricatives and stop bursts), often *increasing* WER. Only light, adaptive noise gating should be used.
