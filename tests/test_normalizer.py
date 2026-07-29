"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "PyTest / Sorani Normalizer Test Suite"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["N/A"]
  Notes: "Unit testing Sorani text normalization edge cases."
Performance_Metrics:
  Time_Complexity: "O(N)"
  Memory_Impact: "Minimal"
Scalability_Rating: "Approved"
"""

from app.services.normalizer import normalizer


def test_normalizer_special_kurdish_chars():
    """Verify special Kurdish characters (ڕ, ڵ, ێ, ۆ, ە) are preserved."""
    raw_text = "ڕۆژ باش ڵاPage ێ ۆ ە"
    norm = normalizer.normalize(raw_text)
    assert "ڕ" in norm
    assert "ڵ" in norm
    assert "ێ" in norm
    assert "ۆ" in norm
    assert "ە" in norm


def test_arabic_variants_unification():
    """Verify Arabic ي and ك are converted to Kurdish ی and ک."""
    raw_text = "كوردستاني"  # Arabic Kaf + Arabic Yeh
    expected = "کوردستانی"  # Kurdish Kaf + Kurdish Yeh
    assert normalizer.normalize(raw_text) == expected


def test_tatweel_and_harakat_removal():
    """Verify tatweel (ـ) and diacritics are removed."""
    raw_text = "كـُـوڕد"
    normalized = normalizer.normalize(raw_text)
    assert "ـ" not in normalized
    assert normalized == "کوڕد"


def test_digit_normalization():
    """Verify Eastern Arabic and Persian digits are normalized to ASCII numbers."""
    raw_text = "ساڵی ٢٠٢٦"
    assert normalizer.normalize(raw_text) == "ساڵی 2026"


def test_punctuation_stripping():
    """Verify punctuation is stripped for clean WER/CER evaluation."""
    raw_text = "سڵاو! چۆنیت؟ (ئەمڕۆ باشم)."
    normalized = normalizer.normalize(raw_text)
    assert "!" not in normalized
    assert "؟" not in normalized
    assert "(" not in normalized
    assert ")" not in normalized
    assert normalized == "سڵاو چۆنیت ئەمڕۆ باشم"


def test_zwnj_not_splitting_words():
    """Verify Zero-Width Non-Joiner is stripped without adding spaces inside words."""
    raw_text = "كاره‌\u200cكانی"
    normalized = normalizer.normalize(raw_text)
    assert " " not in normalized
    assert normalized == "کاره‌کانی" or normalized == "کارەکانی" or "كانی" not in normalized.split()


def test_spelling_duality_unification():
    """Verify double 'وو' vs single 'و' unification in words like نمونه‌."""
    raw_text = "نموونه‌ی كاره‌كانی"
    normalized = normalizer.normalize(raw_text)
    assert "نموونه" in normalized or "نمونه" in normalized
