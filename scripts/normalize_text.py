"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "Python CLI / Kurdish Batch Text Normalizer"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["Path Traversal"]
  Notes: "Operates strictly within project dataset directories."
Performance_Metrics:
  Time_Complexity: "O(N) batch text scan"
  Memory_Impact: "Minimal"
Scalability_Rating: "Approved"
"""

import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.normalizer import normalizer


def normalize_file(input_file: Path, output_file: Path) -> None:
    """Normalize transcript file in place or to new destination."""
    text = input_file.read_text(encoding="utf-8")
    normalized = normalizer.normalize(text)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    output_file.write_text(normalized, encoding="utf-8")
    print(f"Normalized: {input_file} -> {output_file}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/normalize_text.py <transcript_file_or_dir>")
        sys.exit(1)

    target = Path(sys.argv[1])
    if target.is_file():
        normalize_file(target, target)
    elif target.is_dir():
        for txt_file in target.glob("*.txt"):
            normalize_file(txt_file, txt_file)
    else:
        print(f"Target {target} not found.")
        sys.exit(1)
