# Learning Module 05: ASR Evaluation Metrics & Qualitative Error Taxonomy

> **Sub-Plan Reference:** Sub-Plan 05 — Evaluation Framework & Qualitative Error Analysis Engine  
> **Target Mastery:** Levenshtein Edit Distance, Word Error Rate (WER) vs. Character Error Rate (CER), Substitutions/Deletions/Insertions, and Paired Statistical Significance Testing.

---

## 1. Mathematical Formulation of WER & CER

### 1.1 Word Error Rate (WER)
Word Error Rate measures the Minimum Edit Distance (Levenshtein Distance) between a reference word sequence $R = (r_1, r_2, \dots, r_N)$ and a hypothesis word sequence $H = (h_1, h_2, \dots, h_M)$.

$$\text{WER} = \frac{S + D + I}{N} = \frac{\text{Substitutions} + \text{Deletions} + \text{Insertions}}{\text{Reference Word Count } N}$$

```
Reference:  ئەمڕۆ  هەواڵێکی  گرنگ  هاتە  سەر  ڕۆژ   (N = 6 words)
Hypothesis: ئەمڕۆ  هەواڵێکی  گرنگ  هات  سەر  -      (S = 1, D = 1, I = 0)

WER = (1 + 1 + 0) / 6 = 2 / 6 ≈ 0.3333 (33.3%)
```

* **Substitutions ($S$):** A reference word is replaced by a different hypothesis word (e.g. `هاتە` $\rightarrow$ `هات`).
* **Deletions ($D$):** A reference word is completely omitted in the hypothesis (e.g. `ڕۆژ` missing).
* **Insertions ($I$):** An extra word is inserted into the hypothesis that was not present in the reference.

> **Important Caveat:** WER can exceed $1.0$ ($100\%$) if an acoustic model hallucinates many extra inserted words ($I > N$).

### 1.2 Character Error Rate (CER)
CER applies the exact same Levenshtein calculation at the **individual character level** rather than word level:

$$\text{CER} = \frac{S_{\text{char}} + D_{\text{char}} + I_{\text{char}}}{N_{\text{char}}}$$

* **Why CER is crucial for Sorani Kurdish:** Kurdish is a morphologically rich, agglutinative language where multiple suffixes (possessives, tense indicators, plurals) attach to a single root word (e.g. *کوردستانەکەیاندا*). A single character error in a 12-letter word triggers a $100\%$ WER error, but only an $8.3\%$ CER error. Thus, CER provides a more fine-grained assessment of acoustic model quality in Sorani.

---

## 2. Qualitative Error Taxonomy for Sorani ASR

| Error Category | Primary Symptom | Root Cause | Engineering Mitigation |
|---|---|---|---|
| **Dialect Mismatch** | Elevated WER on Garmian / Hawler clips | Training dataset (e.g. Common Voice) skewed toward Sulaymaniyah | Augment fine-tuning data with dialect-balanced samples |
| **Acoustic Noise Distortion** | High substitutions on cafe/outdoor audio | Acoustic model trained on clean, studio audio | Apply SpecAugment, room impulse responses (RIR), and MUSAN noise injection |
| **Silence Hallucination** | High insertions ($I$) on non-speech intervals | Autoregressive decoder hallucinating on silent chunks | Integrate **Silero VAD** segmentation prior to ASR inference |
| **Fast Speech Deletions** | High deletions ($D$) on news anchors | Window truncation (30-second boundary clips) | Segment audio into shorter, dynamic VAD bursts |
| **Kurdish Letter Confusion** | `ي` $\leftrightarrow$ `ی`, `ك` $\leftrightarrow$ `ک`, `ر` $\leftrightarrow$ `ڕ` | Character vocabulary token mismatch or un-normalized ground truth | Apply **`SoraniNormalizer`** to both reference and hypothesis prior to scoring |

---

## 3. Paired Statistical Significance Testing

To verify whether a $2.5\%$ WER improvement from fine-tuning (e.g. $19.5\%$ vs. $22.0\%$) is statistically significant or merely random noise:

* **Paired Bootstrap Resampling (Bisani & Ney, 2004):** Randomly sample $K=1,000$ bootstrap replicates with replacement from the test set. Calculate WER difference $\Delta = \text{WER}_A - \text{WER}_B$ on each replicate and compute the $95\%$ confidence interval. If $0 \notin [CI_{\text{lower}}, CI_{\text{upper}}]$, the improvement is statistically significant ($p < 0.05$).
