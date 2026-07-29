# End-to-End Audio Pipeline Documentation

```
Raw Audio File ──► Downmix to Mono ──► Resample to 16 kHz ──► Peak Normalize (-1 dBFS) ──► Silero VAD ──► Model Inference ──► Normalizer ──► WER/CER Evaluator
```

1. **Input File:** Supports WAV, MP3, FLAC, MP4 container audio.
2. **Channel Downmix:** Stereo channels averaged to 1 mono channel.
3. **Resampling:** Resampled to 16,000 Hz using `torchaudio`.
4. **Normalization:** Peak amplitude adjusted to $-1\text{ dBFS}$ ($0.891$).
5. **VAD:** Silero VAD extracts speech chunks, filtering silent non-speech gaps.
6. **ASR Model:** Inferences via lazy-loaded model registry singleton.
7. **Normalizer:** Sorani Kurdish text normalizer standardizes script orthography.
8. **Scoring:** `jiwer` evaluates WER and CER vs. reference.
