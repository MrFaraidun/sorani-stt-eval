# Sorani Kurdish (ckb) Dataset Repository

```
datasets/
├── README.md                          # Dataset Documentation
├── test_set/                          # Benchmark Evaluation Test Set
│   ├── metadata.csv                   # Index with dialect, speed, noise, speaker tags
│   ├── audio/                         # clip_01.wav ... clip_12.wav (16kHz Mono WAV)
│   └── transcripts/                   # clip_01.txt ... clip_12.txt (Sorani Text)
└── training_set/                      # Massive Training Set for Fine-Tuning
    ├── asosoft/                       # AsoSoft Sorani Kurdish Speech Corpus
    │   ├── train_metadata.csv         # Sample index
    │   ├── audio/                     # asosoft_0001.wav ...
    │   └── transcripts/               # asosoft_0001.txt ...
    └── fleurs/                        # Google FLEURS Sorani Kurdish Corpus
        ├── train_metadata.csv         # Sample index
        ├── audio/                     # fleurs_0001.wav ...
        └── transcripts/               # fleurs_0001.txt ...
```
