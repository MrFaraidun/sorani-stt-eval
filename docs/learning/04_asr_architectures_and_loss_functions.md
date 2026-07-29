# Learning Module 04: ASR Model Architectures & Objective Loss Functions

> **Sub-Plan Reference:** Sub-Plan 04 — Multi-Model ASR Engine & Fine-Tuning Framework  
> **Target Mastery:** Encoder-Decoder Transformers, CTC Loss, Conformer (Convolution-Augmented Transformer), Self-Supervised Waveform Learning, and LoRA Fine-tuning.

---

## 1. Paradigm 1: Encoder-Decoder Sequence-to-Sequence (OpenAI Whisper)

### 1.1 Architectural Overview
OpenAI Whisper is an autoregressive Encoder-Decoder Transformer model trained on 680,000 hours of weakly supervised multilingual web audio.

```
Log-Mel Spectrogram (80-dim / 30s)
       │
       ▼ (Conv1D Stride 2)
  Transformer Encoder
  (Audio Context Vectors)
       │
       ▼ Cross-Attention
  Transformer Decoder
  (Autoregressive Token Generator: <|startoftranscript|> <|ckb|> <|transcribe|> ...)
```

* **Encoder:** Consists of 2 convolutional stem layers (reducing time dimension by $4\times$) followed by standard Transformer encoder blocks (Self-Attention + Feed-Forward MLP).
* **Decoder:** Autoregressive Transformer decoder using causal masked self-attention over generated tokens and cross-attention over encoder output representations.
* **Loss Function:** Standard Cross-Entropy Loss over target token sequences:

$$\mathcal{L}_{\text{seq2seq}} = -\sum_{t=1}^T \log P(y_t \mid y_{<t}, \mathbf{X})$$

---

## 2. Paradigm 2: Self-Supervised Learning & CTC Loss (wav2vec 2.0 & Meta MMS)

### 2.1 Connectionist Temporal Classification (CTC) Loss
Unlike seq2seq decoders, CTC allows training an acoustic encoder without needing frame-level alignment between audio inputs and ground-truth characters.

$$\mathbf{X} = (x_1, \dots, x_T) \quad \longrightarrow \quad \mathbf{Y} = (y_1, \dots, y_U) \quad (T \ge U)$$

CTC introduces a special **blank token** ($\epsilon$). The model outputs a frame-level token distribution $P(\pi \mid \mathbf{X})$, and a collapse mapping $\mathcal{B}(\pi)$ collapses repeating adjacent characters and removes blanks (e.g. $\mathcal{B}(\text{c c } \epsilon \text{ a a } \epsilon \text{ t}) = \text{cat}$).

The CTC loss minimizes the negative log-likelihood of all valid alignments:

$$\mathcal{L}_{\text{CTC}} = -\log P(\mathbf{Y} \mid \mathbf{X}) = -\log \sum_{\pi \in \mathcal{B}^{-1}(\mathbf{Y})} \prod_{t=1}^T P(\pi_t \mid \mathbf{X})$$

```
Frame Index t:    1    2    3    4    5    6    7
Model Output:     c    c    ε    a    a    ε    t
Collapse B(π):    c    -    -    a    -    -    t   ==> "cat"
```

---

## 3. Paradigm 3: Conformer (Convolution-Augmented Transformer)

### 3.1 Why Conformer for Speech?
Transformers excel at capturing **global long-range context** via self-attention, but struggle to extract **local shift-invariant features**. Convolutions excel at local feature extraction (formant transitions), but struggle with long-range context.

The **Conformer block** (Gulati et al., Interspeech 2020) combines both in a Macaron-style structure:

```
Input Frame ──► Feed-Forward 1/2 ──► Multi-Head Self-Attention ──► Conv Module ──► Feed-Forward 1/2 ──► LayerNorm
```

---

## 4. Architectural Comparison Table

| Architecture | Model Example | Input Feature | Alignment Paradigm | Streaming Support | Memory & Speed |
|---|---|---|---|---|---|
| **Seq2Seq Transformer** | OpenAI Whisper | Log-Mel Spectrogram | Cross-Attention | No (Batch only) | High VRAM; Autoregressive Bottleneck |
| **wav2vec 2.0 CTC** | wav2vec2-xls-r-300m | Raw Waveform PCM | CTC Blank Collapsing | Yes (Chunked CTC) | Fast non-autoregressive; Low VRAM |
| **Massively Multilingual CTC** | Meta MMS-1B | Raw Waveform PCM | CTC Adapter Heads | Yes (Chunked CTC) | 1,000+ language scaling |
| **Conformer CTC/RNN-T** | NVIDIA NeMo | Filterbank / Log-Mel | CTC / Transducer | Yes (Streaming Ready) | Optimal local+global representations |
