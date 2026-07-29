# Learning Module 02: Linguistics & Text Normalization — Sorani Kurdish (ckb)

> **Sub-Plan Reference:** Sub-Plan 02 — Sorani Kurdish Linguistics Engine & Dataset Architecture  
> **Target Mastery:** Sorani Orthography, Arabic vs Kurdish Script Unification, Special Letters (`ڕ`, `ڵ`, `ێ`, `ۆ`, `ە`), Dialects, and Evaluation Normalization.

---

## 1. Sorani Kurdish Script & Orthography

Sorani Kurdish (Central Kurdish, ISO 639-3: `ckb`) uses an Arabic-based alphabet modified to represent Kurdish phonemes. Unlike Arabic, where vowels are often omitted as short diacritics (*harakat*), Sorani Kurdish is an **alphabet**, meaning almost every vowel is explicitly written as a letter.

### 1.1 The Five Essential Sorani Characters

| Character | Unicode | Name | IPA Equivalent | Distinction from Arabic | Example Word | Meaning |
|---|---|---|---|---|---|---|
| **ڕ** | `U+0692` | Trilled R | `/r/` | Rolled trill vs. Arabic tapped `ر` (`/ɾ/`) | ڕۆژ | Day / Sun |
| **ڵ** | `U+06B5` | Velarized L | `/ɫ/` | Dark/velarized L vs. Arabic plain `ل` (`/l/`) | ڵاPage | Side / Page |
| **ێ** | `U+06CE` | E Vowel | `/e/` or `/eː/` | Mid-front vowel vs. Arabic Yeh (`ي` / `U+064A`) | ێوارە | Evening |
| **ۆ** | `U+06C6` | O Vowel | `/o/` or `/oː/` | Mid-back rounded vowel vs. Arabic Waw (`و` / `U+0648`) | ۆتۆمبێل | Car |
| **ە** | `U+06D5` | Ae Vowel | `/æ/` | Near-open front vowel vs. Arabic Heh (`هـ` / `U+0647`) | ئەمڕۆ | Today |

---

## 2. Text Normalization Pipeline for ASR Evaluation

When evaluating Speech-to-Text models using metrics like **Word Error Rate (WER)** and **Character Error Rate (CER)**, un-normalized reference or hypothesis text distorts evaluation metrics. For example, if a human writes `ي` (Arabic Yeh) and the model predicts `ی` (Kurdish Yeh), an un-normalized evaluation flags a 100% substitution error even though the spoken audio was identical.

```
Raw Text ──► Remove Tatweel (ـ) ──► Strip Harakat ──► Map Arabic Variants ──► Normalize Digits ──► Collapse Spaces
```

### 2.1 Character Unification Rules

1. **Arabic Yeh (`ي` / `U+064A`) $\rightarrow$ Kurdish Yeh (`ی` / `U+06CC`)**
2. **Arabic Kaf (`ك` / `U+0643`) $\rightarrow$ Kurdish Kaf (`ک` / `U+06A9`)**
3. **Arabic Presentation Forms (e.g. `ﯓ`, `ﻱ`, `ﻛ`) $\rightarrow$ Standard Unicode Base Forms**
4. **Digit Standardization:** Convert Eastern Arabic (`٠١٢٣٤٥٦٧٨٩`) and Persian (`۰۱۲۳۴۵۶۷۸۹`) digits to standard ASCII numbers (`0123456789`).

---

## 3. Sorani Dialectal Variations & Code-Switching

### 3.1 Dialect Continuum

* **Sulaymaniyah (Slêmanî):** Considered the standard literary dialect for media (Rudaw, NRT, Kurdsat).
* **Hawler (Erbil):** Features vowel quality shifts and specific lexical variations.
* **Kirkuk (Kerkûk):** Frequent code-switching with Iraqi Arabic and Turkmen.
* **Garmian (Kelar / Kalar):** Distinct intonation contours and localized terminology.

### 3.2 Code-Switching Challenges
In modern media and podcasts, speakers frequently insert English technical terms (*computer, software, system*) or Arabic phrases (*يعني, بڕیار*). A robust Sorani ASR evaluation framework must test model behavior when foreign tokens appear in Sorani utterances.

---

## 4. Key Interview & Engineering Questions

1. **Q: Why can't we use a standard Arabic text normalizer for Sorani Kurdish?**  
   *A:* Standard Arabic normalizers strip letter dots or convert `ێ` / `ۆ` / `ە` to Arabic `ي` / `و` / `ه`, completely destroying Kurdish lexical semantics (e.g. converting ڕۆژ "day" to ڕوژ "face").

2. **Q: Why should punctuation be stripped during WER calculation but retained during TTS/LLM generation?**  
   *A:* ASR acoustic models output phonemic/word sequences; punctuation marks are non-acoustic tokens inserted by post-processors or language models. Including punctuation during WER evaluation artificially inflates error rates due to cosmetic formatting mismatches.
