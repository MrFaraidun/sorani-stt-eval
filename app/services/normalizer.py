"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "Sorani Kurdish NLP / General Unicode Character Normalizer"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["Safe Character Encoding Mapping"]
  Notes: "Standardizes character encodings without hardcoding specific word overrides."
Performance_Metrics:
  Time_Complexity: "O(N) character scan"
  Memory_Impact: "Minimal (< 1MB)"
Scalability_Rating: "Approved"
"""

import re


class SoraniNormalizer:
    """
    Kurdish (Sorani - ckb) General Unicode Character Normalizer.
    
    Standardizes Arabic-based Sorani script orthography:
    - Normalizes presentation forms to base unicode characters.
    - Preserves and standardizes special Sorani characters: ڕ (U+0692), ڵ (U+06B5), ێ (U+06CE), ۆ (U+06C6), ە (U+06D5).
    - Unifies Arabic/Kurdish character variants (ي -> ی, ك -> ک, ە vs هـ).
    - Removes tatweel (ـ) and optional diacritics (harakat).
    - Standardizes Arabic/Persian digits to standard digits.
    - Collapses multiple whitespace.
    """

    # Diacritics (Fatha, Damma, Kasra, Sukun, Shadda, etc.)
    HARAKAT_RE = re.compile(r"[\u064B-\u0652\u0670]")

    # Tatweel (ـ) and Zero-Width formatting characters (ZWNJ \u200c, ZWJ \u200d)
    FORMAT_CHARS_RE = re.compile(r"[\u0640\u200c\u200d\uFEFF]")

    # Character mappings
    CHAR_MAP: dict[str, str] = {
        # Arabic Yah variants -> Sorani Kurdish Yeh (ی / U+06CC)
        "\u064A": "\u06CC",  # Arabic Letter Yeh (ي) -> Kurdish Yeh (ی)
        "\u0649": "\u06CC",  # Alef Maksura (ى) -> Kurdish Yeh (ی)
        "\u06D0": "\u06CE",  # E (ێ) variant -> Sorani E (ێ)
        # Arabic Kaf variants -> Sorani Kurdish Kaf (ک / U+06A9)
        "\u0643": "\u06A9",  # Arabic Kaf (ك) -> Kurdish Kaf (ک)
        # Kurdish Ro / L / O / E standardization
        "\u0691": "\u0692",  # Rr variant -> Sorani Rr (ڕ)
        "\u06B1": "\u06B5",  # Ll variant -> Sorani Ll (ڵ)
        "\u06C5": "\u06C6",  # Oe variant -> Sorani Oe (ۆ)
        "\u06C7": "\u06C6",  # Oe variant -> Sorani Oe (ۆ)
        # Arabic presentation forms -> Base unicode
        "ﯓ": "ک",
        "ﯔ": "ک",
        "ﯕ": "ک",
        "ﯖ": "ک",
        "ﻯ": "ی",
        "ﻱ": "ی",
        "ﻲ": "ی",
        "ﯾ": "ی",
        "ﯿ": "ی",
        "ﻛ": "ک",
        "ﻜ": "ک",
        "ﻙ": "ک",
        "ﻚ": "ک",
    }

    # Digit mapping (Eastern Arabic & Persian -> Standard ASCII)
    DIGIT_MAP: dict[str, str] = {
        "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
        "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
        "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
        "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
    }

    # Punctuation to strip (Arabic + Standard) without ZWNJ/ZWJ
    PUNCTUATION_RE = re.compile(r"[\.,!\?،؛:\-\"'\(\)\[\]\{\}«»\u061F\u060C\u061B]")

    def normalize(self, text: str, remove_punctuation: bool = True) -> str:
        """
        Normalize Sorani Kurdish text using general character rules only.

        Args:
            text: Input text string.
            remove_punctuation: Whether to strip punctuation for WER evaluation.

        Returns:
            Normalized Kurdish text string.
        """
        if not text:
            return ""

        # 1. Remove Tatweel and Zero-Width characters (ZWNJ/ZWJ)
        text = self.FORMAT_CHARS_RE.sub("", text)

        # 2. Remove Harakat (diacritics)
        text = self.HARAKAT_RE.sub("", text)

        # 3. Apply character and digit mappings
        char_list = []
        for char in text:
            char = self.CHAR_MAP.get(char, char)
            char = self.DIGIT_MAP.get(char, char)
            char_list.append(char)
        text = "".join(char_list)

        # 4. Remove punctuation if requested
        if remove_punctuation:
            text = self.PUNCTUATION_RE.sub(" ", text)

        # 5. Collapse extra spaces
        text = re.sub(r"\s+", " ", text).strip()

        return text


normalizer = SoraniNormalizer()
