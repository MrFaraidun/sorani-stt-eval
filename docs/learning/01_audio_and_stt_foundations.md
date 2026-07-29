# Learning Module 01: Theoretical Foundations — Audio Processing & STT Signal Fundamentals

> **Sub-Plan Reference:** Sub-Plan 01 — Environment, Tooling & Audio Theory Foundations  
> **Target Mastery:** Continuous Audio Signals, Nyquist-Shannon Sampling Theorem, PCM Digitization, STFT Math, Mel Spectrograms, and Front-end Representations.

---

## 1. Physical Sound vs. Digital Audio

### 1.1 Sound as a Continuous Wave
Sound is a longitudinal mechanical pressure wave propagating through a fluid or elastic medium (such as air). In air, vibrating sources (e.g. human vocal cords) create alternating regions of compression (high pressure) and rarefaction (low pressure).

Computers cannot store continuous physical functions $p(t)$. They must sample the continuous acoustic signal into a discrete sequence of digital numbers.

```
Continuous Pressure Wave p(t)          Digital Audio Samples x[n]
         ▲                                   ▲
      +1 ┼   .---.                        +1 ┼   o   o
         │  /     \                          │  / \ / \
       0 ┼─/───────\───► t                 0 ┼─o───o───o──► n
         │/         \                        │/         \
      -1 ┼           `---                 -1 ┼           o
```

---

## 2. The Sampling Theorem & Digitization Parameters

### 2.1 The Nyquist-Shannon Sampling Theorem
For a continuous signal $x(t)$ with maximum frequency component $f_{\max}$ to be completely recovered from its samples without aliasing, the sampling rate $f_s$ must satisfy:

$$f_s \ge 2 f_{\max}$$

* **Nyquist Frequency:** $f_{\text{Nyquist}} = \frac{f_s}{2}$ represents the absolute maximum frequency that can be accurately represented at sampling rate $f_s$. Any frequency above $f_{\text{Nyquist}}$ folds back (aliases) into lower frequencies as unrecoverable distortion.

### 2.2 Standard Sampling Rates in Audio & ASR

| Sampling Rate ($f_s$) | Nyquist Frequency ($f_{\text{Nyquist}}$) | Primary Domain | Applicability to ASR |
|---|---|---|---|
| **8,000 Hz (8 kHz)** | 4,000 Hz | Legacy Telephony (G.711) | High distortion; loses high fricatives (/s/, /z/, /ʃ/) |
| **16,000 Hz (16 kHz)** | 8,000 Hz | **Industrial ASR Standard** | **Optimal**: Speech energy concentrates below 8 kHz |
| **22,050 Hz** | 11,025 Hz | Web Audio / Low-band Music | Non-standard for ASR |
| **44,100 Hz (44.1 kHz)** | 22,050 Hz | CD Quality Music | Redundant compute; requires resampling to 16 kHz |
| **48,000 Hz (48 kHz)** | 24,000 Hz | Professional Video / Broadcast | Redundant compute; requires resampling to 16 kHz |

> **Crucial Rule for ASR:** Models like **OpenAI Whisper** and **wav2vec 2.0** expect **16 kHz mono WAV audio**. Feeding 44.1 kHz or stereo audio directly causes severe silent failure or degraded WER.

---

## 3. Pulse-Code Modulation (PCM) & Bit Depth

### 3.1 Quantization & Bit Depth
Sampling discretizes **time**; quantization discretizes **amplitude**. Bit depth ($b$) defines the number of discrete amplitude levels available to represent each sample:

$$N_{\text{levels}} = 2^b$$

* **16-bit PCM:** $2^{16} = 65,536$ discrete amplitude integer levels ($[-32,768 \dots 32,767]$). Dynamic range $\approx 96\text{ dB}$.
* **32-bit Float:** Samples normalized to $[-1.0, 1.0]$. Used internally by PyTorch, `torchaudio`, and `librosa`.

---

## 4. Time Domain to Frequency Domain: The Fourier Family

### 4.1 Fast Fourier Transform (FFT)
The Fourier Transform decomposes a continuous signal into a sum of complex exponential sinusoids:

$$X(f) = \int_{-\infty}^{\infty} x(t) e^{-j 2 \pi f t} \, dt$$

* **Limitation of Global FFT:** FFT tells us *which* frequencies are present in an entire audio clip, but loses *when* those frequencies occurred. Speech is non-stationary; its frequency spectrum changes every few milliseconds as phonemes transition.

### 4.2 Short-Time Fourier Transform (STFT)
To track temporal changes, STFT computes localized FFTs over short, overlapping sliding windows $w[n]$:

$$\text{STFT}\{x[n]\}(m, \omega) = \sum_{n=-\infty}^{\infty} x[n] w[n - mR] e^{-j \omega n}$$

where:
* $w[n]$ is a window function (e.g. **Hann window**) that smooths frame boundaries to prevent spectral leakage.
* $m$ is the frame index.
* $R$ is the **hop length** (stride between consecutive windows, typically $10\text{ ms} = 160\text{ samples}$ at $16\text{ kHz}$).
* $N_{\text{fft}}$ is the window length (typically $25\text{ ms} = 400\text{ samples}$ at $16\text{ kHz}$).

```
Raw Waveform ──► Sliding Window (400 samples / 25ms) ──► FFT ──► Magnitude Spectrogram |X(m, f)|
```

---

## 5. Perceptual Frequency Scaling: Mel Spectrogram

### 5.1 The Mel Scale
Human hearing does not perceive pitch linearly. We are far more sensitive to small changes in pitch at low frequencies (below 1 kHz) than at high frequencies. The **Mel scale** maps physical frequency $f$ (in Hz) to perceptual pitch $m$ (in mels):

$$m = 2595 \log_{10} \left(1 + \frac{f}{700}\right)$$

```
Physical Frequency (Hz) ──► Triangular Filterbank Bins ──► Log Compression ──► Log-Mel Spectrogram
```

### 5.2 Log-Mel Filterbank vs Raw Waveform Architectures

| Representation | Processing Pipeline | Models Using It | Advantages | Disadvantages |
|---|---|---|---|---|
| **Log-Mel Spectrogram** | STFT $\rightarrow$ Mel Filterbank $\rightarrow$ $\log(\cdot)$ | OpenAI Whisper, Conformer | Compact 2D representation; aligns with psychoacoustics | Ignores phase information |
| **Raw Waveform** | 1D Strided Convolutions (SincNet / Conv1D) | wav2vec 2.0, Meta MMS | Learns custom filterbanks from uncompressed raw PCM | Requires massive self-supervised audio data |

---

## 6. Interview Questions & Key Answers

1. **Q: Why is 16 kHz the universal standard for Automatic Speech Recognition?**  
   *A:* Human speech energy is concentrated below 8 kHz (formants $F_1, F_2, F_3$ occur between 300 Hz and 4,000 Hz). By the Nyquist Theorem ($f_s = 2 f_{\max}$), 16 kHz captures all essential phonemic information while minimizing memory and compute footprint.

2. **Q: What is spectral leakage and how is it mitigated in STFT?**  
   *A:* Truncating an infinite signal into finite rectangular frames introduces sharp boundary discontinuities, manifesting as artificial high-frequency energy (spectral leakage). It is mitigated by multiplying each frame by a smooth tapering window (e.g. Hann or Hamming window).

3. **Q: Why take the logarithm of the Mel spectrogram amplitudes?**  
   *A:* Human loudness perception follows a logarithmic scale (Weber-Fechner Law). Taking the log compresses the high dynamic range of acoustic power and stabilizes variance during neural network optimization.
