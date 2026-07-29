"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "Evaluation Metric Service / JiWER Levenshtein Engine"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["Division by Zero Protection"]
  Notes: "Guards WER/CER calculations when reference text is empty."
Performance_Metrics:
  Time_Complexity: "O(N * M) Levenshtein DP Matrix"
  Memory_Impact: "Minimal"
Scalability_Rating: "Approved"
"""

import jiwer
from pydantic import BaseModel, Field

from app.services.normalizer import normalizer


class EvaluationMetrics(BaseModel):
    """Evaluation result payload."""

    reference: str
    hypothesis: str
    wer: float = Field(..., description="Word Error Rate")
    cer: float = Field(..., description="Character Error Rate")
    substitutions: int
    deletions: int
    insertions: int
    hits: int
    reference_word_count: int


class EvaluatorService:
    """ASR Evaluation Service computing WER, CER, and alignment details."""

    def evaluate(
        self, reference_text: str, hypothesis_text: str, normalize: bool = True
    ) -> EvaluationMetrics:
        """
        Compute WER, CER, and S/D/I breakdown between reference and hypothesis.

        Args:
            reference_text: Human verified ground truth transcript.
            hypothesis_text: ASR model output.
            normalize: Whether to normalize both texts prior to scoring.

        Returns:
            EvaluationMetrics object.
        """
        ref = normalizer.normalize(reference_text) if normalize else reference_text.strip()
        hyp = normalizer.normalize(hypothesis_text) if normalize else hypothesis_text.strip()

        if not ref:
            return EvaluationMetrics(
                reference="",
                hypothesis=hyp,
                wer=1.0 if hyp else 0.0,
                cer=1.0 if hyp else 0.0,
                substitutions=0,
                deletions=0,
                insertions=len(hyp.split()),
                hits=0,
                reference_word_count=0,
            )

        # Word Error Rate & Alignment
        word_measures = jiwer.process_words(ref, hyp)
        wer = float(word_measures.wer)
        substitutions = int(word_measures.substitutions)
        deletions = int(word_measures.deletions)
        insertions = int(word_measures.insertions)
        hits = int(word_measures.hits)
        ref_count = len(ref.split())

        # Character Error Rate
        cer = float(jiwer.cer(ref, hyp))

        return EvaluationMetrics(
            reference=ref,
            hypothesis=hyp,
            wer=round(wer, 4),
            cer=round(cer, 4),
            substitutions=substitutions,
            deletions=deletions,
            insertions=insertions,
            hits=hits,
            reference_word_count=ref_count,
        )


evaluator_service = EvaluatorService()
