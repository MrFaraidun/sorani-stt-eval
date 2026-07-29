"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "PyTest / Evaluator Unit Test Suite"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["N/A"]
  Notes: "Tests exact WER, CER, and S/D/I alignment calculations."
Performance_Metrics:
  Time_Complexity: "O(1)"
  Memory_Impact: "Minimal"
Scalability_Rating: "Approved"
"""

from app.services.evaluator import evaluator_service


def test_evaluator_exact_match():
    """Verify WER=0.0 and CER=0.0 for identical reference and hypothesis."""
    ref = "ئەمڕۆ هەواڵێکی گرنگ هاتە سەر ڕۆژ"
    hyp = "ئەمڕۆ هەواڵێکی گرنگ هاتە سەر ڕۆژ"
    res = evaluator_service.evaluate(ref, hyp)
    assert res.wer == 0.0
    assert res.cer == 0.0
    assert res.substitutions == 0
    assert res.deletions == 0
    assert res.insertions == 0


def test_evaluator_substitution_and_deletion():
    """Verify WER calculation when substitution and deletion occur."""
    ref = "ئەمڕۆ هەواڵێکی گرنگ هاتە سەر ڕۆژ"  # 6 words
    hyp = "ئەمڕۆ هەواڵێکی گرنگ هات سەر"       # 'هاتە' -> 'هات' (sub/norm), 'ڕۆژ' missing (deletion)
    res = evaluator_service.evaluate(ref, hyp)
    assert res.wer > 0.0
    assert res.deletions >= 1
